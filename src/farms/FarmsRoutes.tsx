import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Bell, BookOpen, CalendarDays, Check, ChevronRight, CircleHelp,
  ClipboardList, Download, FileText, MapPin, Menu, Plus, ShieldCheck, Sprout, Truck,
  UserRound, Wheat, X,
} from 'lucide-react'
import { downloadFarmCsv, loadFarmsState, saveFarmsState } from './farmsService'
import {
  activityTypes, cropStages, expertDirectory, farmingInterests, farmingResources,
  programmeExamples,
  type ActivityStatus, type CropRecord, type ExpertRequest, type Farm, type FarmActivity,
  type FarmInput, type FarmsRole, type FarmsState, type FinanceRecord, type HarvestRecord,
  type LivestockRecord, type PlantingSeason, type WorkerAssignment,
} from './farmsStore'

const button = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#285342] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f4032] disabled:cursor-not-allowed disabled:opacity-50'
const secondary = 'inline-flex items-center justify-center gap-2 rounded-full border border-[#dce4dc] bg-white px-4 py-2.5 text-sm font-medium text-[#285342] transition hover:border-[#285342]'
const card = 'rounded-2xl border border-[#e6eae5] bg-white p-5 shadow-[0_16px_40px_rgba(32,41,35,.04)]'
const money = (amount: number) => `KSh ${amount.toLocaleString('en-KE')}`
const timestamp = () => new Date().toISOString()
const image = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=85'

const portalLinks = [
  { to: '/farms/dashboard', label: 'Overview', end: true },
  { to: '/farms/dashboard/farms/new', label: 'Register a farm' },
  { to: '/farms/dashboard/crops', label: 'Crops' },
  { to: '/farms/dashboard/seasons', label: 'Planting seasons' },
  { to: '/farms/dashboard/calendar', label: 'Activities & calendar' },
  { to: '/farms/dashboard/inputs', label: 'Inputs & inventory' },
  { to: '/farms/dashboard/harvests', label: 'Harvest records' },
  { to: '/farms/dashboard/livestock', label: 'Livestock' },
  { to: '/farms/dashboard/finance', label: 'Farm finances' },
  { to: '/farms/dashboard/experts', label: 'Expert support' },
  { to: '/farms/dashboard/resources', label: 'Farming resources' },
  { to: '/farms/dashboard/programmes', label: 'Programmes' },
  { to: '/farms/dashboard/produce', label: 'Market opportunities' },
  { to: '/farms/dashboard/workforce', label: 'Farm workers' },
  { to: '/farms/dashboard/reports', label: 'Reports' },
  { to: '/farms/dashboard/notifications', label: 'Notifications' },
  { to: '/farms/dashboard/profile', label: 'Farmer profile' },
]

