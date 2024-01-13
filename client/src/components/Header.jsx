import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Login from './LoginModal'
import Register from './RegisterModal'

function Header(){
    const { isLoggedIn, logout } = useAuth()
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    const handleLogout = () => {
        logout()
        localStorage.removeItem('token')
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