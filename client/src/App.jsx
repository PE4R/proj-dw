import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Reservations from './pages/Reservations.jsx'
import NotFound from './pages/NotFound.jsx'
import Accommodations from './pages/Accommodations.jsx'

function App() {
  
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/accommodations' element={<Accommodations />}/>
        <Route path='/reservations' element={<Reservations />}/>
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
