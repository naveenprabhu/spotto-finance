import { useEffect } from 'react'
import { logScreenView } from '../lib/firebase'

const BOOKING_URL = 'https://outlook.office.com/book/DiscoveryCallBooking@spottofinance.com.au/?ismsaljsauthenabled'

export default function BookConsultation() {
  useEffect(() => { logScreenView('Book Consultation') }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            📅
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Book a Free Consultation</h1>
          <p className="text-gray-300 text-sm max-w-md mx-auto">
            Choose a time that suits you. Your discovery call is free, no-obligation, and usually takes 20–30 minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-5 text-sm text-gray-300">
            <span className="flex items-center gap-1.5">✅ Free &amp; no obligation</span>
            <span className="flex items-center gap-1.5">⏱️ 20–30 minutes</span>
            <span className="flex items-center gap-1.5">📞 Phone or video call</span>
          </div>
        </div>
      </div>

      {/* Booking iframe */}
      <div className="flex-1 w-full">
        <iframe
          src={BOOKING_URL}
          title="Book a Discovery Call — Spotto Finance"
          width="100%"
          style={{ minHeight: 'calc(100vh - 220px)', border: 'none' }}
          scrolling="yes"
          allowFullScreen
        />
      </div>

      {/* Fallback */}
      <div className="bg-white border-t border-gray-100 py-5 text-center">
        <p className="text-sm text-gray-500">
          Having trouble with the booking form?{' '}
          <a href="tel:+61494168357" className="text-brand-green font-semibold hover:underline">
            Call us on +61 494 168 357
          </a>
          {' '}or{' '}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-green font-semibold hover:underline"
          >
            open booking page in a new tab ↗
          </a>
        </p>
      </div>
    </div>
  )
}
