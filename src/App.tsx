import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Compass,
  Eye,
  EyeOff,
  HeartHandshake,
  Sprout,
  Store,
  UtensilsCrossed,
  UsersRound,
} from 'lucide-react'
import { Component, lazy, Suspense, useEffect, useState, type ErrorInfo, type FormEvent, type ReactNode } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { PublicNavigation } from './PublicNavigation'
import { HomepageContent } from './HomepageContent'
import { LeafyLoading, LeafyLoadingProvider } from './LeafyLoading'
import { LeafyLogo } from './LeafyLogo'

const AcademyRoutes = lazy(() => import('./academy/AcademyRoutes').then((module) => ({ default: module.AcademyRoutes })))
const MarketRoutes = lazy(() => import('./market/MarketRoutes').then((module) => ({ default: module.MarketRoutes })))
const FarmsRoutes = lazy(() => import('./farms/FarmsRoutes').then((module) => ({ default: module.FarmsRoutes })))
const FoodsRoutes = lazy(() => import('./foods/FoodsRoutes').then((module) => ({ default: module.FoodsRoutes })))
const FoundationRoutes = lazy(() => import('./foundation/FoundationRoutes').then((module) => ({ default: module.FoundationRoutes })))

const queryClient = new QueryClient()

const divisionData = [
  {
    id: 'foods',
    name: 'Leafy Foods',
    tag: 'Food products and supply partnerships.',
    description: 'Showcase Leafy food products and connect producers with customers and organisations that need a reliable food supply.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-[#285342] via-[#39845A] to-[#A4C68C]',
    icon: UtensilsCrossed,
  },
  {
    id: 'farms',
    name: 'Leafy Farms',
    tag: 'Agricultural production and producer support.',
    description: 'Support Leafy’s farm-based production and agricultural activities, and connect eligible produce with buyers and partners.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa52ac9fcf7a?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-[#285342] via-[#2e5d46] to-[#A4C68C]',
    icon: Sprout,
  },
  {
    id: 'academy',
    name: 'Leafy Academy',
    tag: 'Practical learning for agriculture and enterprise.',
    description: 'Build practical knowledge and skills in agriculture, entrepreneurship, innovation and community development.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-[#285342] via-[#39845A] to-[#dfeec5]',
    icon: BookOpen,
  },
  {
    id: 'foundation',
    name: 'Leafy Foundation',
    tag: 'Community programmes and social impact.',
    description: 'Coordinate community-led initiatives, participation and partnerships that advance Leafy’s mission.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-[#1f3931] via-[#285342] to-[#8eb57b]',
    icon: HeartHandshake,
  },
  {
    id: 'market',
    name: 'Leafy Market',
    tag: 'Commercial connections for agriculture.',
    description: 'Connect agricultural producers, innovators and food businesses with buyers and potential partners.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    accent: 'from-[#285342] via-[#3d6f51] to-[#d9f1d3]',
    icon: Store,
  },
]

const divisionPaths: Record<string, string> = {
  academy: '/academy',
  farms: '/farms',
  foods: '/foods',
  foundation: '/foundation',
  market: '/market',
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LeafyLoadingProvider>
          <AppShell />
        </LeafyLoadingProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

function AppShell() {
  const location = useLocation()
  const isWorkspaceRoute =
    location.pathname.startsWith('/academy/student') ||
    location.pathname.startsWith('/academy/learn/') ||
    location.pathname.startsWith('/academy/assessments/') ||
    /^\/farms\/(dashboard|farm|expert|manage)(\/|$)/.test(location.pathname) ||
    location.pathname.startsWith('/foods/manage') ||
    /^\/foundation\/(manage|participant)(\/|$)/.test(location.pathname) ||
    location.pathname.startsWith('/market/manage') ||
    (location.pathname.startsWith('/market/seller/') && !location.pathname.startsWith('/market/seller/apply'))
  const isAuthRoute = location.pathname.startsWith('/auth/')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#F6F5EF] text-[#202923]">
      {!isWorkspaceRoute && !isAuthRoute && <PublicNavigation key={location.pathname} />}

      <AnimatePresence mode="wait">
        <RouteErrorBoundary key={location.pathname}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutLeafyPage />} />
            <Route path="/destination" element={<DestinationSelection />} />
            <Route path="/operations" element={<OperationsCentrePage />} />
            <Route path="/auth/:mode" element={<AuthPage />} />
            <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset" element={<PasswordResetPage />} />
            <Route path="/auth/verify" element={<EmailVerificationPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/employee" element={<EmployeePortalPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/division/:divisionId" element={<DivisionRedirect />} />
            <Route path="/foods/*" element={<Suspense fallback={<LeafyLoading />}><FoodsRoutes /></Suspense>} />
            <Route path="/farms/*" element={<Suspense fallback={<LeafyLoading />}><FarmsRoutes /></Suspense>} />
            <Route path="/academy/*" element={<Suspense fallback={<LeafyLoading />}><AcademyRoutes /></Suspense>} />
            <Route path="/foundation/*" element={<Suspense fallback={<LeafyLoading />}><FoundationRoutes /></Suspense>} />
            <Route path="/market/*" element={<Suspense fallback={<LeafyLoading />}><MarketRoutes /></Suspense>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </RouteErrorBoundary>
      </AnimatePresence>
    </div>
  )
}

class RouteErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error): { error: Error } {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('A page failed to load.', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <main role="alert" className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h1 className="text-2xl font-semibold text-[#0B3D2E]">This page could not be loaded.</h1>
          <p className="mt-3 text-sm leading-6 text-[#4B5E56]">The page request failed. Check your connection and try again.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-full bg-[#0B3D2E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#164f3d]">
            Retry page
          </button>
        </main>
      )
    }

    return this.props.children
  }
}

function AboutLeafyPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-8 overflow-hidden rounded-[2rem] border border-[#E6EAE5] bg-white shadow-[0_40px_80px_rgba(32,41,35,0.06)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-8 sm:p-10 lg:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">About Leafy</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#202923] sm:text-5xl">One ecosystem for innovation, learning and growth.</h1>
          <p className="mt-5 text-base leading-8 text-[#6B756E]">Leafy brings agricultural innovators, food founders, learners, investors, mentors and partner organisations into one connected environment. The platform is designed to help people discover opportunities, support ideas and create commercial pathways grounded in real agricultural needs.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <NavLink to="/farms" className="rounded-full bg-[#285342] px-5 py-3 text-sm font-semibold text-white">Explore Farms</NavLink>
            <NavLink to="/foods" className="rounded-full border border-[#E6EAE5] bg-[#F6F5EF] px-5 py-3 text-sm font-semibold text-[#202923]">Explore Foods</NavLink>
          </div>
        </div>
        <div className="relative min-h-[420px] bg-[#EDF4EA]">
          <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80" alt="Leafy stakeholders collaborating" className="h-full w-full object-cover" />
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'Agricultural innovation', detail: 'Promote farm-focused innovation, technology adoption and research-backed solutions.' },
          { title: 'Food systems', detail: 'Support food products, processing, packaging, nutrition and sustainable value chains.' },
          { title: 'Learning', detail: 'Build knowledge through practical academy pathways, training and mentoring.' },
          { title: 'Commercialisation', detail: 'Connect innovation to buyers, partners, investors and market opportunities.' },
        ].map(({ title, detail }) => (
          <div key={title} className="rounded-[1.5rem] border border-[#E6EAE5] bg-white p-6 shadow-[0_25px_50px_rgba(32,41,35,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#39845A]">Leafy</p>
            <h2 className="mt-4 text-2xl font-semibold text-[#202923]">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#6B756E]">{detail}</p>
          </div>
        ))}
      </section>
    </main>
  )
}

