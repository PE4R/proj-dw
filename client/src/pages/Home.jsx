import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from '../components/Card.jsx'
import { Link } from 'react-router-dom'

function Home(){
    const [accommodations, setAccommodations] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const response = await axios.get('/api/accommodations')
                setAccommodations(response.data)
            } catch (err) {
                console.error('Error fetching accommodations:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchAccommodations()
    }, [])

    if (loading) {
        return <div>Loading accommodations...</div>
    }

    return(
        <div className="content">
            {accommodations.map(accommodation => (
                <Link to={`/accommodations/${accommodation.id}`} key={accommodation.id}>
                    <Card
                        key={accommodation.id}
                        name={accommodation.name}
                        src={accommodation.image_url}
                        alt={`Image of ${accommodation.name}`}
                        description={accommodation.description}
                    />
                </Link>
            ))}
        </div>
    )
}

export default Home