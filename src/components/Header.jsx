import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { hash } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [hash])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Calculators', to: '/calculators' },
    { label: 'Contact', to: '/#contact' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/Spottofinancepnglogonew.png"
            alt="Spotto Finance"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} label={l.label} />
          ))}
          <a
            href="tel:+61494168357"
            className="ml-4 btn-primary text-sm py-2 px-5"
          >
            📞 +61 494 168 357
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-navy-700 hover:bg-gray-100"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="py-3 px-4 rounded-lg text-navy-700 font-medium hover:bg-brand-green-light hover:text-brand-green transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <a
              href="tel:+61494168357"
              className="mt-2 btn-primary text-center"
              onClick={() => setMenuOpen(false)}
            >
              📞 +61 494 168 357
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({ to, label }) {
  const { hash, pathname } = useLocation()
  const isActive =
    (to === '/' && pathname === '/' && !hash) ||
    (to !== '/' && !to.includes('#') && pathname.startsWith(to.split('#')[0]))

  if (to.includes('#')) {
    return (
      <a
        href={`#${to.split('#')[1]}`}
        className="px-4 py-2 rounded-lg text-gray-700 font-medium hover:text-brand-green hover:bg-brand-green-light transition-colors"
      >
        {label}
      </a>
    )
  }

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? 'text-brand-green bg-brand-green-light'
          : 'text-gray-700 hover:text-brand-green hover:bg-brand-green-light'
      }`}
    >
      {label}
    </Link>
  )
}
