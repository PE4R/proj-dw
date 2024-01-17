import { useEffect, useState } from "react"
import { useParams, Navigate } from "react-router-dom"
import axios from "axios"
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function AccommodationDetail({ showLogin, showRegister}){
    const { id } = useParams()
    const [accommodation, setAccommodation] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const isValidLocation = (lat, lng) => {
        return !isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null;
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
                <div className="acc-dates">dates</div>
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

                </tbody>
            </table>
        </div>
    )
}

export default AccommodationDetail