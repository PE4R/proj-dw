import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'

function App() {
  
  return (
    <>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
    </Routes>
    <Footer />
    </>
  )
}

export default App
