import { useEffect, useState } from "react"
import { useParams, Navigate } from "react-router-dom"
import axios from "axios"
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function AccommodationDetail(){
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
        <div>
            <h1>{accommodation.name}</h1>
            <img src={accommodation.image_url} alt={`Image of ${accommodation.name}`} />
            <p>{accommodation.description}</p>
            {isValidLocation(accommodation.latitude, accommodation.longitude) && (
                <MapContainer 
                    center={[accommodation.latitude, accommodation.longitude]} 
                    zoom={13} 
                    style={{ height: '400px', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[accommodation.latitude, accommodation.longitude]}/>
                </MapContainer>
            )}
        </div>
    )
}

export default AccommodationDetail