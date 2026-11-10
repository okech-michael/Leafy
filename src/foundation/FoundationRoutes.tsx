import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Check,
  CircleHelp, HeartHandshake, ShieldCheck, Sprout, Users,
} from 'lucide-react'
import { foundationId, loadFoundationState, saveFoundationState } from './foundationService'
import { LeafyLogo } from '../LeafyLogo'
import {
  foundationFocusAreas, type ApplicationStatus, type FoundationImpactIndicator,
  type FoundationProgramme, type FoundationRole, type FoundationState,
  type FoundationStory, type FoundationVolunteerApplication,
} from './foundationStore'

const heroImage = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=2200&q=90'
const currentYear = new Date().getFullYear()
const timestamp = () => new Date().toISOString()
const button = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#24483b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#18362c] disabled:cursor-not-allowed disabled:opacity-50'
const outlineButton = 'inline-flex items-center justify-center gap-2 rounded-full border border-[#d6ddd4] px-5 py-3 text-sm font-semibold text-[#24483b] transition hover:bg-[#eef1e8]'
const panel = 'rounded-[1.5rem] border border-[#e4e6df] bg-white p-5 shadow-[0_16px_40px_rgba(27,45,34,.04)]'
const imageFor = (id: string) => foundationFocusAreas.find((area) => area.id === id)?.image ?? heroImage
const formatDate = (date: string) => date ? new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set'

const publicLinks = [
  ['/foundation/about', 'About Us'],
  ['/foundation/our-work', 'Our Work'],
  ['/foundation/stories', 'Stories'],
  ['/foundation/get-involved', 'Get Involved'],
  ['/foundation/contact', 'Contact Us'],
]

export function FoundationRoutes() {
  const [state, setState] = useState<FoundationState>(() => loadFoundationState())
  const location = useLocation()
  const isManagement = location.pathname.startsWith('/foundation/manage')
  const isParticipantWorkspace = location.pathname.startsWith('/foundation/participant')
  useEffect(() => {
    if (!location.hash) return
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    target?.scrollIntoView({ block: 'start' })
  }, [location.pathname, location.hash])
  const update = (operation: (current: FoundationState) => FoundationState) => {
    setState((current) => {
      const next = operation(current)
      saveFoundationState(next)
      return next
    })
  }

  return <div className="min-h-screen bg-[#f6f3eb] text-[#202923]">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3">Skip to content</a>
    {(isManagement || isParticipantWorkspace) && <header className="sticky top-0 z-40 border-b border-[#e3e5dc] bg-[#f6f3eb]/95 backdrop-blur">
      {isManagement ? <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-4 py-4 sm:px-7 lg:px-10">
        <Link to="/foundation/manage" className="flex items-center gap-3"><LeafyLogo className="h-10 w-20" /><span><strong className="block font-semibold">Foundation</strong><small className="text-[10px] uppercase tracking-[.2em] text-[#68746a]">Staff workspace · preview</small></span></Link>
        <Link to="/foundation" className={outlineButton + ' py-2.5'}>Return to public site</Link>
      </div> : <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-7 lg:px-10">
        <Link to="/foundation/participant" className="flex items-center gap-3"><LeafyLogo className="h-10 w-20" /><span><strong className="block font-semibold">Foundation participant space</strong><small className="text-[10px] uppercase tracking-[.2em] text-[#68746a]">Account preview</small></span></Link>
        <nav aria-label="Participant navigation" className="flex flex-wrap items-center gap-2 text-sm"><NavLink to="/foundation/participant" end className={({ isActive }) => `${outlineButton} py-2 ${isActive ? 'bg-[#eaece2]' : ''}`}>Overview</NavLink><a href="/foundation/participant#activities" className={outlineButton + ' py-2'}>Activities</a><Link to="/foundation" className={outlineButton + ' py-2'}>Public site</Link></nav>
      </div>}
    </header>}
    {!isManagement && !isParticipantWorkspace && <nav aria-label="Foundation sections" className="border-b border-[#e3e5dc] bg-[#f6f3eb]">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        <NavLink end to="/foundation" className={({ isActive }) => `shrink-0 rounded-full px-3 py-2 text-sm font-medium ${isActive ? 'bg-white text-[#24483b]' : 'text-[#536057] hover:bg-white hover:text-[#24483b]'}`}>Foundation home</NavLink>
        {publicLinks.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `shrink-0 rounded-full px-3 py-2 text-sm font-medium ${isActive ? 'bg-white text-[#24483b]' : 'text-[#536057] hover:bg-white hover:text-[#24483b]'}`}>{label}</NavLink>)}
      </div>
    </nav>}
    <Routes>
      <Route index element={<FoundationHome state={state} />} />
      <Route path="about" element={<AboutPage state={state} />} />
      <Route path="our-work" element={<OurWorkPage state={state} />} />
      <Route path="programmes" element={<Navigate to="/foundation/our-work#programmes" replace />} />
      <Route path="programmes/:slug" element={<ProgrammeDetail state={state} update={update} />} />
      <Route path="events" element={<Navigate to="/foundation/get-involved#events" replace />} />
      <Route path="stories" element={<StoriesPage state={state} />} />
      <Route path="stories/:slug" element={<StoryDetail state={state} />} />
      <Route path="impact" element={<Navigate to="/foundation/our-work#impact" replace />} />
      <Route path="get-involved" element={<GetInvolvedPage state={state} update={update} />} />
      <Route path="volunteer" element={<Navigate to="/foundation/get-involved#volunteer" replace />} />
      <Route path="partnerships" element={<Navigate to="/foundation/get-involved#partners" replace />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="privacy" element={<LegalPage kind="privacy" />} />
      <Route path="terms" element={<LegalPage kind="terms" />} />
      <Route path="participant/*" element={<ParticipantWorkspace state={state} update={update} />} />
      <Route path="manage/*" element={<FoundationManagement state={state} update={update} />} />
      <Route path="*" element={<Navigate to="/foundation" replace />} />
    </Routes>
    {isManagement || isParticipantWorkspace
      ? <footer className="border-t border-[#e3e5dc] px-5 py-5 text-xs text-[#68746a] sm:px-8">Foundation workspace preview · Do not enter real participant information. <Link to="/foundation" className="ml-2 underline">Public site</Link></footer>
      : <FoundationFooter />}
  </div>
}

