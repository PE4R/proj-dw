import { useAuth } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { formatDate } from '../utility/helperFunctions'

function Reservations(){
    const { user, loading } = useAuth()
    const [userReservations, setUserReservations] = useState([])
    const [allReservations, setAllReservations] = useState([])
    const [accommodations, setAccommodations] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [users, setUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    const [newReservation, setNewReservation] = useState({
        userId: '',
        accommodationId: '',
        startDate: '',
        endDate: '',
        status: 'pending'
    })

    const [editReservation, setEditReservation] = useState({
        id: '',
        userId: '',
        accommodationId: '',
        startDate: '',
        endDate: '',
        status: ''
    })

    useEffect(() => {
        if (user) {
            const fetchUserReservations = async () => {
                try {
                    const response = await axios.get('api/reservations/my')
                    setUserReservations(response.data)
                    console.log(response.data)
                } catch (err) {
                    console.error('Error fetching reservations:', err.message)
                }
            }
            const fetchAllReservations = async () => {
                try {
                    const response = await axios.get('/api/reservations/all')
                    setAllReservations(response.data)
                } catch (err) {
                    console.error('Error fetching all reservations:', err.message)
                }
            }
            const fetchAccommodations = async () => {
                try {
                    const response = await axios.get('/api/accommodations')
                    setAccommodations(response.data)
                    console.log(response.data)
                } catch (err) {
                    console.error('Error fetching accommodations:', err.message)
                }
            }
            const fetchUsers = async () => {
                try {
                    const response = await axios.get('/api/users/all')
                    setUsers(response.data)
                } catch (err) {
                    console.error('Error fetching users:', err.message)
                }
            }

            fetchUserReservations()

            if (user.isadmin) {
                fetchUsers()
                fetchAccommodations()
                fetchAllReservations()
            }
        }
    }, [user])

    const handlePay = async (id) => {
        try {
            const response = await axios.patch(`/api/reservations/updateStatus/${id}`, { status: 'confirmed' })
            setUserReservations(userReservations.map(reservation => 
                reservation.id === id ? { ...reservation, status: 'confirmed' } : reservation
            ))
        } catch (err) {
            console.error('Error updating reservation:', err)
        }
    }
    
    const handleCancel = async (id) => {
        try {
            const response = await axios.patch(`/api/reservations/updateStatus/${id}`, { status: 'cancelled' })
            setUserReservations(userReservations.map(reservation => 
                reservation.id === id ? { ...reservation, status: 'cancelled' } : reservation
            ))
        } catch (err) {
            console.error('Error updating reservation:', err)
        }
    }

    const handleAccommodationChange = (e) => {
        setNewReservation({
            ...newReservation,
            accommodationId: e.target.value
        })
    }

    const handleAdd = async (e) => {
        e.preventDefault()

        if (!newReservation.userId || !newReservation.accommodationId) {
            alert("Please select both a user and an accommodation.")
            return
        }

        try {
            const response = await axios.post('/api/reservations', newReservation)

            const userName = users.find(user => user.id.toString() === newReservation.userId).name

            const accommodationName = accommodations.find(acc => acc.id.toString() === newReservation.accommodationId).name

            setAllReservations(prev => [...prev, {
                ...response.data,
                user_name: userName,
                accommodation_name: accommodationName
            }])

            setNewReservation({
                id: '',
                userId: '',
                accommodationId: '',
                startDate: '',
                endDate: '',
                status: ''
            })
        } catch (err) {
            console.error(err.message)
        }
    }

    const startEdit = (reservation) => {
        console.log("Editing reservation:", reservation)
        setEditReservation({
            id: reservation.id,
            userId: reservation.user_id,
            accommodationId: reservation.accommodation_id,
            startDate: reservation.start_date.split('T')[0],
            endDate: reservation.end_date.split('T')[0],
            status: reservation.status || 'pending'
        })
        setEditingId(reservation.id)
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(
                `/api/reservations/${editReservation.id}`,
                editReservation
            )

            setAllReservations(allReservations.map((reservation) => {
                if (reservation.id === editReservation.id) {
                    return { ...reservation, ...response.data }
                }
                return reservation
            }))

            cancelEdit()

        } catch (err) {
            console.error(err.message)
        }
    }

    const cancelEdit = () => {
        setEditingId(null)
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
            setUserReservations(prevReservations => prevReservations.filter(reservation => reservation.id !== id))
            setAllReservations(prevReservations => prevReservations.filter(reservation => reservation.id !== id))
        } catch (err) {
            console.error('Error deleting Reservation:', err)
        }
    }

    const filteredReservations = allReservations.filter(
        reservation =>
        reservation.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) return <div>Loading...</div>
    
    if (!user) return <Navigate to='/' />

    return(
        <div className="management management-reservations">
            <h1>Reservations Management</h1>
            <div className="table-container">
                <table className="table-management">
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
                        {userReservations.map((reservation) => (
                            <tr key={reservation.id}>
                                <td>{reservation.accommodation_name}</td>
                                <td>{formatDate(reservation.start_date)}</td>
                                <td>{formatDate(reservation.end_date)}</td>
                                <td>{reservation.status}</td>
                                <td>
                                    <button onClick={() => handlePay(reservation.id)}>Pay</button>
                                    <button onClick={() => handleCancel(reservation.id)}>Cancel</button>
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
                                value={newReservation.userId}
                                onChange={(e) => setNewReservation({
                                    ...newReservation,
                                    userId: e.target.value
                                })}
                            >
                                <option value="">Select a User</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.id} - {user.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={newReservation.accommodationId}
                                onChange={handleAccommodationChange}
                            >
                                <option value="">Select an Accommodation</option>
                                {accommodations.map((acc) => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name}
                                    </option>
                                ))}
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
                                value={editReservation.userId}
                                onChange={(e) => setEditReservation({
                                    ...editReservation,
                                    userId: e.target.value
                                })}
                            >
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.id} - {user.name}
                                    </option>
                                ))}
                            </select>
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

                <input
                    type="text"
                    placeholder="Search by user name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />

                <div className="table-container">
                    <table className="table-management">
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
                            {filteredReservations.map((reservation) => (
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