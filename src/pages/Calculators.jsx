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
      tags: ['Quick', 'Phone verified'],
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
    {
      to: '/calculators/extra-repayments',
      icon: '💸',
      title: 'Extra Repayments',
      description:
        'See how much time and interest you could save by making extra repayments on your home loan each month. Small extra payments can make a big difference over the life of a loan.',
      cta: 'Calculate My Savings',
      tags: ['Instant', 'Interest savings'],
    },
    {
      to: '/calculators/stamp-duty',
      icon: '🏛️',
      title: 'Stamp Duty Calculator',
      description:
        'Estimate the stamp duty on your property purchase across all Australian states and territories. Includes first home buyer concessions and owner-occupier rates.',
      cta: 'Estimate Stamp Duty',
      tags: ['Instant', 'All states & territories'],
    },
    {
      to: '/calculators/offset-account',
      icon: '🏦',
      title: 'Offset Account Savings',
      description:
        'Find out how much interest you could save and how many years you could shave off your loan by keeping money in an offset account.',
      cta: 'Calculate Offset Savings',
      tags: ['Instant', 'Interest savings'],
    },
    {
      to: '/calculators/split-loan',
      icon: '⚖️',
      title: 'Split Loan Calculator',
      description:
        'Compare repayments across different fixed/variable splits to find the balance of rate certainty and flexibility that suits your situation.',
      cta: 'Model My Split',
      tags: ['Instant', 'Rate comparison'],
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
            tailored to your full financial situation, speak to our broker directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/book"
              className="btn-primary inline-block"
              onClick={() => logButtonClick('Calculators - Book')}
            >
              📅 Book a Free Consultation
            </Link>
            <a
              href="tel:+61494168357"
              className="btn-outline inline-block"
              onClick={() => logButtonClick('Calculators - Call')}
            >
              📞 Call +61 494 168 357
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
