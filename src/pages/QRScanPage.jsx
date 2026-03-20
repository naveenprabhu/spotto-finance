import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { logScreenView, logButtonClick } from '../lib/firebase'

export default function QRScanPage() {
  useEffect(() => {
    logScreenView('QR Scan Page')
  }, [])

  const tools = [
    {
      to: '/calculators/loan-health-check',
      icon: '🏥',
      title: 'Loan Health Check',
      description:
        "Compare your current home loan against a competitive benchmark rate. Enter your loan balance and interest rate to see how much you could save by refinancing.",
      cta: 'Check My Loan',
      tags: ['Phone verified', 'Refinancing insight'],
    },
    {
      to: '/calculators/borrowing-capacity',
      icon: '💰',
      title: 'Borrowing Capacity',
      description:
        'Enter your income, monthly expenses and number of dependants to get an estimate of how much you could borrow for a home loan.',
      cta: 'Check My Borrowing Power',
      tags: ['Quick', 'Phone verified'],
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Minimal header — logo + CTA only */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">
          <Link to="/" aria-label="Spotto Finance home">
            <img
              src="/images/Spottofinancepnglogonew.png"
              alt="Spotto Finance"
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="tel:+61494168357"
              className="text-sm font-medium text-gray-600 hover:text-navy-700 transition-colors hidden sm:block"
            >
              +61 494 168 357
            </a>
            <Link
              to="/book"
              className="btn-primary text-sm py-2.5 px-5"
              onClick={() => logButtonClick('QR Scan - Book Header')}
            >
              📅 Book a Call
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            Free Tools — No Obligation
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
            Understand Your Home Loan in Minutes
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Use our two most popular tools to check your loan health or find out
            how much you can borrow — completely free.
          </p>
        </div>
      </div>

      {/* Calculator cards */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {tools.map((t) => (
            <div
              key={t.to}
              className="card flex flex-col gap-4 hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-brand-green-light rounded-2xl flex items-center justify-center text-3xl">
                {t.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-700 mb-2">{t.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{t.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-brand-green-light text-brand-green text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                to={t.to}
                className="btn-primary text-center mt-auto"
                onClick={() => logButtonClick(`QR Scan - ${t.title}`)}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h3 className="font-bold text-navy-700 text-lg mb-2">
            Want a personalised assessment?
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            These tools give you a great starting point. For a full picture
            tailored to your situation, speak to our broker directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/book"
              className="btn-primary inline-block"
              onClick={() => logButtonClick('QR Scan - Book CTA')}
            >
              📅 Book a Free Consultation
            </Link>
            <a
              href="tel:+61494168357"
              className="btn-outline inline-block"
              onClick={() => logButtonClick('QR Scan - Call CTA')}
            >
              📞 Call +61 494 168 357
            </a>
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Spotto Finance. All rights reserved.
      </footer>
    </div>
  )
}
