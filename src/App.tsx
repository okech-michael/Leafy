import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  ShieldCheck,
  Sprout,
  Store,
  UtensilsCrossed,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useState, type FormEvent } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { PublicNavigation } from './PublicNavigation'
import { HomepageContent } from './HomepageContent'

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
        <AppShell />
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#F6F5EF] text-[#202923]">
      {!isWorkspaceRoute && <PublicNavigation key={location.pathname} />}

      <AnimatePresence mode="wait">
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
          <Route path="/foods/*" element={<Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#6B756E]">Loading Leafy Foods…</div>}><FoodsRoutes /></Suspense>} />
          <Route path="/farms/*" element={<Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#6B756E]">Loading Leafy Farms…</div>}><FarmsRoutes /></Suspense>} />
          <Route path="/academy/*" element={<Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#6B756E]">Loading Leafy Academy…</div>}><AcademyRoutes /></Suspense>} />
          <Route path="/foundation/*" element={<Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#6B756E]">Loading Leafy Foundation…</div>}><FoundationRoutes /></Suspense>} />
          <Route path="/market/*" element={<Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#6B756E]">Loading Leafy Market…</div>}><MarketRoutes /></Suspense>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
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
  const [authNotice, setAuthNotice] = useState('')
  const currentMode = mode === 'login' || mode === 'register' ? mode : 'login'
  const isLogin = currentMode === 'login'
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLogin) {
      navigate('/academy/student')
      return
    }
    setAuthNotice('Account creation is not connected yet. No account was created.')
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 overflow-hidden rounded-[2rem] border border-[#E6EAE5] bg-white shadow-[0_40px_80px_rgba(32,41,35,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[500px] overflow-hidden bg-[#285342] p-8 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(164,198,140,0.4),_transparent_40%)]" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A4C68C]">Shared account access</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{isLogin ? 'Welcome back to Leafy.' : 'Join the Leafy community.'}</h1>
            <p className="mt-5 max-w-md text-base leading-7 text-[#E8F2EA]">{isLogin ? 'This prototype opens a sample learner account after sign-in. Real authentication is not connected.' : 'Account creation is not connected yet. This page is a preview and does not create an account.'}</p>

            <div className="mt-8 space-y-4">
              {['Unified member identity', 'Division switching', 'Secure access management'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <ShieldCheck className="h-5 w-5 text-[#A4C68C]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8 flex gap-2 rounded-full border border-[#E6EAE5] bg-[#F6F5EF] p-1">
            <NavLink to="/auth/login" className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-medium ${isLogin ? 'bg-white text-[#202923] shadow-sm' : 'text-[#6B756E]'}`}>
              Login
            </NavLink>
            <NavLink to="/auth/register" className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-medium ${!isLogin ? 'bg-white text-[#202923] shadow-sm' : 'text-[#6B756E]'}`}>
              Register
            </NavLink>
          </div>

          {!isLogin && <p role="status" className="mb-5 rounded-xl border border-[#F3D3AE] bg-[#FFF4E8] p-4 text-sm leading-6 text-[#713D12]">Account registration is a prototype. Do not enter real personal information; submitting will not create or save an account.</p>}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#202923]">Full name</label>
                <input required className="w-full rounded-2xl border border-[#E6EAE5] bg-[#F6F5EF] px-4 py-3 outline-none transition focus:border-[#285342]" placeholder="Alex Maina" />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#202923]">Email address</label>
              <input type="email" required className="w-full rounded-2xl border border-[#E6EAE5] bg-[#F6F5EF] px-4 py-3 outline-none transition focus:border-[#285342]" placeholder="you@example.com" />
            </div>

            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#202923]">Phone number</label>
                <input type="tel" required className="w-full rounded-2xl border border-[#E6EAE5] bg-[#F6F5EF] px-4 py-3 outline-none transition focus:border-[#285342]" placeholder="+254 700 000 000" />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#202923]">Password</label>
              <input type="password" required minLength={8} className="w-full rounded-2xl border border-[#E6EAE5] bg-[#F6F5EF] px-4 py-3 outline-none transition focus:border-[#285342]" placeholder="••••••••" />
            </div>

            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#202923]">Confirm password</label>
                <input type="password" required minLength={8} className="w-full rounded-2xl border border-[#E6EAE5] bg-[#F6F5EF] px-4 py-3 outline-none transition focus:border-[#285342]" placeholder="••••••••" />
              </div>
            )}

            {!isLogin && authNotice && <p role="status" className="text-sm text-[#7b4a1b]">{authNotice}</p>}
            {isLogin && <p className="text-xs leading-5 text-[#6B756E]">Frontend demo sign-in: any valid email and password will open the sample learner account. Authentication is not connected.</p>}
            <button type="submit" className="w-full rounded-full bg-[#285342] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f4032]">
              {isLogin ? 'Sign in to account' : 'Create account'}
            </button>

            <div className="text-center text-sm text-[#6B756E]">
              {isLogin ? 'Forgot password?' : 'Already a member?'}{' '}
              <NavLink to={isLogin ? '/auth/register' : '/auth/login'} className="font-semibold text-[#285342]">
                {isLogin ? 'Create account' : 'Sign in'}
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </main>
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
