import { useState, useEffect, useRef } from 'react'
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
const BENCHMARK_RATE = 4.89

function formatCurrency(amount) {
  return `$${Number(amount.toFixed(0)).toLocaleString('en-AU')}`
}

function calcMonthly(principal, annualRate) {
  const r = annualRate / 100 / 12
  const n = 30 * 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function Steps({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i + 1 < current
                ? 'bg-brand-green text-white'
                : i + 1 === current
                ? 'bg-navy-700 text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {i + 1 < current ? '✓' : i + 1}
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

// ─── Step 1: Name + phone ─────────────────────────────────────────────────────
function StepPhone({ onOtpSent }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    setError('')
    if (!name.trim()) { setError('Please enter your name.'); return }
    const formatted = formatPhone(phone)
    if (!formatted) { setError('Please enter a valid Australian mobile number.'); return }

    logButtonClick('Loan Health Check - Send OTP')
    setLoading(true)
    try {
      await sendOtp(formatted)
      logApiSuccess('Send OTP')
      onOtpSent({ name: name.trim(), mobileNumber: formatted })
    } catch {
      logApiFailure('Send OTP')
      setError('Failed to send OTP. Please try again or call us directly.')
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
          We'll send a one-time code to verify your number.
        </p>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button className="btn-primary w-full" onClick={handleSend} disabled={loading}>
        {loading ? 'Sending OTP…' : 'Send Verification Code'}
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
    if (!code.trim()) { setError('Please enter the OTP code.'); return }

    logButtonClick('Loan Health Check - Verify OTP')
    setLoading(true)
    try {
      await verifyOtp(user.mobileNumber, code.trim())
      logApiSuccess('Verify OTP')
      saveUserData(user.name, user.mobileNumber)
      onVerified()
    } catch {
      logApiFailure('Verify OTP')
      setError('Invalid OTP. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="bg-brand-green-light rounded-xl p-3 text-sm text-brand-green">
        Code sent to <strong>{user.mobileNumber}</strong>
      </div>
      <div>
        <label className="form-label">Verification Code *</label>
        <input
          className="form-input text-center text-2xl font-bold tracking-widest"
          placeholder="••••••"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          maxLength={6}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button className="btn-primary w-full" onClick={handleVerify} disabled={loading}>
        {loading ? 'Verifying…' : 'Verify Code'}
      </button>
      <button
        className="w-full text-sm text-gray-400 hover:text-gray-600 py-2"
        onClick={onBack}
      >
        ← Change number
      </button>
    </div>
  )
}

// ─── Step 3: Loan details ─────────────────────────────────────────────────────
function StepLoanDetails({ user, onResult }) {
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-format interest rate with decimal
  const handleRateChange = (e) => {
    let val = e.target.value.replace(/[^\d.]/g, '')
    if (!val.includes('.') && val.length > 0) {
      val = val[0] + '.' + val.slice(1)
    }
    setInterestRate(val)
  }

  const handleCalculate = async () => {
    setError('')
    const principal = parseFloat(loanAmount)
    const rate = parseFloat(interestRate)
    if (!loanAmount || isNaN(principal) || principal <= 0) { setError('Please enter a valid loan amount.'); return }
    if (!interestRate || isNaN(rate) || rate <= 0) { setError('Please enter a valid interest rate.'); return }

    logButtonClick('Loan Health Check - Calculate')
    setLoading(true)

    const currentMonthly = calcMonthly(principal, rate)
    const benchmarkMonthly = calcMonthly(principal, BENCHMARK_RATE)
    const monthlySavings = currentMonthly - benchmarkMonthly
    const yearlySavings = monthlySavings > 0 ? monthlySavings * 12 : 0
    const totalSavings = yearlySavings + 5000

    const resultData = {
      loanAmount: principal,
      interestRate: rate,
      propertyAddress,
      currentMonthly,
      benchmarkMonthly: monthlySavings > 0 ? benchmarkMonthly : currentMonthly,
      yearlySavings,
      totalSavings,
      hasSavings: yearlySavings > 0,
    }

    try {
      await sendEmail({
        operationName: 'LoanHealthCheck',
        name: user.name,
        mobileNumber: user.mobileNumber,
        loanAmount,
        interestRate,
        propertyAddress,
      })
      logApiSuccess('Send email - Loan Health Check')
    } catch {
      logApiFailure('Send email - Loan Health Check')
    }

    setLoading(false)
    onResult(resultData)
  }

  return (
    <div className="space-y-4">
      <div className="bg-brand-green-light rounded-xl p-3 text-sm text-brand-green font-medium">
        ✅ Verified! Hi {user.name} — enter your loan details below.
      </div>
      <div>
        <label className="form-label">Current Loan Balance *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
          <input
            className="form-input pl-7"
            placeholder="e.g. 450000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
          />
        </div>
      </div>
      <div>
        <label className="form-label">Current Interest Rate *</label>
        <div className="relative">
          <input
            className="form-input pr-7"
            placeholder="e.g. 6.5"
            value={interestRate}
            onChange={handleRateChange}
            inputMode="decimal"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
        </div>
        <p className="text-gray-400 text-xs mt-1">Check your latest bank statement or app.</p>
      </div>
      <div>
        <label className="form-label">Property Address (optional)</label>
        <input
          className="form-input"
          placeholder="e.g. 123 Main St, Melbourne"
          value={propertyAddress}
          onChange={(e) => setPropertyAddress(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button className="btn-primary w-full" onClick={handleCalculate} disabled={loading}>
        {loading ? 'Calculating…' : 'Check My Loan Health'}
      </button>
    </div>
  )
}

// ─── Step 4: Result ───────────────────────────────────────────────────────────
function StepResult({ user, result }) {
  const [callbackSent, setCallbackSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCallback = async () => {
    logButtonClick('Loan Health Check - Request Callback')
    setLoading(true)
    try {
      await sendEmail({
        operationName: 'LoanHealthCheckCallBack',
        name: user.name,
        mobileNumber: user.mobileNumber,
        loanAmount: result.loanAmount,
        interestRate: result.interestRate,
        propertyAddress: result.propertyAddress || '',
        currentRepayment: `${formatCurrency(result.currentMonthly)} / month`,
        potentialRepayment: `${formatCurrency(result.benchmarkMonthly)} / month`,
        interestSavings: `${formatCurrency(result.yearlySavings)} / year`,
      })
      logApiSuccess('Send email - Loan Health Check Callback')
    } catch {
      logApiFailure('Send email - Loan Health Check Callback')
    }
    setLoading(false)
    setCallbackSent(true)
  }

  return (
    <div className="space-y-5">
      {/* Health indicator */}
      <div
        className={`rounded-2xl p-5 text-white text-center ${
          result.hasSavings
            ? 'bg-gradient-to-br from-amber-500 to-orange-600'
            : 'bg-gradient-to-br from-brand-green to-brand-green-dark'
        }`}
      >
        <div className="text-3xl mb-2">{result.hasSavings ? '⚠️' : '✅'}</div>
        <p className="font-bold text-lg">
          {result.hasSavings ? 'Your rate could be better!' : 'Your rate looks competitive!'}
        </p>
        <p className="text-sm opacity-90 mt-1">
          {result.hasSavings
            ? `You may be paying more than the ${BENCHMARK_RATE}% benchmark rate.`
            : `Your rate is at or below our ${BENCHMARK_RATE}% benchmark.`}
        </p>
      </div>

      {/* Comparison table */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Monthly Repayment Comparison
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <p className="text-sm text-gray-500">Your current rate</p>
              <p className="font-bold text-navy-700">{result.interestRate}% p.a.</p>
            </div>
            <p className="text-lg font-extrabold text-navy-700">
              {formatCurrency(result.currentMonthly)}<span className="text-sm font-normal text-gray-400"> /mo</span>
            </p>
          </div>
          <div className="flex justify-between items-center px-4 py-3 bg-brand-green-light">
            <div>
              <p className="text-sm text-gray-500">Benchmark rate</p>
              <p className="font-bold text-brand-green">{BENCHMARK_RATE}% p.a.</p>
            </div>
            <p className="text-lg font-extrabold text-brand-green">
              {formatCurrency(result.benchmarkMonthly)}<span className="text-sm font-normal text-gray-400"> /mo</span>
            </p>
          </div>
        </div>
      </div>

      {/* Savings highlight */}
      {result.hasSavings && (
        <div className="bg-navy-700 text-white rounded-2xl p-5 text-center">
          <p className="text-gray-300 text-sm">Potential annual savings</p>
          <p className="text-3xl font-extrabold text-brand-green my-1">
            {formatCurrency(result.yearlySavings)}/yr
          </p>
          <p className="text-xs text-gray-400">
            Total potential savings: up to {formatCurrency(result.totalSavings)}*
          </p>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
        *Estimates based on a 30-year loan term and market rate comparison. Actual savings depend on lender criteria and individual circumstances.
      </div>

      {/* CTA */}
      {callbackSent ? (
        <div className="text-center py-3">
          <div className="text-3xl mb-2">🎉</div>
          <p className="font-bold text-navy-700">Callback requested!</p>
          <p className="text-gray-500 text-sm mt-1">
            Naveen will call {user.mobileNumber} shortly.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-sm text-gray-600 font-medium">
            Want Naveen to find you a better rate?
          </p>
          <button
            className="btn-primary w-full"
            onClick={handleCallback}
            disabled={loading}
          >
            {loading ? 'Sending…' : '📞 Request a Free Callback'}
          </button>
          <a href="tel:+61494168357" className="btn-outline w-full text-center block">
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
export default function LoanHealthCheck() {
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    logScreenView('Loan Health Check')
    const stored = getUserData()
    if (stored) {
      logUserAction('OTP skipped - Loan Health Check')
      setUser(stored)
      setStep(3) // skip to loan details
    }
  }, [])

  // For users without stored data: step 1 = phone, step 2 = OTP, step 3 = loan details, step 4 = result
  // For users with stored data:    step 3 = loan details, step 4 = result (step indicator shows 1, 2)
  const totalSteps = user?.fromStorage ? 2 : 4
  const displayStep = user?.fromStorage ? (step === 3 ? 1 : 2) : step

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-12">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="text-4xl mb-3">🏥</div>
          <h1 className="text-3xl font-extrabold mb-2">Loan Health Check</h1>
          <p className="text-gray-300 text-sm">
            See how your current home loan compares to the market benchmark and find out if you could save.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">
        <div className="card">
          <Steps current={step} total={step <= 3 && !result ? 4 : 4} />

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
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && user && (
            <StepLoanDetails
              user={user}
              onResult={(r) => {
                setResult(r)
                setStep(4)
              }}
            />
          )}
          {step === 4 && user && result && (
            <StepResult user={user} result={result} />
          )}
        </div>
      </div>
    </div>
  )
}
