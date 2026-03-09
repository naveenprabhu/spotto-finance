import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Calculators from './pages/Calculators'
import BorrowingCapacity from './pages/BorrowingCapacity'
import LoanHealthCheck from './pages/LoanHealthCheck'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/calculators/borrowing-capacity" element={<BorrowingCapacity />} />
          <Route path="/calculators/loan-health-check" element={<LoanHealthCheck />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
