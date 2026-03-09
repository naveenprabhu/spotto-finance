import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { reviews } from '../data/reviews'
import { logScreenView, logButtonClick } from '../lib/firebase'

// ─── Star rating ────────────────────────────────────────────────────────────
function Stars({ count = 5 }) {
  return (
    <span className="text-yellow-400 text-sm">
      {'★'.repeat(count)}
    </span>
  )
}

// ─── Review card ────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="card flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: review.color }}
        >
          {review.initial}
        </div>
        <div>
          <p className="font-semibold text-navy-700 text-sm">{review.name}</p>
          <p className="text-gray-400 text-xs">{review.date}</p>
        </div>
        <div className="ml-auto flex-shrink-0">
          <img
            src="/images/google-logo.svg"
            alt="Google"
            className="h-5 w-auto opacity-60"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      </div>
      <Stars />
      <p className="text-gray-600 text-sm leading-relaxed flex-1">{review.text}</p>
    </div>
  )
}

// ─── Service card ────────────────────────────────────────────────────────────
function ServiceCard({ icon, title, description }) {
  return (
    <div className="card text-center hover:shadow-lg transition-shadow">
      <div className="w-14 h-14 bg-brand-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
        {icon}
      </div>
      <h3 className="font-bold text-navy-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

// ─── Contact form ────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'sent' | 'error'

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    logButtonClick('Contact Form Submit')
    setStatus('sending')
    try {
      const res = await fetch(
        'https://9v4qfkzq5g.execute-api.ap-southeast-2.amazonaws.com/dev/sendemail',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operationName: 'ContactForm',
            name: form.name,
            mobileNumber: form.phone,
            message: form.message,
          }),
        }
      )
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-navy-700 mb-2">Message received!</h3>
        <p className="text-gray-500">Naveen will get back to you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Your Name *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. John Smith"
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label">Phone Number *</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="04XX XXX XXX"
          className="form-input"
        />
      </div>
      <div>
        <label className="form-label">How can we help?</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us a bit about what you're looking for..."
          className="form-input resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full"
        onClick={() => logButtonClick('Contact Form Submit')}
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">
          Something went wrong. Please call us directly on +61 494 168 357.
        </p>
      )}
    </form>
  )
}

