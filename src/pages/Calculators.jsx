import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { logScreenView, logButtonClick } from '../lib/firebase'

export default function Calculators() {
  useEffect(() => {
    logScreenView('Calculators')
  }, [])

  const tools = [
    {
      to: '/calculators/borrowing-capacity',
      icon: '💰',
      title: 'Borrowing Capacity',
      description:
        'Enter your income, monthly expenses and number of dependants to get an estimate of how much you could borrow for a home loan.',
      cta: 'Check My Borrowing Power',
      tags: ['Quick', 'No OTP required'],
    },
    {
      to: '/calculators/loan-health-check',
      icon: '🏥',
      title: 'Loan Health Check',
      description:
        'Enter your current loan balance and interest rate. We\'ll compare it against a competitive benchmark rate (4.89%) and show you how much you could save by refinancing.',
      cta: 'Check My Loan',
      tags: ['Phone verified', 'Refinancing insight'],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Free Financial Calculators
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Get instant insights into your home loan situation — no obligation,
            no cost.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((t) => (
            <div key={t.to} className="card flex flex-col gap-4 hover:shadow-lg transition-shadow">
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
                onClick={() => logButtonClick(`Calculators - ${t.title}`)}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h3 className="font-bold text-navy-700 text-lg mb-2">
            Want a personalised assessment?
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            These calculators give you a ballpark figure. For an accurate picture
            tailored to your full financial situation, speak to Naveen directly.
          </p>
          <a
            href="tel:+61494168357"
            className="btn-primary inline-block"
            onClick={() => logButtonClick('Calculators - Call')}
          >
            📞 Call +61 494 168 357
          </a>
        </div>
      </div>
    </div>
  )
}
