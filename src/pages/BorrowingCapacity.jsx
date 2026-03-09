import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { sendOtp, verifyOtp, sendEmail } from '../lib/api'
import { getUserData, saveUserData, formatPhone } from '../lib/storage'
import {
  logScreenView,
  logButtonClick,
  logApiSuccess,
  logApiFailure,
  logUserAction,
} from '../lib/firebase'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(amount) {
  return `$${Number(amount.toFixed(0)).toLocaleString('en-AU')}`
}

function calculateBorrowingCapacity(income, monthlyExpenses, dependents) {
  const annualExpenses = monthlyExpenses * 12
  const adjustedIncome = income * 0.61 - annualExpenses
  const dependentAdjustment = dependents * 5000
  const preliminary = adjustedIncome - dependentAdjustment
  return Math.max(preliminary / 0.061, 0)
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function Steps({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              i + 1 < current
                ? 'bg-brand-green text-white'
                : i + 1 === current
                ? 'bg-navy-700 text-white ring-2 ring-navy-700 ring-offset-2'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {i + 1 < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`w-8 h-0.5 transition-colors duration-300 ${
                i + 1 < current ? 'bg-brand-green' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Step 1: Phone ────────────────────────────────────────────────────────────
function StepPhone({ onOtpSent }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    setError('')
    if (!name.trim()) { setError('Please enter your name.'); return }
    const formatted = formatPhone(phone)
    if (!formatted) { setError('Please enter a valid Australian mobile number (e.g. 04XX XXX XXX).'); return }

    logButtonClick('Borrowing Capacity - Send OTP')
    setLoading(true)
    try {
      await sendOtp(formatted)
      logApiSuccess('Send OTP - Borrowing Capacity')
      onOtpSent({ name: name.trim(), mobileNumber: formatted })
    } catch {
      logApiFailure('Send OTP - Borrowing Capacity')
      setError('Failed to send code. Please try again or call us directly.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Your Name *</label>
        <input
          className="form-input"
          placeholder="e.g. John Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="form-label">Mobile Number *</label>
        <input
          className="form-input"
          placeholder="04XX XXX XXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="tel"
        />
        <p className="text-gray-400 text-xs mt-1">
          We'll send a one-time verification code to this number.
        </p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
          {error}
        </div>
      )}
      <button className="btn-primary w-full" onClick={handleSend} disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="spinner" /> Sending Code…
          </span>
        ) : (
          'Send Verification Code'
        )}
      </button>
    </div>
  )
}

// ─── Step 2: OTP verify ───────────────────────────────────────────────────────
function StepOtp({ user, onVerified, onBack }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleVerify = async () => {
    setError('')
    if (code.trim().length < 4) { setError('Please enter the full OTP code.'); return }

    logButtonClick('Borrowing Capacity - Verify OTP')
    setLoading(true)
    try {
      await verifyOtp(user.mobileNumber, code.trim())
      logApiSuccess('Verify OTP - Borrowing Capacity')
      saveUserData(user.name, user.mobileNumber)
      onVerified()
    } catch {
      logApiFailure('Verify OTP - Borrowing Capacity')
      setError('Incorrect code. Please check and try again.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="bg-brand-green-light border border-brand-green/20 rounded-xl p-4 text-sm">
        <p className="text-brand-green font-semibold mb-0.5">Code sent! 📱</p>
        <p className="text-gray-600">Sent to <strong>{user.mobileNumber}</strong></p>
      </div>
      <div>
        <label className="form-label">Verification Code *</label>
        <input
          className="form-input text-center text-2xl font-bold tracking-[0.3em]"
          placeholder="• • • • • •"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          maxLength={6}
          autoFocus
        />
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
          {error}
        </div>
      )}
      <button className="btn-primary w-full" onClick={handleVerify} disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="spinner" /> Verifying…
          </span>
        ) : (
          'Verify & Continue'
        )}
      </button>
      <button
        className="w-full text-sm text-gray-400 hover:text-gray-600 py-1 transition-colors"
        onClick={onBack}
      >
        ← Change number
      </button>
    </div>
  )
}

// ─── Step 3: Financial details ────────────────────────────────────────────────
function StepFinancials({ user, onResult }) {
  const [income, setIncome] = useState('')
  const [expense, setExpense] = useState('')
  const [dependants, setDependants] = useState('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCalculate = async () => {
    setError('')
    const inc = parseFloat(income)
    const exp = parseFloat(expense)
    if (!income || isNaN(inc) || inc <= 0) {
      setError('Please enter a valid annual income.')
      return
    }
    if (!expense || isNaN(exp) || exp <= 0) {
      setError('Please enter valid monthly expenses.')
      return
    }

    logButtonClick('Borrowing Capacity - Calculate')
    setLoading(true)

    const capacity = calculateBorrowingCapacity(inc, exp, parseInt(dependants))

    try {
      await sendEmail({
        operationName: 'BorrowingCapacityCheck',
        name: user.name,
        mobileNumber: user.mobileNumber,
        income,
        expense,
        dependants,
      })
      logApiSuccess('Send email - Borrowing Capacity')
    } catch {
      logApiFailure('Send email - Borrowing Capacity')
    }

    setLoading(false)
    onResult({ capacity, income, expense, dependants })
  }

  return (
    <div className="space-y-4">
      <div className="bg-brand-green-light border border-brand-green/20 rounded-xl p-3 text-sm text-brand-green font-medium">
        👋 Hi {user.name}! Enter your financial details below.
      </div>
      <div>
        <label className="form-label">Annual Income (before tax) *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
          <input
            className="form-input pl-7"
            placeholder="e.g. 80000"
            value={income}
            onChange={(e) => setIncome(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
          />
        </div>
      </div>
      <div>
        <label className="form-label">Monthly Living Expenses *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
          <input
            className="form-input pl-7"
            placeholder="e.g. 2000"
            value={expense}
            onChange={(e) => setExpense(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
          />
        </div>
        <p className="text-gray-400 text-xs mt-1">Rent, bills, groceries, subscriptions, etc.</p>
      </div>
      <div>
        <label className="form-label">Number of Dependants</label>
        <select
          className="form-input"
          value={dependants}
          onChange={(e) => setDependants(e.target.value)}
        >
          {[0, 1, 2, 3, 4, '5+'].map((n) => (
            <option key={n} value={n === '5+' ? '5' : n}>
              {n === 0 ? 'None' : `${n} ${n === 1 ? 'child' : n === '5+' ? 'children or more' : 'children'}`}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
          {error}
        </div>
      )}
      <button className="btn-primary w-full" onClick={handleCalculate} disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="spinner" /> Calculating…
          </span>
        ) : (
          'Calculate My Borrowing Power'
        )}
      </button>
    </div>
  )
}

// ─── Step 4: Result ───────────────────────────────────────────────────────────
function StepResult({ user, result }) {
  const [loading, setLoading] = useState(false)
  const [callbackSent, setCallbackSent] = useState(false)

  const handleCallback = async () => {
    logButtonClick('Borrowing Capacity - Request Callback')
    setLoading(true)
    try {
      await sendEmail({
        operationName: 'BorrowingCapacityCheckCallBack',
        name: user.name,
        mobileNumber: user.mobileNumber,
        income: result.income,
        expense: result.expense,
        dependants: result.dependants,
        borrowingCapacity: formatCurrency(result.capacity),
      })
      logApiSuccess('Send email - Borrowing Capacity Callback')
    } catch {
      logApiFailure('Send email - Borrowing Capacity Callback')
    }
    setLoading(false)
    setCallbackSent(true)
  }

  return (
    <div className="space-y-5">
      {/* Result card */}
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 rounded-2xl p-6 text-center text-white">
        <p className="text-gray-300 text-sm mb-1">Your estimated borrowing capacity</p>
        <p className="text-4xl sm:text-5xl font-extrabold text-brand-green mb-1">
          {formatCurrency(result.capacity)}
        </p>
        <p className="text-gray-400 text-xs">
          ${Number(result.income).toLocaleString()} income · ${Number(result.expense).toLocaleString()}/mo expenses
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
        <strong>Disclaimer:</strong> This is an estimate only. Actual borrowing capacity depends on
        lender criteria, credit history, and other factors. Speak to a broker for an accurate assessment.
      </div>

      {callbackSent ? (
        <div className="text-center py-4 bg-brand-green-light rounded-2xl border border-brand-green/20">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-bold text-navy-700">Callback requested!</p>
          <p className="text-gray-500 text-sm mt-1">
            Your broker will call <strong>{user.mobileNumber}</strong> shortly.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-gray-600 text-sm font-medium">
            Want a personalised assessment from a broker?
          </p>
          <button className="btn-primary w-full" onClick={handleCallback} disabled={loading}>
            {loading ? 'Sending…' : '📞 Request a Free Callback'}
          </button>
          <a href="tel:+61494168357" className="btn-outline w-full text-center block">
            Call Now — +61 494 168 357
          </a>
        </div>
      )}

      <Link to="/calculators" className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Back to Calculators
      </Link>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BorrowingCapacity() {
  // Steps: 1=phone, 2=OTP, 3=financials, 4=result
  // Returning users (localStorage) skip to step 3
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    logScreenView('Borrowing Capacity Check')
    const stored = getUserData()
    if (stored) {
      logUserAction('OTP skipped - Borrowing Capacity Check')
      setUser(stored)
      setStep(3)
    }
  }, [])

  // Total steps for progress indicator (skip OTP for returning users)
  const isReturning = user && step >= 3 && !result
  const totalSteps = isReturning ? 2 : 4
  const displayStep = isReturning ? 1 : step === 4 ? (isReturning ? 2 : 4) : step

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            💰
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Borrowing Capacity</h1>
          <p className="text-gray-300 text-sm max-w-sm mx-auto">
            Find out how much you could borrow for a home loan in under 2 minutes.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="max-w-md mx-auto px-4 -mt-6 pb-12">
        <div className="card shadow-xl">
          <Steps current={step} total={step >= 3 && !user?.skippedOtp ? 4 : step <= 2 ? 4 : 2} />

          {step === 1 && (
            <StepPhone
              onOtpSent={(u) => {
                setUser(u)
                setStep(2)
              }}
            />
          )}
          {step === 2 && user && (
            <StepOtp
              user={user}
              onVerified={() => setStep(3)}
              onBack={() => {
                setUser(null)
                setStep(1)
              }}
            />
          )}
          {step === 3 && user && (
            <StepFinancials
              user={user}
              onResult={(r) => {
                setResult(r)
                setStep(4)
              }}
            />
          )}
          {step === 4 && user && result && <StepResult user={user} result={result} />}
        </div>
      </div>
    </div>
  )
}
