import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on navigation
  useEffect(() => { setMenuOpen(false) }, [pathname, hash])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Calculators', to: '/calculators' },
    { label: 'Contact', to: '/#contact' },
  ]


  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100/50'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="Spotto Finance home">
          <img
            src="/images/Spottofinancepnglogonew.png"
            alt="Spotto Finance"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" role="navigation">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} label={l.label} />
          ))}
          <div className="ml-4 flex items-center gap-3">
            <a
              href="tel:+61494168357"
              className="text-sm font-medium text-gray-600 hover:text-navy-700 transition-colors hidden lg:block"
            >
              +61 494 168 357
            </a>
            <Link
              to="/book"
              className="btn-primary text-sm py-2.5 px-5"
            >
              📅 Book a Call
            </Link>
          </div>
        </nav>

        {/* Mobile: phone icon + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href="tel:+61494168357"
            className="w-10 h-10 rounded-xl bg-brand-green-light text-brand-green flex items-center justify-center text-lg"
            aria-label="Call"
          >
            📞
          </a>
          <button
            className="w-10 h-10 rounded-xl text-navy-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-1 shadow-lg">
          {navLinks.map((l) => (
            <MobileNavLink key={l.to} to={l.to} label={l.label} onClose={() => setMenuOpen(false)} />
          ))}
          <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
            <Link
              to="/book"
              className="btn-primary w-full text-center"
              onClick={() => setMenuOpen(false)}
            >
              📅 Book a Free Call
            </Link>
            <a
              href="tel:+61494168357"
              className="btn-outline w-full text-center"
              onClick={() => setMenuOpen(false)}
            >
              📞 +61 494 168 357
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, label }) {
  const { hash, pathname } = useLocation()
  const navigate = useNavigate()

  const isActive =
    (to === '/' && pathname === '/' && !hash) ||
    (to !== '/' && !to.includes('#') && pathname.startsWith(to.split('#')[0]))

  if (to.includes('#')) {
    const anchor = to.split('#')[1]
    const handleClick = (e) => {
      e.preventDefault()
      const el = document.getElementById(anchor)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/')
        setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
    return (
      <a
        href={`#${anchor}`}
        onClick={handleClick}
        className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-brand-green hover:bg-brand-green-light transition-all duration-150"
      >
        {label}
      </a>
    )
  }

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
        isActive
          ? 'text-brand-green bg-brand-green-light font-semibold'
          : 'text-gray-600 hover:text-brand-green hover:bg-brand-green-light'
      }`}
    >
      {label}
    </Link>
  )
}

function MobileNavLink({ to, label, onClose }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to.split('#')[0])

  if (to.includes('#')) {
    const anchor = to.split('#')[1]
    const handleClick = (e) => {
      e.preventDefault()
      onClose()
      const el = document.getElementById(anchor)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/')
        setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 100)
      }
    }
    return (
      <a
        href={`#${anchor}`}
        onClick={handleClick}
        className="py-3 px-4 rounded-xl text-navy-700 font-medium hover:bg-brand-green-light hover:text-brand-green transition-colors"
      >
        {label}
      </a>
    )
  }

  return (
    <Link
      to={to}
      onClick={onClose}
      className={`py-3 px-4 rounded-xl font-medium transition-colors ${
        isActive
          ? 'bg-brand-green-light text-brand-green'
          : 'text-navy-700 hover:bg-brand-green-light hover:text-brand-green'
      }`}
    >
      {label}
    </Link>
  )
}
