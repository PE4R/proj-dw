import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import {Routes, Route, Navigate} from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Reservations from './pages/Reservations.jsx'
import NotFound from './pages/NotFound.jsx'
import Accommodations from './pages/Accommodations.jsx'
import AccommodationDetail from './pages/AccommodationDetail.jsx'

function App() {
  
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/accommodations' element={<Accommodations />}/>
        <Route path='/accommodations/:id' element={<AccommodationDetail />} />
        <Route path='/reservations' element={<Reservations />}/>
        <Route path='/not-found' element={<NotFound />}/>
        <Route path='*' element={<Navigate to='/not-found' replace />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
