import { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function LocationPicker({ initialPosition, onLocationChange }) {
  const [position, setPosition] = useState(initialPosition)

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng)
        onLocationChange(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
      moveend() {
        if (position) {
          onLocationChange(map.getCenter())
        }
      },
    })

    return position === null ? null : (
      <Marker position={position} draggable={true} eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng()
          setPosition(latlng)
          onLocationChange(latlng)
        },
      }} />
    )
  }

  return (
    <MapContainer center={initialPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  )
}

export default LocationPicker