
function Header(){

    return(
        <header>
            <h1>Alojamento</h1>
            <nav className="navbar">
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </nav>
            <ul className="login-bar">
                <li><a href="">Login</a></li>
                <li><a href="">Register</a></li>
                <li><a href="">Logout</a></li>
            </ul>
        </header>
    )
}

export default Header