import {useState} from 'react'

function Login(){

    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const loginUser = (e) => {
        e.preventDefault()
    }

    return(
        <div>
            <form action="" onSubmit={loginUser}>
                <label htmlFor="">E-mail</label>
                <input type="email" placeholder="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
                <label htmlFor="">Password</label>
                <input type="password" placeholder="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login