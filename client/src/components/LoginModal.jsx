import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
axios.defaults.withCredentials = true

function Login({ closeModal }){

    const { login, isLoggedIn } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        document.body.classList.add('modal-open')

        if (isLoggedIn) {
            closeModal()
        }

        return () => {
            document.body.classList.remove('modal-open')
        }

    }, [isLoggedIn, closeModal, navigate])

    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const loginUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/auth/login', data)
            login(response.data.user)
            closeModal()
            console.log('Logged in in modal')
        } catch (err) {
            console.log(err.message)
        }
    }

    return(
        <div className='modal-overlay' onClick={closeModal}>
            <div className='modal' onClick={e => e.stopPropagation()}>
                <form onSubmit={loginUser}>
                    <label htmlFor="">E-mail</label>
                    <input type="email" placeholder="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
                    <label htmlFor="">Password</label>
                    <input type="password" placeholder="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
                    <button type="submit">Login</button>
                    <button onClick={closeModal}>Close</button>
                </form>
            </div>
        </div>
        
    )
}

export default Login