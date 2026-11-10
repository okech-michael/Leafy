import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Building2,
  Eye,
  Handshake,
  Lightbulb,
  Microscope,
  Sprout,
  Store,
  TrendingUp,
  UtensilsCrossed,
  UsersRound,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import heroVideoSrc from './assets/leafy-brand-intro-silent.mp4'
import { LeafyLogo } from './LeafyLogo'

const divisions = [
  {
    to: '/farms',
    name: 'Leafy Farms',
    description: 'Explore farm production, producer support, resources and practical services connected to agricultural work.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa52ac9fcf7a?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Rows of crops growing in a green agricultural field',
    icon: Sprout,
    tone: 'from-[#0B3D2E] to-[#2EBB57]',
    note: 'Farm records and sample programmes are prototypes, not live agricultural services.',
  },
  {
    to: '/foods',
    name: 'Leafy Foods',
    description: 'Discover food products, categories and food-sector activity through the current product catalogue.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'A colourful selection of prepared food and fresh ingredients',
    icon: UtensilsCrossed,
    tone: 'from-[#4B5E56] to-[#2EBB57]',
    note: 'Product photos and prices are illustrative, not confirmation of current stock.',
  },
  {
    to: '/academy',
    name: 'Leafy Academy',
    description: 'Explore practical courses and learning resources for agriculture, enterprise and related skills.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Learners sharing ideas around a table',
    icon: BookOpen,
    tone: 'from-[#0B3D2E] to-[#4B5E56]',
    note: 'Course and learner records are illustrative prototypes, not verified live programmes.',
  },
  {
    to: '/market',
    name: 'Leafy Market',
    description: 'Browse product categories and example seller profiles in Leafy’s agricultural marketplace.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Fresh vegetables arranged at a produce market',
    icon: Store,
    tone: 'from-[#F57C00] to-[#2EBB57]',
    note: 'Listings and sellers are illustrative. Live verification, payments and fulfilment are not connected.',
  },
]

const solutions = [
  {
    icon: Eye,
    title: 'Visibility',
    description: 'Give agricultural and food ideas a clearer place to be seen and explored.',
  },
  {
    icon: Handshake,
    title: 'Connections',
    description: 'Bring innovators, mentors, researchers, businesses and organisations closer together.',
  },
  {
    icon: Lightbulb,
    title: 'Opportunities',
    description: 'Make it easier to discover relevant people, knowledge and possible next steps.',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    description: 'Support learning and collaboration as promising ideas continue to develop.',
  },
]

const audiences = [
  {
    icon: Lightbulb,
    title: 'Innovators',
    description: 'Introduce an agricultural or food idea and help others understand the problem it addresses.',
  },
  {
    icon: TrendingUp,
    title: 'Investors',
    description: 'Explore an emerging field and learn about ideas and teams that may align with your interests.',
  },
  {
    icon: UsersRound,
    title: 'Mentors',
    description: 'Share experience, practical knowledge or guidance with people developing new solutions.',
  },
  {
    icon: Building2,
    title: 'Organisations',
    description: 'Find areas of shared interest and explore possible partnerships or programme connections.',
  },
  {
    icon: Microscope,
    title: 'Researchers and institutions',
    description: 'Connect research, learning and evidence with real questions across agriculture and food.',
  },
  {
    icon: Store,
    title: 'Businesses and other stakeholders',
    description: 'Discover relevant products, ideas and people across the wider agricultural community.',
  },
]

const journey = [
  { number: '01', title: 'Discover', description: 'Explore ideas, people, learning and activity across Leafy.' },
  { number: '02', title: 'Connect', description: 'Find innovators and others with relevant experience or interests.' },
  { number: '03', title: 'Collaborate', description: 'Start conversations and explore practical ways to work together.' },
  { number: '04', title: 'Grow', description: 'Keep learning and help ideas move toward their next stage.' },
]

