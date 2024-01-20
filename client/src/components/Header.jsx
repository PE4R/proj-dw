import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Login from './LoginModal'
import Register from './RegisterModal'
import axios from 'axios'
axios.defaults.withCredentials = true

function Header(){
    const { user, logout } = useAuth()
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 816)

    useEffect(() => {
        const handleResize = () => {
            const newIsSmallScreen = window.innerWidth < 816
            setIsSmallScreen(newIsSmallScreen)
        
            const navBar = document.querySelector('.navbar')
            const loginBar = document.querySelector('.login-bar')
        
            if (newIsSmallScreen) {
                // Hide navbar and login-bar on small screens
                navBar.style.display = 'none'
                loginBar.style.display = 'none'
            } else {
                // Show navbar and login-bar on large screens
                navBar.style.display = 'flex'
                loginBar.style.display = 'flex'
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()
        
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

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

    const toggleNavigation = () => {
        if (isSmallScreen) {
            const navBar = document.querySelector('.navbar')
            const loginBar = document.querySelector('.login-bar')
            navBar.style.display = navBar.style.display === 'none' ? 'flex' : 'none'
            loginBar.style.display = loginBar.style.display === 'none' ? 'flex' : 'none'
        }
    }

    return(
        <header>
            <h1 onClick={toggleNavigation}>Casota</h1>
            <nav className={`navbar ${isSmallScreen ? 'hidden' : ''}`}>
                <ul>
                    <li><button><Link to='/'>Home</Link></button></li>
                    <li><button><Link to='/about'>About</Link></button></li>
                    <li><button><Link to='/contact'>Contact</Link></button></li>
                </ul>
            </nav>
            <ul className={`login-bar ${isSmallScreen ? 'hidden' : ''}`}>
                {user ? (
                    <>
                        <li>
                            <button onClick={toggleUserMenu}>{user.name}</button>
                        </li>
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
                            <Link 
                                to="/"
                                id='login'
                                onClick={(e) => { e.preventDefault(); setShowLogin(true) }}>Login</Link>
                        </li>
                        <li>
                            <Link 
                                to="/" 
                                id='register'
                                onClick={(e) => { e.preventDefault(); setShowRegister(true) }}>Register</Link>
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