function OperationsCentrePage() {
  const operationsCards = [
    { title: 'Stakeholder CRM', copy: 'Track innovators, partners, mentors, buyers and programme participants in one shared directory.', status: 'Shared records' },
    { title: 'Innovation management', copy: 'Review submissions, assign reviewers, track stages from screening through commercialisation.', status: 'Lifecycle view' },
    { title: 'Incubation programmes', copy: 'Coordinate cohorts, milestones, mentors, applications and programme reporting.', status: 'Programme admin' },
    { title: 'Investor and partnership management', copy: 'Record introductions, opportunities, follow-ups and stakeholder engagement history.', status: 'Relationships' },
    { title: 'Academy administration', copy: 'Manage courses, instructors, learner progress, assessments and certificates.', status: 'Learning operations' },
    { title: 'Physical operations & events', copy: 'Schedule workshops, exhibitions, field learning, meetings and site activity coordination.', status: 'Events & logistics' },
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-[#E6EAE5] bg-white p-8 shadow-[0_40px_80px_rgba(32,41,35,0.06)] sm:p-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Leafy operations centre</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#202923] sm:text-5xl">The private operating system behind the Leafy ecosystem.</h1>
          <p className="mt-5 text-base leading-8 text-[#6B756E]">This internal workspace is designed for Leafy staff to manage stakeholders, track innovation progress, oversee academy delivery and coordinate the physical and digital side of the business in a single, connected operating model.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Registered innovators', value: '128' },
            { label: 'Active programmes', value: '09' },
            { label: 'Upcoming events', value: '14' },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-[#E6EAE5] bg-[#F6F5EF] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#39845A]">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-[#202923]">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Operational functions</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#202923]">Connected business operations, not disconnected admin screens.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {operationsCards.map(({ title, copy, status }) => (
            <article key={title} className="rounded-[1.6rem] border border-[#E6EAE5] bg-white p-6 shadow-[0_25px_50px_rgba(32,41,35,0.04)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#39845A]">{status}</p>
                <div className="h-2.5 w-2.5 rounded-full bg-[#285342]" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-[#202923]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#6B756E]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] border border-[#E6EAE5] bg-[#EDF4EA] p-8 sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Working model</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#202923]">Submission → Screening → Assessment → Incubation → Commercialisation.</h2>
          </div>
          <NavLink to="/dashboard" className="inline-flex items-center justify-center rounded-full bg-[#285342] px-5 py-3 text-sm font-semibold text-white">View member portal</NavLink>
        </div>
      </section>
    </main>
  )
}

function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Organisation overview · prototype</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#202923]">Leafy’s connected work</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6B756E]">Leafy brings agricultural production, food businesses, commercial connections, practical learning and community programmes together. This preview has no live organisation records or reporting data.</p>
        </div>
        <NavLink to="/operations" className="inline-flex items-center gap-2 rounded-full bg-[#285342] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f4032]">
          Operations workspace <ArrowRight className="h-4 w-4" />
        </NavLink>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {divisionData.map(({ id, name, description, icon: Icon }) => (
          <article key={id} className="rounded-[1.5rem] border border-[#E6EAE5] bg-white p-6 shadow-[0_25px_50px_rgba(32,41,35,0.04)]">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]"><Icon className="h-5 w-5" /></div>
            <h2 className="text-xl font-semibold text-[#202923]">{name}</h2>
            <p className="mt-3 text-sm leading-6 text-[#6B756E]">{description}</p>
            <NavLink to={`/${id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#285342]">Explore this division <ArrowRight className="h-4 w-4" /></NavLink>
          </article>
        ))}
      </div>
    </main>
  )
}

function EmployeePortalPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Staff workspace · preview</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#202923]">Coordinate work across Leafy</h1>
        </div>
      </div>

      <p className="mb-6 max-w-3xl rounded-2xl border border-[#e6eae5] bg-white p-5 text-sm leading-7 text-[#6B756E]">Leafy staff work across agricultural production, food products, producer and buyer connections, practical learning and community initiatives. This page is a workflow preview only: it does not contain real tasks, enquiries, orders or access permissions.</p>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {divisionData.map(({ id, name, description, icon: Icon }) => (
          <article key={id} className="rounded-[1.5rem] border border-[#E6EAE5] bg-white p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]"><Icon className="h-5 w-5" /></div>
            <h2 className="text-xl font-semibold text-[#202923]">{name}</h2>
            <p className="mt-3 text-sm leading-6 text-[#6B756E]">{description}</p>
          </article>
        ))}
      </div>
    </main>
  )
}

function ForgotPasswordPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[#E6EAE5] bg-white p-8 shadow-[0_30px_60px_rgba(32,41,35,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Account recovery</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#202923]">Forgot your password?</h1>
        <p className="mt-4 text-base leading-7 text-[#6B756E]">We’ll send a secure reset link to the email address associated with your Leafy account.</p>
        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#202923]">Email address</label>
            <input className="w-full rounded-2xl border border-[#E6EAE5] bg-[#F6F5EF] px-4 py-3 outline-none transition focus:border-[#285342]" placeholder="you@example.com" />
          </div>
          <button className="w-full rounded-full bg-[#285342] px-4 py-3 text-sm font-semibold text-white">Send reset link</button>
        </form>
      </div>
    </main>
  )
}

function PasswordResetPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[#E6EAE5] bg-white p-8 shadow-[0_30px_60px_rgba(32,41,35,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Secure reset</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#202923]">Reset your password</h1>
        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#202923]">New password</label>
            <input type="password" className="w-full rounded-2xl border border-[#E6EAE5] bg-[#F6F5EF] px-4 py-3 outline-none transition focus:border-[#285342]" placeholder="••••••••" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#202923]">Confirm password</label>
            <input type="password" className="w-full rounded-2xl border border-[#E6EAE5] bg-[#F6F5EF] px-4 py-3 outline-none transition focus:border-[#285342]" placeholder="••••••••" />
          </div>
          <button className="w-full rounded-full bg-[#285342] px-4 py-3 text-sm font-semibold text-white">Update password</button>
        </form>
      </div>
    </main>
  )
}

function EmailVerificationPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[#E6EAE5] bg-white p-8 shadow-[0_30px_60px_rgba(32,41,35,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Email verification</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#202923]">Confirm your email</h1>
        <p className="mt-4 text-base leading-7 text-[#6B756E]">A confirmation link was sent to your inbox. Once verified, you can access your Leafy account and continue to your selected division.</p>
        <button className="mt-8 rounded-full bg-[#285342] px-5 py-3 text-sm font-semibold text-white">Verify email</button>
      </div>
    </main>
  )
}

function LandingPage() {
  return <HomepageContent />
}

function DestinationSelection() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Discover the ecosystem</p>
        <h1 className="text-5xl font-semibold tracking-[-0.06em] text-[#202923]">Where Would You Like to Go?</h1>
        <p className="mt-4 text-lg leading-8 text-[#6B756E]">Explore our divisions and discover the services, opportunities and experiences available within the Leafy ecosystem.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {divisionData.map(({ id, name, tag, description, image, icon: Icon }) => (
          <motion.div key={id} whileHover={{ scale: 1.01, y: -5 }} className="group overflow-hidden rounded-[1.8rem] border border-[#E6EAE5] bg-white shadow-[0_30px_60px_rgba(32,41,35,0.05)]">
            <div className="relative h-56 overflow-hidden">
              <img src={image} alt={name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#202923]/80 to-transparent" />
              <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#285342]">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <h2 className="text-xl font-semibold text-[#202923]">{name}</h2>
                <p className="mt-2 text-sm font-medium text-[#39845A]">{tag}</p>
              </div>
              <p className="text-sm leading-6 text-[#6B756E]">{description}</p>
              <NavLink to={`/${id}`} className="inline-flex items-center rounded-full bg-[#285342] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f4032]">
                Explore {name.split(' ')[1] ?? 'division'}
              </NavLink>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}

function AuthPage() {
  const { mode } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [authNotice, setAuthNotice] = useState('')
  const currentMode = mode === 'login' || mode === 'register' ? mode : 'login'
  const isLogin = currentMode === 'login'

  const errors = {
    name: values.name.trim().length < 2 ? 'Enter your full name.' : '',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? '' : 'Enter a valid email address.',
    phone: /^\+?[0-9\s()-]{7,20}$/.test(values.phone.trim()) ? '' : 'Enter a valid phone number.',
    password: values.password.length >= 8 ? '' : 'Use at least 8 characters.',
    confirmPassword: values.confirmPassword && values.confirmPassword === values.password ? '' : 'Passwords do not match.',
  }
  const isRegistrationValid = Object.values(errors).every((error) => !error)
  const strengthScore = [
    values.password.length >= 8,
    /[a-z]/.test(values.password) && /[A-Z]/.test(values.password),
    /\d/.test(values.password),
    /[^A-Za-z0-9]/.test(values.password),
  ].filter(Boolean).length
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strengthScore]

  const updateValue = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setAuthNotice('')
  }

  const markTouched = (field: keyof typeof values) => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLogin) {
      navigate('/academy/student')
      return
    }
    setTouched({ name: true, email: true, phone: true, password: true, confirmPassword: true })
    if (!isRegistrationValid) {
      setAuthNotice('Review the highlighted fields before continuing.')
      return
    }
    setAuthNotice('Account creation is not connected yet. No account was created.')
  }

  return (
    <main className="min-h-screen bg-[#F7F9F4]">
      <header className="border-b border-[#DFE7DF] bg-white">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <NavLink to="/" aria-label="Leafy home" className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EBB57] focus-visible:ring-offset-2">
            <LeafyLogo className="h-11 w-24" />
          </NavLink>
          <div className="flex items-center gap-3 text-sm">
            <NavLink to="/" className="hidden font-medium text-[#4B5E56] hover:text-[#0B3D2E] sm:inline">Return to home</NavLink>
            <span className="hidden h-5 w-px bg-[#DFE7DF] sm:block" />
            <span className="text-[#4B5E56]">{isLogin ? 'New to Leafy?' : 'Already a member?'}</span>
            <NavLink to={isLogin ? '/auth/register' : '/auth/login'} className="font-semibold text-[#0B3D2E] underline decoration-[#2EBB57] decoration-2 underline-offset-4 hover:text-[#247947]">
              {isLogin ? 'Create an account' : 'Sign in'}
            </NavLink>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-8 sm:py-8 lg:min-h-[calc(100vh-68px)] lg:grid-cols-2 lg:items-stretch lg:gap-8 lg:px-10 lg:py-8">
        <section className="order-2 overflow-hidden rounded-[1.75rem] bg-[#0B3D2E] text-white lg:order-1">
          <div className="grid h-full grid-rows-[auto_1fr_auto] p-6 sm:p-8 lg:p-10">
            <div className="flex items-center justify-between">
              <span className="inline-flex rounded bg-white p-1"><LeafyLogo className="h-10 w-24" /></span>
              <span className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/85">Agricultural innovation</span>
            </div>

            <div className="grid content-center gap-6 py-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9BE3A7]">{isLogin ? 'Welcome back' : 'Your next chapter starts here'}</p>
                <h1 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl xl:text-[2.75rem]">
                  {isLogin ? 'Good to have you back.' : 'Good Ideas Deserve Room to Grow.'}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                  {isLogin
                    ? 'Continue exploring ideas, people and opportunities across the Leafy ecosystem.'
                    : 'Join an ecosystem where agricultural innovators, investors, mentors and organisations can discover ideas, build connections and explore opportunities together.'}
                </p>
              </div>

              <div className="relative min-h-44 overflow-hidden rounded-2xl border border-white/15 bg-[#174E37] sm:min-h-52">
                <div aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(165deg,rgba(155,227,167,0.16)_0px,rgba(155,227,167,0.16)_1px,transparent_1px,transparent_22px)]" />
                <img
                  src="https://images.unsplash.com/photo-1464226184884-fa52ac9fcf7a?auto=format&fit=crop&w=1200&q=85"
                  alt="Healthy crops growing in an agricultural field"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(event) => { event.currentTarget.style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D2E]/65 via-[#0B3D2E]/10 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-[#0B3D2E]/70 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm">
                  <Sprout className="h-4 w-4 text-[#9BE3A7]" />
                  Ideas rooted in real-world needs
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { icon: Sprout, label: 'Showcase your innovations' },
                  { icon: UsersRound, label: 'Connect with relevant people' },
                  { icon: Compass, label: 'Discover ways to grow' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-3 py-3 text-xs font-medium leading-5 text-white/90">
                    <Icon className="h-4 w-4 shrink-0 text-[#9BE3A7]" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <p className="border-t border-white/15 pt-4 text-xs leading-5 text-white/60">A shared space for people shaping the future of agriculture and food.</p>
          </div>
        </section>

        <section className="order-1 flex items-center justify-center rounded-[1.75rem] border border-[#DFE7DF] bg-white px-5 py-7 shadow-[0_18px_50px_rgba(11,61,46,0.06)] sm:px-8 sm:py-9 lg:order-2 lg:px-10 xl:px-14">
          <div className="w-full max-w-[470px]">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F57C00]">{isLogin ? 'Member access' : 'Start your journey'}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-[#0B3D2E] sm:text-4xl">
                {isLogin ? 'Sign in to Leafy' : 'Create your Leafy account'}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#4B5E56]">
                {isLogin ? 'Sign in to continue to your Leafy workspace.' : 'Get started and become part of the Leafy ecosystem.'}
              </p>
            </div>

            {!isLogin && (
              <p role="status" className="mb-5 rounded-xl border border-[#F3D3AE] bg-[#FFF7EE] px-4 py-3 text-xs leading-5 text-[#713D12]">
                Account creation is a prototype and is not connected yet. Do not enter real personal information; submitting will not create an account.
              </p>
            )}

            <form className="space-y-4" noValidate={!isLogin} onSubmit={handleSubmit}>
              {!isLogin && (
                <AuthField
                  id="register-name"
                  label="Full name"
                  placeholder="Your full name"
                  value={values.name}
                  error={touched.name ? errors.name : ''}
                  onChange={(value) => updateValue('name', value)}
                  onBlur={() => markTouched('name')}
                  required
                />
              )}

              <AuthField
                id={isLogin ? 'login-email' : 'register-email'}
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={values.email}
                error={!isLogin && touched.email ? errors.email : ''}
                onChange={(value) => updateValue('email', value)}
                onBlur={() => markTouched('email')}
                required
              />

              {!isLogin && (
                <AuthField
                  id="register-phone"
                  label="Phone number"
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={values.phone}
                  error={touched.phone ? errors.phone : ''}
                  onChange={(value) => updateValue('phone', value)}
                  onBlur={() => markTouched('phone')}
                  required
                />
              )}

              <AuthField
                id={isLogin ? 'login-password' : 'register-password'}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder={isLogin ? 'Enter your password' : 'At least 8 characters'}
                value={values.password}
                error={!isLogin && touched.password ? errors.password : ''}
                onChange={(value) => updateValue('password', value)}
                onBlur={() => markTouched('password')}
                required
                trailing={
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((shown) => !shown)}
                    className="rounded-md p-1 text-[#4B5E56] hover:bg-[#EAF4EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EBB57]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />

              {!isLogin && (
                <div className="-mt-2">
                  <div className="flex items-center gap-1.5" role="status" aria-live="polite" aria-label={`Password strength: ${strengthLabel || 'not entered'}`}>
                    {[1, 2, 3, 4].map((level) => (
                      <span key={level} className={`h-1 flex-1 rounded-full ${strengthScore >= level ? (strengthScore < 2 ? 'bg-[#F57C00]' : strengthScore < 4 ? 'bg-[#2EBB57]' : 'bg-[#0B3D2E]') : 'bg-[#E3EAE3]'}`} />
                    ))}
                    <span className="ml-2 min-w-10 text-right text-[11px] font-medium text-[#4B5E56]">{strengthLabel}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#65756D]">Use 8+ characters; a mix of letters, numbers and symbols is stronger.</p>
                </div>
              )}

              {!isLogin && (
                <AuthField
                  id="register-confirm-password"
                  label="Confirm password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Enter your password again"
                  value={values.confirmPassword}
                  error={touched.confirmPassword ? errors.confirmPassword : ''}
                  onChange={(value) => updateValue('confirmPassword', value)}
                  onBlur={() => markTouched('confirmPassword')}
                  required
                  trailing={
                    <button
                      type="button"
                      aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                      aria-pressed={showConfirmPassword}
                      onClick={() => setShowConfirmPassword((shown) => !shown)}
                      className="rounded-md p-1 text-[#4B5E56] hover:bg-[#EAF4EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EBB57]"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
              )}

              {isLogin && <div className="flex flex-wrap items-center justify-between gap-2 text-xs leading-5 text-[#65756D]"><span>Demo sign-in opens a sample learner workspace. Authentication is not connected.</span><NavLink to="/auth/forgot" className="shrink-0 font-semibold text-[#0B3D2E] hover:underline">Forgot password?</NavLink></div>}
              {!isLogin && authNotice && <p role="alert" className="rounded-xl border border-[#F3D3AE] bg-[#FFF7EE] px-4 py-3 text-sm leading-5 text-[#713D12]">{authNotice}</p>}
              {isLogin && authNotice && <p role="alert" className="text-sm text-[#713D12]">{authNotice}</p>}

              <button
                type="submit"
                disabled={!isLogin && !isRegistrationValid}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0B3D2E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#164f3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EBB57] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#9AA9A1] disabled:text-white"
              >
                {isLogin ? 'Sign in to account' : 'Create account'} <ArrowRight className="h-4 w-4" />
              </button>
              {!isLogin && <p className="text-center text-[11px] leading-5 text-[#65756D]">By continuing, you confirm that the information you enter is yours to share. Registration is currently a non-functional prototype.</p>}

              <div className="border-t border-[#E3EAE3] pt-4 text-center text-sm text-[#4B5E56]">
                {isLogin ? 'New to Leafy?' : 'Already a member?'}{' '}
                <NavLink to={isLogin ? '/auth/register' : '/auth/login'} className="font-semibold text-[#0B3D2E] underline decoration-[#2EBB57] underline-offset-4">
                  {isLogin ? 'Create your account' : 'Sign in'}
                </NavLink>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

function AuthField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  placeholder,
  required = false,
  trailing,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  error?: string
  type?: string
  placeholder?: string
  required?: boolean
  trailing?: React.ReactNode
}) {
  const errorId = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#26372F]">{label}{required && <span className="ml-1 text-[#F57C00]">*</span>}</label>
      <div className={`flex min-h-11 items-center rounded-xl border bg-[#FBFCFA] px-3 transition focus-within:ring-2 focus-within:ring-[#2EBB57]/40 ${error ? 'border-[#C84C32]' : 'border-[#D9E3D9] focus-within:border-[#2EBB57]'}`}>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[#26372F] outline-none placeholder:text-[#89968F]"
        />
        {trailing}
      </div>
      {error && <p id={errorId} className="mt-1 text-xs font-medium text-[#B33D2B]">{error}</p>}
    </div>
  )
}

function DivisionRedirect() {
  const { divisionId = '' } = useParams()
  return <Navigate to={divisionPaths[divisionId] ?? '/'} replace />
}

function DashboardPage() {
  return <Navigate to="/academy/student" replace />
}

export default App