function RevealSection({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function SectionHeading({ eyebrow, title, description, inverse = false }: { eyebrow: string; title: string; description?: string; inverse?: boolean }) {
  const headingColor = inverse ? 'text-white' : 'text-[#0B3D2E]'
  const descriptionColor = inverse ? 'text-white/75' : 'text-[#4B5E56]'
  const eyebrowColor = inverse ? 'text-[#78D88B]' : 'text-[#0B3D2E]'

  return (
    <div className="mb-10 max-w-3xl">
      <p className={`text-sm font-semibold uppercase tracking-[0.16em] ${eyebrowColor}`}>{eyebrow}</p>
      <h2 className={`mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] ${headingColor} sm:text-4xl lg:text-5xl`}>{title}</h2>
      {description && <p className={`mt-4 max-w-2xl text-base leading-7 ${descriptionColor}`}>{description}</p>}
    </div>
  )
}

export function HomepageContent() {
  return (
    <main className="overflow-x-hidden bg-[#F7F9F4] text-[#0B3D2E]">
      <section aria-labelledby="homepage-title" className="relative isolate flex min-h-[calc(100svh-76px)] items-center overflow-hidden text-white">
        <video className="absolute inset-0 -z-10 h-full w-full object-cover" autoPlay muted loop playsInline aria-hidden="true">
          <source src={heroVideoSrc} type="video/mp4" />
        </video>
        <div className="mx-auto w-full max-w-7xl px-5 py-24 text-center sm:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.65)]">Ideas for a better food and farming future</p>
            <h1 id="homepage-title" className="mx-auto mt-5 max-w-5xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.045em] [text-shadow:0_3px_18px_rgba(0,0,0,0.65)] sm:text-6xl lg:text-7xl">
              Where Agricultural Innovations Meet Opportunity.
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.7)] sm:text-lg sm:leading-8">
              Leafy brings agricultural and food innovators together with investors, mentors, partners and organisations. We help promising ideas gain visibility, build meaningful connections and find opportunities to grow.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#ecosystem" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0B3D2E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#164f3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B3D2E]">
                Explore Innovations <ArrowDownRight className="h-4 w-4" />
              </a>
              <NavLink to="/auth/register" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/80 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B3D2E]">
                Join Leafy
              </NavLink>
            </div>
          </motion.div>
        </div>
      </section>

      <RevealSection className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F57C00]">Why Leafy exists</p>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#0B3D2E] sm:text-4xl lg:text-5xl">
            Good ideas should be easier to find — and easier to move forward.
          </h2>
          <p className="mt-6 text-base leading-7 text-[#4B5E56]">
            Across farming and food systems, people are developing useful ideas, solutions and new ways of working. Many struggle to get noticed, meet the right people, find practical knowledge or reach organisations that could help.
          </p>
          <p className="mt-4 text-base leading-7 text-[#4B5E56]">
            Leafy exists to help bridge that gap. It brings discovery, learning and connections into one place, so people can explore what is happening and consider a meaningful next step.
          </p>
          <Link to="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#0B3D2E] underline decoration-[#2EBB57] decoration-2 underline-offset-4 hover:text-[#247947]">
            Read about Leafy <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] bg-[#0B3D2E] sm:min-h-[390px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D2E] via-[#174E37] to-[#2EBB57]" />
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
            alt="People working together and sharing ideas"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
            onError={(event) => { event.currentTarget.style.display = 'none' }}
          />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/25 bg-[#0B3D2E]/85 p-5 text-white backdrop-blur-sm sm:inset-x-7 sm:bottom-7 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9BE3A7]">A place to start</p>
            <p className="mt-2 text-lg font-medium leading-7 sm:text-xl">Make an idea visible. Find people who care about the same challenges.</p>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="How Leafy helps"
            title="A practical bridge between ideas and the people around them."
            description="Leafy is being built around four useful ways to help agricultural and food ideas find a path forward."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map(({ icon: Icon, title, description }, index) => (
              <motion.article key={title} whileHover={{ y: -4 }} className="rounded-2xl border border-[#E3EAE3] bg-[#F7F9F4] p-6">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${index === 0 ? 'bg-[#E5F5E9] text-[#0B3D2E]' : index === 1 ? 'bg-[#FFF0E1] text-[#A84D00]' : 'bg-white text-[#0B3D2E]'}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-[#0B3D2E]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4B5E56]">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection id="ecosystem" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Explore the Leafy ecosystem"
            title="Four connected spaces. Start with what matters to you."
            description="Each division has a different focus. Explore its landing page to see the resources and experiences currently available."
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {divisions.map(({ to, name, description, image, imageAlt, icon: Icon, tone, note }) => (
              <motion.article key={to} whileHover={{ y: -5 }} className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-[#DFE7DF] bg-white shadow-[0_12px_36px_rgba(11,61,46,0.06)]">
                <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${tone}`}>
                  <img
                    src={image}
                    alt={imageAlt}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(event) => { event.currentTarget.style.display = 'none' }}
                  />
                  <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0B3D2E] shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-semibold text-[#0B3D2E]">{name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-[#4B5E56]">{description}</p>
                  {note && <p className="mt-3 rounded-xl bg-[#FFF3E8] p-3 text-xs leading-5 text-[#713D12]">{note}</p>}
                  <NavLink to={to} className="mt-5 inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-[#0B3D2E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#164f3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EBB57] focus-visible:ring-offset-2">
                    Explore {name.replace('Leafy ', '')} <ArrowRight className="h-4 w-4" />
                  </NavLink>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="bg-[#0B3D2E] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Who is Leafy for?"
            title="There is room for many kinds of contribution."
            description="You do not need to be a farmer or have a finished product. If you have an idea, experience, knowledge or a relevant opportunity, you can find a place to begin."
            inverse
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 transition hover:bg-white/[0.1]">
                <Icon className="h-5 w-5 text-[#78D88B]" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="How Leafy works"
            title="A simple journey from discovery to growth."
            description="Every connection starts somewhere. Take the steps that fit your idea, your experience and what you hope to learn."
          />
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {journey.map(({ number, title, description }, index) => (
              <li key={number} className="relative rounded-2xl border border-[#DFE7DF] bg-white p-6">
                <span className="text-sm font-bold tracking-[0.14em] text-[#F57C00]">{number}</span>
                <h3 className="mt-3 text-2xl font-semibold text-[#0B3D2E]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#4B5E56]">{description}</p>
                {index < journey.length - 1 && <ArrowRight className="absolute right-5 top-6 hidden h-4 w-4 text-[#2EBB57] xl:block" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </RevealSection>

      <RevealSection className="bg-[#EAF4EA] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B3D2E]">Why take part?</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] text-[#0B3D2E] sm:text-4xl">
              Make your next connection more intentional.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#4B5E56]">
              Leafy is a place to make work easier to discover, exchange knowledge and explore collaboration across agriculture and food.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Help more people discover your idea or work.',
              'Meet people with relevant skills and experience.',
              'Find learning and resources for your next step.',
              'Explore possible partnerships and opportunities.',
            ].map((benefit) => (
              <div key={benefit} className="flex min-h-24 items-start gap-3 rounded-2xl bg-white p-5">
                <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2EBB57]" />
                <p className="text-sm font-medium leading-6 text-[#0B3D2E]">{benefit}</p>
              </div>
            ))}
            <p className="sm:col-span-2 text-xs leading-5 text-[#4B5E56]">
              Leafy does not guarantee funding, investment, partnerships or commercial success. Some account, marketplace and connection features are still in development.
            </p>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 rounded-[2rem] bg-[#0B3D2E] px-6 py-10 text-white sm:px-10 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#78D88B]">Be part of what comes next</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">
              Every Great Innovation Deserves an Opportunity.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
              Whether you have an innovation to share, knowledge to contribute or opportunities to offer, there is a place for you in the Leafy ecosystem.
            </p>
          </div>
          <div className="shrink-0">
            <NavLink to="/auth/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B3D2E] transition hover:bg-[#EAF4EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B3D2E]">
              Join Leafy <ArrowRight className="h-4 w-4" />
            </NavLink>
            <p className="mt-3 text-xs leading-5 text-white/75">Account registration is a prototype and does not yet create a live account.</p>
          </div>
        </div>
      </RevealSection>

      <footer className="border-t border-[#DFE7DF] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr] lg:px-12">
          <div>
            <Link to="/" aria-label="Leafy home" className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2EBB57] focus-visible:ring-offset-2">
              <LeafyLogo className="h-14 w-28" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#4B5E56]">
              Leafy helps agricultural and food innovators become easier to discover and connect with people who can contribute knowledge, support and opportunity.
            </p>
          </div>

          <nav aria-label="Leafy divisions">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0B3D2E]">Explore</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#4B5E56]">
              {divisions.map(({ to, name }) => <li key={to}><Link className="hover:text-[#0B3D2E] hover:underline" to={to}>{name}</Link></li>)}
            </ul>
          </nav>

          <nav aria-label="About Leafy">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0B3D2E]">About Leafy</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#4B5E56]">
              <li><Link className="hover:text-[#0B3D2E] hover:underline" to="/about">Our story</Link></li>
              <li><Link className="hover:text-[#0B3D2E] hover:underline" to="/destination">Opportunities and divisions</Link></li>
              <li><Link className="hover:text-[#0B3D2E] hover:underline" to="/auth/login">Sign in</Link></li>
              <li><Link className="hover:text-[#0B3D2E] hover:underline" to="/auth/register">Join Leafy</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0B3D2E]">Information and support</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#4B5E56]">
              <li><a className="hover:text-[#0B3D2E] hover:underline" href="tel:+254746593987">Call 0746 593 987</a></li>
              <li><a className="hover:text-[#0B3D2E] hover:underline" href="mailto:info@leafyinnovations.com">info@leafyinnovations.com</a></li>
              <li><Link className="hover:text-[#0B3D2E] hover:underline" to="/foundation/contact">Foundation contact page</Link></li>
              <li><Link className="hover:text-[#0B3D2E] hover:underline" to="/foods/support">Foods customer support</Link></li>
              <li><Link className="hover:text-[#0B3D2E] hover:underline" to="/foundation/privacy">Foundation privacy notice</Link></li>
              <li><Link className="hover:text-[#0B3D2E] hover:underline" to="/foundation/terms">Foundation website terms</Link></li>
            </ul>
            <p className="mt-4 text-xs leading-5 text-[#4B5E56]">Contact forms and legal pages describe prototype features; approved policies are not yet configured.</p>
          </div>
        </div>
        <div className="border-t border-[#DFE7DF]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 text-xs text-[#4B5E56] sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
            <span>© 2026 Leafy. All rights reserved.</span>
            <span>Some listings and services are illustrative prototypes, not verified offers.</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
