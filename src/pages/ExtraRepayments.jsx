import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { logScreenView, logButtonClick } from '../lib/firebase'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const BOOKING_URL = 'https://outlook.office.com/book/DiscoveryCallBooking@spottofinance.com.au/?ismsaljsauthenabled'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(n) {
  return `$${Number(n.toFixed(0)).toLocaleString('en-AU')}`
}

function calcExtraRepayments(balance, annualRate, termYears, extraMonthly) {
  const r = annualRate / 100 / 12
  const n = termYears * 12
  const stdPayment = (balance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  const simulate = (extraPmt) => {
    let bal = balance
    let months = 0
    let totalInterest = 0
    const pmt = stdPayment + extraPmt
    while (bal > 0.01 && months < n * 2) {
      const interest = bal * r
      totalInterest += interest
      bal -= pmt - interest
      months++
    }
    return { months, totalInterest }
  }

  const std = simulate(0)
  const extra = simulate(extraMonthly)
  return {
    stdMonthly: stdPayment,
    newMonths: extra.months,
    stdMonths: std.months,
    monthsSaved: std.months - extra.months,
    interestSaved: std.totalInterest - extra.totalInterest,
  }
}

function fmtMonths(months) {
  const yrs = Math.floor(months / 12)
  const mo = months % 12
  if (yrs === 0) return `${mo} month${mo !== 1 ? 's' : ''}`
  if (mo === 0) return `${yrs} year${yrs !== 1 ? 's' : ''}`
  return `${yrs} yr${yrs !== 1 ? 's' : ''} ${mo} mo`
}

// ─── Step indicator ───────────────────────────────────────────────────────────
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

// ─── Step 1: Inputs ───────────────────────────────────────────────────────────
function StepDetails({ onResult }) {
  const [balance, setBalance] = useState('')
  const [rate, setRate] = useState('')
  const [term, setTerm] = useState('')
  const [extra, setExtra] = useState('')
  const [error, setError] = useState('')

  const handleCalculate = () => {
    setError('')
    const b = parseFloat(balance)
    const r = parseFloat(rate)
    const t = parseInt(term)
    const e = parseFloat(extra)
    if (!b || b <= 0) { setError('Please enter a valid loan balance.'); return }
    if (!r || r <= 0 || r > 30) { setError('Please enter a valid interest rate (e.g. 6.5).'); return }
    if (!t || t <= 0 || t > 40) { setError('Please enter a valid remaining term (e.g. 25).'); return }
    if (!e || e <= 0) { setError('Please enter the extra monthly repayment amount.'); return }
    logButtonClick('Extra Repayments - Calculate')
    onResult({ ...calcExtraRepayments(b, r, t, e), balance: b, rate: r, term: t, extra: e })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Current Loan Balance *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
          <input className="form-input pl-7" placeholder="e.g. 450000" value={balance} onChange={(e) => setBalance(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />
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
        <label className="form-label">Remaining Term (years) *</label>
        <input className="form-input" placeholder="e.g. 25" value={term} onChange={(e) => setTerm(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />
      </div>
      <div>
        <label className="form-label">Extra Monthly Repayment *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
          <input className="form-input pl-7" placeholder="e.g. 500" value={extra} onChange={(e) => setExtra(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />
        </div>
        <p className="text-gray-400 text-xs mt-1">Amount above your minimum repayment each month.</p>
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}
      <button className="btn-primary w-full" onClick={handleCalculate}>Calculate Savings</button>
    </div>
  )
}

// ─── Chart data ───────────────────────────────────────────────────────────────
function buildBalanceData(balance, annualRate, termYears, extra, stdMonthly) {
  const r = annualRate / 100 / 12
  const data = []
  let stdBal = balance
  let extraBal = balance
  const extraPmt = stdMonthly + extra
  const step = Math.max(1, Math.floor(termYears / 20)) // max ~20 data points

  for (let mo = 0; mo <= termYears * 12; mo += step) {
    if (mo > 0) {
      for (let i = 0; i < step; i++) {
        if (stdBal > 0) stdBal = Math.max(0, stdBal - (stdMonthly - stdBal * r))
        if (extraBal > 0) extraBal = Math.max(0, extraBal - (extraPmt - extraBal * r))
      }
    }
    data.push({
      year: (mo / 12).toFixed(1),
      Standard: Math.round(stdBal),
      'With Extra': Math.round(extraBal),
    })
    if (extraBal === 0 && stdBal === 0) break
  }
  return data
}

// ─── Step 2: Result ───────────────────────────────────────────────────────────
function StepResult({ result }) {
  const chartData = buildBalanceData(result.balance, result.rate, result.term, result.extra, result.stdMonthly)

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 rounded-2xl p-6 text-center text-white">
        <p className="text-gray-300 text-sm mb-1">Total interest you could save</p>
        <p className="text-4xl sm:text-5xl font-extrabold text-brand-green mb-1">
          {formatCurrency(result.interestSaved)}
        </p>
        <p className="text-gray-400 text-xs">by adding {formatCurrency(result.extra)}/mo to your repayments</p>
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
          <span className="text-gray-500">Standard repayment</span>
          <span className="font-semibold text-navy-700">{formatCurrency(result.stdMonthly)}/mo</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">With extra repayment</span>
          <span className="font-semibold text-brand-green">{formatCurrency(result.stdMonthly + result.extra)}/mo</span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2">
          <span className="text-gray-500">Original term</span>
          <span className="font-semibold text-navy-700">{fmtMonths(result.stdMonths)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">New term</span>
          <span className="font-semibold text-brand-green">{fmtMonths(result.newMonths)}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-sm font-semibold text-navy-700 mb-3">Loan Balance Over Time</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: 'Years', position: 'insideBottom', offset: -2, fontSize: 11 }} height={30} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={52} />
            <Tooltip formatter={(v) => [`$${Number(v).toLocaleString('en-AU')}`, undefined]} labelFormatter={(l) => `Year ${l}`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="Standard" stroke="#94a3b8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="With Extra" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Estimates assume a constant interest rate. Actual savings depend on lender and individual circumstances.
      </p>

      <div className="space-y-3">
        <p className="text-center text-gray-600 text-sm font-medium">Want a broker to find you a better rate?</p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full text-center block"
          onClick={() => logButtonClick('Extra Repayments - Book Consultation')}
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

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ExtraRepayments() {
  const [step, setStep] = useState(1)
  const [result, setResult] = useState(null)

  useEffect(() => { logScreenView('Extra Repayments Calculator') }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">💸</div>
          <h1 className="text-3xl font-extrabold mb-2">Extra Repayments Calculator</h1>
          <p className="text-gray-300 text-sm max-w-sm mx-auto">
            See how much time and interest you can save by paying a little extra each month.
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
