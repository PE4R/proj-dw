import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Register({ closeModal }){

    const { isLoggedIn } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoggedIn) {
            closeModal()
        }
    }, [isLoggedIn, navigate])

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const registerUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/auth/register', data)
            console.log('Registered')
            closeModal()
        } catch (err) {
            console.log(err.message)
        }

    }

    return(
        <div className='modal-overlay' onClick={closeModal}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <form onSubmit={registerUser}>
                    <label htmlFor="">Name</label>
                    <input type="text" placeholder="name" value={data.name} onChange={(e) => setData({...data, name: e.target.value})}/>
                    <label htmlFor="">E-mail</label>
                    <input type="email" placeholder="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
                    <label htmlFor="">Password</label>
                    <input type="password" placeholder="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
                    <button type="submit">Register</button>
                    <button onClick={closeModal}>Close</button>
                </form>
            </div>
        </div>
        
    )
}

export default Register