import { useContext, useEffect, useState } from "react"
import { useParams, Navigate } from "react-router-dom"
import axios from "axios"
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuth } from '../../context/AuthContext'

function AccommodationDetail() {
    const { user } = useAuth()
    const { id } = useParams()
    const [accommodation, setAccommodation] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [dates, setDates] = useState({ start_date: '', end_date: '' })
    const [availableAccommodations, setAvailableAccommodations] = useState([])

    const isValidLocation = (lat, lng) => {
        return !isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null
    }

    useEffect(() => {
        const fetchAccommodation = async () => {
            try {
                const response = await axios.get(`/api/accommodations/${id}`)
                setAccommodation(response.data)
                setIsLoading(false)
            } catch (err) {
                console.error('Error fetching accommodation:', err)
                setIsLoading(false)
            }
        }
        fetchAccommodation()
    }, [id])

    useEffect(() => {
        if (dates.start_date && dates.end_date) {
            const fetchAvailableAccommodations = async () => {
                try {
                    const response = await axios.get(`/api/accommodations/available?start_date=${dates.start_date}&end_date=${dates.end_date}&accommodation_id=${id}`)
                    setAvailableAccommodations(response.data)
                } catch (err) {
                    console.error('Error fetching available accommodations:', err)
                }
            }
            fetchAvailableAccommodations()
        }
    }, [dates])

    const handleBooking = async (accommodationId) => {

        if (!user) {
            alert('You must be logged in to make a reservation.')
            return
        }

        try {
            const response = await axios.post('/api/reservations', {
                userId: user.id,
                accommodationId: accommodationId,
                startDate: dates.start_date,
                endDate: dates.end_date,
                status: 'pending'
            })

            alert(`Booking successful for ${accommodation.name} from ${dates.start_date} to ${dates.end_date}`)

            console.log('Reservation successful:', response.data)

        } catch (err) {
            console.error('Error making reservation:', err)
            alert('Error making reservation: ' + (err.response ? err.response.data.error : err.message))
        }
    }

    const calculateTotalPrice = (pricePerDay) => {
        const startDate = new Date(dates.start_date)
        const endDate = new Date(dates.end_date)
        const timeDiff = endDate - startDate
        const days = timeDiff / (1000 * 60 * 60 * 24)
        return pricePerDay * days
    }

    if (isLoading) return <div>Loading...</div>

    if (!accommodation) return <Navigate to='/not-found' replace />

    return(
        <div className="acc-detail">
            <h1>{accommodation.name}</h1>
            <p>{accommodation.description}</p>
            <div className="acc-map-dates">
                {isValidLocation(accommodation.latitude, accommodation.longitude) && (
                    <>
                    <div className="acc-map">
                        <MapContainer 
                            center={[accommodation.latitude, accommodation.longitude]} 
                            zoom={13} 
                            style={{ height: '150px', width: '300px',  zIndex: 0 }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={[accommodation.latitude, accommodation.longitude]}/>
                        </MapContainer>
                    </div>
                    <div className="map-placeholder"></div>
                    </>
                )}
                <div className="acc-dates">
                    <label>Start Date:
                        <input
                            type="date"
                            name="start_date"
                            value={dates.start_date}
                            onChange={(e) => setDates({ ...dates, start_date: e.target.value})}
                        />
                    </label>
                    <label>End Date:
                        <input
                            type="date"
                            name="end_date"
                            value={dates.end_date}
                            onChange={(e) => setDates({ ...dates, end_date: e.target.value})}
                        />
                    </label>
                </div>
            </div>
            <img src={accommodation.image_url} alt={`Image of ${accommodation.name}`} />
            <h3>Availability</h3>
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Capacity</th>
                        <th>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {availableAccommodations.map((acc, index) => (
                        <tr key={index}>
                            <td>{acc.type}</td>
                            <td>{acc.capacity}</td>
                            <td>{calculateTotalPrice(acc.price)}€</td>
                            <td>
                                <button onClick={() => handleBooking(acc.id)}>Book</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AccommodationDetail