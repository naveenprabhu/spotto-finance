import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Calculators from './pages/Calculators'
import BorrowingCapacity from './pages/BorrowingCapacity'
import LoanHealthCheck from './pages/LoanHealthCheck'
import ExtraRepayments from './pages/ExtraRepayments'
import StampDuty from './pages/StampDuty'
import OffsetAccount from './pages/OffsetAccount'
import SplitLoan from './pages/SplitLoan'
import BookConsultation from './pages/BookConsultation'

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
          <Route path="/calculators/extra-repayments" element={<ExtraRepayments />} />
          <Route path="/calculators/stamp-duty" element={<StampDuty />} />
          <Route path="/calculators/offset-account" element={<OffsetAccount />} />
          <Route path="/calculators/split-loan" element={<SplitLoan />} />
          <Route path="/book" element={<BookConsultation />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
