import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { reviews } from '../data/reviews'
import { logScreenView, logButtonClick } from '../lib/firebase'

// ─── Stars ───────────────────────────────────────────────────────────────────
function Stars({ count = 5, size = 'sm' }) {
  return (
    <span className={`text-yellow-400 ${size === 'lg' ? 'text-xl' : 'text-sm'}`}>
      {'★'.repeat(count)}
    </span>
  )
}

// ─── Review card ─────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ring-white shadow-sm"
          style={{ backgroundColor: review.color }}
        >
          {review.initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-navy-700 text-sm truncate">{review.name}</p>
          <p className="text-gray-400 text-xs">{review.date}</p>
        </div>
        <div className="w-5 h-5 flex-shrink-0">
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        </div>
      </div>
      <Stars />
      <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-4">{review.text}</p>
    </div>
  )
}

// ─── Contact form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

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
          body: JSON.stringify({ operationName: 'ContactForm', name: form.name, mobileNumber: form.phone, message: form.message }),
        }
      )
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
    } catch { setStatus('error') }
  }

  if (status === 'sent') {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
        <h3 className="text-xl font-bold text-navy-700 mb-2">Message Received!</h3>
        <p className="text-gray-500">Naveen will personally get back to you shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Your Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="John Smith" className="form-input" />
        </div>
        <div>
          <label className="form-label">Phone Number *</label>
          <input name="phone" value={form.phone} onChange={handleChange} required placeholder="04XX XXX XXX" className="form-input" inputMode="tel" />
        </div>
      </div>
      <div>
        <label className="form-label">How can we help?</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us about your property goals…" className="form-input resize-none" />
      </div>
      <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
        {status === 'sending' ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Sending…</span> : 'Send Message'}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">
          Something went wrong. Please call <a href="tel:+61494168357" className="underline">+61 494 168 357</a> directly.
        </p>
      )}
    </form>
  )
}

