import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { sendEmail } from '../lib/api'
import { getUserData, saveUserData, formatPhone } from '../lib/storage'
import { logScreenView, logButtonClick, logApiSuccess, logApiFailure, logUserAction } from '../lib/firebase'

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i + 1 <= current
                ? 'bg-brand-green text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {i + 1 <= current - 1 ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`w-8 h-0.5 transition-colors ${
                i + 1 < current ? 'bg-brand-green' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Step 1: User details ─────────────────────────────────────────────────────
function StepUserDetails({ onNext }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const handleNext = () => {
    setError('')
    if (!name.trim()) { setError('Please enter your name.'); return }
    const formatted = formatPhone(phone)
    if (!formatted) { setError('Please enter a valid Australian mobile number.'); return }
    logButtonClick('Borrowing Capacity - Save User Details')
    saveUserData(name.trim(), formatted)
    onNext({ name: name.trim(), mobileNumber: formatted })
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
        <p className="text-gray-400 text-xs mt-1">Australian mobile numbers only</p>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button className="btn-primary w-full" onClick={handleNext}>
        Continue →
      </button>
    </div>
  )
}

// ─── Step 2: Financial details ────────────────────────────────────────────────
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
    if (!income || isNaN(inc) || inc <= 0) { setError('Please enter a valid annual income.'); return }
    if (!expense || isNaN(exp) || exp <= 0) { setError('Please enter valid monthly expenses.'); return }

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
      <div className="bg-brand-green-light rounded-xl p-3 text-sm text-brand-green font-medium">
        👋 Hi {user.name}! Fill in your details below.
      </div>
      <div>
        <label className="form-label">Annual Income (before tax) *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
          <input
            className="form-input pl-7"
            placeholder="e.g. 2000"
            value={expense}
            onChange={(e) => setExpense(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
          />
        </div>
        <p className="text-gray-400 text-xs mt-1">Include rent, bills, groceries, subscriptions, etc.</p>
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
              {n} {n === '5+' ? 'or more' : n === 1 ? 'child' : 'children'}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        className="btn-primary w-full"
        onClick={handleCalculate}
        disabled={loading}
      >
        {loading ? 'Calculating…' : 'Calculate My Borrowing Power'}
      </button>
    </div>
  )
}

// ─── Step 3: Result ───────────────────────────────────────────────────────────
function StepResult({ user, result, onCallbackSent }) {
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
    onCallbackSent?.()
  }

  return (
    <div className="space-y-6">
      {/* Result card */}
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 rounded-2xl p-6 text-center text-white">
        <p className="text-gray-300 text-sm mb-1">Your estimated borrowing capacity</p>
        <p className="text-4xl font-extrabold text-brand-green mb-1">
          {formatCurrency(result.capacity)}
        </p>
        <p className="text-gray-400 text-xs">
          Based on ${Number(result.income).toLocaleString()} income &amp;
          ${Number(result.expense).toLocaleString()}/mo expenses
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Disclaimer:</strong> This is an estimate only. Actual borrowing capacity
        depends on lender assessment criteria, credit history, and other factors.
        Speak to Naveen for an accurate assessment.
      </div>

      {callbackSent ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-bold text-navy-700">Callback requested!</p>
          <p className="text-gray-500 text-sm mt-1">Naveen will call you at {user.mobileNumber} shortly.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-gray-600 text-sm font-medium">
            Want Naveen to call you with a personalised assessment?
          </p>
          <button
            className="btn-primary w-full"
            onClick={handleCallback}
            disabled={loading}
          >
            {loading ? 'Sending…' : '📞 Request a Free Callback'}
          </button>
          <a
            href="tel:+61494168357"
            className="btn-outline w-full text-center block"
          >
            Call Now — +61 494 168 357
          </a>
        </div>
      )}

      <Link to="/calculators" className="block text-center text-sm text-gray-400 hover:text-gray-600">
        ← Back to Calculators
      </Link>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BorrowingCapacity() {
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    logScreenView('Borrowing Capacity Check')
    const stored = getUserData()
    if (stored) {
      logUserAction('OTP skipped - Borrowing Capacity Check')
      setUser(stored)
      setStep(2)
    }
  }, [])

  const totalSteps = user && step === 1 ? 2 : 3
  const displayStep = user && step === 2 ? 1 : step

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {/* Page header */}
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-12 mb-10">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="text-4xl mb-3">💰</div>
          <h1 className="text-3xl font-extrabold mb-2">Borrowing Capacity</h1>
          <p className="text-gray-300 text-sm">
            Find out how much you could borrow for a home loan in under 2 minutes.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="max-w-md mx-auto px-4">
        <div className="card">
          <Steps current={step} total={step === 3 || result ? 3 : 2} />

          {step === 1 && (
            <StepUserDetails
              onNext={(u) => {
                setUser(u)
                setStep(2)
              }}
            />
          )}
          {step === 2 && user && (
            <StepFinancials
              user={user}
              onResult={(r) => {
                setResult(r)
                setStep(3)
              }}
            />
          )}
          {step === 3 && user && result && (
            <StepResult user={user} result={result} />
          )}
        </div>
      </div>
    </div>
  )
}
