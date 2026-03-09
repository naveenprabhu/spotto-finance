import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-700 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/">
              <img
                src="/images/Spottofinancepnglogonew.png"
                alt="Spotto Finance"
                className="h-12 w-auto brightness-0 invert mb-4"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Your trusted mortgage broker in Melbourne. We help Australians
              navigate home loans, refinancing, and investment finance with
              expert guidance and access to 30+ lenders.
            </p>
            <p className="text-gray-400 text-xs">
              Credit Representative No. 504895 authorised under Australian
              Credit Licence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Calculators', to: '/calculators' },
                { label: 'Borrowing Capacity', to: '/calculators/borrowing-capacity' },
                { label: 'Loan Health Check', to: '/calculators/loan-health-check' },
                { label: 'Book a Consultation', to: '/book' },
                { label: 'Contact Us', to: '/#contact' },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-gray-300 hover:text-brand-green text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📞</span>
                <a
                  href="tel:+61494168357"
                  className="hover:text-brand-green transition-colors"
                >
                  +61 494 168 357
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span>5/50 Thomas Street, Dandenong VIC 3175</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">🕐</span>
                <span>
                  Mon–Fri: 9am – 6pm
                  <br />
                  Sat: 10am – 5pm
                  <br />
                  Sun: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {year} Spotto Finance. All rights reserved.</p>
          <p>ABN: 72 677 973 821 &nbsp;|&nbsp; CRN: 504895</p>
        </div>
      </div>
    </footer>
  )
}
