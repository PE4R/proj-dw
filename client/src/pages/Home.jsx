import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../components/Card.jsx'

function Home(){
    const [accommodations, setAccommodations] = useState([])
    
    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const response = await axios.get('/api/accommodations')
                setAccommodations(response.data)
            } catch (err) {
                console.error('Error fetching accommodations:', err)
            }
        }
        fetchAccommodations()
    }, [])

    return(
        <div className="content">
            {accommodations.map(accommodation => (
                <Card
                    key={accommodation.id}
                    name={accommodation.name}
                    src={accommodation.image_url}
                    alt={`Image of ${accommodation.name}`}
                    description={accommodation.description}
                />
            ))}
        </div>
    )
}

export default Home