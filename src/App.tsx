import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroVideoSrc from './assets/leafy-brand-intro-silent.mp4'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Globe,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sprout,
  Store,
  UtensilsCrossed,
  Waves,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { PublicNavigation } from './PublicNavigation'

const AcademyRoutes = lazy(() => import('./academy/AcademyRoutes').then((module) => ({ default: module.AcademyRoutes })))
const MarketRoutes = lazy(() => import('./market/MarketRoutes').then((module) => ({ default: module.MarketRoutes })))
const FarmsRoutes = lazy(() => import('./farms/FarmsRoutes').then((module) => ({ default: module.FarmsRoutes })))
const FoodsRoutes = lazy(() => import('./foods/FoodsRoutes').then((module) => ({ default: module.FoodsRoutes })))
const FoundationRoutes = lazy(() => import('./foundation/FoundationRoutes').then((module) => ({ default: module.FoundationRoutes })))

gsap.registerPlugin(ScrollTrigger)

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

const impactAreas = [
  'Agricultural innovation and production',
  'Commercial connections for producers',
  'Practical learning and capacity building',
  'Community programmes and participation',
  'Food products and supply opportunities',
]

const overviewStats = [
  { label: 'Purpose', value: 'Connect agricultural ideas to practical opportunity' },
  { label: 'Stakeholders', value: 'Innovators, producers, organisations and buyers' },
  { label: 'Approach', value: 'Production, commerce, learning and community impact' },
]

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
    location.pathname.startsWith('/academy/') ||
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
          <Route path="/division/market" element={<Navigate to="/market" replace />} />
          <Route path="/division/farms" element={<Navigate to="/farms" replace />} />
          <Route path="/division/:divisionId" element={<DivisionPage />} />
          <Route path="/foods/*" element={<Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#6B756E]">Loading Leafy Foods…</div>}><FoodsRoutes /></Suspense>} />
          <Route path="/farms/*" element={<Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-sm text-[#6B756E]">Loading Leafy Farms…</div>}><FarmsRoutes /></Suspense>} />
          <Route path="/academy" element={<DivisionExperiencePage divisionId="academy" />} />
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
            <NavLink to={`/division/${id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#285342]">Explore this division <ArrowRight className="h-4 w-4" /></NavLink>
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
  const heroRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-copy > *',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'power3.out' },
      )
      gsap.utils.toArray<HTMLElement>('.story-panel').forEach((panel) => {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 80%',
            },
          },
        )
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="overflow-x-hidden">
      <section ref={heroRef} className="relative isolate min-h-screen overflow-hidden border-b border-[#E6EAE5] bg-[#202923] text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          poster="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80"
        >
          <source src={heroVideoSrc} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[#202923]/60" />

        <div className="relative mx-auto flex min-h-screen w-full items-center justify-center px-5 py-20 sm:px-8 lg:px-16">
          <div className="hero-copy w-full max-w-[1450px] text-center">
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mx-auto max-w-[1450px] text-balance text-4xl font-semibold leading-[1] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
              Connecting Agricultural Innovation with People, Markets and Opportunity.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="mx-auto mt-6 max-w-4xl text-base leading-7 text-[#F3F7F4]/85 sm:text-lg sm:leading-8">
              Leafy connects agricultural innovators, producers, organisations, institutions, investors and consumers so agricultural ideas and products can become sustainable, commercially viable and impactful.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <NavLink to="/destination" className="inline-flex items-center justify-center rounded-full bg-[#A4C68C] px-6 py-3 font-medium text-[#1B2C24] transition hover:bg-[#bfd9a9]">
                Explore Leafy <ArrowRight className="ml-2 h-4 w-4" />
              </NavLink>
              <a href="#impact" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10">
                Explore Leafy’s Work
              </a>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs uppercase tracking-[0.4em] text-[#E6F3EA]">
          Scroll
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-16">
        <div className="story-panel grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Introducing Leafy</p>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#202923] sm:text-5xl">One organisation connecting production, commerce, learning and community.</h2>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-[#E6EAE5] bg-white shadow-[0_40px_80px_rgba(32,41,35,0.08)]">
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80" alt="People collaborating in a community-oriented setting" className="h-[460px] w-full object-cover transition duration-700 hover:scale-105" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 pb-20 sm:px-8 lg:px-16">
        <div className="mb-10 flex items-end justify-between gap-3">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">The Leafy Ecosystem</p>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#202923]">Five divisions with connected roles.</h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {divisionData.map(({ id, name, tag, description, image, accent, icon: Icon }) => (
            <motion.div key={id} whileHover={{ y: -8 }} className="group overflow-hidden rounded-[1.75rem] border border-[#E6EAE5] bg-white shadow-[0_30px_60px_rgba(32,41,35,0.06)]">
              <div className={`relative h-60 overflow-hidden bg-gradient-to-br ${accent}`}>
                <img src={image} alt={name} className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#202923]/70 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#285342] shadow-lg">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-xl font-semibold text-[#202923]">{name}</h3>
                  <p className="mt-2 text-sm font-medium text-[#39845A]">{tag}</p>
                </div>
                <p className="text-sm leading-6 text-[#6B756E]">{description}</p>
                <NavLink to={`/division/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#285342]">
                  Explore division <ArrowUpRight className="h-4 w-4" />
                </NavLink>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#202923] py-24 text-white">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#A4C68C]">Our Mission</p>
              <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Agricultural Innovation. Sustainable Opportunity. Community Impact.</h2>
            </div>
            <p className="text-base leading-7 text-[#DCE8E1]">
              Leafy connects agricultural production and innovation with commercial opportunities, practical learning and community programmes.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {overviewStats.map((stat) => (
              <div key={stat.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-[#A4C68C]">{stat.label}</p>
                <p className="mt-4 text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="impact" className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-16">
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Our priorities</p>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#202923]">Work that links ideas, producers and opportunity.</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[#E6EAE5] bg-white p-8 shadow-[0_30px_60px_rgba(32,41,35,0.04)]">
            <div className="mb-6 flex items-center gap-3 text-[#285342]">
              <Waves className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">Priority areas</p>
            </div>
            <div className="space-y-4">
              {impactAreas.map((area) => (
                <div key={area} className="flex items-center justify-between rounded-2xl border border-[#E6EAE5] bg-[#F6F5EF] px-4 py-3">
                  <span className="font-medium text-[#202923]">{area}</span>
                  <ChevronRight className="h-4 w-4 text-[#39845A]" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="overflow-hidden rounded-[2rem] border border-[#E6EAE5] bg-white p-4 shadow-[0_30px_60px_rgba(32,41,35,0.04)]">
              <img src="https://images.unsplash.com/photo-1464226184884-fa52ac9fcf7a?auto=format&fit=crop&w=1000&q=80" alt="Farm field and crops under natural sunlight" className="h-64 w-full rounded-[1.5rem] object-cover" />
            </div>
            <div className="rounded-[2rem] border border-[#E6EAE5] bg-[#EDF4EA] p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#285342]">Our approach</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-[#202923] sm:text-base">
                <span>People</span><ArrowRight className="h-4 w-4 text-[#39845A]" />
                <span>Agriculture</span><ArrowRight className="h-4 w-4 text-[#39845A]" />
                <span>Education</span><ArrowRight className="h-4 w-4 text-[#39845A]" />
                <span>Community</span><ArrowRight className="h-4 w-4 text-[#39845A]" />
                <span>Marketplace</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F0F5EF] py-24">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
          <div className="mb-12 flex items-center justify-between gap-4">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#39845A]">Featured stories</p>
              <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#202923]">Stories from Leafy’s agricultural and community work.</h2>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E6EAE5] bg-white p-8 shadow-[0_30px_60px_rgba(32,41,35,0.04)]">
            <h3 className="text-2xl font-semibold leading-tight text-[#202923]">Stories from Leafy’s work will be shared here.</h3>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6B756E]">No verified organisational stories or outcomes have been provided for publication. This section should feature real, approved accounts from producers, learners, partners and communities when they are available.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-24 sm:px-8 lg:px-16">
        <div className="rounded-[2.5rem] bg-[#285342] px-6 py-10 text-white sm:px-10 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A4C68C]">Take part</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Be Part of Something That Matters.</h2>
            </div>
            <NavLink to="/destination" className="inline-flex items-center justify-center rounded-full bg-[#A4C68C] px-6 py-3 font-medium text-[#1B2C24] transition hover:bg-[#bfd9a9]">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </NavLink>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E6EAE5] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#285342] text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold">Leafy</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[#6B756E]">Nourishing People</div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#6B756E]">Connecting agricultural innovation and production with commercial opportunities, practical learning and community impact.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#202923]">About</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#6B756E]">
              <li>Leafy Foods</li>
              <li>Leafy Farms</li>
              <li>Leafy Academy</li>
              <li>Leafy Foundation</li>
              <li>Leafy Market</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#202923]">Company</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#6B756E]">
              <li>About Leafy</li>
              <li>Contact</li>
              <li>Privacy policy</li>
              <li>Terms and conditions</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#202923]">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#6B756E]">
              <li>Official contact details have not been provided.</li>
              <li>Use verified Leafy contact channels for real enquiries.</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#E6EAE5] text-center text-sm text-[#6B756E]">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">© 2026 Leafy. All rights reserved.</div>
        </div>
      </footer>
    </main>
  )
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
              <NavLink to={`/division/${id}`} className="inline-flex items-center rounded-full bg-[#285342] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f4032]">
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
            <p className="mt-5 max-w-md text-base leading-7 text-[#E8F2EA]">Register once and access the services and memberships that matter across the Leafy ecosystem.</p>

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

function DivisionPage() {
  const { divisionId } = useParams()
  const division = useMemo(() => divisionData.find((item) => item.id === divisionId) ?? divisionData[0], [divisionId])
  const Icon = division.icon

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-[#E6EAE5] bg-white shadow-[0_30px_60px_rgba(32,41,35,0.06)]">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[440px]">
            <img src={division.image} alt={division.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#202923]/80 via-[#202923]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A4C68C]">Division</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{division.name}</h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-[#EBF5ED]">{division.tag}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-[#F6F5EF] p-8 sm:p-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#285342] text-white">
                <Globe className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#285342]">Leafy ecosystem</p>
            </div>

            <p className="text-lg leading-8 text-[#6B756E]">{division.description}</p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-[#E6EAE5] bg-white p-4">
                <p className="text-sm uppercase tracking-[0.18em] text-[#39845A]">Division focus</p>
                <p className="mt-2 text-base text-[#202923]">{division.tag}</p>
              </div>
              <div className="rounded-2xl border border-[#E6EAE5] bg-white p-4">
                <p className="text-sm uppercase tracking-[0.18em] text-[#39845A]">Connected work</p>
                <p className="mt-2 text-base text-[#202923]">Leafy’s divisions connect agricultural production and products with learning, commercial relationships and community initiatives.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <NavLink to={`/${division.id}`} className="inline-flex items-center gap-2 rounded-full bg-[#285342] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f4032]">
                Open {division.name} <ArrowRight className="h-4 w-4" />
              </NavLink>
              <NavLink to="/destination" className="inline-flex items-center gap-2 rounded-full border border-[#E6EAE5] bg-white px-5 py-3 text-sm font-semibold text-[#202923]">
                More divisions
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { title: 'Agricultural innovation', detail: 'Leafy intends to connect innovators with incubation, funding, validation, technical support and markets; a request and partner-matching process is not yet available.', icon: Sprout },
          { title: 'Producer-to-market pathways', detail: 'Leafy Farms and Leafy Foods can present eligible products through Leafy Market when listings and supply are confirmed.', icon: Store },
          { title: 'Learning and community capacity', detail: 'Leafy Academy supports practical skills, while Leafy Foundation coordinates community programmes and participation.', icon: BookOpen },
        ].map(({ title, detail, icon: Icon }) => (
          <div key={title} className="rounded-[1.8rem] border border-[#E6EAE5] bg-white p-6 shadow-[0_30px_60px_rgba(32,41,35,0.04)]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-semibold text-[#202923]">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-[#6B756E]">{detail}</p>
          </div>
        ))}
      </section>
    </main>
  )
}

function DivisionExperiencePage({ divisionId }: { divisionId: string }) {
  const division = useMemo(() => divisionData.find((item) => item.id === divisionId) ?? divisionData[0], [divisionId])
  const Icon = division.icon

  const contentByDivision: Record<string, { focus: { title: string; detail: string }[]; connections: { label: string; href: string }[]; gap?: string }> = {
    foods: {
      focus: [
        { title: 'Food products and offerings', detail: 'Present food products, packages and relevant offers from Leafy and participating producers.' },
        { title: 'Producer and buyer connections', detail: 'Connect food producers with customers, institutions and potential business partners.' },
        { title: 'Sales and fulfilment', detail: 'Support ordering and fulfilment where Leafy has an active, configured service.' },
      ],
      connections: [{ label: 'Explore agricultural and food listings', href: '/market' }, { label: 'See farm production', href: '/farms' }],
    },
    farms: {
      focus: [
        { title: 'Agricultural production', detail: 'Support farm-based production and relevant records when Leafy directly participates in an operation.' },
        { title: 'Producer support', detail: 'Offer practical resources and a path to request agricultural assistance.' },
        { title: 'Routes to market', detail: 'Help eligible farm products reach Leafy Market and potential buyers.' },
      ],
      connections: [{ label: 'Build practical skills', href: '/academy/courses' }, { label: 'Explore commercial listings', href: '/market' }],
    },
    academy: {
      focus: [
        { title: 'Relevant learning', detail: 'Develop knowledge and skills in agriculture, entrepreneurship, innovation and community development.' },
        { title: 'Practical application', detail: 'Connect learning to the real needs of farmers, producers, innovators and communities.' },
        { title: 'Learning progress', detail: 'Support learners with course materials, assessments and progress records.' },
      ],
      connections: [{ label: 'Explore farm-related learning', href: '/academy/courses' }, { label: 'See community programmes', href: '/foundation' }],
    },
    foundation: {
      focus: [
        { title: 'Community initiatives', detail: 'Make relevant programmes visible and support participation in initiatives aligned with Leafy’s mission.' },
        { title: 'Partnership and coordination', detail: 'Coordinate volunteers, partners and participants around clearly defined activities.' },
        { title: 'Evidence of impact', detail: 'Document programme outcomes using verified records rather than assumed figures.' },
      ],
      connections: [{ label: 'Find learning opportunities', href: '/academy' }, { label: 'Explore agricultural work', href: '/farms' }],
    },
    market: {
      focus: [
        { title: 'Agricultural and food listings', detail: 'Give agricultural producers, food businesses and product owners a place to present relevant offerings.' },
        { title: 'Commercial connections', detail: 'Help buyers and potential partners discover producers, products and agricultural innovations.' },
        { title: 'Orders where appropriate', detail: 'Support enquiries, orders and transactions when the commercial service is configured.' },
      ],
      connections: [{ label: 'Connect with farm production', href: '/farms' }, { label: 'Explore food products', href: '/foods' }],
      gap: 'Incubation, funding, technical assistance, mentorship and validation pathways for agricultural innovations are part of Leafy’s intended work, but an intake and partner-matching workflow is not yet available in this prototype.',
    },
  }

  const config = contentByDivision[divisionId] ?? contentByDivision.foods

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-[#E6EAE5] bg-white shadow-[0_30px_60px_rgba(32,41,35,0.04)]">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[420px]">
            <img src={division.image} alt={division.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#202923]/80 via-[#202923]/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A4C68C]">Division</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{division.name}</h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-[#EBF5ED]">{division.tag}</p>
            </div>
          </div>

          <div className="bg-[#F6F5EF] p-8 sm:p-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#285342] text-white">
                <Globe className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#285342]">Purpose and work</p>
            </div>
            <p className="text-lg leading-8 text-[#6B756E]">{division.description}</p>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {config.focus.map(({ title, detail }) => (
          <div key={title} className="rounded-[2rem] border border-[#E6EAE5] bg-white p-6 shadow-[0_30px_60px_rgba(32,41,35,0.04)]">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]">
              <Leaf className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold text-[#202923]">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-[#6B756E]">{detail}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 rounded-[2rem] border border-[#E6EAE5] bg-[#EDF4EA] p-8">
        <h2 className="text-3xl font-semibold text-[#202923]">Connected across Leafy</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {config.connections.map(({ label, href }) => (
            <NavLink key={href} to={href} className="rounded-full border border-[#dce4dc] bg-white px-4 py-2.5 text-sm font-medium text-[#285342]">{label} <ArrowRight className="ml-1 inline h-4 w-4" /></NavLink>
          ))}
        </div>
        {config.gap && <p className="mt-5 rounded-2xl border border-[#e6eae5] bg-white p-4 text-sm leading-6 text-[#58645d]">{config.gap}</p>}
      </section>
    </main>
  )
}

function DashboardPage() {
  return <Navigate to="/academy/student" replace />
}

export default App
