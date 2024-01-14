import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
axios.defaults.withCredentials = true;

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const checkSession = async () => {
        try {
            await axios.get('/api/auth/checkSession')
            setIsLoggedIn(true)
            console.log('Session verified')
        } catch (err) {
            console.error(err.message)
            console.log('Session denied')
        }
    }

    useEffect(() => {
        checkSession()
    }, [])

    const login = () => setIsLoggedIn(true)
    const logout = () => setIsLoggedIn(false)

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)
