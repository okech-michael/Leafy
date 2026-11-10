import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { LeafyLogo } from './LeafyLogo'

const exploreLinks = [
  { to: '/farms', label: 'Leafy Farms', detail: 'Production and producer support' },
  { to: '/foods', label: 'Leafy Foods', detail: 'Food products and supply' },
  { to: '/market', label: 'Leafy Market', detail: 'Commercial connections' },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap rounded-full px-3 py-2 text-[17px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B45] focus-visible:ring-offset-2 ${
    isActive ? 'font-[600] text-[#245B45]' : 'font-[550] text-[#53645A] hover:text-[#245B45]'
  }`

export function PublicNavigation() {
  const { pathname } = useLocation()
  const [exploreOpen, setExploreOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const exploreButtonRef = useRef<HTMLButtonElement>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const isExploring = exploreLinks.some(({ to }) => pathname.startsWith(to))

  useEffect(() => {
    if (!exploreOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setExploreOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [exploreOpen])

  const closeMenus = () => {
    setExploreOpen(false)
    setMobileOpen(false)
    setMobileExploreOpen(false)
  }

  const handleEscape = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape' && (exploreOpen || mobileOpen)) {
      closeMenus()
      if (mobileOpen) mobileMenuButtonRef.current?.focus()
      else exploreButtonRef.current?.focus()
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#E6EAE5] bg-[#F6F5EF]/95 backdrop-blur-xl">
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8"
        onKeyDown={handleEscape}
      >
        <NavLink
          to="/"
          end
          onClick={closeMenus}
          aria-label="Leafy home"
          className="flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B45] focus-visible:ring-offset-4"
        >
          <LeafyLogo className="h-14 w-28 sm:w-32" />
        </NavLink>

        <div className="hidden items-center gap-1 xl:flex">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <div className="relative">
            <button
              ref={exploreButtonRef}
              type="button"
              aria-expanded={exploreOpen}
              aria-controls="public-explore-menu"
              data-active={isExploring || exploreOpen}
              onClick={() => setExploreOpen((open) => !open)}
              className="public-nav-trigger inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B45] focus-visible:ring-offset-2"
            >
              Explore
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`} />
            </button>
            {exploreOpen && (
              <div
                id="public-explore-menu"
                className="public-nav-dropdown absolute left-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-[#E6EAE5] bg-white p-2 shadow-[0_24px_60px_rgba(32,41,35,0.14)]"
              >
                {exploreLinks.map(({ to, label, detail }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={closeMenus}
                    className={({ isActive }) => `block rounded-xl px-4 py-3 transition-colors hover:bg-[#F3F6F1] focus-visible:bg-[#F3F6F1] focus-visible:outline-none ${isActive ? 'bg-[#F3F6F1]' : ''}`}
                  >
                    <span className="block text-base font-semibold text-[#26372F]">{label}</span>
                    <span className="mt-0.5 block text-sm text-[#53645A]">{detail}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          <NavLink to="/academy" className={navLinkClass}>Leafy Academy</NavLink>
          <NavLink to="/destination" className={navLinkClass}>Opportunities</NavLink>
          <NavLink to="/about" className={navLinkClass}>About Leafy</NavLink>
        </div>

        <div className="hidden shrink-0 items-center gap-5 xl:flex">
          <NavLink to="/auth/login" className="whitespace-nowrap text-base font-[550] text-[#53645A] transition-colors hover:text-[#245B45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B45] focus-visible:ring-offset-4">
            Sign in
          </NavLink>
          <NavLink to="/auth/register" className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full bg-[#285342] px-5 text-base font-[600] text-white transition-colors hover:bg-[#1F4032] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B45] focus-visible:ring-offset-2">
            Join Leafy
          </NavLink>
        </div>

        <button
          ref={mobileMenuButtonRef}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE4DC] text-[#245B45] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B45] focus-visible:ring-offset-2 xl:hidden"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="public-mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div id="public-mobile-menu" onKeyDown={handleEscape} className="border-t border-[#E6EAE5] bg-[#F6F5EF] px-4 pb-5 pt-3 shadow-[0_20px_40px_rgba(32,41,35,0.08)] sm:px-6 xl:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto grid max-w-7xl gap-1">
            <NavLink to="/" end onClick={closeMenus} className={navLinkClass}>Home</NavLink>
            <button
              type="button"
              aria-expanded={mobileExploreOpen}
              aria-controls="public-mobile-explore"
              data-active={isExploring || mobileExploreOpen}
              onClick={() => setMobileExploreOpen((open) => !open)}
              className="public-nav-trigger flex w-full items-center justify-between rounded-full px-3 py-2 text-left transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B45]"
            >
              Explore
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileExploreOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileExploreOpen && (
              <div id="public-mobile-explore" className="public-nav-dropdown ml-3 grid gap-1 border-l border-[#DCE4DC] py-1 pl-3">
                {exploreLinks.map(({ to, label }) => (
                  <NavLink key={to} to={to} onClick={closeMenus} className={navLinkClass}>{label}</NavLink>
                ))}
              </div>
            )}
            <NavLink to="/academy" onClick={closeMenus} className={navLinkClass}>Leafy Academy</NavLink>
            <NavLink to="/destination" onClick={closeMenus} className={navLinkClass}>Opportunities</NavLink>
            <NavLink to="/about" onClick={closeMenus} className={navLinkClass}>About Leafy</NavLink>
            <div className="mt-3 flex items-center gap-3 border-t border-[#E6EAE5] pt-4">
              <NavLink to="/auth/login" onClick={closeMenus} className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-base font-[550] text-[#53645A] hover:text-[#245B45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B45]">
                Sign in
              </NavLink>
              <NavLink to="/auth/register" onClick={closeMenus} className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-[#285342] px-5 text-base font-[600] text-white transition-colors hover:bg-[#1F4032] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245B45] focus-visible:ring-offset-2">
                Join Leafy
              </NavLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
