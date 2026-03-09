import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { logScreenView, logButtonClick } from '../lib/firebase'

const BOOKING_URL = 'https://outlook.office.com/book/DiscoveryCallBooking@spottofinance.com.au/?ismsaljsauthenabled'

function formatCurrency(n) {
  return `$${Number(n.toFixed(0)).toLocaleString('en-AU')}`
}

function monthlyRepayment(principal, annualRate, termYears) {
  if (principal <= 0) return 0
  const r = annualRate / 100 / 12
  const n = termYears * 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function calcSplitLoan(totalLoan, fixedPct, fixedRate, varRate, termYears) {
  const fixedAmount = totalLoan * (fixedPct / 100)
  const varAmount = totalLoan - fixedAmount
  const fixedMonthly = monthlyRepayment(fixedAmount, fixedRate, termYears)
  const varMonthly = monthlyRepayment(varAmount, varRate, termYears)
  const blendedRate = (fixedAmount * fixedRate + varAmount * varRate) / totalLoan
  return {
    fixedAmount, varAmount,
    fixedMonthly, varMonthly,
    totalMonthly: fixedMonthly + varMonthly,
    blendedRate,
    fullFixedMonthly: monthlyRepayment(totalLoan, fixedRate, termYears),
    fullVarMonthly: monthlyRepayment(totalLoan, varRate, termYears),
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
  const [totalLoan, setTotalLoan] = useState('')
  const [fixedPct, setFixedPct] = useState('50')
  const [fixedRate, setFixedRate] = useState('')
  const [varRate, setVarRate] = useState('')
  const [term, setTerm] = useState('')
  const [error, setError] = useState('')

  const handleCalculate = () => {
    setError('')
    const loan = parseFloat(totalLoan)
    const fp = parseFloat(fixedPct)
    const fr = parseFloat(fixedRate)
    const vr = parseFloat(varRate)
    const t = parseInt(term)
    if (!loan || loan <= 0) { setError('Please enter a valid loan amount.'); return }
    if (isNaN(fp) || fp < 0 || fp > 100) { setError('Fixed split must be between 0% and 100%.'); return }
    if (!fr || fr <= 0 || fr > 30) { setError('Please enter a valid fixed interest rate.'); return }
    if (!vr || vr <= 0 || vr > 30) { setError('Please enter a valid variable interest rate.'); return }
    if (!t || t <= 0 || t > 40) { setError('Please enter a valid loan term (e.g. 30).'); return }
    logButtonClick('Split Loan - Calculate')
    onResult({ ...calcSplitLoan(loan, fp, fr, vr, t), loan, fixedPct: fp, fixedRate: fr, varRate: vr, term: t })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Total Loan Amount *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
          <input className="form-input pl-7" placeholder="e.g. 600000" value={totalLoan} onChange={(e) => setTotalLoan(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />
        </div>
      </div>
      <div>
        <label className="form-label">Fixed Portion: {fixedPct}% fixed / {100 - Number(fixedPct)}% variable</label>
        <input type="range" className="w-full accent-brand-green" min={0} max={100} step={5} value={fixedPct} onChange={(e) => setFixedPct(e.target.value)} />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>All Variable</span><span>50/50</span><span>All Fixed</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label">Fixed Rate (% p.a.) *</label>
          <div className="relative">
            <input className="form-input pr-7" placeholder="e.g. 6.0" value={fixedRate} onChange={(e) => setFixedRate(e.target.value)} inputMode="decimal" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
        </div>
        <div>
          <label className="form-label">Variable Rate (% p.a.) *</label>
          <div className="relative">
            <input className="form-input pr-7" placeholder="e.g. 6.8" value={varRate} onChange={(e) => setVarRate(e.target.value)} inputMode="decimal" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
        </div>
      </div>
      <div>
        <label className="form-label">Loan Term (years) *</label>
        <input className="form-input" placeholder="e.g. 30" value={term} onChange={(e) => setTerm(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}
      <button className="btn-primary w-full" onClick={handleCalculate}>Calculate Split Repayments</button>
    </div>
  )
}

function StepResult({ result }) {
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 rounded-2xl p-6 text-center text-white">
        <p className="text-gray-300 text-sm mb-1">Total monthly repayment</p>
        <p className="text-4xl sm:text-5xl font-extrabold text-brand-green mb-1">
          {formatCurrency(result.totalMonthly)}
        </p>
        <p className="text-gray-400 text-xs">Blended rate: {result.blendedRate.toFixed(2)}% p.a.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-2">Fixed {result.fixedPct}%</p>
          <p className="text-xl font-extrabold text-navy-700">{formatCurrency(result.fixedAmount)}</p>
          <p className="text-xs text-gray-500 mt-1">Loan portion</p>
          <p className="text-base font-bold text-navy-700 mt-2">{formatCurrency(result.fixedMonthly)}<span className="text-xs font-normal text-gray-500">/mo</span></p>
          <p className="text-xs text-gray-400">at {result.fixedRate}% p.a.</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs text-brand-green font-semibold uppercase tracking-wide mb-2">Variable {100 - result.fixedPct}%</p>
          <p className="text-xl font-extrabold text-navy-700">{formatCurrency(result.varAmount)}</p>
          <p className="text-xs text-gray-500 mt-1">Loan portion</p>
          <p className="text-base font-bold text-navy-700 mt-2">{formatCurrency(result.varMonthly)}<span className="text-xs font-normal text-gray-500">/mo</span></p>
          <p className="text-xs text-gray-400">at {result.varRate}% p.a.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2 text-sm">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Comparison — all fixed vs all variable</p>
        <div className="flex justify-between">
          <span className="text-gray-500">100% fixed ({result.fixedRate}%)</span>
          <span className="font-semibold text-navy-700">{formatCurrency(result.fullFixedMonthly)}/mo</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">100% variable ({result.varRate}%)</span>
          <span className="font-semibold text-navy-700">{formatCurrency(result.fullVarMonthly)}/mo</span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2 text-brand-green">
          <span className="font-medium">Your split</span>
          <span className="font-bold">{formatCurrency(result.totalMonthly)}/mo</span>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Variable rates can change. Speak to a broker for a personalised comparison.
      </p>

      <div className="space-y-3">
        <p className="text-center text-gray-600 text-sm font-medium">Want help choosing the right split?</p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full text-center block"
          onClick={() => logButtonClick('Split Loan - Book Consultation')}
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

export default function SplitLoan() {
  const [step, setStep] = useState(1)
  const [result, setResult] = useState(null)

  useEffect(() => { logScreenView('Split Loan Calculator') }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">⚖️</div>
          <h1 className="text-3xl font-extrabold mb-2">Split Loan Calculator</h1>
          <p className="text-gray-300 text-sm max-w-sm mx-auto">
            Compare repayments on a fixed/variable split to find the right balance of security and flexibility.
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
