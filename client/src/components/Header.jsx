import {Link} from 'react-router-dom'

function Header(){

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
                <li><Link to='/login'>Login</Link></li>
                <li><Link to='/register'>Register</Link></li>
            </ul>
        </header>
    )
}

export default Header