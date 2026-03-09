import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { logScreenView, logButtonClick } from '../lib/firebase'

const BOOKING_URL = 'https://outlook.office.com/book/DiscoveryCallBooking@spottofinance.com.au/?ismsaljsauthenabled'

function formatCurrency(n) {
  return `$${Number(n.toFixed(0)).toLocaleString('en-AU')}`
}

function fmtMonths(months) {
  const yrs = Math.floor(months / 12)
  const mo = months % 12
  if (yrs === 0) return `${mo} month${mo !== 1 ? 's' : ''}`
  if (mo === 0) return `${yrs} year${yrs !== 1 ? 's' : ''}`
  return `${yrs} yr${yrs !== 1 ? 's' : ''} ${mo} mo`
}

function calcOffset(loanAmount, annualRate, termYears, offsetBalance) {
  const r = annualRate / 100 / 12
  const n = termYears * 12
  const stdPayment = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  const stdTotalInterest = stdPayment * n - loanAmount

  let bal = loanAmount
  let months = 0
  let totalInterest = 0
  while (bal > 0.01 && months < n * 2) {
    const effectiveBal = Math.max(0, bal - offsetBalance)
    const interest = effectiveBal * r
    totalInterest += interest
    const principal = stdPayment - interest
    if (principal <= 0) break
    bal -= principal
    months++
  }
  return {
    stdPayment,
    stdTotalInterest,
    offsetTotalInterest: totalInterest,
    interestSaved: stdTotalInterest - totalInterest,
    monthsSaved: n - months,
    newMonths: months,
  }
}

function Steps({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            i < current ? 'bg-brand-green text-white'
              : i === current ? 'bg-navy-700 text-white ring-2 ring-navy-700 ring-offset-2'
              : 'bg-gray-200 text-gray-400'
          }`}>
            {i < current ? '✓' : i}
          </div>
          {i < 2 && <div className={`w-8 h-0.5 transition-colors duration-300 ${i < current ? 'bg-brand-green' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  )
}

function StepDetails({ onResult }) {
  const [loanAmount, setLoanAmount] = useState('')
  const [rate, setRate] = useState('')
  const [term, setTerm] = useState('')
  const [offset, setOffset] = useState('')
  const [error, setError] = useState('')

  const handleCalculate = () => {
    setError('')
    const loan = parseFloat(loanAmount)
    const r = parseFloat(rate)
    const t = parseInt(term)
    const off = parseFloat(offset)
    if (!loan || loan <= 0) { setError('Please enter a valid loan amount.'); return }
    if (!r || r <= 0 || r > 30) { setError('Please enter a valid interest rate (e.g. 6.5).'); return }
    if (!t || t <= 0 || t > 40) { setError('Please enter a valid loan term (e.g. 30).'); return }
    if (isNaN(off) || off < 0) { setError('Please enter your offset balance (enter 0 if none).'); return }
    if (off >= loan) { setError('Offset balance cannot exceed the loan amount.'); return }
    logButtonClick('Offset Account - Calculate')
    onResult({ ...calcOffset(loan, r, t, off), loan, rate: r, term: t, offset: off })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Loan Amount *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
          <input className="form-input pl-7" placeholder="e.g. 500000" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />
        </div>
      </div>
      <div>
        <label className="form-label">Interest Rate (% p.a.) *</label>
        <div className="relative">
          <input className="form-input pr-7" placeholder="e.g. 6.5" value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">%</span>
        </div>
      </div>
      <div>
        <label className="form-label">Loan Term (years) *</label>
        <input className="form-input" placeholder="e.g. 30" value={term} onChange={(e) => setTerm(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />
      </div>
      <div>
        <label className="form-label">Offset Account Balance *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
          <input className="form-input pl-7" placeholder="e.g. 50000" value={offset} onChange={(e) => setOffset(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />
        </div>
        <p className="text-gray-400 text-xs mt-1">Average balance you keep in your offset account.</p>
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}
      <button className="btn-primary w-full" onClick={handleCalculate}>Calculate Offset Savings</button>
    </div>
  )
}

function StepResult({ result }) {
  const offsetPct = ((result.offset / result.loan) * 100).toFixed(1)
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 rounded-2xl p-6 text-center text-white">
        <p className="text-gray-300 text-sm mb-1">Total interest saved with offset</p>
        <p className="text-4xl sm:text-5xl font-extrabold text-brand-green mb-1">
          {formatCurrency(result.interestSaved)}
        </p>
        <p className="text-gray-400 text-xs">{offsetPct}% of loan held in offset</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-extrabold text-navy-700">{fmtMonths(result.monthsSaved)}</p>
          <p className="text-xs text-gray-500 mt-1">Earlier payoff</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-extrabold text-navy-700">{fmtMonths(result.newMonths)}</p>
          <p className="text-xs text-gray-500 mt-1">New loan term</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Monthly repayment</span>
          <span className="font-semibold text-navy-700">{formatCurrency(result.stdPayment)}/mo</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Total interest (no offset)</span>
          <span className="font-semibold text-navy-700">{formatCurrency(result.stdTotalInterest)}</span>
        </div>
        <div className="flex justify-between text-brand-green border-t border-gray-100 pt-2">
          <span className="font-medium">Total interest (with offset)</span>
          <span className="font-semibold">{formatCurrency(result.offsetTotalInterest)}</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Assumes a constant offset balance and interest rate. Actual savings will vary.
      </p>

      <div className="space-y-3">
        <p className="text-center text-gray-600 text-sm font-medium">Want a loan with a full offset account?</p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full text-center block"
          onClick={() => logButtonClick('Offset Account - Book Consultation')}
        >
          📅 Book a Free Consultation
        </a>
        <a href="tel:+61494168357" className="btn-outline w-full text-center block">Call Now — +61 494 168 357</a>
      </div>

      <Link to="/calculators" className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Back to Calculators
      </Link>
    </div>
  )
}

export default function OffsetAccount() {
  const [step, setStep] = useState(1)
  const [result, setResult] = useState(null)

  useEffect(() => { logScreenView('Offset Account Calculator') }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🏦</div>
          <h1 className="text-3xl font-extrabold mb-2">Offset Account Savings</h1>
          <p className="text-gray-300 text-sm max-w-sm mx-auto">
            See how much interest you could save and how many years you could shave off your loan with an offset account.
          </p>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 -mt-6 pb-12">
        <div className="card shadow-xl">
          <Steps current={step} />
          {step === 1 && <StepDetails onResult={(r) => { setResult(r); setStep(2) }} />}
          {step === 2 && result && <StepResult result={result} />}
        </div>
      </div>
    </div>
  )
}
