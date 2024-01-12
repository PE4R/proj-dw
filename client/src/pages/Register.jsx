import {useState} from 'react'

function Register(){

    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    })

    const registerUser = (e) => {
        e.preventDefault()

    }

    return(
        <div>
            <form action="" onSubmit={registerUser}>
                <label htmlFor="">Name</label>
                <input type="text" placeholder="name" value={data.name} onChange={(e) => setData({...data, name: e.target.value})}/>
                <label htmlFor="">E-mail</label>
                <input type="email" placeholder="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
                <label htmlFor="">Password</label>
                <input type="password" placeholder="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register