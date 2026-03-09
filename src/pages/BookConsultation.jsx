import { useEffect } from 'react'
import { logScreenView, logButtonClick } from '../lib/firebase'

const BOOKING_URL = 'https://outlook.office.com/book/DiscoveryCallBooking@spottofinance.com.au/?ismsaljsauthenabled'

export default function BookConsultation() {
  useEffect(() => { logScreenView('Book Consultation') }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-5 text-4xl">
            📅
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Book a Free Discovery Call</h1>
          <p className="text-gray-300 max-w-md mx-auto leading-relaxed">
            A no-obligation chat to understand your goals and show you how we can help — no paperwork, no pressure.
          </p>

          {/* Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {[
              { icon: '✅', label: 'Free & no obligation' },
              { icon: '⏱️', label: '20–30 minutes' },
              { icon: '📞', label: 'Phone or video call' },
            ].map(({ icon, label }) => (
              <span key={label} className="bg-white/10 rounded-full px-4 py-1.5 text-sm text-gray-200 flex items-center gap-1.5">
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">

        {/* Primary CTA card */}
        <div className="card shadow-xl text-center space-y-5">
          <div className="text-5xl">🗓️</div>
          <div>
            <h2 className="text-xl font-extrabold text-navy-700 mb-1">Choose Your Time Slot</h2>
            <p className="text-gray-500 text-sm">
              Our online calendar opens in a new tab — pick a date and time that works for you.
            </p>
          </div>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-center block text-base py-4"
            onClick={() => logButtonClick('Book Consultation - Open Calendar')}
          >
            📅 Open Booking Calendar →
          </a>
          <p className="text-xs text-gray-400">
            You'll be taken to our secure Microsoft Bookings calendar
          </p>
        </div>

        {/* Or divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400 font-medium">or reach us directly</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="tel:+61494168357"
            className="card flex items-center gap-4 hover:shadow-md transition-shadow"
            onClick={() => logButtonClick('Book Consultation - Call')}
          >
            <div className="w-12 h-12 bg-brand-green-light rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
              📞
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Call us</p>
              <p className="font-bold text-navy-700">+61 494 168 357</p>
              <p className="text-xs text-gray-400">Mon–Sat, 9am – 6pm</p>
            </div>
          </a>

          <a
            href="mailto:info@spottofinance.com.au"
            className="card flex items-center gap-4 hover:shadow-md transition-shadow"
            onClick={() => logButtonClick('Book Consultation - Email')}
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
              ✉️
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Email us</p>
              <p className="font-bold text-navy-700 text-sm">info@spottofinance.com.au</p>
              <p className="text-xs text-gray-400">We reply within 24 hours</p>
            </div>
          </a>
        </div>

        {/* What to expect */}
        <div className="card space-y-4">
          <h3 className="font-bold text-navy-700 text-base">What to expect on the call</h3>
          <div className="space-y-3">
            {[
              { icon: '🎯', title: 'Understand your goals', desc: 'We listen first — whether it\'s buying, refinancing, or investing.' },
              { icon: '🏦', title: 'Explore your options', desc: 'We compare 30+ lenders to find the right loan for your situation.' },
              { icon: '📋', title: 'Clear next steps', desc: 'You\'ll leave knowing exactly what to do and what to expect.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-brand-green-light rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="font-semibold text-navy-700 text-sm">{title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { value: '30+', label: 'Lenders' },
            { value: '5.0★', label: 'Google Rating' },
            { value: 'Free', label: 'No broker fees' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4">
              <p className="text-xl font-extrabold text-brand-green">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
