import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { logScreenView, logButtonClick } from '../lib/firebase'

const BOOKING_URL = 'https://outlook.office.com/book/DiscoveryCallBooking@spottofinance.com.au/?ismsaljsauthenabled'

function formatCurrency(n) {
  return `$${Number(Math.round(n)).toLocaleString('en-AU')}`
}

const STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA',  label: 'Western Australia' },
  { value: 'SA',  label: 'South Australia' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT',  label: 'Northern Territory' },
  { value: 'TAS', label: 'Tasmania' },
]

function calcDuty(state, price, isFirstHome, isPrimary) {
  let duty = 0
  switch (state) {
    case 'NSW':
      if (price <= 16000)        duty = price * 0.0125
      else if (price <= 35000)   duty = 200 + (price - 16000) * 0.015
      else if (price <= 93000)   duty = 485 + (price - 35000) * 0.0175
      else if (price <= 351000)  duty = 1500 + (price - 93000) * 0.035
      else if (price <= 1168000) duty = 10530 + (price - 351000) * 0.045
      else                       duty = 47295 + (price - 1168000) * 0.055
      if (isFirstHome && isPrimary) {
        if (price <= 800000)       duty = 0
        else if (price <= 1000000) duty = duty * (price - 800000) / 200000
      }
      break
    case 'VIC':
      if (price <= 25000)        duty = price * 0.014
      else if (price <= 130000)  duty = 350 + (price - 25000) * 0.024
      else if (price <= 960000)  duty = 2870 + (price - 130000) * 0.06
      else                       duty = price * 0.055
      if (isFirstHome && isPrimary) {
        if (price <= 600000)       duty = 0
        else if (price <= 750000)  duty = duty * (price - 600000) / 150000
      }
      break
    case 'QLD':
      if (price <= 5000)          duty = 0
      else if (price <= 75000)    duty = (price - 5000) * 0.015
      else if (price <= 540000)   duty = 1050 + (price - 75000) * 0.035
      else if (price <= 1000000)  duty = 17325 + (price - 540000) * 0.045
      else                        duty = 38025 + (price - 1000000) * 0.0575
      if (isFirstHome && isPrimary) {
        if (price <= 500000)       duty = 0
        else if (price <= 550000)  duty = duty * (price - 500000) / 50000
      }
      break
    case 'WA':
      if (price <= 80000)         duty = price * 0.019
      else if (price <= 100000)   duty = 1520 + (price - 80000) * 0.0285
      else if (price <= 250000)   duty = 2090 + (price - 100000) * 0.038
      else if (price <= 500000)   duty = 7790 + (price - 250000) * 0.0475
      else                        duty = 19665 + (price - 500000) * 0.0515
      if (isFirstHome && isPrimary) {
        if (price <= 430000)       duty = 0
        else if (price <= 530000)  duty = duty * (price - 430000) / 100000
      }
      break
    case 'SA':
      if (price <= 12000)         duty = price * 0.01
      else if (price <= 30000)    duty = 120 + (price - 12000) * 0.02
      else if (price <= 50000)    duty = 480 + (price - 30000) * 0.03
      else if (price <= 100000)   duty = 1080 + (price - 50000) * 0.035
      else if (price <= 200000)   duty = 2830 + (price - 100000) * 0.04
      else if (price <= 250000)   duty = 6830 + (price - 200000) * 0.0425
      else if (price <= 300000)   duty = 8955 + (price - 250000) * 0.0475
      else                        duty = 11330 + (price - 300000) * 0.055
      break
    case 'ACT':
      if (price <= 200000)        duty = price * 0.012 + 20
      else if (price <= 300000)   duty = price * 0.022 + 20
      else if (price <= 500000)   duty = price * 0.034 + 20
      else if (price <= 750000)   duty = price * 0.0432 + 20
      else if (price <= 1000000)  duty = price * 0.059
      else                        duty = price * 0.0647
      if (isFirstHome && isPrimary && price <= 1000000) duty = 20
      break
    case 'NT':
      duty = price <= 525000 ? price * 0.034 : price * 0.0495
      break
    case 'TAS':
      if (price <= 3000)          duty = price * 0.01
      else if (price <= 25000)    duty = 30 + (price - 3000) * 0.015
      else if (price <= 75000)    duty = 360 + (price - 25000) * 0.0225
      else if (price <= 200000)   duty = 1485 + (price - 75000) * 0.035
      else if (price <= 375000)   duty = 5860 + (price - 200000) * 0.04
      else                        duty = 12860 + (price - 375000) * 0.045
      if (isFirstHome && isPrimary) duty = duty * 0.5
      break
    default: duty = 0
  }
  return Math.max(0, Math.round(duty))
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
  const [state, setState] = useState('VIC')
  const [price, setPrice] = useState('')
  const [isFirstHome, setIsFirstHome] = useState(false)
  const [isPrimary, setIsPrimary] = useState(true)
  const [error, setError] = useState('')

  const handleCalculate = () => {
    setError('')
    const p = parseFloat(price.replace(/,/g, ''))
    if (!p || p <= 0) { setError('Please enter a valid property price.'); return }
    logButtonClick('Stamp Duty - Calculate')
    const duty = calcDuty(state, p, isFirstHome, isPrimary)
    const stateName = STATES.find((s) => s.value === state)?.label || state
    onResult({ duty, price: p, state, stateName, isFirstHome, isPrimary })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">State / Territory *</label>
        <select className="form-input" value={state} onChange={(e) => setState(e.target.value)}>
          {STATES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Property Purchase Price *</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
          <input className="form-input pl-7" placeholder="e.g. 750000" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ''))} inputMode="numeric" />
        </div>
      </div>
      <div className="space-y-3">
        {[
          { label: 'First Home Buyer', value: isFirstHome, set: setIsFirstHome },
          { label: 'Owner-Occupied (not investment)', value: isPrimary, set: setIsPrimary },
        ].map(({ label, value, set }) => (
          <label key={label} className="flex items-center gap-3 cursor-pointer select-none">
            <div className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center ${value ? 'bg-brand-green' : 'bg-gray-300'}`} onClick={() => set(!value)}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 mx-0.5 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </label>
        ))}
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>}
      <button className="btn-primary w-full" onClick={handleCalculate}>Calculate Stamp Duty</button>
    </div>
  )
}

function StepResult({ result }) {
  const effectivePct = ((result.duty / result.price) * 100).toFixed(2)
  const totalUpfront = result.duty + result.price
  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 rounded-2xl p-6 text-center text-white">
        <p className="text-gray-300 text-sm mb-1">Estimated stamp duty in {result.stateName}</p>
        <p className="text-4xl sm:text-5xl font-extrabold text-brand-green mb-1">
          {result.duty === 0 ? 'Nil' : formatCurrency(result.duty)}
        </p>
        <p className="text-gray-400 text-xs">
          {result.isFirstHome ? '🏠 First Home Buyer concession applied' : `${effectivePct}% of property price`}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Property price</span>
          <span className="font-semibold text-navy-700">{formatCurrency(result.price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Stamp duty</span>
          <span className="font-semibold text-navy-700">{result.duty === 0 ? 'Nil' : formatCurrency(result.duty)}</span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2">
          <span className="text-gray-500 font-medium">Total upfront cost</span>
          <span className="font-bold text-navy-700">{formatCurrency(totalUpfront)}</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
        <strong>Note:</strong> Figures are indicative estimates. Concessions, surcharges, and thresholds change regularly. Consult a conveyancer for exact amounts.
      </div>

      <div className="space-y-3">
        <p className="text-center text-gray-600 text-sm font-medium">Need help planning your upfront costs?</p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full text-center block"
          onClick={() => logButtonClick('Stamp Duty - Book Consultation')}
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

export default function StampDuty() {
  const [step, setStep] = useState(1)
  const [result, setResult] = useState(null)

  useEffect(() => { logScreenView('Stamp Duty Calculator') }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🏛️</div>
          <h1 className="text-3xl font-extrabold mb-2">Stamp Duty Calculator</h1>
          <p className="text-gray-300 text-sm max-w-sm mx-auto">
            Estimate the stamp duty on your property purchase across all Australian states and territories.
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
