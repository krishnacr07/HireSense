import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HeroSection from './HeroSection'
import CareerPage from './pages/CareerPage'
import CareerDetails from './pages/CareerDetails'
import ResumePage from './pages/ResumePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/career/:careerId" element={<CareerDetails />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App