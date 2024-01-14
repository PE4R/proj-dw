import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import axios from "axios"

function Accommodations() {
    const { user, loading } = useAuth()
    const [accommodations, setAccommodations] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")

    const [newAccommodation, setNewAccommodation] = useState({
        name: '',
        description: '',
        imageUrl: ''
    });

    const [editAccommodation, setEditAccommodation] = useState({
        name: '',
        description: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (user && user.isadmin){
            const fetchAccommodations = async () => {
                try {
                    const response = await axios.get('/api/accommodations')
                    setAccommodations(response.data)
                } catch (err) {
                    console.error('Error fetching accommodations: ', err)
                }
            }
            fetchAccommodations()
        }
    }, [user])

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(
                '/api/accommodations',
                newAccommodation
            )
            setAccommodations([...accommodations, response.data])
            setNewAccommodation({
                name: '',
                description: '',
                imageUrl: ''
            })
        } catch (err) {
            console.error('Error adding accommodation:', err)
        }
    }

    const startEdit = (accommodation) => {
        setEditAccommodation({
            name: accommodation.name,
            description: accommodation.description,
            imageUrl: accommodation.image_url
        })
        setEditingId(accommodation.id)
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(
                `/api/accommodations/${editingId}`,
                editAccommodation
            )

            setAccommodations(accommodations.map(accommodation => {
                if (accommodation.id === editingId) {
                    return response.data
                }
                return accommodation
            }))

            cancelEdit()

        } catch (err) {
            console.error('Error editing accommodation:', err)
        }
    }

    const cancelEdit = () => {
        setEditingId(null);
        setEditAccommodation({
          name: '',
          description: '',
          imageUrl: ''
        })
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/accommodations/${id}`)
            setAccommodations(accommodations.filter(accommodation => accommodation.id !== id))
        } catch (err) {
            console.error('Error deleting accommodation:', err)
        }
    }

    const filteredAccommodations = accommodations.filter(
        accommodation =>
        accommodation.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user || !user.isadmin){
        return <Navigate to='/' />
    }

    return (
        <div>
            <h1>Accommodations Management</h1>
            {editingId === null ? (
                <form onSubmit={handleAdd}>
                    <input
                        type="text"
                        required
                        className=""
                        value={newAccommodation.name}
                        onChange={e => setNewAccommodation({
                            ...newAccommodation, 
                            name: e.target.value
                        })}
                        placeholder="name (required)"
                    />
                    <input
                        type="text"
                        className=""
                        value={newAccommodation.description}
                        onChange={e => setNewAccommodation({
                            ...newAccommodation, 
                            description: e.target.value
                        })}
                        placeholder="description"
                    />
                    <input
                        type="text"
                        className=""
                        value={newAccommodation.imageUrl}
                        onChange={e => setNewAccommodation({
                            ...newAccommodation, 
                            imageUrl: e.target.value
                        })}
                        placeholder="image url"
                    />
                    <button type="submit">Add</button>
                </form>
            ) : (
                <form onSubmit={handleEdit}>
                    <input
                        type="text"
                        required
                        value={editAccommodation.name}
                        onChange={e => setEditAccommodation({
                            ...editAccommodation, 
                            name: e.target.value
                        })}
                        placeholder="name (required)"
                    />
                    <input
                        type="text"
                        value={editAccommodation.description}
                        onChange={e => setEditAccommodation({
                            ...editAccommodation, 
                            description: e.target.value
                        })}
                        placeholder="description"
                    />
                    <input
                        type="text"
                        value={editAccommodation.imageUrl}
                        onChange={e => setEditAccommodation({
                            ...editAccommodation, 
                            imageUrl: e.target.value
                        })}
                        placeholder="image url"
                    />
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={cancelEdit}>Cancel</button>
                </form>
            )}

            <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Image URL</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAccommodations.map(accommodation => (
                        <tr key={accommodation.id}>
                            <td>{accommodation.name}</td>
                            <td>{accommodation.description}</td>
                            <td>{accommodation.image_url}</td>
                            <td>
                                <button onClick={() => startEdit(accommodation)}>Edit</button>
                                <button onClick={() => handleDelete(accommodation.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Accommodations