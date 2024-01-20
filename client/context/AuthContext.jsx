import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
axios.defaults.withCredentials = true

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const checkSession = async () => {
        try {
            const response = await axios.get('/api/auth/checkSession')
            if (response.data) {
                setUser(response.data)
                console.log('Session verified with user:', response.data)
            }
        } catch (err) {
            console.error(err.message)
            setUser(null)
            console.log('Session denied')
        }
    }

    useEffect(() => {
        checkSession()
        .finally(() => setLoading(false))
    }, [])

    const login = (userData) => {
        setUser(userData)
        console.log('Logged in with user:', userData, 'in context')
    }
    const logout = () => {
        setUser(null)
        console.log('Logged out in context')
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
