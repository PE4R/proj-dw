import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Login from './LoginModal'
import Register from './RegisterModal'
import axios from 'axios'
axios.defaults.withCredentials = true;

function Header(){
    const { user, logout } = useAuth()
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout')
            logout()
            console.log('Logged out in header')
        } catch (err) {
            console.error(err.message)
        }
    }

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu)
    }

    return(
        <header>
            <h1>Casota</h1>
            <nav className="navbar">
                <ul>
                    <li><button><Link to='/'>Home</Link></button></li>
                    <li><button><Link to='/about'>About</Link></button></li>
                    <li><button><Link to='/contact'>Contact</Link></button></li>
                </ul>
            </nav>
            <ul className="login-bar">
                {user ? (
                    <>
                        <button onClick={toggleUserMenu}>{user.name}</button>
                        {showUserMenu && (
                            <ul className="user-menu">
                                {user.isadmin ? (
                                    <li>
                                        <Link to='/accommodations'>Accommodations</Link>
                                    </li>
                                ) : null}
                                <li>
                                    <Link to='/reservations'>Reservations</Link>
                                </li>
                                <li>
                                    <Link to="/" onClick={handleLogout}>Logout</Link>
                                </li>
                            </ul>
                        )}
                    </>
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