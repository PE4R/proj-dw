import { useAuth } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"

function Reservations(){
    const { user, loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }
    
    if (!user) {
        return <Navigate to='/' />
    }

    return(
        <div>
            <h1>Reservations Management</h1>
            {user.isadmin && <h1>Admin</h1>}
        </div>
    )
}

export default Reservations