// ─── Home page ────────────────────────────────────────────────────────────────
export default function Home() {
  const contactRef = useRef(null)

  useEffect(() => {
    logScreenView('Home')
    if (window.location.hash.includes('contact')) {
      setTimeout(() => contactRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [])

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-navy-700 via-navy-800 to-[#0d2b45] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          <div className="section-badge bg-brand-green/20 text-brand-green animate-fade-up">
            Melbourne's Trusted Mortgage Broker
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 animate-fade-up-d1">
            Home Loans Made{' '}
            <span className="text-gradient">Simple.</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-up-d2">
            Expert mortgage advice, 30+ lenders, zero broker fees.
            From first home buyers to seasoned investors — we get you the right loan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up-d3">
            <a href="tel:+61494168357" className="btn-primary text-base py-3.5 px-8" onClick={() => logButtonClick('Hero - Call Now')}>
              📞 Free Consultation
            </a>
            <Link to="/calculators" className="btn-white text-base py-3.5 px-8" onClick={() => logButtonClick('Hero - Calculators')}>
              Try Our Calculators →
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 animate-fade-up-d3">
            <div className="flex items-center gap-1.5"><Stars /><span className="text-white font-semibold">5.0</span><span>on Google</span></div>
            <div className="w-px h-4 bg-white/20 hidden sm:block" />
            <div>✓ Credit Rep No. 504895</div>
            <div className="w-px h-4 bg-white/20 hidden sm:block" />
            <div>✓ No broker fees</div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="bg-brand-green py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
            {[
              { icon: '🏦', value: '30+', label: 'Lenders' },
              { icon: '⭐', value: '5.0', label: 'Google Rating' },
              { icon: '💰', value: 'Free', label: 'Consultation' },
              { icon: '📋', value: '100%', label: 'Client-First' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className="text-2xl sm:text-3xl font-extrabold">{s.value}</p>
                <p className="text-sm font-medium opacity-90 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-badge">What We Do</div>
            <h2 className="section-heading">How We Can Help You</h2>
            <p className="section-sub">From your first home to building a portfolio — Spotto Finance is with you every step of the way.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏠', color: 'bg-blue-50 border-blue-200', iconBg: 'bg-blue-100', title: 'Home Loans',
                desc: "First purchase or upgrade — we find the right loan from 30+ lenders at rates you won't find by walking into a bank." },
              { icon: '🔄', color: 'bg-emerald-50 border-emerald-200', iconBg: 'bg-emerald-100', title: 'Refinancing',
                desc: "Already have a loan? We'll compare your current rate and switch you to a better deal, saving you thousands." },
              { icon: '📈', color: 'bg-purple-50 border-purple-200', iconBg: 'bg-purple-100', title: 'Investment Loans',
                desc: 'Grow your property portfolio with smart finance strategies and access to investor-friendly lenders.' },
              { icon: '🔑', color: 'bg-orange-50 border-orange-200', iconBg: 'bg-orange-100', title: 'First Home Buyer',
                desc: "Navigating the market for the first time? We make the whole journey simple — from pre-approval to settlement." },
            ].map((s) => (
              <div key={s.title} className={`rounded-2xl border-2 ${s.color} p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}>
                <div className={`w-14 h-14 ${s.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-navy-700 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT NAVEEN ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Photo */}
            <div className="flex items-center justify-center order-last lg:order-first">
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-green to-navy-700 scale-105 opacity-20 blur-sm" />
                {/* Photo frame */}
                <div className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="/images/naveen.jpeg"
                    alt="Naveen Arumugam — Mortgage Broker"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Subtle gradient at bottom to soften background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-700/40 via-transparent to-transparent" />
                  {/* Name label */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                    <p className="text-white font-bold text-sm drop-shadow-lg">Naveen Arumugam</p>
                    <p className="text-white/80 text-xs drop-shadow-lg">Mortgage Broker · Dandenong, VIC</p>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute -top-3 -right-3 bg-brand-green text-white rounded-xl shadow-lg px-3 py-1.5 text-xs font-bold">
                  30+ Lenders
                </div>
                <div className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-lg px-3 py-1.5 flex items-center gap-1.5">
                  <Stars size="sm" />
                  <span className="text-sm font-bold text-navy-700">5.0</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="section-badge">Your Broker</div>
              <h2 className="section-heading">Meet Naveen Arumugam</h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Based in Dandenong, Victoria, Naveen brings a strong accounting background
                and a working understanding of Australian tax law to his mortgage broking practice.
                He helps clients across Victoria find the right home loan, refinance smarter,
                and think about property with a financial strategy in mind.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                His clients consistently describe him as patient, honest, and genuinely invested
                in their success. Whether you're buying your first home or restructuring multiple
                loans, Naveen delivers real results — not just paperwork.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { label: 'Accounting background', icon: '📊', color: 'bg-blue-50 text-blue-700' },
                  { label: 'AU tax knowledge', icon: '⚖️', color: 'bg-purple-50 text-purple-700' },
                  { label: 'Property strategy', icon: '📈', color: 'bg-emerald-50 text-emerald-700' },
                  { label: 'Patient & transparent', icon: '🤝', color: 'bg-orange-50 text-orange-700' },
                ].map((f) => (
                  <div key={f.label} className={`flex items-center gap-2 text-xs font-semibold ${f.color} rounded-xl px-3 py-2`}>
                    <span>{f.icon}</span>
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
              <a href="tel:+61494168357" className="btn-primary" onClick={() => logButtonClick('About - Call Now')}>
                Book a Free Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-navy-700 to-navy-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-badge bg-white/10 text-white">Why Spotto Finance</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">The Smarter Way to Get a Home Loan</h2>
            <p className="text-gray-300 max-w-xl mx-auto">Walk into a bank and get one option. Come to us and get the best option from over 30 lenders.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Access to 30+ Lenders', color: 'border-blue-400',
                desc: "We compare hundreds of products across Australia's top banks, credit unions, and non-bank lenders to find your best rate." },
              { icon: '🤝', title: 'Personalised Service', color: 'border-brand-green',
                desc: "You deal directly with Naveen — not a call centre. He takes the time to understand your full financial picture." },
              { icon: '📊', title: 'Accounting Expertise', color: 'border-purple-400',
                desc: "With an accounting background and working knowledge of AU tax, Naveen gives you broader financial perspective beyond just the mortgage." },
            ].map((w) => (
              <div key={w.title} className={`glass rounded-2xl p-6 text-center border-t-4 ${w.color} hover:-translate-y-1 transition-transform duration-300`}>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">{w.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-white">{w.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="section-badge">How It Works</div>
            <h2 className="section-heading">Simple 3-Step Process</h2>
            <p className="section-sub">From first call to settlement — we keep it simple and transparent.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-0.5 bg-brand-green/30" />

            {[
              { step: '01', icon: '📞', title: 'Free Consultation', color: 'bg-blue-500',
                desc: 'Chat with Naveen about your goals. No obligation — just honest advice tailored to your situation.' },
              { step: '02', icon: '🔍', title: 'We Compare 30+ Lenders', color: 'bg-brand-green',
                desc: 'We search the market to find the loan with the best rate and features for your needs.' },
              { step: '03', icon: '🏡', title: 'Settlement', color: 'bg-purple-500',
                desc: 'We handle all the paperwork and keep you informed every step of the way until you get your keys.' },
            ].map((p) => (
              <div key={p.step} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow relative">
                {/* Numbered badge — clearly visible, colorful */}
                <div className={`w-16 h-16 ${p.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <span className="text-white font-black text-xl">{p.step}</span>
                </div>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-navy-700 text-lg mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="section-badge">Client Reviews</div>
            <h2 className="section-heading">What Our Clients Say</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Stars size="lg" />
              <span className="text-2xl font-extrabold text-navy-700">5.0</span>
              <span className="text-gray-400">· 8 reviews on Google</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((r) => <ReviewCard key={r.name} review={r} />)}
          </div>
          <div className="mt-8 text-center">
            <a href="https://share.google/qGCinTcXioUgFbtGI" target="_blank" rel="noopener noreferrer"
              className="btn-outline inline-block" onClick={() => logButtonClick('See All Reviews')}>
              See All Reviews on Google ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR CTA ────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-brand-green to-brand-green-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="section-badge bg-white/20 text-white">Free Tools</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Know Your Numbers</h2>
            <p className="text-white/80 max-w-xl mx-auto">
              Use our free calculators to understand your borrowing power or check if you're getting the best rate.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { to: '/calculators/borrowing-capacity', icon: '💰', badge: 'Most Popular',
                title: 'Borrowing Capacity', desc: 'Find out how much you could borrow based on your income and expenses.',
                cta: 'Check My Borrowing Power', event: 'Home CTA - Borrowing Capacity' },
              { to: '/calculators/loan-health-check', icon: '🏥', badge: 'Save Thousands',
                title: 'Loan Health Check', desc: 'Compare your current rate against a 4.89% benchmark and see potential savings.',
                cta: 'Check My Loan Rate', event: 'Home CTA - Loan Health Check' },
            ].map((c) => (
              <Link key={c.to} to={c.to} onClick={() => logButtonClick(c.event)}
                className="bg-white rounded-2xl p-6 block hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-green-light rounded-xl flex items-center justify-center text-2xl">
                    {c.icon}
                  </div>
                  <span className="text-xs font-bold text-brand-green bg-brand-green-light px-2 py-0.5 rounded-full">{c.badge}</span>
                </div>
                <h3 className="font-bold text-navy-700 text-lg mb-2">{c.title}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{c.desc}</p>
                <span className="text-brand-green font-semibold text-sm">{c.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" ref={contactRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="section-badge">Get in Touch</div>
              <h2 className="section-heading">Let's Talk About Your Home Loan</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Whether you're ready to apply or just have questions, Naveen will personally
                get back to you — usually within a few hours.
              </p>
              <ul className="space-y-5">
                {[
                  { icon: '📞', label: 'Phone', content: <a href="tel:+61494168357" className="font-bold text-navy-700 hover:text-brand-green transition-colors">+61 494 168 357</a>, color: 'bg-blue-50' },
                  { icon: '📍', label: 'Address', content: <span className="font-bold text-navy-700">5/50 Thomas Street, Dandenong VIC 3175</span>, color: 'bg-orange-50' },
                  { icon: '🕐', label: 'Hours', content: <span className="font-bold text-navy-700">Mon–Fri 9am–6pm · Sat 10am–5pm · Sun Closed</span>, color: 'bg-purple-50' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{item.label}</p>
                      {item.content}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400 space-y-1">
                <p>ABN: 72 677 973 821 · CRN: 504895</p>
                <p>Credit Representative authorised under Australian Credit Licence</p>
              </div>
            </div>
            <div className="card shadow-lg border border-gray-100">
              <h3 className="font-bold text-navy-700 text-xl mb-1">Send a Message</h3>
              <p className="text-gray-400 text-sm mb-6">We'll get back to you within a few hours.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