// ─── Main Home page ──────────────────────────────────────────────────────────
export default function Home() {
  const contactRef = useRef(null)

  useEffect(() => {
    logScreenView('Home')
    // Scroll to #contact if hash present
    if (window.location.hash === '#contact' || window.location.hash === '#/contact') {
      setTimeout(() => contactRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [])

  const services = [
    {
      icon: '🏠',
      title: 'Home Loans',
      description:
        'First purchase or upgrade — we find the right loan for your situation from 30+ lenders at competitive rates.',
    },
    {
      icon: '🔄',
      title: 'Refinancing',
      description:
        'Could you be paying less? We compare your current rate and help you switch to a better deal and save thousands.',
    },
    {
      icon: '📈',
      title: 'Investment Loans',
      description:
        'Grow your property portfolio with smart finance strategies tailored to your investment goals.',
    },
    {
      icon: '🔑',
      title: 'First Home Buyer',
      description:
        'Navigating the property market for the first time? We make the journey smooth, simple, and stress-free.',
    },
  ]

  const stats = [
    { value: '30+', label: 'Lenders' },
    { value: '5.0★', label: 'Google Rating' },
    { value: '100%', label: 'Client-First' },
    { value: 'Free', label: 'Consultation' },
  ]

  const whyUs = [
    {
      icon: '🎯',
      title: 'Access to 30+ Lenders',
      description:
        'We compare hundreds of loan products across Australia\'s top banks and lenders to find you the best rate.',
    },
    {
      icon: '🤝',
      title: 'Personalised Service',
      description:
        'Naveen takes the time to understand your financial situation, goals, and concerns — no cookie-cutter advice.',
    },
    {
      icon: '📊',
      title: 'Tax & Investment Expertise',
      description:
        'Beyond just mortgages, Naveen\'s background in accounting and AU taxation means holistic financial guidance.',
    },
  ]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="inline-block bg-brand-green/20 text-brand-green font-semibold text-sm px-4 py-1 rounded-full mb-6 tracking-wide">
            Melbourne's Trusted Mortgage Broker
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Making Homeownership
            <span className="text-brand-green block sm:inline"> Easy</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Expert home loans, refinancing &amp; investment finance in Melbourne.
            Access 30+ lenders. Zero broker fee. 5-star service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+61494168357"
              className="btn-primary text-base py-3 px-8"
              onClick={() => logButtonClick('Hero - Call Now')}
            >
              📞 Call Now — Free Consult
            </a>
            <Link
              to="/calculators"
              className="btn-white text-base py-3 px-8"
              onClick={() => logButtonClick('Hero - Try Calculator')}
            >
              Try Our Calculators
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <section className="bg-brand-green py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-white">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-extrabold">{s.value}</p>
                <p className="text-sm font-medium opacity-90">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-700 mb-3">
              How We Can Help You
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From your first home to building a property portfolio, Spotto Finance
              has you covered every step of the way.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── About Naveen ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              👨‍💼
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-700 mb-4">
              Meet Naveen Arumugam
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Naveen is a Melbourne-based mortgage broker with a background in
              accounting and deep expertise in Australian taxation and property
              investment. Based in Dandenong, he serves clients across Victoria
              and beyond.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              His approach is simple: understand your goals, explain your options
              clearly, and work tirelessly to secure the best possible outcome.
              That's why his clients consistently give 5-star reviews.
            </p>
            <a
              href="tel:+61494168357"
              className="btn-primary inline-block"
              onClick={() => logButtonClick('About - Call Now')}
            >
              Book a Free Consultation
            </a>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-700 mb-3">
              Why Choose Spotto Finance?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUs.map((w) => (
              <div key={w.title} className="text-center">
                <div className="w-16 h-16 bg-brand-green-light rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  {w.icon}
                </div>
                <h3 className="font-bold text-navy-700 text-lg mb-2">{w.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{w.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Google Reviews ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-700 mb-2">
              What Our Clients Say
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Stars />
              <span className="text-gray-600 font-semibold">5.0</span>
              <span className="text-gray-400 text-sm">· Google Reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
            {reviews.map((r) => (
              <ReviewCard key={r.name} review={r} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Calculator CTA ──────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-navy-700 to-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Know Your Numbers
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-10">
            Use our free calculators to understand your borrowing power or check
            whether your current loan is still competitive.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              to="/calculators/borrowing-capacity"
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 text-left transition-colors block"
              onClick={() => logButtonClick('Home CTA - Borrowing Capacity')}
            >
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-bold text-lg mb-2">Borrowing Capacity</h3>
              <p className="text-gray-300 text-sm">
                Find out how much you could borrow based on your income &amp; expenses.
              </p>
            </Link>
            <Link
              to="/calculators/loan-health-check"
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 text-left transition-colors block"
              onClick={() => logButtonClick('Home CTA - Loan Health Check')}
            >
              <div className="text-3xl mb-3">🏥</div>
              <h3 className="font-bold text-lg mb-2">Loan Health Check</h3>
              <p className="text-gray-300 text-sm">
                Compare your current rate against a benchmark and see potential savings.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────────────── */}
      <section id="contact" ref={contactRef} className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Info */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-700 mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Ready to get started, or just want to ask a question? Reach out
                and Naveen will personally get back to you.
              </p>
              <ul className="space-y-5 text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-brand-green-light rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    📞
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Phone</p>
                    <a
                      href="tel:+61494168357"
                      className="text-navy-700 font-semibold hover:text-brand-green transition-colors"
                    >
                      +61 494 168 357
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-10 h-10 bg-brand-green-light rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    📍
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Address</p>
                    <p className="text-navy-700 font-semibold">
                      5/50 Thomas Street, Dandenong VIC 3175
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-10 h-10 bg-brand-green-light rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    🕐
                  </span>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Hours</p>
                    <p className="text-navy-700 font-semibold">
                      Mon–Fri: 9am – 6pm
                      <br />
                      Sat: 10am – 5pm
                      <br />
                      Sun: Closed
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Form */}
            <div className="card">
              <h3 className="font-bold text-navy-700 text-lg mb-5">Send a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