function FoundationHome({ state }: { state: FoundationState }) {
  const featuredStory = state.stories.find((story) => story.status === 'Published' && story.featured && story.consentStatus === 'Confirmed')
  return <main id="main-content">
    <section className="relative flex min-h-[min(760px,88svh)] items-end overflow-hidden bg-[#1d3028] text-white">
      <img src={heroImage} alt="Community members gathered together, sharing conversation" className="absolute inset-0 h-full w-full object-cover object-center opacity-75" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#15251f]/85 via-[#1a2e25]/55 to-[#16251f]/10" />
      <div className="relative mx-auto grid w-full max-w-[1600px] gap-12 px-5 pb-14 pt-24 sm:px-8 sm:pb-20 lg:grid-cols-1 lg:px-16">
        <div className="w-full max-w-[1450px]">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[.25em] text-[#d9e7ce]"><span className="h-px w-9 bg-[#d9e7ce]" /> Every life deserves an opportunity to grow</p>
          <h1 className="max-w-[1450px] font-serif text-5xl leading-[.99] tracking-[-.045em] sm:text-7xl lg:text-[88px]">{state.profile.heroHeadline}</h1>
          <p className="mt-7 max-w-4xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">{state.profile.heroIntroduction}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/foundation/our-work#impact" className="inline-flex items-center gap-2 rounded-full bg-[#f3f0e5] px-6 py-3.5 text-sm font-semibold text-[#24483b] hover:bg-white">Explore our impact <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/foundation/get-involved" className="inline-flex items-center gap-2 rounded-full border border-white/60 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">Be part of the story <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="hidden max-w-2xl border-l border-white/50 pl-5 text-sm leading-6 text-white/80 lg:block">
          <p className="font-serif text-2xl leading-8 text-white">“Opportunity grows when people shape it together.”</p>
          <p className="mt-4 text-xs uppercase tracking-[.15em]">Our guiding belief</p>
        </div>
        <a href="#the-story" className="absolute bottom-7 right-7 hidden items-center gap-2 text-xs uppercase tracking-[.17em] text-white/75 lg:flex">Scroll to explore <ArrowDown className="h-4 w-4" /></a>
      </div>
    </section>
    <section id="the-story" className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[.8fr_1.2fr] lg:px-12">
      <div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#718071]">The story behind our work</p><h2 className="mt-5 max-w-lg font-serif text-4xl leading-tight tracking-[-.035em] sm:text-6xl">Change does not happen by chance.</h2></div>
      <div className="max-w-2xl"><p className="text-xl leading-9 text-[#435248]">Communities hold talent, ideas and ambition. Yet access to opportunity, knowledge and resources can shape how far those strengths can reach.</p><p className="mt-6 leading-8 text-[#647067]">Leafy Foundation is being built around a simple conviction: lasting change begins by listening, working alongside people and making room for them to lead. Our work is a commitment to learn with communities and help connect people with practical opportunities to grow.</p><Link to="/foundation/about" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#24483b]">Read our story <ArrowRight className="h-4 w-4" /></Link></div>
    </section>
    <section className="bg-[#eaece2]">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[.9fr_1.1fr] lg:px-12">
        <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1400&q=85" alt="Young people working together on a learning activity" className="h-[340px] w-full rounded-[1.5rem] object-cover sm:h-[480px]" />
        <div className="max-w-xl lg:pl-8"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#718071]">A belief that guides us</p><h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-.035em] sm:text-5xl">People are not problems to solve. They are partners in progress.</h2><p className="mt-6 leading-8 text-[#59665b]">Our approach begins with dignity and participation. We want every initiative to be shaped by the people it is meant to serve, grounded in evidence and accountable to the communities involved.</p>        <Link to="/foundation/our-work#focus-areas" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#24483b]">Explore our proposed focus areas <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
    </section>
    <FocusStrip />
    <ProgrammesPreview state={state} />
    <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#718071]">Listen. Learn. Share.</p><h2 className="mt-4 font-serif text-4xl tracking-[-.035em] sm:text-5xl">Stories that remind us why we do this.</h2></div><Link to="/foundation/stories" className="inline-flex items-center gap-2 text-sm font-semibold text-[#24483b]">Visit the journal <ArrowRight className="h-4 w-4" /></Link></div>
      {featuredStory ? <Link to={`/foundation/stories/${featuredStory.slug}`} className="mt-10 grid overflow-hidden rounded-[1.5rem] bg-white md:grid-cols-[1.1fr_.9fr]"><img src={featuredStory.coverImage || heroImage} alt="" className="h-72 w-full object-cover md:h-[420px]" /><div className="flex flex-col justify-center p-7 sm:p-10"><p className="text-xs uppercase tracking-[.18em] text-[#718071]">A story shared with consent</p><h3 className="mt-4 font-serif text-3xl">{featuredStory.title}</h3><p className="mt-4 leading-7 text-[#647067]">{featuredStory.introduction}</p></div></Link> : <div className="mt-10 grid gap-8 rounded-[1.5rem] border border-[#dedfd7] bg-[#f0eee5] p-7 sm:grid-cols-[auto_1fr] sm:p-10"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#24483b]"><BookOpen className="h-5 w-5" /></span><div><h3 className="font-serif text-2xl">Stories deserve care before they are shared.</h3><p className="mt-3 max-w-2xl leading-7 text-[#647067]">No participant stories have been approved for publication yet. When stories are shared, they will be published only with confirmed consent and respect for each person’s dignity.</p><Link to="/foundation/stories" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#24483b]">How we share stories <ArrowRight className="h-4 w-4" /></Link></div></div>}
    </section>
    <section className="bg-[#24483b] text-[#fbfaf5]"><div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_.7fr] lg:px-12"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#c0d0b6]">Accountability matters</p><h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">Impact should be evidenced, not imagined.</h2></div><div><p className="leading-8 text-white/75">{state.impactIndicators.some((indicator) => indicator.verificationStatus === 'Verified') ? 'We share progress only when it is supported by verified records and approved reporting.' : 'There are no verified impact figures or reports published at this time. We would rather share no number than one without evidence.'}</p><Link to="/foundation/our-work#impact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">Our approach to impact <ArrowRight className="h-4 w-4" /></Link></div></div></section>
    <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12"><div className="flex flex-wrap items-end justify-between gap-5 rounded-[1.5rem] bg-[#eaece2] p-7 sm:p-10"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#718071]">Get involved</p><h2 className="mt-3 font-serif text-3xl sm:text-4xl">There is a place for you in this story.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#59665b]">Volunteer, explore a partnership or ask how to share your skills with community-led work.</p></div><Link to="/foundation/get-involved" className={button}>Find your way to contribute <ArrowRight className="h-4 w-4" /></Link></div></section>
    <ClosingStory />
  </main>
}

function FoundationFooter() {
  return <footer className="border-t border-[#e3e5dc] bg-[#f6f3eb]">
    <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-12">
      <div><Link to="/foundation" className="inline-flex"><LeafyLogo className="h-14 w-28" /></Link><p className="mt-4 max-w-sm text-sm leading-6 text-[#536057]">Creating opportunities, empowering communities and building a future where everyone has the chance to grow.</p><p className="mt-4 text-sm font-medium text-[#24483b]">Every life deserves an opportunity to grow.</p><p className="mt-3 text-xs text-[#68746a]">Official social accounts have not been provided.</p></div>
      <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#718071]">Explore</p><div className="mt-4 grid gap-3 text-sm">{[['/foundation', 'Home'], ['/foundation/about', 'About Us'], ['/foundation/our-work#focus-areas', 'Our Work'], ['/foundation/our-work#programmes', 'Programmes'], ['/foundation/stories', 'Stories'], ['/foundation/our-work#impact', 'Impact']].map(([to, label]) => <Link key={to} to={to} className="text-[#4d5a50] transition hover:text-[#24483b]">{label}</Link>)}</div></div>
      <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#718071]">Get involved</p><div className="mt-4 grid gap-3 text-sm">{[['/foundation/get-involved#volunteer', 'Volunteer'], ['/foundation/get-involved#partners', 'Become a partner'],       ['/foundation/get-involved#support', 'Support our work'], ['/foundation/contact', 'Contact Us']].map(([to, label]) => <Link key={to} to={to} className="text-[#4d5a50] transition hover:text-[#24483b]">{label}</Link>)}<Link to="/foundation/get-involved#events" className="text-[#4d5a50] transition hover:text-[#24483b]">Events</Link></div></div>
      <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#718071]">Contact</p><div className="mt-4 grid gap-2 text-sm text-[#536057]"><a className="hover:text-[#24483b]" href="tel:+254746593987">0746 593 987</a><a className="hover:text-[#24483b]" href="mailto:info@leafyinnovations.com">info@leafyinnovations.com</a></div><Link to="/foundation/contact" className="mt-3 inline-flex text-sm font-semibold text-[#24483b] hover:underline">Send an enquiry</Link><p className="mt-5 text-xs uppercase tracking-[.15em] text-[#718071]">Across Leafy</p><div className="mt-3 grid gap-2 text-sm"><Link to="/academy">Academy</Link><Link to="/farms">Farms</Link><Link to="/foods">Foods</Link><Link to="/market">Market</Link></div></div>
    </div>
    <div className="border-t border-[#dfe2d9]"><div className="mx-auto flex max-w-[1440px] flex-wrap justify-between gap-3 px-5 py-5 text-xs text-[#536057] sm:px-8 lg:px-12"><span>© {currentYear} Leafy Foundation. All rights reserved.</span><span className="flex gap-4"><Link to="/foundation/privacy" className="hover:text-[#24483b]">Privacy Policy</Link><Link to="/foundation/terms" className="hover:text-[#24483b]">Terms and Conditions</Link></span></div></div>
  </footer>
}

function FoundationPage({ children, eyebrow, title, intro }: { children: ReactNode; eyebrow: string; title: string; intro: string }) {
  return <main id="main-content" className="mx-auto min-h-[60vh] max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12"><div className="mb-12 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#718071]">{eyebrow}</p><h1 className="mt-4 font-serif text-4xl leading-tight tracking-[-.04em] sm:text-6xl">{title}</h1><p className="mt-5 text-lg leading-8 text-[#68746a]">{intro}</p></div>{children}</main>
}

function AboutPage({ state }: { state: FoundationState }) {
  return <FoundationPage eyebrow="The story behind the work" title="Change begins when people have room to shape it." intro="Leafy Foundation exists to support people and communities through meaningful opportunities, inclusion and sustainable development.">
    <nav aria-label="About page sections" className="mb-9 flex flex-wrap gap-3 text-sm"><a className="text-[#24483b] underline" href="#our-story">Our Story</a><a className="text-[#24483b] underline" href="#mission-vision">Mission & Vision</a><a className="text-[#24483b] underline" href="#our-approach">Our Approach</a></nav>
    <div id="our-story" className="scroll-mt-28 grid gap-8 lg:grid-cols-[1fr_.9fr]"><div className="space-y-6 text-[#59665b]"><h2 className="font-serif text-3xl text-[#202923]">Change does not happen by chance.</h2><p className="leading-8">Every community holds knowledge, ambition and ideas for a better future. Access to resources and opportunity can help those strengths flourish. Our role is to listen, connect and support community-led progress—not to speak over the people whose lives are involved.</p><p className="leading-8">This is an evolving Foundation experience. Official history, leadership biographies and confirmed programme records have not yet been provided, so they are intentionally not invented here.</p></div><img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1400&q=85" alt="People working and learning together" className="h-full min-h-[360px] w-full rounded-[1.5rem] object-cover" /></div>
    <div id="mission-vision" className="scroll-mt-28 mt-14 grid gap-5 md:grid-cols-2"><div className={panel}><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#718071]">Our mission</p><p className="mt-3 font-serif text-2xl leading-8">{state.profile.mission}</p></div><div className={panel}><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#718071]">Our vision</p><p className="mt-3 font-serif text-2xl leading-8">{state.profile.vision}</p></div><div className={`${panel} md:col-span-2`}><p className="text-xs font-semibold uppercase tracking-[.15em] text-[#718071]">Our values</p><ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">{state.profile.values.map((value) => <li key={value} className="list-inside list-disc text-sm text-[#405247]">{value}</li>)}</ul></div></div>
    <div id="our-approach" className="scroll-mt-28 mt-8 rounded-[1.5rem] bg-[#eaece2] p-7"><h2 className="font-serif text-2xl">Our approach</h2><p className="mt-3 max-w-3xl leading-7 text-[#59665b]">Listen first. Work alongside communities. Protect dignity and consent. Make decisions transparently and share evidence only when it has been reviewed.</p><Link to="/foundation/our-work" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#24483b]">Explore Our Work <ArrowRight className="h-4 w-4" /></Link></div>
  </FoundationPage>
}

function FocusStrip() {
  return <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"><div className="mb-9 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#718071]">Where we hope to learn and contribute</p><h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-.035em] sm:text-5xl">Opportunity can take many forms.</h2><p className="mt-4 leading-7 text-[#68746a]">These are proposed focus areas for configuration—not a statement that active programmes are currently running.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{foundationFocusAreas.map((area) => <Link key={area.id} to="/foundation/our-work#focus-areas" className="group relative min-h-[310px] overflow-hidden rounded-[1.3rem] bg-[#243d31] text-white"><img src={area.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#16261f]/90 via-[#1e3429]/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6"><span className="text-xs uppercase tracking-[.14em] text-white/70">Proposed focus area</span><h3 className="mt-2 font-serif text-2xl">{area.title}</h3><p className="mt-2 max-w-md text-sm leading-6 text-white/80">{area.description}</p></div></Link>)}</div><Link to="/foundation/our-work#focus-areas" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#24483b]">Explore all focus areas <ArrowRight className="h-4 w-4" /></Link></section>
}

function OurWorkPage({ state }: { state: FoundationState }) {
  return <FoundationPage eyebrow="Our work" title="A thoughtful framework, shaped with communities." intro="Explore proposed focus areas, confirmed programmes and our evidence-led approach to impact. We share opportunities only when details are reviewed and confirmed.">
    <nav aria-label="Our Work sections" className="mb-9 flex flex-wrap gap-4 text-sm"><a className="text-[#24483b] underline" href="#focus-areas">Focus Areas</a><a className="text-[#24483b] underline" href="#programmes">Programmes</a><a className="text-[#24483b] underline" href="#impact">Impact & Accountability</a></nav>
    <section id="focus-areas" className="scroll-mt-28"><div className="mb-7"><h2 className="font-serif text-3xl">Focus areas</h2><p className="mt-2 text-sm leading-6 text-[#68746a]">These areas are proposed and configurable; they are not statements of active services or funded programmes.</p></div><div className="grid gap-5 md:grid-cols-2">{foundationFocusAreas.map((area, index) => <article key={area.id} className="grid overflow-hidden rounded-[1.4rem] border border-[#e4e6df] bg-white sm:grid-cols-[.85fr_1.15fr]"><img src={area.image} alt="" className="h-64 w-full object-cover sm:h-full" /><div className="p-6"><p className="text-xs uppercase tracking-[.15em] text-[#718071]">Proposed area {String(index + 1).padStart(2, '0')}</p><h3 className="mt-3 font-serif text-2xl">{area.title}</h3><p className="mt-3 text-sm leading-6 text-[#68746a]">{area.description}</p><h4 className="mt-5 text-xs font-semibold uppercase tracking-[.12em] text-[#45544a]">Possible objectives</h4><ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[#68746a]">{area.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul></div></article>)}</div><div className="mt-8 rounded-[1.5rem] bg-[#eaece2] p-7"><p className="font-serif text-xl">A framework, not a promise of service.</p><p className="mt-2 max-w-3xl text-sm leading-7 text-[#68746a]">Each focus area should be reviewed with community members, resourced appropriately and approved before it becomes a public programme.</p></div></section>
    <ProgrammesSection state={state} />
    <ImpactSection state={state} />
  </FoundationPage>
}

function ProgrammesPreview({ state }: { state: FoundationState }) {
  const programmes = state.programmes.filter((programme) => programme.status !== 'Archived').slice(0, 3)
  return <section className="bg-[#eaece2]"><div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#718071]">Programmes & initiatives</p><h2 className="mt-4 font-serif text-4xl tracking-[-.035em]">Opportunities, when they are ready.</h2></div><Link to="/foundation/our-work#programmes" className="inline-flex items-center gap-2 text-sm font-semibold text-[#24483b]">Explore programmes <ArrowRight className="h-4 w-4" /></Link></div>{programmes.length ? <div className="mt-8 grid gap-5 md:grid-cols-3">{programmes.map((programme) => <ProgrammeCard key={programme.id} programme={programme} />)}</div> : <p className="mt-6 max-w-2xl text-sm leading-7 text-[#59665b]">No confirmed programmes are listed yet. Visit Our Work to explore the proposed framework and learn how opportunities will be shared.</p>}</div></section>
}

function ProgrammesSection({ state }: { state: FoundationState }) {
  const programmes = state.programmes.filter((programme) => programme.status !== 'Archived')
  return <section id="programmes" className="scroll-mt-28 border-t border-[#e4e6df] pt-12"><div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#718071]">Programmes & initiatives</p><h2 className="mt-3 font-serif text-3xl">Explore confirmed opportunities.</h2></div>{programmes.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{programmes.map((programme) => <ProgrammeCard key={programme.id} programme={programme} />)}</div> : <p className="rounded-2xl bg-[#eaece2] p-6 text-sm leading-7 text-[#59665b]">There are no approved programme records available at this time. Proposed focus areas are not active opportunities.</p>}<Link to="/foundation/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#24483b]">Ask about a programme or propose an initiative <ArrowRight className="h-4 w-4" /></Link></section>
}

function ImpactSection({ state }: { state: FoundationState }) {
  const indicators = state.impactIndicators.filter((item) => item.verificationStatus === 'Verified')
  return <section id="impact" className="scroll-mt-28 border-t border-[#e4e6df] pt-12"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#718071]">Impact & accountability</p><h2 className="mt-3 font-serif text-3xl">Evidence before numbers.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#68746a]">Progress deserves to be shared clearly, with a source and reporting period behind every figure.</p>{indicators.length > 0 ? <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{indicators.map((item) => <article key={item.id} className={panel}><p className="text-sm text-[#68746a]">{item.reportingPeriod}</p><p className="mt-2 font-serif text-4xl text-[#24483b]">{item.value?.toLocaleString('en-KE')} <span className="text-lg">{item.unit}</span></p><h3 className="mt-3 font-semibold">{item.name}</h3><p className="mt-2 text-sm leading-6 text-[#68746a]">{item.description}</p><p className="mt-4 text-xs text-[#718071]">Verified source: {item.evidenceSource}</p></article>)}</div> : <div className="mt-6 rounded-[1.5rem] bg-[#24483b] p-7 text-white"><h3 className="font-serif text-2xl">No verified impact figures have been published yet.</h3><p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">We would rather share no number than one without evidence. Approved indicators will include a reporting period and a source that can be reviewed.</p><p className="mt-3 text-xs text-white/65">No downloadable reports are available at this time.</p></div>}</section>
}

function ProgrammeCard({ programme }: { programme: FoundationProgramme }) {
  return <Link to={`/foundation/programmes/${programme.slug}`} className={`${panel} overflow-hidden p-0 transition hover:-translate-y-1`}><img src={programme.image || imageFor(programme.focusAreaId)} alt="" className="h-56 w-full object-cover" /><div className="p-5"><span className="text-xs font-medium text-[#405247]">{programme.status}</span><h2 className="mt-2 font-serif text-2xl">{programme.name}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#68746a]">{programme.description}</p><p className="mt-4 text-xs text-[#718071]">{programme.location || 'Location to be confirmed'} · {formatDate(programme.startDate)}</p></div></Link>
}

function ProgrammeDetail({ state, update }: { state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void }) {
  const { slug } = useParams()
  const programme = state.programmes.find((item) => item.slug === slug && item.status !== 'Archived')
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  if (!programme) return <FoundationPage eyebrow="Programmes" title="This programme is not available." intro="It may have been removed or its details may not yet be published."><Link to="/foundation/our-work#programmes" className={button}>Browse programmes</Link></FoundationPage>
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const application = { id: foundationId('application'), programmeId: programme.id, participantName: String(data.get('name')), email: String(data.get('email')), phone: String(data.get('phone')), motivation: String(data.get('motivation')), status: 'Submitted' as ApplicationStatus, createdAt: timestamp() }
    update((current) => ({ ...current, programmeApplications: [application, ...current.programmeApplications] }))
    setMessage('Your application is saved in this browser prototype. It has not been sent to Foundation staff.')
    event.currentTarget.reset()
  }
  return <FoundationPage eyebrow={`Programme · ${programme.status}`} title={programme.name} intro={programme.description}>
    <div className="grid gap-8 lg:grid-cols-[1fr_.75fr]"><img src={programme.image || imageFor(programme.focusAreaId)} alt="" className="h-[360px] w-full rounded-[1.4rem] object-cover lg:h-full" /><div className="space-y-5"><InfoRow label="Status" value={programme.status} /><InfoRow label="Location" value={programme.location || 'To be confirmed'} /><InfoRow label="Dates" value={`${formatDate(programme.startDate)} – ${formatDate(programme.endDate)}`} /><InfoRow label="Who it is for" value={programme.targetParticipants || 'Details to be confirmed'} /><InfoRow label="Eligibility" value={programme.eligibility || 'Details to be confirmed'} /><div className={panel}><h2 className="font-serif text-2xl">What this programme aims to do</h2><p className="mt-3 leading-7 text-[#68746a]">{programme.objectives}</p></div></div></div>
    {programme.applicationOpen && <form onSubmit={submit} className={`${panel} mt-10 max-w-3xl`}><h2 className="font-serif text-2xl">Apply to participate</h2><p className="mt-2 text-sm text-[#68746a]">Application details are stored locally in this prototype.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><FormField label="Full name" name="name" required /><FormField label="Email" name="email" type="email" required /><FormField label="Phone" name="phone" type="tel" required /><label className="text-sm sm:col-span-2">Why are you interested?<textarea name="motivation" required rows={4} className={inputClass} /></label></div>{message && <p role="status" className="mt-4 text-sm text-[#405d47]">{message}</p>}<button className={`${button} mt-5`}>Submit application <ArrowRight className="h-4 w-4" /></button></form>}
    {!programme.applicationOpen && <div className="mt-8 rounded-2xl bg-[#eaece2] p-6"><p className="font-semibold">Applications are not open.</p><p className="mt-2 text-sm text-[#68746a]">We will show application details here only when this programme is accepting applications.</p></div>}
    <button className={`${outlineButton} mt-8`} onClick={() => navigate('/foundation/our-work#programmes')}><ArrowLeft className="h-4 w-4" /> All programmes</button>
  </FoundationPage>
}

function StoriesPage({ state }: { state: FoundationState }) {
  const stories = state.stories.filter((story) => story.status === 'Published' && story.consentStatus === 'Confirmed')
  return <FoundationPage eyebrow="Stories of change" title="Stories that remind us why we do this." intro="We share stories only when people have given informed consent and the story has been reviewed for publication.">
    {stories.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{stories.map((story) => <Link key={story.id} to={`/foundation/stories/${story.slug}`} className={`${panel} overflow-hidden p-0`}><img src={story.coverImage || heroImage} alt="" className="h-64 w-full object-cover" /><div className="p-6"><p className="text-xs uppercase tracking-[.15em] text-[#718071]">{formatDate(story.publicationDate)} · Shared with consent</p><h2 className="mt-3 font-serif text-2xl">{story.title}</h2><p className="mt-3 text-sm leading-6 text-[#68746a]">{story.introduction}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#24483b]">Read story <ArrowRight className="h-4 w-4" /></span></div></Link>)}</div> : <div className="grid gap-8 rounded-[1.5rem] bg-[#eaece2] p-7 sm:grid-cols-[.75fr_1.25fr] sm:p-10"><div><BookOpen className="h-8 w-8 text-[#24483b]" /><h2 className="mt-4 font-serif text-3xl">The journal is waiting for stories shared with care.</h2></div><div><p className="leading-7 text-[#59665b]">No stories have been approved for public sharing yet. We will not invent participant experiences, quotes or achievements. Stories will be published only after consent is confirmed and the person or community featured has had a chance to review their story.</p><Link to="/foundation/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#24483b]">Ask about story consent <ArrowRight className="h-4 w-4" /></Link></div></div>}
  </FoundationPage>
}

function StoryDetail({ state }: { state: FoundationState }) {
  const { slug } = useParams()
  const story = state.stories.find((item) => item.slug === slug && item.status === 'Published' && item.consentStatus === 'Confirmed')
  if (!story) return <FoundationPage eyebrow="Stories" title="This story is not available." intro="We publish stories only after editorial review and consent confirmation."><Link to="/foundation/stories" className={button}>Back to stories</Link></FoundationPage>
  return <article id="main-content" className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-16"><Link to="/foundation/stories" className="inline-flex items-center gap-2 text-sm text-[#536057]"><ArrowLeft className="h-4 w-4" /> All stories</Link><header className="mx-auto max-w-3xl py-10"><p className="text-xs uppercase tracking-[.18em] text-[#718071]">A story shared with consent · {formatDate(story.publicationDate)}</p><h1 className="mt-5 font-serif text-4xl leading-tight tracking-[-.04em] sm:text-6xl">{story.title}</h1><p className="mt-5 text-xl leading-8 text-[#68746a]">{story.introduction}</p><p className="mt-5 text-sm text-[#68746a]">Words by {story.author || 'Leafy Foundation'}</p></header><img src={story.coverImage || heroImage} alt="" className="max-h-[650px] w-full rounded-[1.5rem] object-cover" /><div className="prose prose-lg mx-auto mt-10 max-w-3xl whitespace-pre-line leading-8 text-[#435248]">{story.body}</div><ClosingStory /></article>
}

function GetInvolvedPage({ state, update }: { state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void }) {
  const ways = [
    ['Volunteer', 'Offer time, skills or experience when a suitable opportunity is confirmed.', '#volunteer', <Users key="icon" className="h-5 w-5" />],
    ['Become a partner', 'Explore a responsible collaboration aligned with community priorities.', '#partners', <HeartHandshake key="icon" className="h-5 w-5" />],
    ['Support our work', 'Discuss non-financial support and responsible collaboration.', '#support', <Sprout key="icon" className="h-5 w-5" />],
    ['Community events', 'Find activities that are confirmed and accepting registrations.', '#events', <CalendarDays key="icon" className="h-5 w-5" />],
  ] as const
  const events = state.events.filter((event) => event.registrationOpen
    && state.eventRegistrations.filter((registration) => registration.eventId === event.id).length < event.capacity)
  return <FoundationPage eyebrow="Get involved" title="There is a place for you in this story." intro="Meaningful participation begins by listening. Choose a practical way to contribute or find a community activity.">
    <nav aria-label="Ways to get involved" className="mb-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{ways.map(([title, description, href, icon]) => <a key={title} href={href} className={`${panel} group flex gap-4 transition hover:-translate-y-1`}><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaece2] text-[#24483b]">{icon}</span><span><strong className="font-serif text-xl">{title}</strong><span className="mt-2 block text-sm leading-6 text-[#68746a]">{description}</span></span></a>)}</nav>
    <VolunteerSection state={state} update={update} />
    <PartnershipSection />
    <section id="events" className="scroll-mt-28 border-t border-[#e4e6df] pt-12"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#718071]">Community activities</p><h2 className="mt-3 font-serif text-3xl">Events and opportunities to meet.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#68746a]">Registration is shown only for confirmed activities that are open and have remaining capacity.</p>{events.length ? <div className="mt-6 space-y-4">{events.map((event) => <EventCard key={event.id} event={event} state={state} update={update} />)}</div> : <p className="mt-5 rounded-2xl bg-[#eaece2] p-6 text-sm leading-7 text-[#59665b]">No events are currently open for registration.</p>}</section>
    <SupportSection />
  </FoundationPage>
}

function SupportSection() {
  return <section id="support" className="scroll-mt-28 mt-12 grid gap-8 rounded-[1.5rem] bg-[#24483b] p-7 text-white sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-white/65">Support the work</p><h2 className="mt-3 font-serif text-3xl">Bring time, skills or resources to the conversation.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">Financial contributions are not currently an active service. Contact the Foundation to discuss expertise, resources or a potential partnership. No payment can be made through this website.</p></div><Link to="/foundation/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f3f0e5] px-5 py-3 text-sm font-semibold text-[#24483b] hover:bg-white">Ask how to help <ArrowRight className="h-4 w-4" /></Link></section>
}

function VolunteerSection({ state, update }: { state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void }) {
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const myApplications = state.participant.email
    ? state.volunteerApplications.filter((application) => application.email.toLowerCase() === state.participant.email.toLowerCase())
    : []
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const application: FoundationVolunteerApplication = {
      id: foundationId('volunteer'), fullName: String(data.get('name')).trim(),
      email: String(data.get('email')).trim(), phone: String(data.get('phone')).trim(),
      location: String(data.get('location')).trim(),
      interests: data.getAll('interest').map(String),
      skills: String(data.get('skills')).trim(), availability: String(data.get('availability')).trim(),
      motivation: String(data.get('motivation')).trim(),
      supportingFileName: (data.get('document') as File | null)?.name ?? '',
      privacyConsent: data.get('privacy') === 'on', status: 'Submitted', createdAt: timestamp(),
    }
    if (!application.privacyConsent || !application.interests.length) {
      setError(!application.interests.length ? 'Select at least one area of interest.' : 'Consent is required before submitting.')
      return
    }
    update((current) => ({
      ...current,
      participant: { name: application.fullName, email: application.email, phone: application.phone, location: application.location },
      volunteerApplications: [application, ...current.volunteerApplications],
    }))
    setError('')
    setNotice('Your application is saved in this browser prototype. It has not been sent to a Foundation team.')
    form.reset()
  }
  return <section id="volunteer" className="scroll-mt-28 border-t border-[#e4e6df] py-12"><div className="mb-7 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#718071]">Volunteer with us</p><h2 className="mt-3 font-serif text-3xl">Bring your skills. Learn from the community.</h2><p className="mt-3 text-sm leading-7 text-[#68746a]">Tell us what you care about and how you might contribute. An application is not a promise of placement; opportunities depend on confirmed programmes.</p></div>
    <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]"><aside className="space-y-5"><div className="rounded-[1.4rem] bg-[#24483b] p-7 text-white"><p className="text-xs uppercase tracking-[.18em] text-white/65">Before you apply</p><h2 className="mt-3 font-serif text-3xl">Participation starts with listening.</h2><p className="mt-4 text-sm leading-7 text-white/75">We will ask about your skills, interests and availability so we can have a thoughtful conversation if a relevant opportunity is available.</p></div><div className={`${panel} border-amber-300 bg-amber-50`}><h3 className="font-semibold">Prototype privacy notice</h3><p className="mt-2 text-sm text-amber-950">Applications are stored in this browser only. Do not enter real personal information; a secure application service and official privacy notice are not configured.</p></div><div className={panel}><h3 className="font-semibold">Your application status</h3><p className="mt-2 text-sm text-[#68746a]">{myApplications.length ? `You have ${myApplications.length} application(s) saved in this browser.` : 'No applications are recorded for this profile in this browser.'}</p>{myApplications.map((application) => <p key={application.id} className="mt-3 rounded-xl bg-[#eff1e9] p-3 text-sm">{application.status} · {formatDate(application.createdAt)}</p>)}</div></aside>
    <form onSubmit={submit} className={`${panel} grid gap-4 sm:grid-cols-2`}><FormField label="Full name" name="name" required /><FormField label="Email address" name="email" type="email" required /><FormField label="Phone number" name="phone" type="tel" required /><FormField label="Location" name="location" required /><fieldset className="sm:col-span-2"><legend className="mb-2 text-sm font-medium">Areas of interest</legend><div className="grid gap-2 sm:grid-cols-2">{['Learning support', 'Youth development', 'Community initiatives', 'Environmental work', 'Communications', 'Events and logistics'].map((interest) => <label key={interest} className="flex items-center gap-2 rounded-xl bg-[#f6f6f1] p-3 text-sm"><input type="checkbox" name="interest" value={interest} />{interest}</label>)}</div></fieldset><label className="text-sm sm:col-span-2">Skills and experience<textarea name="skills" rows={3} className={inputClass} required /></label><FormField label="Availability" name="availability" placeholder="Days, times or hours" required /><label className="text-sm">Supporting document (optional · file name only in this prototype)<input name="document" type="file" className={`${inputClass} file:mr-3 file:border-0 file:bg-transparent`} /></label><label className="text-sm sm:col-span-2">Why would you like to volunteer?<textarea name="motivation" rows={4} required className={inputClass} /></label><label className="flex items-start gap-3 text-sm leading-6 sm:col-span-2"><input name="privacy" type="checkbox" required className="mt-1" /><span>I understand this prototype stores application details in this browser only and will not submit real personal information.</span></label>{error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}{notice && <p role="status" className="text-sm text-[#405d47] sm:col-span-2">{notice}</p>}<button className={`${button} sm:col-span-2`}>Submit volunteer application <ArrowRight className="h-4 w-4" /></button></form></div>
  </section>
}

function PartnershipSection() {
  return <section id="partners" className="scroll-mt-28 border-t border-[#e4e6df] py-12"><div className="mb-7 max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[#718071]">Partners & supporters</p><h2 className="mt-3 font-serif text-3xl">Better work is built through thoughtful collaboration.</h2><p className="mt-3 text-sm leading-7 text-[#68746a]">Partnerships should align with community priorities, shared values and clear accountability.</p></div>
    <div className="grid gap-10 md:grid-cols-[1fr_.85fr]"><div className="space-y-5 text-[#59665b]"><p className="leading-8">We welcome conversations with organisations and individuals who bring relevant expertise, resources and a commitment to working respectfully alongside communities.</p><p className="leading-8">No partner organisations are listed yet because confirmed partnerships and approved logos have not been supplied. We will only publish partners after permission and collaboration details are confirmed.</p><Link to="/foundation/contact" className={button}>Start a partnership conversation <ArrowRight className="h-4 w-4" /></Link></div><div className="rounded-[1.5rem] bg-[#eaece2] p-7"><h2 className="font-serif text-2xl">What we look for</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-[#59665b]">{['A shared commitment to dignity and inclusion', 'Clear goals and responsibilities', 'Community participation in decisions', 'Transparent resourcing and accountability', 'Respect for privacy, consent and local context'].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#507152]" />{item}</li>)}</ul></div></div>
  </section>
}

function ContactPage() {
  const [sent, setSent] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }
  return <FoundationPage eyebrow="Contact" title="Start a conversation." intro="Share a question, an idea or the kind of support you would like to offer.">
    <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]"><aside className="rounded-[1.5rem] bg-[#24483b] p-7 text-white"><h2 className="font-serif text-3xl">We begin by listening.</h2><p className="mt-4 leading-7 text-white/75">Call <a className="font-semibold text-white underline underline-offset-2" href="tel:+254746593987">0746 593 987</a> or email <a className="font-semibold text-white underline underline-offset-2" href="mailto:info@leafyinnovations.com">info@leafyinnovations.com</a>. The form below is a prototype and will not send a message.</p><div className="mt-7 flex gap-3 text-sm text-white/80"><CircleHelp className="h-5 w-5 shrink-0" />For a response, contact Leafy directly by phone or email.</div></aside><form onSubmit={submit} className={`${panel} grid gap-4 sm:grid-cols-2`}><FormField label="Your name" name="name" required /><FormField label="Email address" name="email" type="email" required /><label className="text-sm sm:col-span-2">What would you like to discuss?<select className={inputClass}><option>General question</option><option>Volunteering</option><option>Partnership</option><option>Community initiative</option><option>Story consent</option></select></label><label className="text-sm sm:col-span-2">Message<textarea required rows={6} className={inputClass} /></label>{sent && <p role="status" className="text-sm text-[#405d47] sm:col-span-2">Your message has not been sent or saved; a verified contact service is not configured.</p>}<button className={`${button} sm:col-span-2`}>Preview message (not sent) <ArrowRight className="h-4 w-4" /></button></form></div>
  </FoundationPage>
}

function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const isPrivacy = kind === 'privacy'
  return <FoundationPage
    eyebrow={isPrivacy ? 'Privacy' : 'Terms'}
    title={isPrivacy ? 'Privacy information' : 'Website terms'}
    intro={isPrivacy
      ? 'The Foundation’s approved privacy policy has not been provided. This page is a notice about this prototype, not a substitute for that policy.'
      : 'The Foundation’s approved website terms have not been provided. This page is a status notice, not a legal agreement.'}
  >
    <section className={`${panel} max-w-3xl`}>
      <h2 className="font-serif text-2xl">{isPrivacy ? 'Please do not enter real personal information.' : 'This website is an unconnected prototype.'}</h2>
      {isPrivacy
        ? <p className="mt-4 leading-7 text-[#59665b]">Some Foundation forms save prototype entries in local browser storage on this device. The entries are not sent to Foundation staff, but this storage is not a secure application service. A verified privacy policy, retention process and secure service must be provided before these forms are used for real participant information.</p>
        : <p className="mt-4 leading-7 text-[#59665b]">Programme applications, volunteer submissions, event registrations and profile details are browser-only demonstrations. They do not create a confirmed application, registration, service commitment or legal relationship with Leafy Foundation. Official terms and operating details must be supplied and reviewed before launch.</p>}
      <p className="mt-4 leading-7 text-[#59665b]">For questions about this notice, use the contact page. Its message form is also a preview and does not send or store messages.</p>
      <Link to="/foundation/contact" className={`${outlineButton} mt-6`}>Contact the Foundation <ArrowRight className="h-4 w-4" /></Link>
    </section>
  </FoundationPage>
}

function ParticipantWorkspace({ state, update }: { state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void }) {
  const participantEmail = state.participant.email.trim().toLowerCase()
  const volunteerApplications = state.volunteerApplications.filter((application) => application.email.toLowerCase() === participantEmail && participantEmail)
  const programmeApplications = state.programmeApplications.filter((application) => application.email.toLowerCase() === participantEmail && participantEmail)
  const applications = [
    ...volunteerApplications.map((item) => ({ id: item.id, name: 'Volunteer application', status: item.status, date: item.createdAt })),
    ...programmeApplications.map((item) => ({ id: item.id, name: state.programmes.find((program) => program.id === item.programmeId)?.name ?? 'Programme application', status: item.status, date: item.createdAt })),
  ]
  return <FoundationPage eyebrow="Participant space" title={`Welcome${state.participant.name ? `, ${state.participant.name.split(' ')[0]}` : ''}.`} intro="Your Foundation applications and event registrations are gathered here. This local preview is not connected to shared Leafy authentication.">
    <div className="mb-6 flex flex-wrap gap-2"><Link to="/auth/login?returnTo=%2Ffoundation%2Fparticipant" className={outlineButton}>Shared Leafy sign in</Link><Link to="/auth/register" className={button}>Create Leafy account</Link><Link to="/foundation/get-involved#volunteer" className={outlineButton}>Volunteer</Link></div>
    <div className="grid gap-5 md:grid-cols-3"><StatCard label="Volunteer applications" value={state.volunteerApplications.length} /><StatCard label="Programme applications" value={state.programmeApplications.length} /><StatCard label="Upcoming events" value={state.events.filter((event) => event.registrationOpen).length} /></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-2"><div className={panel}><h2 className="font-serif text-2xl">Your applications</h2><div className="mt-4 space-y-3">{applications.length ? applications.map((item) => <div key={item.id} className="flex justify-between gap-3 border-b border-[#e8e9e2] py-3 text-sm"><span>{item.name}<small className="mt-1 block text-[#718071]">{formatDate(item.date)}</small></span><StatusPill status={item.status} /></div>) : <p className="text-sm text-[#68746a]">No applications are associated with this profile in this browser.</p>}</div></div><div className={panel}><h2 className="font-serif text-2xl">Your profile</h2><form className="mt-4 grid gap-3" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); update((current) => ({ ...current, participant: { name: String(data.get('name')), email: String(data.get('email')), phone: String(data.get('phone')), location: String(data.get('location')) } })) }}><FormField label="Full name" name="name" defaultValue={state.participant.name} required /><FormField label="Email" name="email" type="email" defaultValue={state.participant.email} required /><FormField label="Phone" name="phone" type="tel" defaultValue={state.participant.phone} /><FormField label="Location" name="location" defaultValue={state.participant.location} /><button className={`${button} mt-2`}>Save profile</button></form></div></div>
    <div id="activities" className={`${panel} mt-6 scroll-mt-28`}><h2 className="font-serif text-2xl">Upcoming activities</h2>{state.events.filter((event) => event.registrationOpen).length ? state.events.filter((event) => event.registrationOpen).map((event) => <EventCard key={event.id} event={event} state={state} update={update} />) : <p className="mt-3 text-sm text-[#68746a]">There are no confirmed events open for registration at this time.</p>}</div>
  </FoundationPage>
}

function FoundationManagement({ state, update }: { state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void }) {
  const [tab, setTab] = useState('Overview')
  const [role, setRole] = useState<FoundationRole>(state.role)
  const [message, setMessage] = useState('')
  const roles: FoundationRole[] = ['foundation-admin', 'programme-manager', 'programme-coordinator', 'volunteer-coordinator', 'communications-officer', 'finance-officer', 'content-editor', 'super-admin']
  const canEditProgrammes = ['foundation-admin', 'programme-manager', 'programme-coordinator', 'super-admin'].includes(role)
  const canReviewVolunteers = ['foundation-admin', 'volunteer-coordinator', 'super-admin'].includes(role)
  const canEditStories = ['foundation-admin', 'communications-officer', 'content-editor', 'super-admin'].includes(role)
  const canManageImpact = ['foundation-admin', 'programme-manager', 'super-admin'].includes(role)
  const canSeeFinance = ['finance-officer', 'super-admin'].includes(role)
  const setWorkspaceRole = (nextRole: FoundationRole) => {
    setRole(nextRole)
    update((current) => ({ ...current, role: nextRole }))
  }
  return <main id="main-content" className="mx-auto min-h-[65vh] max-w-[1500px] px-4 py-7 sm:px-7 lg:px-10">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#718071]">Private workspace · not linked in public navigation</p><h1 className="mt-2 font-serif text-4xl">Foundation administration</h1></div><Link to="/foundation" className={outlineButton}>Public site</Link></div>
    <div role="note" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>Prototype access notice.</strong> Role selection below only previews interface permissions; it is not authentication or authorization. Do not enter real participant, financial or confidential records. Server-side identity and access controls are required before launch.</div>
    <div className="mb-5 flex flex-wrap items-center gap-3"><label className="text-sm font-medium">Preview workspace role<select value={role} onChange={(event) => setWorkspaceRole(event.target.value as FoundationRole)} className="ml-3 rounded-xl border border-[#d6ddd4] bg-white px-3 py-2">{(['participant', ...roles] as FoundationRole[]).map((item) => <option key={item} value={item}>{item.replaceAll('-', ' ')}</option>)}</select></label><span className="text-xs text-[#68746a]">Role matrix preview · enforcement requires backend</span></div>
    <div className="grid gap-5 lg:grid-cols-[230px_1fr]"><nav className={`${panel} flex gap-2 overflow-x-auto p-2 lg:block lg:space-y-1`}>{['Overview', 'Programmes', 'Stories', 'Applications', 'Impact', 'Events', 'Content'].map((item) => <button key={item} onClick={() => setTab(item)} className={`shrink-0 rounded-xl px-3 py-2 text-left text-sm lg:block lg:w-full ${tab === item ? 'bg-[#24483b] text-white' : 'text-[#536057] hover:bg-[#eff1e9]'}`}>{item}</button>)}{canSeeFinance && <button onClick={() => setTab('Contributions')} className={`shrink-0 rounded-xl px-3 py-2 text-left text-sm lg:block lg:w-full ${tab === 'Contributions' ? 'bg-[#24483b] text-white' : 'text-[#536057] hover:bg-[#eff1e9]'}`}>Foundation contributions</button>}</nav>
      <section className="min-w-0">
        {tab === 'Overview' && <div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Confirmed active programmes" value={state.programmes.filter((p) => p.status === 'Active').length} /><StatCard label="Applications" value={state.programmeApplications.length} /><StatCard label="Volunteer applications" value={state.volunteerApplications.length} /><StatCard label="Verified impact indicators" value={state.impactIndicators.filter((item) => item.verificationStatus === 'Verified').length} /></div><div className={`${panel} mt-5`}><h2 className="font-serif text-2xl">Recent activity</h2><p className="mt-3 text-sm text-[#68746a]">No central activity log is connected. Records shown in this prototype are stored only in this browser.</p></div></div>}
        {tab === 'Programmes' && (canEditProgrammes ? <ProgrammeAdmin state={state} update={update} message={message} setMessage={setMessage} /> : <PermissionMessage />)}
        {tab === 'Stories' && (canEditStories ? <StoryAdmin state={state} update={update} message={message} setMessage={setMessage} /> : <PermissionMessage />)}
        {tab === 'Applications' && (canReviewVolunteers ? <ApplicationsAdmin state={state} update={update} /> : <PermissionMessage />)}
        {tab === 'Impact' && (canManageImpact ? <ImpactAdmin state={state} update={update} /> : <PermissionMessage />)}
        {tab === 'Events' && (canEditProgrammes ? <EventsAdmin state={state} update={update} /> : <PermissionMessage />)}
        {tab === 'Content' && <ContentAdmin state={state} update={update} />}
        {tab === 'Contributions' && canSeeFinance && <div className={panel}><h2 className="font-serif text-2xl">Foundation contributions</h2><p className="mt-3 text-sm text-[#68746a]">No transaction records are stored. Payment callbacks and financial data require a verified backend; central Leafy financial data is not available in this portal.</p></div>}
      </section>
    </div>
  </main>
}

function ContentAdmin({ state, update }: { state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void }) {
  const [notice, setNotice] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const values = String(data.get('values')).split(/\r?\n/).map((value) => value.trim()).filter(Boolean)
    if (!values.length) {
      setNotice('Add at least one Foundation value.')
      return
    }
    update((current) => ({
      ...current,
      profile: {
        heroHeadline: String(data.get('heroHeadline')).trim(),
        heroIntroduction: String(data.get('heroIntroduction')).trim(),
        mission: String(data.get('mission')).trim(),
        vision: String(data.get('vision')).trim(),
        values,
      },
    }))
    setNotice('Foundation profile updated in this browser prototype. No server-side content was published.')
  }
  return <form onSubmit={submit} className={`${panel} grid gap-4 sm:grid-cols-2`}>
    <div className="sm:col-span-2"><h2 className="font-serif text-2xl">Homepage & Foundation profile</h2><p className="mt-2 text-sm leading-6 text-[#68746a]">Changes appear in this browser only. Production content management requires authenticated staff, review history and an audit log.</p></div>
    <label className="text-sm sm:col-span-2">Homepage headline<input name="heroHeadline" defaultValue={state.profile.heroHeadline} required className={inputClass} /></label>
    <label className="text-sm sm:col-span-2">Homepage introduction<textarea name="heroIntroduction" defaultValue={state.profile.heroIntroduction} rows={3} required className={inputClass} /></label>
    <label className="text-sm">Mission<textarea name="mission" defaultValue={state.profile.mission} rows={4} required className={inputClass} /></label>
    <label className="text-sm">Vision<textarea name="vision" defaultValue={state.profile.vision} rows={4} required className={inputClass} /></label>
    <label className="text-sm sm:col-span-2">Values (one per line)<textarea name="values" defaultValue={state.profile.values.join('\n')} rows={6} required className={inputClass} /></label>
    {notice && <p role="status" className="text-sm text-[#405d47] sm:col-span-2">{notice}</p>}
    <button className={`${button} sm:col-span-2`}>Save Foundation profile <Check className="h-4 w-4" /></button>
  </form>
}

function ProgrammeAdmin({ state, update, message, setMessage }: { state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void; message: string; setMessage: (value: string) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name')).trim()
    const programme: FoundationProgramme = { id: foundationId('programme'), slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`, name, description: String(data.get('description')), objectives: String(data.get('objectives')), targetParticipants: String(data.get('target')), location: String(data.get('location')), status: String(data.get('status')) as FoundationProgramme['status'], startDate: String(data.get('start')), endDate: String(data.get('end')), eligibility: String(data.get('eligibility')), applicationOpen: data.get('applicationOpen') === 'on', focusAreaId: String(data.get('focusArea')), image: '', coordinator: String(data.get('coordinator')) }
    update((current) => ({ ...current, programmes: [programme, ...current.programmes] }))
    setMessage('Programme saved to this browser prototype. It is not published to a server.')
    event.currentTarget.reset()
  }
  return <div className="space-y-5"><form onSubmit={submit} className={`${panel} grid gap-4 sm:grid-cols-2`}><h2 className="font-serif text-2xl sm:col-span-2">Create programme</h2><FormField label="Programme name" name="name" required /><FormField label="Location" name="location" /><FormField label="Target participants" name="target" /><FormField label="Coordinator" name="coordinator" /><label className="text-sm">Status<select name="status" className={inputClass}><option>Upcoming</option><option>Active</option><option>Completed</option><option>Archived</option></select></label><label className="text-sm">Focus area<select name="focusArea" className={inputClass}>{foundationFocusAreas.map((area) => <option key={area.id} value={area.id}>{area.title}</option>)}</select></label><FormField label="Start date" name="start" type="date" /><FormField label="End date" name="end" type="date" /><label className="text-sm sm:col-span-2">Description<textarea name="description" rows={3} required className={inputClass} /></label><label className="text-sm sm:col-span-2">Objectives<textarea name="objectives" rows={3} required className={inputClass} /></label><label className="text-sm sm:col-span-2">Eligibility<textarea name="eligibility" rows={2} className={inputClass} /></label><label className="flex items-center gap-2 text-sm sm:col-span-2"><input name="applicationOpen" type="checkbox" /> Applications open</label>{message && <p role="status" className="text-sm text-[#405d47] sm:col-span-2">{message}</p>}<button className={`${button} sm:col-span-2`}>Save programme <Check className="h-4 w-4" /></button></form><div className={panel}><h2 className="font-serif text-2xl">Programme records</h2>{state.programmes.length ? state.programmes.map((programme) => <div key={programme.id} className="flex flex-wrap items-center justify-between gap-3 border-b py-3 text-sm"><span><strong>{programme.name}</strong><small className="ml-2 text-[#68746a]">{programme.status}</small></span><button className="text-red-700" onClick={() => update((current) => ({ ...current, programmes: current.programmes.filter((item) => item.id !== programme.id) }))}>Delete</button></div>) : <p className="mt-3 text-sm text-[#68746a]">No programme records yet.</p>}</div></div>
}

function StoryAdmin({ state, update, message, setMessage }: { state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void; message: string; setMessage: (value: string) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const title = String(data.get('title')).trim()
    const story: FoundationStory = { id: foundationId('story'), slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`, title, introduction: String(data.get('introduction')), body: String(data.get('body')), author: String(data.get('author')), featured: data.get('featured') === 'on', publicationDate: String(data.get('date')), consentStatus: data.get('consent') === 'on' ? 'Confirmed' : 'Pending', status: String(data.get('status')) as FoundationStory['status'], coverImage: String(data.get('image')), programmeId: String(data.get('programme')) }
    if (story.status === 'Published' && story.consentStatus !== 'Confirmed') {
      setMessage('A story cannot be published until consent is confirmed.')
      return
    }
    update((current) => ({ ...current, stories: [story, ...current.stories] }))
    setMessage('Story saved to this browser prototype.')
    event.currentTarget.reset()
  }
  return <div className="space-y-5"><form onSubmit={submit} className={`${panel} grid gap-4 sm:grid-cols-2`}><h2 className="font-serif text-2xl sm:col-span-2">Story editor</h2><FormField label="Story title" name="title" required /><FormField label="Author" name="author" /><FormField label="Publication date" name="date" type="date" /><FormField label="Cover image URL" name="image" type="url" /><label className="text-sm sm:col-span-2">Introduction<textarea name="introduction" rows={2} required className={inputClass} /></label><label className="text-sm sm:col-span-2">Story body<textarea name="body" rows={7} required className={inputClass} /></label><label className="text-sm">Related programme<select name="programme" className={inputClass}><option value="">None</option>{state.programmes.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select></label><label className="text-sm">Editorial status<select name="status" className={inputClass}><option>Draft</option><option>Review</option><option>Published</option></select></label><label className="flex items-center gap-2 text-sm"><input name="consent" type="checkbox" /> Consent to public sharing confirmed</label><label className="flex items-center gap-2 text-sm"><input name="featured" type="checkbox" /> Feature on homepage</label>{message && <p role="status" className="text-sm text-[#405d47] sm:col-span-2">{message}</p>}<button className={`${button} sm:col-span-2`}>Save story <Check className="h-4 w-4" /></button></form><div className={panel}><h2 className="font-serif text-2xl">Stories & consent</h2>{state.stories.length ? state.stories.map((story) => <div key={story.id} className="flex flex-wrap justify-between gap-3 border-b py-3 text-sm"><span><strong>{story.title}</strong><small className="ml-2 text-[#68746a]">{story.status} · Consent {story.consentStatus}</small></span><button onClick={() => update((current) => ({ ...current, stories: current.stories.filter((item) => item.id !== story.id) }))} className="text-red-700">Delete</button></div>) : <p className="mt-3 text-sm text-[#68746a]">No stories have been entered.</p>}</div></div>
}

function ApplicationsAdmin({ state, update }: { state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void }) {
  const setStatus = (id: string, status: ApplicationStatus) => update((current) => ({ ...current, volunteerApplications: current.volunteerApplications.map((item) => item.id === id ? { ...item, status } : item) }))
  const setProgrammeStatus = (id: string, status: ApplicationStatus) => update((current) => ({ ...current, programmeApplications: current.programmeApplications.map((item) => item.id === id ? { ...item, status } : item) }))
  const statuses: ApplicationStatus[] = ['Submitted', 'Under Review', 'More Information Required', 'Approved', 'Rejected', 'Withdrawn']
  return <div className="space-y-5"><div className={panel}><h2 className="font-serif text-2xl">Volunteer applications</h2><p className="mt-2 text-sm text-[#68746a]">Personal application data is local to this browser and should not be used for real participants.</p>{state.volunteerApplications.length ? state.volunteerApplications.map((application) => <article key={application.id} className="mt-4 rounded-xl border border-[#e6e8df] p-4"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-semibold">{application.fullName}</h3><p className="text-sm text-[#68746a]">{application.email} · {application.phone} · {application.location}</p></div><select value={application.status} onChange={(event) => setStatus(application.id, event.target.value as ApplicationStatus)} className="rounded-lg border px-3 py-2 text-sm">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><p className="mt-3 text-sm">{application.motivation}</p><p className="mt-2 text-xs text-[#68746a]">Interests: {application.interests.join(', ')} · Availability: {application.availability}</p></article>) : <p className="mt-4 text-sm text-[#68746a]">No volunteer applications have been saved.</p>}</div><div className={panel}><h2 className="font-serif text-2xl">Programme applications</h2>{state.programmeApplications.length ? state.programmeApplications.map((application) => <article key={application.id} className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e6e8df] p-4"><div><h3 className="font-semibold">{state.programmes.find((programme) => programme.id === application.programmeId)?.name ?? 'Programme application'}</h3><p className="text-sm text-[#68746a]">{application.participantName} · {application.email} · {application.phone}</p><p className="mt-2 text-sm">{application.motivation}</p></div><select value={application.status} onChange={(event) => setProgrammeStatus(application.id, event.target.value as ApplicationStatus)} className="rounded-lg border px-3 py-2 text-sm">{statuses.map((status) => <option key={status}>{status}</option>)}</select></article>) : <p className="mt-4 text-sm text-[#68746a]">No programme applications have been saved.</p>}</div></div>
}

function ImpactAdmin({ state, update }: { state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void }) {
  const [notice, setNotice] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const indicator: FoundationImpactIndicator = { id: foundationId('impact'), name: String(data.get('name')), description: String(data.get('description')), value: data.get('value') ? Number(data.get('value')) : null, unit: String(data.get('unit')), reportingPeriod: String(data.get('period')), evidenceSource: String(data.get('evidence')), verificationStatus: 'Pending', updatedAt: timestamp() }
    update((current) => ({ ...current, impactIndicators: [indicator, ...current.impactIndicators] }))
    setNotice('Indicator saved as Pending. Only verified indicators appear in the public impact page.')
    event.currentTarget.reset()
  }
  return <div className="space-y-5"><form onSubmit={submit} className={`${panel} grid gap-4 sm:grid-cols-2`}><h2 className="font-serif text-2xl sm:col-span-2">Add impact indicator</h2><FormField label="Indicator" name="name" required /><FormField label="Value (optional)" name="value" type="number" /><FormField label="Unit" name="unit" placeholder="people, sessions…" /><FormField label="Reporting period" name="period" required /><label className="text-sm sm:col-span-2">Description<textarea name="description" required rows={2} className={inputClass} /></label><FormField label="Evidence source" name="evidence" required /><button className={`${button} sm:col-span-2`}>Save as pending verification</button>{notice && <p role="status" className="text-sm text-[#405d47] sm:col-span-2">{notice}</p>}</form><div className={panel}><h2 className="font-serif text-2xl">Verification queue</h2>{state.impactIndicators.length ? state.impactIndicators.map((indicator) => <div key={indicator.id} className="flex flex-wrap items-center justify-between gap-3 border-b py-3"><span className="text-sm"><strong>{indicator.name}</strong><small className="ml-2 text-[#68746a]">{indicator.reportingPeriod} · {indicator.evidenceSource}</small></span>{indicator.verificationStatus === 'Pending' ? <div className="flex gap-2"><button className={outlineButton + ' px-3 py-2'} onClick={() => update((current) => ({ ...current, impactIndicators: current.impactIndicators.map((item) => item.id === indicator.id ? { ...item, verificationStatus: 'Verified' } : item) }))}>Verify</button><button className="px-3 text-sm text-red-700" onClick={() => update((current) => ({ ...current, impactIndicators: current.impactIndicators.map((item) => item.id === indicator.id ? { ...item, verificationStatus: 'Rejected' } : item) }))}>Reject</button></div> : <StatusPill status={indicator.verificationStatus} />}</div>) : <p className="mt-3 text-sm text-[#68746a]">No indicators submitted.</p>}</div></div>
}

function EventsAdmin({ state, update }: { state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const record = { id: foundationId('event'), title: String(data.get('title')), description: String(data.get('description')), date: String(data.get('date')), venue: String(data.get('venue')), capacity: Number(data.get('capacity')), registrationOpen: data.get('open') === 'on' }
    update((current) => ({ ...current, events: [record, ...current.events] }))
    event.currentTarget.reset()
  }
  return <div className="space-y-5"><form onSubmit={submit} className={`${panel} grid gap-4 sm:grid-cols-2`}><h2 className="font-serif text-2xl sm:col-span-2">Create community event</h2><FormField label="Title" name="title" required /><FormField label="Date and time" name="date" type="datetime-local" required /><FormField label="Venue" name="venue" required /><FormField label="Capacity" name="capacity" type="number" required /><label className="text-sm sm:col-span-2">Description<textarea name="description" required rows={3} className={inputClass} /></label><label className="flex items-center gap-2 text-sm"><input name="open" type="checkbox" /> Open registration</label><button className={`${button} sm:col-span-2`}>Save event</button></form><div className={panel}><h2 className="font-serif text-2xl">Events & registrations</h2>{state.events.length ? state.events.map((event) => <div key={event.id} className="flex justify-between gap-4 border-b py-3 text-sm"><span>{event.title}<small className="block text-[#68746a]">{state.eventRegistrations.filter((registration) => registration.eventId === event.id).length} registrations · {formatDate(event.date)}</small></span></div>) : <p className="mt-3 text-sm text-[#68746a]">No events have been added.</p>}</div></div>
}

function EventCard({ event, state, update }: { event: FoundationState['events'][number]; state: FoundationState; update: (operation: (current: FoundationState) => FoundationState) => void }) {
  const [notice, setNotice] = useState('')
  const registered = state.eventRegistrations.some((registration) => registration.eventId === event.id && registration.email.toLowerCase() === state.participant.email.toLowerCase())
  const submit = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault()
    const data = new FormData(formEvent.currentTarget)
    const email = String(data.get('email')).trim().toLowerCase()
    if (state.eventRegistrations.filter((registration) => registration.eventId === event.id).length >= event.capacity) {
      setNotice('This event has reached its listed capacity.')
      return
    }
    const alreadyRegistered = state.eventRegistrations.some((registration) => registration.eventId === event.id && registration.email.toLowerCase() === email)
    if (alreadyRegistered) {
      setNotice('This email is already registered for the event.')
      return
    }
    update((current) => ({ ...current, eventRegistrations: [...current.eventRegistrations, { id: foundationId('registration'), eventId: event.id, name: String(data.get('name')), email, registeredAt: timestamp() }] }))
    setNotice('Registration saved in this browser prototype; no confirmation was sent.')
  }
  return <article className="mt-4 rounded-xl border border-[#e6e8df] p-4"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-semibold">{event.title}</h3><p className="mt-1 text-sm text-[#68746a]"><CalendarDays className="mr-1 inline h-4 w-4" />{formatDate(event.date)} · {event.venue}</p></div><span className="text-xs text-[#68746a]">{state.eventRegistrations.filter((item) => item.eventId === event.id).length}/{event.capacity} places</span></div><p className="mt-2 text-sm text-[#68746a]">{event.description}</p>{registered ? <p className="mt-3 text-sm text-[#405d47]">You are registered for this event.</p> : <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><input name="name" required defaultValue={state.participant.name} placeholder="Full name" className={inputClass} /><input name="email" type="email" required defaultValue={state.participant.email} placeholder="Email" className={inputClass} /><button className={button}>Register</button></form>}{notice && <p role="status" className="mt-3 text-sm text-[#68746a]">{notice}</p>}</article>
}

function ClosingStory() {
  return <section className="bg-[#eaece2]"><div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#718071]">The next chapter is shared</p><h2 className="mt-5 max-w-4xl font-serif text-4xl leading-tight tracking-[-.04em] sm:text-6xl">The future is not something we wait for. It is something we build together.</h2><div className="mt-8 flex flex-wrap items-end justify-between gap-6"><p className="max-w-xl leading-7 text-[#59665b]">Every opportunity can open a door. Every act of support can create possibilities. Every person has something meaningful to contribute.</p><Link to="/foundation/get-involved" className={button}>Become part of the change <ArrowRight className="h-4 w-4" /></Link></div></div></section>
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-[#dfe2d9] pb-3"><p className="text-xs uppercase tracking-[.12em] text-[#718071]">{label}</p><p className="mt-1 font-medium">{value}</p></div>
}

function StatCard({ label, value }: { label: string; value: number }) {
  return <div className={panel}><p className="text-sm text-[#68746a]">{label}</p><p className="mt-3 font-serif text-4xl text-[#24483b]">{value}</p></div>
}

function StatusPill({ status }: { status: string }) {
  return <span className="text-xs font-medium text-[#405247]">{status}</span>
}

const inputClass = 'mt-1.5 w-full rounded-xl border border-[#d9ded6] bg-white px-3.5 py-3 text-sm outline-none transition focus:border-[#52735c]'

function FormField({ label, name, type = 'text', placeholder, required = false, defaultValue }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean; defaultValue?: string }) {
  return <label className="block text-sm font-medium">{label}<input name={name} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue} className={inputClass} /></label>
}

function PermissionMessage() {
  return <div className={`${panel} py-12 text-center`}><ShieldCheck className="mx-auto h-8 w-8 text-[#24483b]" /><h2 className="mt-4 font-serif text-2xl">This workspace role does not have access.</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#68746a]">Only the relevant staff role should see these records. This is a front-end role preview only; a production system must enforce permissions on the server.</p></div>
}
