import { useAuth } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { formatDate } from '../utility/helperFunctions'

function Reservations(){
    const { user, loading } = useAuth()
    const [reservations, setReservations] = useState([])
    const [accommodations, setAccommodations] = useState([])
    const [editingId, setEditingId] = useState(null)

    const [newReservation, setNewReservation] = useState({
        accommodationId: '',
        startDate: '',
        endDate: '',
        status: ''
    })

    const [editReservation, setEditReservation] = useState({
        id: '',
        accommodationId: '',
        startDate: '',
        endDate: '',
        status: ''
    })

    useEffect(() => {
        if (user) {
            const fetchReservations = async () => {
                try {
                    const response = await axios.get('api/reservations/my')
                    setReservations(response.data)
                    console.log(response.data)
                } catch (err) {
                    console.error('Error fetching reservations:', err.message)
                }
            }
            const fetchAccommodations = async () => {
                try {
                    const response = await axios.get('/api/accommodations');
                    setAccommodations(response.data)
                } catch (err) {
                    console.error('Error fetching accommodations:', err.message)
                }
            }

            fetchReservations()

            if (user.isadmin) {
                fetchAccommodations()
            }
        }
    }, [user])

    const handleAccommodationChange = (e) => {
        setNewReservation({
            ...newReservation,
            accommodationId: e.target.value
        })
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/reservations', newReservation)
        } catch (err) {
            console.error(err.message)
        }
    }

    const startEdit = (reservation) => {
        setEditReservation({
            id: reservation.id,
            accommodationId: reservation.accommodation_id,
            startDate: reservation.start_date.split('T')[0],
            endDate: reservation.end_date.split('T')[0],
            status: reservation.status
        })
        setEditingId(reservation.id)
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`/api/reservations/${editReservation.id}`, editReservation)
            cancelEdit()
        } catch (err) {
            console.error(err.message)
        }
    }

    const cancelEdit = () => {
        setEditingId(null);
        setEditReservation({
            id: '',
            accommodationId: '',
            startDate: '',
            endDate: '',
            status: ''
        })
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/reservations/${id}`)
        } catch (err) {
            console.error('Error deleting Reservation:', err)
        }
    }

    if (loading) return <div>Loading...</div>
    
    if (!user) return <Navigate to='/' />

    return(
        <div className="management">
            <h1>Reservations Management</h1>
            <div className="table-container">
                <table className="table-accommodations">
                    <thead>
                        <tr>
                            <th>Accommodation</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation.id}>
                                <td>{reservation.accommodation_name}</td>
                                <td>{formatDate(reservation.start_date)}</td>
                                <td>{formatDate(reservation.end_date)}</td>
                                <td>{reservation.status}</td>
                                <td>
                                    <button onClick="{ }">Pay</button>
                                    <button onClick="{ }">Cancel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {user.isadmin && 
                <>
                <h1>Admin</h1>
                {editingId == null ? (
                    <form onSubmit={handleAdd} className="form-add">
                        <div className="form-div">
                            <select
                                value={newReservation.accommodationId}
                                onChange={handleAccommodationChange}
                            >
                                {accommodations.map((acc) => {
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name}
                                    </option>
                                })}
                            </select>
                            <input
                                type="date"
                                value={newReservation.startDate}
                                onChange={(e) => setNewReservation({
                                    ...newReservation,
                                    startDate: e.target.value
                                })}
                                required
                            />
                            <input
                                type="date"
                                value={newReservation.endDate}
                                onChange={(e) => setNewReservation({
                                    ...newReservation,
                                    endDate: e.target.value
                                })}
                                required
                            />
                            <select
                                value={newReservation.status}
                                onChange={(e) => setNewReservation({
                                    ...newReservation,
                                    status: e.target.value
                                })}
                                required
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button type="submit">Add Reservation</button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleEdit} className="form-edit">
                        <div className="form-div">
                            <select
                                value={editReservation.accommodationId}
                                onChange={(e) => setEditReservation({
                                    ...editReservation,
                                    accommodationId: e.target.value
                                })}
                            >
                                {accommodations.map((acc) => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={editReservation.startDate}
                                onChange={(e) => setEditReservation({
                                    ...editReservation,
                                    startDate: e.target.value
                                })}
                            />
                            <input
                                type="date"
                                value={editReservation.endDate}
                                onChange={(e) => setEditReservation({
                                    ...editReservation,
                                    endDate: e.target.value
                                })}
                            />
                            <select
                                value={editReservation.status}
                                onChange={(e) => setEditReservation({
                                    ...editReservation,
                                    status: e.target.value
                                })}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button type="submit">Save Changes</button>
                            <button type="button" onClick={cancelEdit}>Cancel</button>
                        </div>
                    </form>
                )}
                <div className="table-container">
                    <table className="table-accommodations">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>Accommodation</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.user_id}</td>
                                    <td>{reservation.user_name}</td>
                                    <td>{reservation.accommodation_name}</td>
                                    <td>{formatDate(reservation.start_date)}</td>
                                    <td>{formatDate(reservation.end_date)}</td>
                                    <td>{reservation.status}</td>
                                    <td>
                                        <button onClick={() => startEdit(reservation)}>Edit</button>
                                        <button onClick={() => handleDelete(reservation.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </>
            }
        </div>
    )
}

export default Reservations