import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Login from './LoginModal'
import Register from './RegisterModal'
import axios from 'axios'
axios.defaults.withCredentials = true;

function Header(){
    const { isLoggedIn, logout } = useAuth()
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout')
            logout()
            console.log('Logged out')
        } catch (err) {
            console.error(err.message)
        }
    }

    return(
        <header>
            <h1>Alojamento</h1>
            <nav className="navbar">
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/about'>About</Link></li>
                    <li><Link to='/contact'>Contact</Link></li>
                </ul>
            </nav>
            <ul className="login-bar">
                {isLoggedIn? (
                    <li>
                        <Link to="/" onClick={handleLogout}>Logout</Link>
                    </li>
                ) : (
                    <>
                        <li>
                            <Link to="/" onClick={(e) => { e.preventDefault(); setShowLogin(true); }}>Login</Link>
                        </li>
                        <li>
                            <Link to="/" onClick={(e) => { e.preventDefault(); setShowRegister(true); }}>Register</Link>
                        </li>
                    </>
                )}
            </ul>
            {showLogin && <Login closeModal={() => setShowLogin(false)} />}
            {showRegister && <Register closeModal={() => setShowRegister(false)} />}
        </header>
    )
}

export default Header