export function FarmsRoutes() {
  const [state, setState] = useState<FarmsState>(() => loadFarmsState())
  const location = useLocation()
  const [mobileNav, setMobileNav] = useState(false)
  const isPortal = /^\/farms\/(dashboard|farm|expert|manage)/.test(location.pathname)

  const update = (operation: (current: FarmsState) => FarmsState) => {
    setState((current) => {
      const next = operation(current)
      saveFarmsState(next)
      return next
    })
  }

  return <div className="min-h-screen bg-[#F6F5EF] text-[#202923]">
    {isPortal ? <header className="sticky top-0 z-40 border-b border-[#e6eae5] bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-6"><Link to="/farms/dashboard" className="flex items-center gap-2 font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#285342] text-white"><Sprout className="h-5 w-5" /></span>Leafy Farms</Link><span className="hidden text-sm text-[#6B756E] sm:block">Farm workspace</span><button aria-label="Toggle farm navigation" className="rounded-full border p-2 lg:hidden" onClick={() => setMobileNav((open) => !open)}>{mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button><Link to="/farms" className="hidden text-sm font-medium text-[#285342] sm:block">Public site</Link></div></header>
      : <header className="sticky top-0 z-40 border-b border-[#e6eae5] bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"><Link to="/farms" className="flex items-center gap-2 font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#285342] text-white"><Sprout className="h-5 w-5" /></span>Leafy Farms</Link><nav className="hidden items-center gap-5 text-sm lg:flex"><NavLink to="/farms/about">About</NavLink><NavLink to="/farms/services">What We Offer</NavLink><NavLink to="/farms/resources">Farming Resources</NavLink><NavLink to="/farms/programmes">Our Programmes</NavLink><NavLink to="/farms/contact">Contact</NavLink></nav><div className="hidden items-center gap-2 sm:flex"><Link to="/auth/login" className={`${secondary} py-2`}>Sign In</Link><Link to="/auth/register" className={`${button} py-2`}>Get Started</Link></div><button aria-label="Toggle public farm navigation" className="rounded-full border p-2 sm:hidden" onClick={() => setMobileNav((open) => !open)}>{mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>{mobileNav && <nav className="grid gap-3 border-t bg-white px-4 py-4 text-sm sm:hidden"><Link to="/farms/about">About</Link><Link to="/farms/services">What We Offer</Link><Link to="/farms/resources">Farming Resources</Link><Link to="/farms/programmes">Our Programmes</Link><Link to="/farms/contact">Contact</Link><Link to="/auth/login">Sign In</Link><Link to="/auth/register">Get Started</Link></nav>}</header>}
    <div className={isPortal ? 'mx-auto flex max-w-[1500px]' : ''}>
      {isPortal && <aside className={`fixed inset-y-[57px] left-0 z-30 w-72 overflow-y-auto border-r border-[#e6eae5] bg-white p-3 transition-transform lg:sticky lg:top-[57px] lg:block lg:h-[calc(100vh-57px)] ${mobileNav ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}><div className="mb-3 rounded-xl bg-[#EDF4EA] p-3"><p className="text-xs font-semibold uppercase tracking-wide text-[#39845A]">Farm workspace</p><p className="mt-1 truncate text-sm font-semibold">{state.profile?.fullName || 'Farmer profile not set up'}</p><p className="mt-1 text-xs text-[#6B756E]">{state.farms.length} registered farm{state.farms.length === 1 ? '' : 's'}</p></div><nav className="grid gap-1">{portalLinks.map((item) => <NavLink key={item.to} end={item.end} to={item.to} onClick={() => setMobileNav(false)} className={({ isActive }) => `rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-[#285342] font-medium text-white' : 'text-[#4d5a52] hover:bg-[#F6F5EF]'}`}>{item.label}</NavLink>)}{state.role === 'expert' && <NavLink to="/farms/expert" className={({ isActive }) => `rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-[#285342] text-white' : 'text-[#4d5a52] hover:bg-[#F6F5EF]'}`}>Expert workspace</NavLink>}{['farms-admin', 'super-admin'].includes(state.role) && <NavLink to="/farms/manage" className={({ isActive }) => `mt-2 rounded-lg border border-[#e6eae5] px-3 py-2 text-sm ${isActive ? 'bg-[#285342] text-white' : 'text-[#4d5a52] hover:bg-[#F6F5EF]'}`}>Farms administration</NavLink>}</nav></aside>}
      <main className={isPortal ? 'min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8' : 'min-h-[65vh]'}><Routes>
        <Route index element={<PublicHome />} />
        <Route path="about" element={<PublicInfo page="about" />} />
        <Route path="services" element={<PublicInfo page="services" />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="programmes" element={<ProgrammesPage state={state} update={update} />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="onboarding" element={<OnboardingPage state={state} update={update} />} />
        <Route path="dashboard" element={<FarmerDashboard state={state} />} />
        <Route path="dashboard/farms/new" element={<FarmForm update={update} />} />
        <Route path="dashboard/farms/:farmId/*" element={<FarmManagement state={state} update={update} />} />
        <Route path="dashboard/crops" element={<FarmRecords kind="crops" state={state} update={update} />} />
        <Route path="dashboard/seasons" element={<FarmRecords kind="seasons" state={state} update={update} />} />
        <Route path="dashboard/calendar" element={<FarmRecords kind="calendar" state={state} update={update} />} />
        <Route path="dashboard/inputs" element={<FarmRecords kind="inputs" state={state} update={update} />} />
        <Route path="dashboard/harvests" element={<FarmRecords kind="harvests" state={state} update={update} />} />
        <Route path="dashboard/livestock" element={<FarmRecords kind="livestock" state={state} update={update} />} />
        <Route path="dashboard/finance" element={<FarmRecords kind="finance" state={state} update={update} />} />
        <Route path="dashboard/experts" element={<ExpertSupport state={state} update={update} />} />
        <Route path="dashboard/resources" element={<ResourcesPage />} />
        <Route path="dashboard/programmes" element={<ProgrammesPage state={state} update={update} />} />
        <Route path="dashboard/produce" element={<ProducePage state={state} update={update} />} />
        <Route path="dashboard/workforce" element={<WorkforcePage state={state} update={update} />} />
        <Route path="dashboard/reports" element={<ReportsPage state={state} />} />
        <Route path="dashboard/notifications" element={<NotificationsPage state={state} update={update} />} />
        <Route path="dashboard/profile" element={<ProfilePage state={state} update={update} />} />
        <Route path="dashboard/settings" element={<SettingsPage state={state} update={update} />} />
        <Route path="expert" element={<ExpertWorkspace state={state} update={update} />} />
        <Route path="manage" element={<FarmsAdmin state={state} update={update} />} />
        <Route path="*" element={<Navigate to="/farms" replace />} />
      </Routes></main>
    </div>
    {!isPortal && <Footer />}
  </div>
}

function PublicHome() {
  return <div className="space-y-14 pb-14">
    <section className="relative isolate overflow-hidden bg-[#1d3026] text-white"><img src={image} alt="Green farmland stretching across a rural landscape" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#15231d]/90 via-[#15231d]/60 to-transparent" /><div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28 lg:px-16"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#b8d5a2]">Leafy Farms · agricultural production</p><h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Support agricultural production. Connect producers to opportunity.</h1><p className="mt-5 max-w-4xl text-base leading-7 text-white/90">Leafy Farms supports farm-based production and relevant agricultural activities, with practical producer support and connections to Leafy Market where appropriate.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/auth/register" className="rounded-full bg-[#A4C68C] px-6 py-3 text-sm font-semibold text-[#202923]">Get Started <ArrowRight className="ml-1 inline h-4 w-4" /></Link><Link to="/farms/services" className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold">Explore Our Services</Link></div></div></section>
    <p role="status" className="mx-auto mt-5 max-w-7xl px-4 text-xs leading-5 text-[#6B756E] sm:px-6">This is a browser-based prototype. Farm records and sample programme information are not shared with Leafy or connected to live agricultural services.</p>
    <section className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center"><div><Eyebrow>Production and producer support</Eyebrow><h2 className="mt-2 text-3xl font-semibold">Practical records, learning and market connections.</h2><p className="mt-4 leading-7 text-[#59665d]">Where Leafy directly participates in production, farm records can support crop planning and harvests. Producers can also use relevant resources and prepare eligible products for commercial opportunities.</p><Link to="/farms/about" className="mt-5 inline-flex items-center gap-2 font-semibold text-[#285342]">About Leafy Farms <ArrowRight className="h-4 w-4" /></Link></div><img src="https://images.unsplash.com/photo-1523742815150-7c76b2c5e1b4?auto=format&fit=crop&w=1000&q=80" alt="Farmer tending crops in a green field" className="h-72 w-full rounded-2xl object-cover" /></section>
    <section className="bg-white py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6"><SectionHeading eyebrow="Relevant farm activities" title="Support the work Leafy participates in" detail="Use only the records and support relevant to a farm or production activity. This is not a requirement to adopt a full farm-management system." /><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[
      [Sprout, 'Production records', 'Record crops, activities and harvests for relevant Leafy farm operations.'],
      [CalendarDays, 'Seasonal planning', 'Note planned work and production dates where they support an active operation.'],
      [CircleHelp, 'Agricultural assistance', 'Prepare a request for relevant technical support; expert availability is not yet connected.'],
      [BookOpen, 'Practical learning', 'Use agricultural resources and relevant learning through Leafy Academy.'],
      [Wheat, 'Producer opportunities', 'Prepare eligible produce for commercial connections through Leafy Market.'],
      [FileText, 'Production summaries', 'Review summaries based on records entered in this local prototype.'],
    ].map(([Icon, title, detail]) => <article key={String(title)} className={`${card} space-y-3`}><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]"><Icon className="h-5 w-5" /></span><h3 className="font-semibold">{String(title)}</h3><p className="text-sm leading-6 text-[#6B756E]">{String(detail)}</p></article>)}</div></div></section>
    <section className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center"><img src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1000&q=80" alt="Carefully harvested produce in a field" className="h-72 w-full rounded-2xl object-cover" /><div><Eyebrow>How Leafy Farms works</Eyebrow><h2 className="mt-2 text-3xl font-semibold">Build your farm record one step at a time</h2><ol className="mt-5 space-y-4">{['Create or sign in to your shared Leafy account.', 'Add a farmer profile and register one or more farms.', 'Record crops, activities, inputs, harvests and expenses as they happen.', 'Use resources, request expert support and explore selling through Leafy Market.'].map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#285342] text-xs font-semibold text-white">{index + 1}</span>{step}</li>)}</ol></div></section>
    <section className="mx-auto max-w-7xl px-4 sm:px-6"><div className="rounded-3xl bg-[#285342] p-7 text-white sm:p-10"><div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#c5dfb1]">Start where you are</p><h2 className="mt-2 text-3xl font-semibold">Your farm journey belongs to you.</h2><p className="mt-3 leading-7 text-white/85">Create your Leafy account, then add a farmer profile and farm details when you are ready. Optional details can be completed later.</p><Link to="/auth/register" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#285342]">Create a Leafy account <ArrowRight className="ml-2 h-4 w-4" /></Link><p className="mt-3 text-xs text-white/75">Already registered? <Link to="/auth/login" className="underline">Sign in</Link>, then <Link to="/farms/onboarding" className="underline">set up your farmer profile</Link>.</p></div></div></section>
  </div>
}

function PublicInfo({ page }: { page: 'about' | 'services' }) {
  const isAbout = page === 'about'
  return <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6"><Link to="/farms" className="inline-flex items-center gap-2 text-sm font-medium text-[#285342]"><ArrowLeft className="h-4 w-4" /> Leafy Farms home</Link><SectionHeading eyebrow={isAbout ? 'About us' : 'What we offer'} title={isAbout ? 'Agriculture support shaped around real farm work' : 'One place to organise your farm journey'} detail={isAbout ? 'Leafy Farms is designed as a practical digital companion for growers and agricultural professionals. Keep records you control, find learning resources and prepare to connect with wider support.' : 'Use farm records, seasonal planning, inputs, harvest tracking, learning, expert-request workflows and market preparation. Start with one module and expand when it fits your operation.'} /><div className="grid gap-5 md:grid-cols-3">{[
    ['Farm operations', 'Farm profiles, crop records, planting seasons, activities, inventory, livestock and harvests.'],
    ['Knowledge & guidance', 'Practical resources and a request workflow for agricultural assistance. No automated diagnosis or fabricated experts.'],
    ['Connected opportunities', 'Links to Leafy Academy learning and Leafy Market seller onboarding, using the existing ecosystem routes.'],
  ].map(([title, detail]) => <article key={title} className={card}><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-[#6B756E]">{detail}</p></article>)}</div><Link to="/farms/onboarding" className={button}>Create your farmer profile <ArrowRight className="h-4 w-4" /></Link></div>
}

function OnboardingPage({ state, update }: { state: FarmsState; update: FarmsUpdate }) {
  const navigate = useNavigate()
  const initial = state.profile
  const [profile, setProfile] = useState(initial ?? { fullName: '', phone: '', email: '', county: '', subCounty: '', ward: '', village: '', experience: '', interests: [], language: 'English', bio: '' })
  const [error, setError] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!profile.fullName.trim() || !profile.phone.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) { setError('Enter your name, phone number and a valid email address. You can add other profile details later.'); return }
    update((current) => ({ ...current, profile: { ...profile, fullName: profile.fullName.trim(), email: profile.email.trim() } }))
    navigate('/farms/dashboard')
  }
  const toggleInterest = (interest: string) => setProfile((current) => ({ ...current, interests: current.interests.includes(interest) ? current.interests.filter((item) => item !== interest) : [...current.interests, interest] }))
  return <div className="mx-auto max-w-3xl space-y-6 px-4 py-10"><Link to="/farms" className="inline-flex items-center gap-2 text-sm text-[#285342]"><ArrowLeft className="h-4 w-4" /> Public site</Link><SectionHeading eyebrow="Farmer onboarding" title={initial ? 'Update your farmer profile' : 'Set up your farmer profile'} detail="Use your shared Leafy account. This prototype stores profile data only in this browser; production profile sync needs the Leafy account API." /><div className="rounded-xl bg-[#EDF4EA] p-4 text-sm leading-6 text-[#3d5948]">Not signed in yet? <Link className="font-semibold underline" to="/auth/register">Create your Leafy account</Link> or <Link className="font-semibold underline" to="/auth/login">sign in</Link>, then return here. This screen does not create a second password or account.</div><form onSubmit={submit} className={`${card} space-y-5`}><div className="grid gap-4 sm:grid-cols-2">{profileField('fullName', 'Full name', true)}{profileField('phone', 'Phone number', true, 'tel')}{profileField('email', 'Email address', true, 'email')}{profileField('county', 'County')}{profileField('subCounty', 'Sub-county')}{profileField('ward', 'Ward')}{profileField('village', 'Village or locality')}{profileField('experience', 'Farming experience (years)')}</div><fieldset><legend className="text-sm font-semibold">Farming interests</legend><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{farmingInterests.map((interest) => <label key={interest} className="flex items-center gap-2 rounded-lg border border-[#e6eae5] p-2 text-xs"><input type="checkbox" checked={profile.interests.includes(interest)} onChange={() => toggleInterest(interest)} />{interest}</label>)}</div></fieldset><label className="block text-sm font-medium">Preferred language<select value={profile.language} onChange={(event) => setProfile({ ...profile, language: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dce4dc] bg-white p-3"><option>English</option><option>Kiswahili</option><option>Other / prefer not to say</option></select></label><label className="block text-sm font-medium">About your farming<textarea value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} rows={3} className="mt-2 w-full rounded-xl border border-[#dce4dc] p-3 font-normal" placeholder="Optional" /></label>{error && <p role="alert" className="text-sm text-[#a1462b]">{error}</p>}<button className={button}>Save and continue <ArrowRight className="h-4 w-4" /></button></form></div>

  function profileField(name: keyof typeof profile, label: string, required = false, type = 'text') {
    const value = profile[name]
    if (typeof value !== 'string') return null
    return <label className="block text-sm font-medium">{label}<input required={required} type={type} value={value} onChange={(event) => setProfile((current) => ({ ...current, [name]: event.target.value }))} className="mt-2 block w-full rounded-xl border border-[#dce4dc] p-3 font-normal" /></label>
  }
}

function FarmerDashboard({ state }: { state: FarmsState }) {
  const profile = state.profile
  const upcoming = state.activities.filter((item) => item.status !== 'Completed').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)
  const recent = [...state.activities].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)
  const initials = profile?.fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'LF'
  return <div className="space-y-7"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#285342] text-lg font-semibold text-white">{initials}</span><div><Eyebrow>Farmer dashboard</Eyebrow><h1 className="text-2xl font-semibold">Welcome{profile?.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}</h1><p className="mt-1 text-sm text-[#6B756E]">{profile?.county || 'Add your location'} · {state.farms.length} farm{state.farms.length === 1 ? '' : 's'}</p></div></div><Link to="/farms/dashboard/farms/new" className={button}><Plus className="h-4 w-4" /> Register a farm</Link></div>
    {!profile && <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d6e5d7] bg-[#EDF4EA] p-4"><div><p className="font-semibold">Complete your farmer profile</p><p className="mt-1 text-sm text-[#59665d]">Add basic contact details now; location and farming interests can be completed later.</p></div><Link to="/farms/onboarding" className={secondary}>Set up profile</Link></div>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[
      ['Registered farms', state.farms.length], ['Active crops', state.crops.filter((crop) => crop.stage !== 'Harvesting').length],
      ['Active seasons', state.seasons.filter((season) => season.status === 'Active').length],
      ['Upcoming activities', upcoming.length], ['Recorded harvests', state.harvests.length],
    ].map(([label, value]) => <div key={String(label)} className={`${card} p-4`}><p className="text-xs text-[#6B756E]">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>)}</div>
    <section><SectionHeading eyebrow="Quick actions" title="What would you like to do?" /><div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{[
      [Sprout, 'Add a crop', '/farms/dashboard/crops'], [CalendarDays, 'Record activity', '/farms/dashboard/calendar'],
      [Wheat, 'Record harvest', '/farms/dashboard/harvests'], [CircleHelp, 'Request expert help', '/farms/dashboard/experts'],
      [BookOpen, 'Farming resources', '/farms/dashboard/resources'], [Truck, 'Market opportunities', '/farms/dashboard/produce'],
      [ClipboardList, 'Manage inputs', '/farms/dashboard/inputs'], [FileText, 'View reports', '/farms/dashboard/reports'],
    ].map(([Icon, label, href]) => <Link key={String(label)} to={String(href)} className={`${card} flex min-h-24 flex-col justify-between gap-3 p-4 hover:border-[#A4C68C]`}><Icon className="h-5 w-5 text-[#285342]" /><span className="text-sm font-semibold">{String(label)}</span></Link>)}</div></section>
    <section><SectionHeading eyebrow="My farms" title="Your registered farms" action={<Link to="/farms/dashboard/farms/new" className="text-sm font-semibold text-[#285342]">Add farm <ArrowRight className="inline h-4 w-4" /></Link>} /><div className="mt-4 grid gap-4 md:grid-cols-2">{state.farms.map((farm) => <FarmCard key={farm.id} farm={farm} crops={state.crops.filter((crop) => crop.farmId === farm.id).length} />)}{state.farms.length === 0 && <EmptyCard title="No farms registered yet" detail="Add your first farm to begin organising its crops, activities and records." action={<Link to="/farms/dashboard/farms/new" className={button}>Register a farm</Link>} />}</div></section>
    <div className="grid gap-5 lg:grid-cols-2"><section className={card}><SectionHeading eyebrow="Next steps" title="Upcoming farm activities" />{upcoming.length ? <RecordList rows={upcoming.map((item) => ({ title: item.title, detail: `${farmName(state, item.farmId)} · ${item.date}`, status: item.status }))} /> : <p className="mt-4 text-sm text-[#6B756E]">No upcoming activities recorded. Add a task when you are ready.</p>}</section><section className={card}><SectionHeading eyebrow="Latest records" title="Recent farm activity" />{recent.length ? <RecordList rows={recent.map((item) => ({ title: item.title, detail: `${farmName(state, item.farmId)} · ${item.date}`, status: item.status }))} /> : <p className="mt-4 text-sm text-[#6B756E]">Your farm activity records will appear here. No activity has been entered.</p>}</section></div>
    <section className="grid gap-4 sm:grid-cols-2"><Link to="/farms/dashboard/experts" className={`${card} flex gap-3`}><CircleHelp className="h-5 w-5 shrink-0 text-[#285342]" /><div><h2 className="font-semibold">Agricultural support</h2><p className="mt-1 text-sm text-[#6B756E]">{state.expertRequests.length ? `${state.expertRequests.length} request(s) recorded` : 'No requests yet. Ask for help when you need it.'}</p></div></Link><Link to="/farms/dashboard/notifications" className={`${card} flex gap-3`}><Bell className="h-5 w-5 shrink-0 text-[#285342]" /><div><h2 className="font-semibold">Farm updates</h2><p className="mt-1 text-sm text-[#6B756E]">{state.notifications.filter((item) => !item.read).length} unread · Reminders use this device in the prototype</p></div></Link></section>
  </div>
}

function FarmForm({ update }: { update: FarmsUpdate }) {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const size = Number(data.get('size'))
    if (!name || !Number.isFinite(size) || size <= 0) { setError('Enter a farm name and a valid farm size.'); return }
    const activities = data.getAll('activities').map(String)
    const farm: Farm = {
      id: crypto.randomUUID(), name, location: String(data.get('location') ?? '').trim(),
      county: String(data.get('county') ?? '').trim(), subCounty: String(data.get('subCounty') ?? '').trim(),
      ward: String(data.get('ward') ?? '').trim(), village: String(data.get('village') ?? '').trim(),
      size, sizeUnit: String(data.get('sizeUnit') ?? 'acres'), landUse: String(data.get('landUse') ?? ''),
      latitude: String(data.get('latitude') ?? ''), longitude: String(data.get('longitude') ?? ''),
      activities, irrigation: String(data.get('irrigation') ?? ''), soil: String(data.get('soil') ?? ''),
      description: String(data.get('description') ?? '').trim(), createdAt: timestamp(), image,
    }
    update((current) => ({ ...current, farms: [farm, ...current.farms] }))
    navigate(`/farms/dashboard/farms/${farm.id}`)
  }
  return <div className="mx-auto max-w-3xl space-y-5"><Link to="/farms/dashboard" className="inline-flex items-center gap-2 text-sm text-[#285342]"><ArrowLeft className="h-4 w-4" /> Dashboard</Link><SectionHeading eyebrow="Farm registration" title="Register a farm" detail="You can add more farms later. GPS pin and soil details are optional if you do not have them." /><form onSubmit={submit} className={`${card} space-y-4`}><div className="grid gap-4 sm:grid-cols-2">{inputField('Farm name', 'name', true)}{inputField('County', 'county', true)}{inputField('Sub-county', 'subCounty')}{inputField('Ward', 'ward')}{inputField('Village or locality', 'village')}{inputField('General location or directions', 'location')}{inputField('Farm size', 'size', true, 'number')}{selectField('Size unit', 'sizeUnit', ['acres', 'hectares'])}{selectField('Land arrangement', 'landUse', ['Owned', 'Leased', 'Family land', 'Community land', 'Other'])}{selectField('Irrigation availability', 'irrigation', ['Available', 'Not available', 'Seasonal', 'Unknown'])}{inputField('Latitude (optional)', 'latitude')}{inputField('Longitude (optional)', 'longitude')}</div><label className="block text-sm font-medium">Main agricultural activities<fieldset className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">{farmingInterests.map((item) => <label key={item} className="flex items-center gap-2 rounded-lg border p-2 text-xs"><input type="checkbox" name="activities" value={item} />{item}</label>)}</fieldset></label><label className="block text-sm font-medium">Soil information, if known<textarea name="soil" rows={2} className="mt-2 w-full rounded-xl border border-[#dce4dc] p-3 font-normal" /></label><label className="block text-sm font-medium">Additional farm description<textarea name="description" rows={3} className="mt-2 w-full rounded-xl border border-[#dce4dc] p-3 font-normal" /></label><p className="text-xs text-[#6B756E]">Farm information is stored locally in this prototype. Production records should be protected by the shared Leafy account and server permissions.</p>{error && <p role="alert" className="text-sm text-[#a1462b]">{error}</p>}<button className={button}>Save farm</button></form></div>
}

function FarmManagement({ state, update }: { state: FarmsState; update: FarmsUpdate }) {
  const { farmId = '' } = useParams()
  const farm = state.farms.find((item) => item.id === farmId)
  const [tab, setTab] = useState('Overview')
  if (!farm) return <EmptyCard title="Farm not found" detail="Choose a farm registered in this browser, or register a new one." action={<Link to="/farms/dashboard" className={button}>My farms</Link>} />
  const crops = state.crops.filter((item) => item.farmId === farmId)
  const activities = state.activities.filter((item) => item.farmId === farmId)
  const harvests = state.harvests.filter((item) => item.farmId === farmId)
  const tabs = ['Overview', 'Crops', 'Planting seasons', 'Activities', 'Inputs', 'Harvests', 'Livestock', 'Expenses', 'Workers', 'Reports', 'Settings']
  return <div className="space-y-6"><Link to="/farms/dashboard" className="inline-flex items-center gap-2 text-sm text-[#285342]"><ArrowLeft className="h-4 w-4" /> All farms</Link><section className="overflow-hidden rounded-2xl bg-white"><img src={farm.image} alt="" className="h-44 w-full object-cover sm:h-60" /><div className="flex flex-wrap items-center justify-between gap-4 p-5"><div><Eyebrow>{farm.county || 'Farm location'}</Eyebrow><h1 className="mt-1 text-2xl font-semibold">{farm.name}</h1><p className="mt-1 text-sm text-[#6B756E]">{[farm.village, farm.ward, farm.subCounty, farm.county].filter(Boolean).join(', ') || farm.location} · {farm.size} {farm.sizeUnit}</p></div><Link to={`/farms/dashboard/crops?farm=${farm.id}`} className={button}>Add a crop <Plus className="h-4 w-4" /></Link></div><nav className="flex gap-2 overflow-x-auto border-t border-[#e6eae5] p-3">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm ${tab === item ? 'bg-[#285342] text-white' : 'bg-[#F6F5EF] text-[#4d5a52]'}`}>{item}</button>)}</nav></section>
    {tab === 'Overview' && <div className="grid gap-4 md:grid-cols-2"><section className={card}><SectionHeading title="Farm profile" /><dl className="mt-3 grid grid-cols-2 gap-3 text-sm">{[['Land use', farm.landUse || 'Not recorded'], ['Irrigation', farm.irrigation || 'Not recorded'], ['Farm activities', farm.activities.join(', ') || 'Not recorded'], ['Soil', farm.soil || 'Not recorded'], ['Farm recorded', formatDate(farm.createdAt)], ['Workers assigned', state.workers.filter((worker) => worker.farmId === farmId).length]].map(([label, value]) => <div key={label}><dt className="text-xs text-[#6B756E]">{label}</dt><dd className="mt-1">{value}</dd></div>)}</dl></section><section className={card}><SectionHeading title="Farm at a glance" /><div className="mt-4 grid grid-cols-2 gap-3">{[['Crops', crops.length], ['Activities', activities.length], ['Harvests', harvests.length], ['Inputs', state.inputs.filter((item) => item.farmId === farmId).length]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-[#F6F5EF] p-3"><p className="text-xs text-[#6B756E]">{label}</p><p className="text-xl font-semibold">{value}</p></div>)}</div></section><section className={`${card} md:col-span-2`}><SectionHeading title="Team & farm notes" /><p className="mt-3 text-sm leading-6 text-[#59665d]">{farm.description || 'Add a description or operational note in farm settings.'}</p><p className="mt-3 text-xs text-[#6B756E]">Financial and worker data remains local in this prototype. Production access must use farm-specific permissions.</p></section></div>}
    {tab !== 'Overview' && <FarmTabContent tab={tab} farm={farm} state={state} update={update} />}
  </div>
}

function FarmTabContent({ tab, farm, state, update }: { tab: string; farm: Farm; state: FarmsState; update: FarmsUpdate }) {
  const crops = state.crops.filter((crop) => crop.farmId === farm.id)
  const records = tab === 'Crops' || tab === 'Planting seasons' ? crops.map((item) => ({ title: `${item.name}${item.variety ? ` · ${item.variety}` : ''}`, detail: `${item.area} area · planted ${item.plantingDate} · expected harvest ${item.expectedHarvestDate || 'not set'}`, status: item.stage })) : tab === 'Activities' ? state.activities.filter((item) => item.farmId === farm.id).map((item) => ({ title: item.title, detail: `${item.date} · ${item.type}`, status: item.status })) : tab === 'Inputs' ? state.inputs.filter((item) => item.farmId === farm.id).map((item) => ({ title: item.name, detail: `${item.quantity} ${item.unit} · ${item.category}`, status: item.quantity <= item.minimum ? 'Low stock' : 'On hand' })) : tab === 'Harvests' ? state.harvests.filter((item) => item.farmId === farm.id).map((item) => ({ title: `${cropName(state, item.cropId)} · ${item.quantity} ${item.unit}`, detail: `${item.date} · ${item.grade}`, status: item.intendedUse })) : tab === 'Livestock' ? state.livestock.filter((item) => item.farmId === farm.id).map((item) => ({ title: `${item.quantity} ${item.category}`, detail: `${item.breed || 'Breed not recorded'} · ${item.purpose}`, status: formatDate(item.acquiredOn) })) : tab === 'Expenses' ? state.finances.filter((item) => item.farmId === farm.id && item.direction === 'Expense').map((item) => ({ title: `${item.category} · ${money(item.amount)}`, detail: `${item.date} · ${item.description}`, status: 'Recorded' })) : tab === 'Workers' ? state.workers.filter((item) => item.farmId === farm.id).map((item) => ({ title: item.name, detail: `${item.email} · ${item.role}`, status: item.permissions.join(', ') || 'No extra permissions' })) : []
  const operationTab = tab.toLowerCase()
  const addTo = tab === 'Crops' || tab === 'Planting seasons' ? 'crops' : tab === 'Activities' ? 'calendar' : tab === 'Inputs' ? 'inputs' : tab === 'Harvests' ? 'harvests' : tab === 'Livestock' ? 'livestock' : tab === 'Expenses' ? 'finance' : tab === 'Workers' ? 'workforce' : ''
  return <section className={`${card} space-y-4`}><div className="flex flex-wrap items-center justify-between gap-3"><SectionHeading eyebrow={operationTab} title={`${tab} · ${farm.name}`} />{addTo && <Link to={`/farms/dashboard/${addTo}?farm=${farm.id}`} className={`${button} py-2`}><Plus className="h-4 w-4" /> Add record</Link>}</div>{tab === 'Settings' ? <FarmSettings farm={farm} update={update} /> : tab === 'Reports' ? <Link to="/farms/dashboard/reports" className={secondary}>Open farm reports</Link> : records.length ? <RecordList rows={records} /> : <p className="text-sm text-[#6B756E]">No {tab.toLowerCase()} have been recorded for this farm.</p>}</section>
}

function FarmSettings({ farm, update }: { farm: Farm; update: FarmsUpdate }) {
  const [message, setMessage] = useState('')
  const [description, setDescription] = useState(farm.description)
  const save = () => {
    update((current) => ({ ...current, farms: current.farms.map((item) => item.id === farm.id ? { ...item, description } : item) }))
    setMessage('Farm notes saved on this device.')
  }
  return <div className="space-y-3"><label className="block text-sm font-medium">Farm description and notes<textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce4dc] p-3 font-normal" /></label><button onClick={save} className={button}>Save farm settings</button>{message && <p role="status" className="text-sm text-[#285342]">{message}</p>}<p className="text-xs text-[#6B756E]">Farm access and deletion controls are available only in the authenticated service, not in this local prototype.</p></div>
}

type FarmsUpdate = (operation: (current: FarmsState) => FarmsState) => void

type RecordKind = 'crops' | 'seasons' | 'calendar' | 'inputs' | 'harvests' | 'livestock' | 'finance'

function FarmRecords({ kind, state, update }: { kind: RecordKind; state: FarmsState; update: FarmsUpdate }) {
  const [message, setMessage] = useState('')
  const params = new URLSearchParams(window.location.search)
  const [farmId, setFarmId] = useState(params.get('farm') ?? state.farms[0]?.id ?? '')
  const [filterFarm, setFilterFarm] = useState('all')
  const [filterStage, setFilterStage] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const recordItems = kind === 'crops' ? state.crops : kind === 'seasons' ? state.seasons : kind === 'calendar' ? state.activities : kind === 'inputs' ? state.inputs : kind === 'harvests' ? state.harvests : kind === 'livestock' ? state.livestock : state.finances
  const displayed = recordItems.filter((item) => filterFarm === 'all' || item.farmId === filterFarm)
  const title: Record<RecordKind, string> = {
    crops: 'Crops', seasons: 'Planting seasons', calendar: 'Farm calendar & activities', inputs: 'Inputs & inventory',
    harvests: 'Harvest records', livestock: 'Livestock records', finance: 'Farm finances',
  }
  const description: Record<RecordKind, string> = {
    crops: 'Record crops and track their farm-specific stage and expected harvest. Crop lifecycles are not assumed to be identical.',
    seasons: 'Plan growing seasons for a specific farm and crop. Dates and status are recorded as entered, not forecast.',
    calendar: 'Plan farm tasks, assign a worker and update the status as work progresses.',
    inputs: 'Record input purchases and on-hand stock. Regulated inputs need label-compliant handling and qualified guidance.',
    harvests: 'Record actual harvested quantities. Summaries reflect only records entered here.',
    livestock: 'Keep optional animal and production records for farms with livestock.',
    finance: 'Record farm income and expenses privately. These records are not audited accounting statements.',
  }
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (!farmId) { setMessage('Register a farm before adding farm records.'); return }
    const id = crypto.randomUUID()
    if (kind === 'crops') {
      const crop: CropRecord = { id, farmId, name: String(data.get('name') ?? '').trim(), category: String(data.get('category') ?? ''), variety: String(data.get('variety') ?? '').trim(), plot: String(data.get('plot') ?? '').trim(), plantingDate: String(data.get('plantingDate') ?? ''), expectedHarvestDate: String(data.get('expectedHarvestDate') ?? ''), area: Number(data.get('area') ?? 0), areaUnit: String(data.get('areaUnit') ?? 'acres'), stage: String(data.get('stage') ?? cropStages[0]), irrigation: String(data.get('irrigation') ?? ''), health: String(data.get('health') ?? 'No observation recorded'), notes: String(data.get('notes') ?? '').trim() }
      update((current) => ({ ...current, crops: [crop, ...current.crops] }))
    } else if (kind === 'seasons') {
      const season: PlantingSeason = { id, farmId, cropId: String(data.get('cropId') ?? ''), name: String(data.get('name') ?? '').trim(), startDate: String(data.get('startDate') ?? ''), expectedEndDate: String(data.get('expectedEndDate') ?? ''), status: String(data.get('status') ?? 'Planned') as PlantingSeason['status'], area: Number(data.get('area') ?? 0), areaUnit: String(data.get('areaUnit') ?? 'acres'), notes: String(data.get('notes') ?? '').trim() }
      update((current) => ({ ...current, seasons: [season, ...current.seasons] }))
    } else if (kind === 'calendar') {
      const activity: FarmActivity = { id, farmId, cropId: String(data.get('cropId') ?? ''), title: String(data.get('title') ?? '').trim(), type: String(data.get('type') ?? 'Other'), date: String(data.get('date') ?? ''), assignedTo: String(data.get('assignedTo') ?? ''), reminder: data.get('reminder') === 'on', status: 'Planned', notes: String(data.get('notes') ?? '').trim() }
      update((current) => ({ ...current, activities: [activity, ...current.activities], notifications: activity.reminder ? [{ id: crypto.randomUUID(), title: `Farm reminder: ${activity.title}`, detail: `${farmName(current, farmId)} · ${activity.date}`, href: '/farms/dashboard/calendar', createdAt: timestamp(), read: false }, ...current.notifications] : current.notifications }))
    } else if (kind === 'inputs') {
      const input: FarmInput = { id, farmId, name: String(data.get('name') ?? '').trim(), category: String(data.get('category') ?? ''), quantity: Number(data.get('quantity') ?? 0), unit: String(data.get('unit') ?? ''), minimum: Number(data.get('minimum') ?? 0), cost: Number(data.get('cost') ?? 0), supplier: String(data.get('supplier') ?? '').trim(), purchaseDate: String(data.get('purchaseDate') ?? ''), applicationDate: String(data.get('applicationDate') ?? '') }
      update((current) => ({ ...current, inputs: [input, ...current.inputs] }))
    } else if (kind === 'harvests') {
      const harvest: HarvestRecord = { id, farmId, cropId: String(data.get('cropId') ?? ''), date: String(data.get('date') ?? ''), quantity: Number(data.get('quantity') ?? 0), unit: String(data.get('unit') ?? ''), grade: String(data.get('grade') ?? ''), storage: String(data.get('storage') ?? '').trim(), intendedUse: String(data.get('intendedUse') ?? ''), notes: String(data.get('notes') ?? '').trim() }
      update((current) => ({ ...current, harvests: [harvest, ...current.harvests] }))
    } else if (kind === 'livestock') {
      const animal: LivestockRecord = { id, farmId, category: String(data.get('category') ?? ''), breed: String(data.get('breed') ?? '').trim(), quantity: Number(data.get('quantity') ?? 0), acquiredOn: String(data.get('acquiredOn') ?? ''), purpose: String(data.get('purpose') ?? ''), notes: String(data.get('notes') ?? '').trim() }
      update((current) => ({ ...current, livestock: [animal, ...current.livestock] }))
    } else {
      const record: FinanceRecord = { id, farmId, direction: String(data.get('direction') ?? 'Expense') as FinanceRecord['direction'], category: String(data.get('category') ?? ''), amount: Number(data.get('amount') ?? 0), date: String(data.get('date') ?? ''), description: String(data.get('description') ?? '').trim() }
      update((current) => ({ ...current, finances: [record, ...current.finances] }))
    }
    event.currentTarget.reset()
    setMessage('Record saved on this device.')
    setShowForm(false)
  }
  const updateActivity = (activity: FarmActivity, status: ActivityStatus) => update((current) => ({ ...current, activities: current.activities.map((item) => item.id === activity.id ? { ...item, status } : item) }))
  const rows = kind === 'crops' ? (displayed as CropRecord[]).map((item) => ({ title: `${item.name}${item.variety ? ` · ${item.variety}` : ''}`, detail: `${farmName(state, item.farmId)} · ${item.area} ${item.areaUnit} · planted ${item.plantingDate || 'date not set'} · ${item.health}`, status: item.stage })) :
    kind === 'seasons' ? (displayed as PlantingSeason[]).map((item) => ({ title: item.name, detail: `${farmName(state, item.farmId)} · ${cropName(state, item.cropId)} · ${item.area} ${item.areaUnit} · ${item.startDate} – ${item.expectedEndDate}`, status: item.status })) :
    kind === 'calendar' ? (displayed as FarmActivity[]).map((item) => ({ title: item.title, detail: `${farmName(state, item.farmId)} · ${item.type} · ${item.date || 'date not set'}${item.assignedTo ? ` · ${item.assignedTo}` : ''}`, status: item.status })) :
      kind === 'inputs' ? (displayed as FarmInput[]).map((item) => ({ title: item.name, detail: `${farmName(state, item.farmId)} · ${item.quantity} ${item.unit} · cost ${money(item.cost)}`, status: item.quantity <= item.minimum ? 'Low stock' : item.category })) :
        kind === 'harvests' ? (displayed as HarvestRecord[]).map((item) => ({ title: `${cropName(state, item.cropId)} · ${item.quantity} ${item.unit}`, detail: `${farmName(state, item.farmId)} · ${item.date} · ${item.grade}`, status: item.intendedUse })) :
          kind === 'livestock' ? (displayed as LivestockRecord[]).map((item) => ({ title: `${item.quantity} ${item.category}`, detail: `${farmName(state, item.farmId)} · ${item.breed || 'Breed not recorded'} · ${item.purpose}`, status: formatDate(item.acquiredOn) })) :
            (displayed as FinanceRecord[]).map((item) => ({ title: `${item.direction} · ${item.category} · ${money(item.amount)}`, detail: `${farmName(state, item.farmId)} · ${item.date} · ${item.description}`, status: 'Recorded' }))
  const availableCrops = state.crops.filter((crop) => crop.farmId === farmId)
  return <div className="space-y-6"><SectionHeading eyebrow="Farm records" title={title[kind]} detail={description[kind]} action={<button onClick={() => setShowForm((open) => !open)} className={button}><Plus className="h-4 w-4" /> {showForm ? 'Close form' : 'Add record'}</button>} />
    {!state.farms.length && <div className="rounded-xl bg-[#fff4e8] p-4 text-sm">Register a farm before recording crop, activity or production data. <Link className="font-semibold underline" to="/farms/dashboard/farms/new">Register a farm</Link></div>}
    {state.farms.length > 0 && <div className="flex flex-wrap gap-3"><label className="text-sm">Farm<select value={farmId} onChange={(event) => setFarmId(event.target.value)} className="ml-2 rounded-lg border bg-white p-2"><option value="">All farms</option>{state.farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</select></label><label className="text-sm">Filter<select value={filterFarm} onChange={(event) => setFilterFarm(event.target.value)} className="ml-2 rounded-lg border bg-white p-2"><option value="all">All records</option>{state.farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</select></label>{kind === 'crops' && <label className="text-sm">Growth stage<select value={filterStage} onChange={(event) => setFilterStage(event.target.value)} className="ml-2 rounded-lg border bg-white p-2"><option value="all">All stages</option>{cropStages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>}</div>}
    {showForm && state.farms.length > 0 && <form onSubmit={save} className={`${card} grid gap-4 sm:grid-cols-2`}>
      {kind === 'crops' && <>{inputField('Crop name', 'name', true)}{selectField('Category', 'category', ['Cereal', 'Vegetable', 'Fruit', 'Legume', 'Root crop', 'Other'])}{inputField('Variety', 'variety')}{inputField('Plot or field', 'plot')}{inputField('Planting date', 'plantingDate', true, 'date')}{inputField('Expected harvest date', 'expectedHarvestDate', false, 'date')}{inputField('Area allocated', 'area', true, 'number')}{selectField('Area unit', 'areaUnit', ['acres', 'hectares'])}{selectField('Planting method', 'plantingMethod', ['Direct sowing', 'Transplanting', 'Other'])}{selectField('Irrigation method', 'irrigation', ['Rain-fed', 'Drip', 'Sprinkler', 'Other'])}{selectField('Growth stage', 'stage', cropStages)}{selectField('Health observation', 'health', ['No observation recorded', 'Healthy observation', 'Pest observation', 'Possible disease symptoms', 'Nutrient concern', 'Weather-related damage', 'Other'])}{inputField('Notes', 'notes')}</>}
      {kind === 'seasons' && <>{inputField('Season name', 'name', true)}{selectField('Crop (optional)', 'cropId', ['', ...availableCrops.map((crop) => crop.id)], ['', ...availableCrops.map((crop) => crop.name)])}{inputField('Season start date', 'startDate', true, 'date')}{inputField('Expected end date', 'expectedEndDate', false, 'date')}{inputField('Allocated area', 'area', false, 'number')}{selectField('Area unit', 'areaUnit', ['acres', 'hectares'])}{selectField('Season status', 'status', ['Planned', 'Active', 'Completed', 'Paused'])}{inputField('Season notes', 'notes')}</>}
      {kind === 'calendar' && <>{inputField('Activity title', 'title', true)}{selectField('Activity type', 'type', activityTypes)}{inputField('Date', 'date', true, 'date')}{inputField('Assigned worker (optional)', 'assignedTo')}{selectField('Crop (optional)', 'cropId', ['', ...availableCrops.map((crop) => crop.id)], availableCrops.map((crop) => crop.name))}<label className="flex items-center gap-2 text-sm"><input type="checkbox" name="reminder" /> Add a local reminder</label></>}
      {kind === 'inputs' && <>{inputField('Input name', 'name', true)}{selectField('Category', 'category', ['Seeds', 'Fertilisers', 'Pesticides (regulated)', 'Herbicides (regulated)', 'Animal feeds', 'Veterinary supplies', 'Irrigation equipment', 'Farm tools', 'Other'])}{inputField('Quantity', 'quantity', true, 'number')}{inputField('Unit', 'unit', true)}{inputField('Low-stock threshold', 'minimum', false, 'number')}{inputField('Purchase cost (KSh)', 'cost', false, 'number')}{inputField('Supplier', 'supplier')}{inputField('Purchase date', 'purchaseDate', false, 'date')}{inputField('Application date (optional)', 'applicationDate', false, 'date')}<p className="text-xs leading-5 text-[#6B756E] sm:col-span-2">Follow the product label and applicable safety rules. This record tool does not recommend chemical inputs or application rates.</p></>}
      {kind === 'harvests' && <>{selectField('Crop', 'cropId', ['', ...availableCrops.map((crop) => crop.id)], availableCrops.map((crop) => crop.name))}{inputField('Harvest date', 'date', true, 'date')}{inputField('Quantity harvested', 'quantity', true, 'number')}{inputField('Unit', 'unit', true)}{selectField('Quality or grade', 'grade', ['Not graded', 'Grade A', 'Grade B', 'Other'])}{inputField('Storage location', 'storage')}{selectField('Intended use', 'intendedUse', ['For sale', 'Household use', 'Seed', 'Feed', 'Other'])}</>}
      {kind === 'livestock' && <>{selectField('Animal category', 'category', ['Cattle', 'Dairy cows', 'Goats', 'Sheep', 'Poultry', 'Pigs', 'Other'])}{inputField('Breed', 'breed')}{inputField('Quantity', 'quantity', true, 'number')}{inputField('Acquisition date', 'acquiredOn', false, 'date')}{selectField('Production purpose', 'purpose', ['Dairy', 'Meat', 'Eggs', 'Breeding', 'Mixed', 'Other'])}{inputField('Notes', 'notes')}</>}
      {kind === 'finance' && <>{selectField('Record type', 'direction', ['Expense', 'Income'])}{selectField('Category', 'category', ['Seeds', 'Fertilisers', 'Labour', 'Irrigation', 'Transport', 'Equipment', 'Veterinary services', 'Farm maintenance', 'Crop sales', 'Livestock sales', 'Milk production', 'Poultry products', 'Other'])}{inputField('Amount (KSh)', 'amount', true, 'number')}{inputField('Date', 'date', true, 'date')}{inputField('Description', 'description')}</>}
      <button className={`${button} sm:col-span-2`}>Save {kind === 'calendar' ? 'activity' : kind === 'finance' ? 'financial record' : kind.slice(0, -1) || 'record'}</button>
    </form>}
    {message && <p role="status" className="text-sm text-[#285342]">{message}</p>}
    {kind === 'finance' && state.role === 'worker' ? <RestrictedPanel state={state} update={update} /> : rows.length ? <section className={`${card} space-y-3`}><RecordList rows={kind === 'crops' && filterStage !== 'all' ? rows.filter((item) => item.status === filterStage) : rows} actions={kind === 'calendar' ? state.activities.filter((item) => filterFarm === 'all' || item.farmId === filterFarm).map((item) => ({ id: item.id, label: item.status === 'Completed' ? 'Mark planned' : 'Mark completed', onClick: () => updateActivity(item, item.status === 'Completed' ? 'Planned' : 'Completed') })) : undefined} /></section> : <EmptyCard title={`No ${title[kind].toLowerCase()} recorded`} detail="Records are only included after you add them. No production, activity or financial values are estimated." action={state.farms.length ? <button className={button} onClick={() => setShowForm(true)}>Add first record</button> : undefined} />}
  </div>
}

function ExpertSupport({ state, update }: { state: FarmsState; update: FarmsUpdate }) {
  const [message, setMessage] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const farmId = String(data.get('farmId') ?? '')
    if (!farmId) { setMessage('Select a farm before sending your request.'); return }
    const request: ExpertRequest = { id: crypto.randomUUID(), farmId, subject: String(data.get('subject') ?? '').trim(), category: String(data.get('category') ?? ''), description: String(data.get('description') ?? '').trim(), urgency: String(data.get('urgency') ?? ''), contactMethod: String(data.get('contactMethod') ?? ''), status: 'Submitted', createdAt: timestamp() }
    update((current) => ({ ...current, expertRequests: [request, ...current.expertRequests], notifications: [{ id: crypto.randomUUID(), title: 'Agricultural support request received', detail: `${request.subject} · Awaiting assignment`, href: '/farms/dashboard/experts', createdAt: timestamp(), read: false }, ...current.notifications] }))
    event.currentTarget.reset()
    setMessage('Request saved. Assignment and response require the Leafy Farms support service.')
  }
  return <div className="space-y-6"><SectionHeading eyebrow="Agricultural support" title="Ask for expert assistance" detail="Describe a farm challenge and keep a record of the request. This prototype does not claim experts or appointments are currently available." /><section className={`${card} flex items-start gap-3`}><CircleHelp className="mt-1 h-5 w-5 shrink-0 text-[#285342]" /><div><h2 className="font-semibold">Expert directory</h2>{expertDirectory.length ? <RecordList rows={expertDirectory.map((expert) => ({ title: expert.name, detail: `${expert.expertise.join(', ')} · ${expert.coverage}`, status: 'Directory profile' }))} /> : <p className="mt-1 text-sm leading-6 text-[#6B756E]">No verified expert profiles or consultation slots are published yet.</p>}</div></section><form onSubmit={submit} className={`${card} grid gap-4 sm:grid-cols-2`}><h2 className="font-semibold sm:col-span-2">New support request</h2>{selectField('Farm', 'farmId', ['', ...state.farms.map((farm) => farm.id)], state.farms.map((farm) => farm.name))}{selectField('Concern category', 'category', ['Crop production', 'Soil management', 'Pest observation', 'Disease symptoms', 'Nutrient concerns', 'Livestock production', 'Dairy', 'Poultry', 'Irrigation', 'Agribusiness', 'Other'])}{inputField('Short description', 'subject', true)}{selectField('Urgency', 'urgency', ['Routine', 'Time-sensitive', 'Urgent'])}{selectField('Preferred contact method', 'contactMethod', ['Phone', 'Email', 'In-platform response'])}<label className="block text-sm font-medium sm:col-span-2">Describe what you observed<textarea name="description" required rows={4} className="mt-2 w-full rounded-xl border border-[#dce4dc] p-3 font-normal" /></label><label className="block text-sm font-medium sm:col-span-2">Attach photos (not uploaded in this prototype)<input type="file" accept="image/*" multiple disabled className="mt-2 block w-full rounded-xl border p-3 text-xs" /></label><p className="text-xs leading-5 text-[#6B756E] sm:col-span-2">Do not treat this form as a diagnosis. Follow local safety guidance and contact qualified services for urgent risks.</p><button className={button}>Submit assistance request</button>{message && <p role="status" className="text-sm text-[#285342]">{message}</p>}</form><section className={card}><SectionHeading title="Request history" />{state.expertRequests.length ? <RecordList rows={state.expertRequests.map((item) => ({ title: item.subject, detail: `${farmName(state, item.farmId)} · ${item.category} · ${formatDate(item.createdAt)}`, status: item.status }))} /> : <p className="mt-3 text-sm text-[#6B756E]">No support requests have been submitted.</p>}</section></div>
}

function ResourcesPage() {
  return <div className="mx-auto max-w-7xl space-y-7 px-4 py-10 sm:px-6"><Link to="/farms" className="text-sm font-semibold text-[#285342]">← Leafy Farms</Link><SectionHeading eyebrow="Farmer knowledge" title="Farming resources" detail="Practical checklists and learning links. Verify crop-specific and regulated-input decisions with qualified local agricultural support." /><div className="grid gap-4 md:grid-cols-2">{farmingResources.map((resource) => <article key={resource.id} className={`${card} space-y-3`}><Eyebrow>{resource.category}</Eyebrow><h2 className="text-xl font-semibold">{resource.title}</h2><p className="text-sm leading-6 text-[#59665d]">{resource.detail}</p><ul className="space-y-2">{resource.checklist.map((item) => <li key={item} className="flex gap-2 text-sm"><Check className="h-4 w-4 shrink-0 text-[#39845A]" />{item}</li>)}</ul><p className="text-xs text-[#6B756E]">Leafy Farms practical note · review date and editorial ownership will be supplied by the content service.</p></article>)}</div><section className="rounded-2xl bg-[#EDF4EA] p-5"><Eyebrow>Connected learning</Eyebrow><h2 className="mt-1 text-xl font-semibold">Continue learning with Leafy Academy</h2><p className="mt-2 text-sm text-[#59665d]">Explore Introduction to Regenerative Growing from the existing Academy catalogue.</p><Link to="/academy/courses/regenerative-growing" className={`${button} mt-4`}>Open course in Leafy Academy <ArrowRight className="h-4 w-4" /></Link></section><p className="text-xs leading-5 text-[#6B756E]">Weather forecasts are not available because no weather provider is configured. This page does not display invented current conditions or advisories.</p></div>
}

function ProgrammesPage({ state, update }: { state: FarmsState; update: FarmsUpdate }) {
  const [message, setMessage] = useState('')
  const register = (title: string) => {
    update((current) => ({ ...current, notifications: [{ id: crypto.randomUUID(), title: 'Programme interest saved', detail: `You asked to hear about: ${title}. This is a local reminder, not a programme application.`, href: '/farms/dashboard/notifications', createdAt: timestamp(), read: false }, ...current.notifications] }))
    setMessage('Interest saved locally. This example is not an open programme registration.')
  }
  return <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6"><Link to="/farms" className="text-sm font-semibold text-[#285342]">← Leafy Farms</Link><SectionHeading eyebrow="Farmer initiatives" title="Programmes & initiatives" detail="Only programmes published by an authorised Leafy Farms administrator can accept applications. The entry below is illustrative and cannot be registered for." />{programmeExamples.map((programme) => <article key={programme.id} className={card}><span className="rounded-full bg-[#fff4e8] px-3 py-1 text-xs text-[#79501c]">{programme.status}</span><h2 className="mt-3 text-xl font-semibold">{programme.title}</h2><p className="mt-2 text-sm leading-6 text-[#59665d]">{programme.description}</p><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><p><strong>Location:</strong> {programme.location}</p><p><strong>Eligibility:</strong> {programme.eligibility}</p></div><button onClick={() => register(programme.title)} className={`${secondary} mt-4`}>Save interest (not an application)</button></article>)}{message && <p role="status" className="text-sm text-[#285342]">{message}</p>}<section className={card}><h2 className="font-semibold">My programme activity</h2><p className="mt-2 text-sm text-[#6B756E]">{state.notifications.filter((item) => item.title === 'Programme interest saved').length} local expression(s) of interest · no real applications recorded.</p></section></div>
}

function ProducePage({ state, update }: { state: FarmsState; update: FarmsUpdate }) {
  const [message, setMessage] = useState('')
  const [farmId, setFarmId] = useState(state.farms[0]?.id ?? '')
  const [cropId, setCropId] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const selectedFarm = state.farms.find((farm) => farm.id === farmId)
    if (!selectedFarm) { setMessage('Register a farm before preparing a produce listing.'); return }
    const draft = { id: crypto.randomUUID(), farmId, cropId, productName: String(data.get('productName') ?? '').trim(), variety: String(data.get('variety') ?? '').trim(), quantity: Number(data.get('quantity')), unit: String(data.get('unit') ?? ''), grade: String(data.get('grade') ?? ''), price: Number(data.get('price')), location: selectedFarm.location || selectedFarm.county, availableDate: String(data.get('availableDate') ?? ''), status: 'Seller setup required' as const }
    update((current) => ({ ...current, produceDrafts: [draft, ...current.produceDrafts] }))
    event.currentTarget.reset()
    setMessage('Produce details saved as a local draft. Publishing requires approved Market seller access and its product API.')
  }
  const crops = state.crops.filter((crop) => crop.farmId === farmId)
  return <div className="space-y-6"><SectionHeading eyebrow="Leafy Market connection" title="Produce & buyer opportunities" detail="Prepare a produce listing and continue through the existing Leafy Market seller workflow. Drafts here are not published or visible to buyers." /><div className="grid gap-4 md:grid-cols-2"><section className={card}><h2 className="font-semibold">Prepare a produce listing</h2>{!state.farms.length ? <p className="mt-3 text-sm text-[#6B756E]">Register a farm before preparing a listing.</p> : <form onSubmit={submit} className="mt-4 space-y-3"><label className="block text-sm">Farm<select value={farmId} onChange={(event) => { setFarmId(event.target.value); setCropId('') }} className="mt-1 w-full rounded-lg border bg-white p-3">{state.farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</select></label><label className="block text-sm">Registered crop (optional)<select value={cropId} onChange={(event) => setCropId(event.target.value)} className="mt-1 w-full rounded-lg border bg-white p-3"><option value="">Select crop</option>{crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.name} · {crop.variety}</option>)}</select></label>{inputField('Product or produce name', 'productName', true)}{inputField('Variety', 'variety')}{inputField('Quantity available', 'quantity', true, 'number')}{inputField('Unit', 'unit', true)}{selectField('Quality or grade', 'grade', ['Not graded', 'Grade A', 'Grade B', 'Other'])}{inputField('Indicative asking price (KSh)', 'price', true, 'number')}{inputField('Available from', 'availableDate', true, 'date')}<p className="text-xs leading-5 text-[#6B756E]">Price and quantity here are draft information only. Buyer orders, enquiries and fulfilment require Market backend integration.</p><button className={button}>Save produce draft</button></form>}</section><section className="space-y-4"><div className={`${card}`}><h2 className="font-semibold">Publish through Leafy Market</h2><p className="mt-2 text-sm leading-6 text-[#6B756E]">The existing Market manages seller applications, product moderation, orders and fulfilment. Complete seller onboarding there to prepare for approved listings.</p><Link to="/market/seller/apply" className={`${secondary} mt-4`}>Open Market seller onboarding <ArrowRight className="h-4 w-4" /></Link></div><div className={card}><h2 className="font-semibold">Buyer opportunities</h2><p className="mt-2 text-sm leading-6 text-[#6B756E]">No verified buyer requests or procurement opportunities are available in the connected Market records yet.</p></div></section></div><section className={card}><SectionHeading title="My produce drafts" />{state.produceDrafts.length ? <RecordList rows={state.produceDrafts.map((draft) => ({ title: `${draft.productName} · ${draft.quantity} ${draft.unit}`, detail: `${farmName(state, draft.farmId)} · ${draft.location} · ${draft.availableDate} · ${money(draft.price)}`, status: draft.status }))} /> : <p className="mt-3 text-sm text-[#6B756E]">No produce drafts.</p>}</section>{message && <p role="status" className="text-sm text-[#285342]">{message}</p>}</div>
}

function WorkforcePage({ state, update }: { state: FarmsState; update: FarmsUpdate }) {
  const [message, setMessage] = useState('')
  const [farmId, setFarmId] = useState(state.farms[0]?.id ?? '')
  const addWorker = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const worker: WorkerAssignment = { id: crypto.randomUUID(), farmId, name: String(data.get('name') ?? '').trim(), email: String(data.get('email') ?? '').trim(), role: String(data.get('role') ?? 'Farm Worker') as WorkerAssignment['role'], permissions: data.getAll('permissions').map(String) }
    if (!farmId || !worker.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(worker.email)) { setMessage('Select a farm and enter the worker name and a valid email address.'); return }
    update((current) => ({ ...current, workers: [worker, ...current.workers] }))
    event.currentTarget.reset()
    setMessage('Assignment saved locally. An invitation and access enforcement require the shared account service.')
  }
  return <div className="space-y-6"><SectionHeading eyebrow="Team management" title="Farm workers & permissions" detail="Set farm-specific assignments and avoid granting sensitive financial access. This local preview does not send invitations or enforce permissions on a server." />{!state.farms.length ? <EmptyCard title="Register a farm first" detail="Workers can only be assigned to a farm you have registered." action={<Link to="/farms/dashboard/farms/new" className={button}>Register a farm</Link>} /> : <form onSubmit={addWorker} className={`${card} grid gap-4 sm:grid-cols-2`}><label className="block text-sm">Farm<select value={farmId} onChange={(event) => setFarmId(event.target.value)} className="mt-1 w-full rounded-lg border bg-white p-3">{state.farms.map((farm) => <option key={farm.id} value={farm.id}>{farm.name}</option>)}</select></label>{inputField('Worker full name', 'name', true)}{inputField('Worker email', 'email', true, 'email')}{selectField('Role', 'role', ['Farm Manager', 'Farm Worker', 'Agricultural Consultant'])}<fieldset className="space-y-2 sm:col-span-2"><legend className="text-sm font-semibold">Allowed operational areas (preview)</legend>{['Record activities', 'Update crop stages', 'Record inputs', 'Record harvests', 'View farm profile'].map((permission) => <label key={permission} className="mr-4 inline-flex items-center gap-2 text-xs"><input type="checkbox" name="permissions" value={permission} />{permission}</label>)}</fieldset><p className="text-xs text-[#6B756E] sm:col-span-2">Farm finance, account settings and permission changes are not granted by default.</p><button className={`${button} sm:col-span-2`}>Save farm assignment</button></form>}<section className={card}><h2 className="font-semibold">Assigned team</h2>{state.workers.length ? <RecordList rows={state.workers.map((worker) => ({ title: worker.name, detail: `${farmName(state, worker.farmId)} · ${worker.email} · ${worker.permissions.join(', ') || 'No operational permissions selected'}`, status: worker.role }))} /> : <p className="mt-3 text-sm text-[#6B756E]">No workers have been assigned.</p>}</section>{message && <p role="status" className="text-sm text-[#285342]">{message}</p>}</div>
}

function ReportsPage({ state }: { state: FarmsState }) {
  const harvestTotal = state.harvests.reduce((sum, record) => sum + record.quantity, 0)
  const expenseTotal = state.finances.filter((record) => record.direction === 'Expense').reduce((sum, record) => sum + record.amount, 0)
  const incomeTotal = state.finances.filter((record) => record.direction === 'Income').reduce((sum, record) => sum + record.amount, 0)
  const csvRows = [
    ['Farm', 'Crop', 'Harvest date', 'Quantity', 'Unit', 'Grade'],
    ...state.harvests.map((record) => [farmName(state, record.farmId), cropName(state, record.cropId), record.date, String(record.quantity), record.unit, record.grade]),
  ]
  return <div className="space-y-6"><SectionHeading eyebrow="Farm reports" title="Reports from your records" detail="These summaries contain only information entered in this browser. They are operational records, not audited accounts or forecasts." /><div className="grid gap-3 sm:grid-cols-3">{[['Harvest quantity', `${harvestTotal}${state.harvests.length ? ` · ${state.harvests.length} records` : ''}`], ['Recorded income', money(incomeTotal)], ['Recorded expenses', money(expenseTotal)]].map(([label, value]) => <div key={label} className={card}><p className="text-xs text-[#6B756E]">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>)}</div><div className="grid gap-5 lg:grid-cols-2"><section className={card}><SectionHeading title="Harvests by crop" />{state.harvests.length ? <RecordList rows={Object.entries(state.harvests.reduce<Record<string, number>>((summary, record) => ({ ...summary, [cropName(state, record.cropId)]: (summary[cropName(state, record.cropId)] ?? 0) + record.quantity }), {})).map(([name, quantity]) => ({ title: name, detail: `${quantity} recorded units`, status: 'From entered records' }))} /> : <p className="mt-3 text-sm text-[#6B756E]">No harvest records to summarize.</p>}</section><section className={card}><SectionHeading title="Financial record summary" />{state.role === 'worker' ? <p className="mt-3 text-sm text-[#6B756E]">Financial reporting is not available for this role.</p> : state.finances.length ? <><div className="mt-3 flex justify-between text-sm"><span>Income</span><strong>{money(incomeTotal)}</strong></div><div className="mt-2 flex justify-between text-sm"><span>Expenses</span><strong>{money(expenseTotal)}</strong></div><div className="mt-3 border-t pt-3 text-sm"><span>Net recorded balance</span><strong className="float-right">{money(incomeTotal - expenseTotal)}</strong></div><p className="mt-3 text-xs text-[#6B756E]">Based only on recorded entries. Not an accounting or audited statement.</p></> : <p className="mt-3 text-sm text-[#6B756E]">No financial entries are recorded.</p>}</section></div><section className={card}><div className="flex flex-wrap items-center justify-between gap-3"><SectionHeading title="Harvest record export" detail="Download a CSV containing farm and harvest records on this device." /><button disabled={!state.harvests.length} onClick={() => downloadFarmCsv('leafy-farms-harvests.csv', csvRows)} className={secondary}><Download className="h-4 w-4" /> Export CSV</button></div>{state.harvests.length ? <RecordList rows={state.harvests.map((record) => ({ title: `${cropName(state, record.cropId)} · ${record.quantity} ${record.unit}`, detail: `${farmName(state, record.farmId)} · ${record.date}`, status: record.grade }))} /> : <p className="mt-3 text-sm text-[#6B756E]">A report becomes available after you enter harvest records.</p>}</section></div>
}

function NotificationsPage({ state, update }: { state: FarmsState; update: FarmsUpdate }) {
  return <div className="space-y-5"><div className="flex flex-wrap items-end justify-between gap-3"><SectionHeading eyebrow="Farm updates" title="Notifications & reminders" detail="In this prototype, notifications are local records; email and SMS reminders require a configured service." /><button onClick={() => update((current) => ({ ...current, notifications: current.notifications.map((item) => ({ ...item, read: true })) }))} className={secondary}>Mark all as read</button></div>{state.notifications.length ? <div className="space-y-3">{state.notifications.map((item) => <article key={item.id} className={`${card} flex items-start justify-between gap-4 ${item.read ? '' : 'border-l-4 border-l-[#39845A]'}`}><div><h2 className="font-semibold">{item.title}</h2><p className="mt-1 text-sm leading-6 text-[#6B756E]">{item.detail}</p><Link to={item.href} onClick={() => update((current) => ({ ...current, notifications: current.notifications.map((notice) => notice.id === item.id ? { ...notice, read: true } : notice) }))} className="mt-2 inline-block text-xs font-semibold text-[#285342]">Open related page</Link></div><time className="shrink-0 text-xs text-[#6B756E]">{formatDate(item.createdAt)}</time></article>)}</div> : <EmptyCard title="No farm notifications" detail="Activity reminders, support updates and market notices will appear here when available." />}</div>
}

function ProfilePage({ state }: { state: FarmsState; update: FarmsUpdate }) {
  const profile = state.profile
  if (!profile) return <EmptyCard title="Farmer profile not set up" detail="Add basic details and optional farming interests. You can complete more information later." action={<Link to="/farms/onboarding" className={button}>Set up profile</Link>} />
  return <div className="space-y-5"><SectionHeading eyebrow="Farmer profile" title={profile.fullName} detail={profile.bio || 'No biography added.'} action={<Link to="/farms/onboarding" className={secondary}>Edit profile</Link>} /><section className={card}><dl className="grid gap-4 sm:grid-cols-2">{[['Email', profile.email], ['Phone', profile.phone], ['County', profile.county], ['Sub-county', profile.subCounty], ['Ward', profile.ward], ['Village or locality', profile.village], ['Experience', profile.experience ? `${profile.experience} years` : 'Not provided'], ['Preferred language', profile.language], ['Farming interests', profile.interests.join(', ') || 'Not selected']].map(([label, value]) => <div key={label}><dt className="text-xs text-[#6B756E]">{label}</dt><dd className="mt-1 text-sm">{value || 'Not provided'}</dd></div>)}</dl></section><p className="text-xs leading-5 text-[#6B756E]">Profile visibility, privacy and account security are controlled by your shared Leafy account. This prototype does not modify account authentication or security settings.</p></div>
}

function SettingsPage({ state, update }: { state: FarmsState; update: FarmsUpdate }) {
  const [message, setMessage] = useState('')
  const changeRole = (role: FarmsRole) => update((current) => ({ ...current, role }))
  const roles: FarmsRole[] = ['farmer', 'worker', 'expert', 'farms-admin', 'super-admin']
  return <div className="space-y-5"><SectionHeading eyebrow="Workspace settings" title="Privacy, access & preferences" detail="Production access and notification preferences belong to the shared Leafy account service. The role selector below is only a local preview." /><section className={card}><h2 className="font-semibold">Role preview</h2><p className="mt-1 text-sm leading-6 text-[#6B756E]">Changing this value does not authenticate you or grant real access.</p><label className="mt-3 block max-w-sm text-sm">Preview role<select value={state.role} onChange={(event) => changeRole(event.target.value as FarmsRole)} className="mt-2 w-full rounded-lg border bg-white p-3">{roles.map((role) => <option key={role} value={role}>{role.replace('-', ' ')}</option>)}</select></label></section><section className={`${card} space-y-3`}><h2 className="font-semibold">Local data</h2><p className="text-sm leading-6 text-[#6B756E]">Farm profile and records are saved in this browser. Avoid using this prototype for sensitive or business-critical records.</p><button onClick={() => { localStorage.removeItem('leafy-farms-state-v1'); setMessage('Local Farms data cleared. Refresh to load an empty workspace.') }} className="rounded-full border border-[#e5b7a7] px-4 py-2 text-sm text-[#9b422b]">Clear local Farms data</button>{message && <p role="status" className="text-sm">{message}</p>}</section><div className="flex flex-wrap gap-3"><Link to="/auth/login" className={secondary}>Shared Leafy account</Link><Link to="/" className={secondary}>Return to Leafy home</Link></div></div>
}

function ExpertWorkspace({ state, update }: { state: FarmsState; update: FarmsUpdate }) {
  if (state.role !== 'expert' && state.role !== 'farms-admin' && state.role !== 'super-admin') return <RestrictedPanel state={state} update={update} />
  const openRequests = state.expertRequests.filter((request) => !['Resolved', 'Closed'].includes(request.status))
  const setStatus = (request: ExpertRequest, status: ExpertRequest['status']) => update((current) => ({ ...current, expertRequests: current.expertRequests.map((item) => item.id === request.id ? { ...item, status } : item) }))
  return <div className="space-y-6"><SectionHeading eyebrow="Expert workspace · role preview" title="Support request queue" detail="Requests shown here are browser-local prototype records. Production assignment requires authenticated expert credentials and protected farmer details." /><section className={card}><h2 className="font-semibold">Assigned or submitted requests</h2>{openRequests.length ? <div className="mt-3 space-y-3">{openRequests.map((request) => <article key={request.id} className="rounded-xl bg-[#F6F5EF] p-4"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{request.subject}</h3><span className="text-xs">{request.status}</span></div><p className="mt-1 text-sm text-[#6B756E]">{farmName(state, request.farmId)} · {request.category} · {request.urgency}</p><p className="mt-2 text-sm leading-6">{request.description}</p><div className="mt-3 flex flex-wrap gap-2">{(['Assigned', 'In Progress', 'Response Provided', 'Resolved'] as const).map((status) => <button key={status} onClick={() => setStatus(request, status)} className={secondary}>{status}</button>)}</div></article>)}</div> : <p className="mt-3 text-sm text-[#6B756E]">No open support requests are available.</p>}</section></div>
}

function FarmsAdmin({ state, update }: { state: FarmsState; update: FarmsUpdate }) {
  if (state.role !== 'farms-admin' && state.role !== 'super-admin') return <RestrictedPanel state={state} update={update} />
  const requests = state.expertRequests
  return <div className="space-y-6"><SectionHeading eyebrow="Restricted workspace · local role preview" title="Leafy Farms administration" detail="Administration lists contain only local prototype records. This is not a security boundary; production admin access must be checked by the server." /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['Farmers', state.profile ? 1 : 0], ['Farms', state.farms.length], ['Crops recorded', state.crops.length], ['Support requests', requests.length]].map(([label, count]) => <div key={String(label)} className={card}><p className="text-xs text-[#6B756E]">{label}</p><p className="mt-1 text-2xl font-semibold">{count}</p></div>)}</div><div className="grid gap-5 lg:grid-cols-2"><section className={card}><h2 className="font-semibold">Registered farms</h2>{state.farms.length ? <RecordList rows={state.farms.map((farm) => ({ title: farm.name, detail: `${farm.county || farm.location} · ${farm.size} ${farm.sizeUnit} · ${farm.activities.join(', ')}`, status: 'Local record' }))} /> : <p className="mt-3 text-sm text-[#6B756E]">No farms are registered in this browser.</p>}</section><section className={card}><h2 className="font-semibold">Farmer support requests</h2>{requests.length ? <RecordList rows={requests.map((request) => ({ title: request.subject, detail: `${farmName(state, request.farmId)} · ${request.category}`, status: request.status }))} /> : <p className="mt-3 text-sm text-[#6B756E]">No support requests have been recorded.</p>}</section><section className={card}><h2 className="font-semibold">Expert directory review</h2><p className="mt-2 text-sm text-[#6B756E]">No expert profiles have been published. Expert application and vetting workflows require the backend.</p></section><section className={card}><h2 className="font-semibold">Programmes & content</h2><p className="mt-2 text-sm text-[#6B756E]">Programme examples and knowledge notes are illustrative frontend content; publishing, participant review and audit history require the Farms service.</p></section></div><Link to="/farms/dashboard/settings" className={secondary}>Change local role preview</Link></div>
}

function RestrictedPanel({ state, update }: { state: FarmsState; update: FarmsUpdate }) {
  const roles: FarmsRole[] = ['farmer', 'worker', 'expert', 'farms-admin', 'super-admin']
  return <section className={`${card} space-y-4`}><span className="inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-3 py-1 text-xs text-[#79501c]"><ShieldCheck className="h-4 w-4" /> Restricted preview</span><h2 className="text-lg font-semibold">This workspace is not available for the current role</h2><p className="text-sm leading-6 text-[#6B756E]">Production access must be verified by the shared Leafy authentication service. The local role selector is only a prototype navigation preview and grants no actual permissions.</p><label className="block max-w-sm text-sm font-medium">Local role preview<select value={state.role} onChange={(event) => update((current) => ({ ...current, role: event.target.value as FarmsRole }))} className="mt-2 w-full rounded-lg border bg-white p-3">{roles.map((role) => <option key={role} value={role}>{role.replace('-', ' ')}</option>)}</select></label><Link to="/farms/dashboard" className={secondary}>Return to farmer dashboard</Link></section>
}

function ContactPage() {
  return <div className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6"><SectionHeading eyebrow="Contact & support" title="Talk with the Leafy Farms team" detail="Support contacts are not configured in this workspace. Send an agricultural question from your Farms dashboard to create a support request record." /><div className="grid gap-4 sm:grid-cols-2"><Link to="/farms/dashboard/experts" className={`${card} block`}><CircleHelp className="h-6 w-6 text-[#285342]" /><h2 className="mt-3 font-semibold">Request agricultural assistance</h2><p className="mt-1 text-sm text-[#6B756E]">Describe a farm question for the support workflow.</p></Link><Link to="/auth/login" className={`${card} block`}><UserRound className="h-6 w-6 text-[#285342]" /><h2 className="mt-3 font-semibold">Shared Leafy account</h2><p className="mt-1 text-sm text-[#6B756E]">Sign in through the existing Leafy account flow.</p></Link></div></div>
}

function Footer() {
  return <footer className="border-t border-[#e6eae5] bg-white"><div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm sm:grid-cols-3 sm:px-6"><div><p className="font-semibold">Leafy Farms</p><p className="mt-2 leading-6 text-[#6B756E]">Practical digital tools for farm records, knowledge and connected opportunities.</p></div><div className="space-y-2"><Link className="block text-[#285342]" to="/farms/services">Farm services</Link><Link className="block text-[#285342]" to="/farms/resources">Farming resources</Link><Link className="block text-[#285342]" to="/farms/programmes">Programmes</Link></div><div className="space-y-2"><Link className="block text-[#285342]" to="/market">Leafy Market</Link><Link className="block text-[#285342]" to="/academy">Leafy Academy</Link><Link className="block text-[#285342]" to="/">Leafy home</Link></div></div></footer>
}

function SectionHeading({ eyebrow, title, detail, action }: { eyebrow?: string; title: string; detail?: string; action?: ReactNode }) {
  return <div className="flex flex-wrap items-end justify-between gap-3"><div>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>{detail && <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B756E]">{detail}</p>}</div>{action}</div>
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#39845A]">{children}</p>
}

function EmptyCard({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return <div className={`${card} flex min-h-44 flex-col items-center justify-center text-center`}><Sprout className="h-7 w-7 text-[#39845A]" /><h2 className="mt-3 font-semibold">{title}</h2><p className="mt-1 max-w-lg text-sm leading-6 text-[#6B756E]">{detail}</p>{action && <div className="mt-4">{action}</div>}</div>
}

function FarmCard({ farm, crops }: { farm: Farm; crops: number }) {
  return <article className="overflow-hidden rounded-2xl border border-[#e6eae5] bg-white"><img src={farm.image} alt="" className="h-36 w-full object-cover" /><div className="p-4"><div className="flex justify-between gap-3"><div><h3 className="font-semibold">{farm.name}</h3><p className="mt-1 flex items-center gap-1 text-xs text-[#6B756E]"><MapPin className="h-3 w-3" />{[farm.village, farm.county].filter(Boolean).join(', ') || farm.location || 'Location not set'}</p></div><span className="text-xs">{farm.size} {farm.sizeUnit}</span></div><p className="mt-3 text-xs text-[#6B756E]">{farm.activities.join(' · ') || 'Farming activities not set'} · {crops} active crop records</p><Link to={`/farms/dashboard/farms/${farm.id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#285342]">View farm <ChevronRight className="h-4 w-4" /></Link></div></article>
}

function RecordList({ rows, actions }: { rows: { title: string; detail: string; status: string }[]; actions?: { id: string; label: string; onClick: () => void }[] }) {
  return <ul className="mt-3 divide-y divide-[#e6eae5]">{rows.map((row, index) => <li key={`${row.title}-${index}`} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="text-sm font-medium">{row.title}</p><p className="mt-1 text-xs leading-5 text-[#6B756E]">{row.detail}</p></div><div className="flex items-center gap-2"><span className="text-xs font-medium text-[#285342]">{row.status}</span>{actions?.[index] && <button onClick={actions[index].onClick} className="text-xs font-semibold text-[#285342]">{actions[index].label}</button>}</div></li>)}</ul>
}

function inputField(label: string, name: string, required = false, type = 'text') {
  return <label className="block text-sm font-medium">{label}<input name={name} required={required} type={type} min={type === 'number' ? '0' : undefined} step={type === 'number' ? 'any' : undefined} className="mt-2 block w-full rounded-xl border border-[#dce4dc] bg-white p-3 font-normal" /></label>
}

function selectField(label: string, name: string, options: string[], labels = options) {
  return <label className="block text-sm font-medium">{label}<select name={name} className="mt-2 block w-full rounded-xl border border-[#dce4dc] bg-white p-3 font-normal">{options.map((option, index) => <option key={`${option}-${index}`} value={option}>{labels[index] ?? option}</option>)}</select></label>
}

function farmName(state: FarmsState, id: string) {
  return state.farms.find((farm) => farm.id === id)?.name ?? 'Farm not selected'
}

function cropName(state: FarmsState, id: string) {
  return state.crops.find((crop) => crop.id === id)?.name ?? 'Crop not selected'
}

function formatDate(value: string) {
  if (!value) return 'Not recorded'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}
