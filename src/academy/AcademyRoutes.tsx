import { useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Play,
  Search,
  Settings,
  SlidersHorizontal,
  UserRound,
  X,
} from 'lucide-react'
import {
  academyAssignments,
  academyCourses,
  academyEvents,
  canCompleteCourse,
  createActivity,
  getCertificateId,
  getCourse,
  getCourseProgress,
  getLessons,
  loadAcademyState,
  quizQuestions,
  saveAcademyState,
  type AcademyCourse,
  type AcademyState,
  type Lesson,
} from './academyStore'

const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#285342] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f4032] disabled:cursor-not-allowed disabled:opacity-50'
const secondaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-full border border-[#E6EAE5] bg-white px-4 py-2.5 text-sm font-medium text-[#285342] transition hover:border-[#285342]'
const cardClass = 'rounded-[1.5rem] border border-[#E6EAE5] bg-white p-5 shadow-[0_20px_50px_rgba(32,41,35,0.04)]'
const todayLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
const currentIsoTimestamp = () => new Date().toISOString()

const studentLinks = [
  { to: '/academy/student', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/academy/courses', label: 'Explore courses', icon: Search },
  { to: '/academy/student/my-learning', label: 'My learning', icon: BookOpen },
  { to: '/academy/student/assignments', label: 'Assignments', icon: FileText },
  { to: '/academy/student/assessments', label: 'Assessments', icon: ListChecks },
  { to: '/academy/student/progress', label: 'Learning progress', icon: SlidersHorizontal },
  { to: '/academy/student/certificates', label: 'My certificates', icon: Award },
  { to: '/academy/student/notifications', label: 'Notifications', icon: Bell },
  { to: '/academy/student/profile', label: 'My profile', icon: UserRound },
  { to: '/academy/student/settings', label: 'Settings', icon: Settings },
]

export function AcademyRoutes() {
  const [state, setState] = useState<AcademyState>(() => loadAcademyState())
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const updateState = (update: (current: AcademyState) => AcademyState) => {
    setState((current) => {
      const next = update(current)
      saveAcademyState(next)
      return next
    })
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#F6F5EF]">
      <header className="border-b border-[#E6EAE5] bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/academy/student" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#285342] text-white"><GraduationCap className="h-5 w-5" /></span>
            <span><span className="block font-semibold text-[#202923]">Leafy Academy</span><span className="block text-xs text-[#6B756E]">Student learning space</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/academy/student/notifications" aria-label="Notifications" className="relative rounded-full border border-[#E6EAE5] p-2.5 text-[#285342]">
              <Bell className="h-4 w-4" />
              {state.notifications.some((notification) => !notification.read) && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#d26945]" />}
            </Link>
            <Link to="/academy/student/profile" className="hidden items-center gap-2 rounded-full bg-[#EDF4EA] py-1.5 pl-1.5 pr-4 text-sm font-medium text-[#285342] sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#285342] text-xs font-semibold text-white">{initials(state.profile.name)}</span>{state.profile.name}
            </Link>
            <button type="button" className="rounded-full border border-[#E6EAE5] p-2.5 lg:hidden" aria-label="Open student navigation" onClick={() => setMobileNavOpen((open) => !open)}>
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[245px_minmax(0,1fr)] lg:px-8">
        <aside className={`${mobileNavOpen ? 'block' : 'hidden'} h-fit rounded-[1.5rem] border border-[#E6EAE5] bg-white p-3 lg:sticky lg:top-24 lg:block`}>
          <nav className="space-y-1">
            {studentLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} onClick={() => setMobileNavOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-[#285342] text-white' : 'text-[#58645d] hover:bg-[#F0F5EF] hover:text-[#285342]'}`}>
                <Icon className="h-4 w-4" />{label}
                {label === 'Notifications' && state.notifications.some((notification) => !notification.read) && <span className="ml-auto h-2 w-2 rounded-full bg-[#d26945]" />}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 border-t border-[#E6EAE5] pt-3">
            <Link to="/academy" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#58645d] hover:bg-[#F0F5EF]"><ArrowLeft className="h-4 w-4" /> Academy home</Link>
            <Link to="/auth/login" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#58645d] hover:bg-[#F0F5EF]"><LogOut className="h-4 w-4" /> Sign out</Link>
          </div>
        </aside>

        <div className="min-w-0">
          <Routes>
            <Route path="student" element={<StudentDashboard state={state} />} />
            <Route path="courses" element={<CourseCatalogue />} />
            <Route path="courses/:courseId" element={<CourseDetails state={state} updateState={updateState} />} />
            <Route path="student/my-learning" element={<MyLearning state={state} />} />
            <Route path="learn/:courseId/:lessonId" element={<LearningRoom state={state} updateState={updateState} />} />
            <Route path="assessments/:courseId" element={<QuizPage state={state} updateState={updateState} />} />
            <Route path="student/assignments" element={<AssignmentsPage state={state} updateState={updateState} />} />
            <Route path="student/assessments" element={<AssessmentHistory state={state} />} />
            <Route path="student/progress" element={<ProgressPage state={state} />} />
            <Route path="student/certificates" element={<CertificatesPage state={state} />} />
            <Route path="student/certificates/:courseId" element={<CertificatePage state={state} />} />
            <Route path="student/notifications" element={<NotificationsPage state={state} updateState={updateState} />} />
            <Route path="student/profile" element={<ProfilePage state={state} updateState={updateState} />} />
            <Route path="student/settings" element={<SettingsPage state={state} updateState={updateState} />} />
            <Route path="*" element={<Navigate to="/academy/student" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function StudentDashboard({ state }: { state: AcademyState }) {
  const enrolled = state.enrolments.map((enrolment) => ({ enrolment, course: getCourse(enrolment.courseId) })).filter((item): item is { enrolment: typeof state.enrolments[number]; course: AcademyCourse } => Boolean(item.course))
  const inProgress = enrolled.filter(({ enrolment }) => enrolment.status === 'active')
  const completed = enrolled.filter(({ enrolment }) => enrolment.status === 'completed')
  const certificates = completed.filter(({ course }) => canCompleteCourse(course, state)).length
  const upcoming = academyAssignments.filter((assignment) => enrolled.some(({ course }) => course.id === assignment.courseId) && !state.assignmentSubmissions.some((submission) => submission.assignmentId === assignment.id)).slice(0, 3)
  const liveActivities = academyEvents.filter((activity) => enrolled.some(({ course }) => course.id === activity.courseId))
  const recommended = academyCourses.filter((course) => !state.enrolments.some((enrolment) => enrolment.courseId === course.id)).slice(0, 3)

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 rounded-[1.75rem] bg-[#285342] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-sm text-[#DCE8E1]">{todayLabel}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, {state.profile.name.split(' ')[0]}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#E4EFE7]">Every lesson is a step toward something meaningful. Pick up where you left off or find your next course.</p>
          <Link to="/academy/courses" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#A4C68C] px-5 py-3 text-sm font-semibold text-[#1B2C24] hover:bg-[#bfd9a9]">Explore courses <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <span className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl font-semibold sm:flex">{initials(state.profile.name)}</span>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={BookOpen} label="Enrolled courses" value={String(enrolled.length)} />
        <Metric icon={CheckCircle2} label="Courses completed" value={String(completed.length)} />
        <Metric icon={Clock3} label="Learning hours" value={(state.learningMinutes / 60).toFixed(1)} />
        <Metric icon={Award} label="Certificates earned" value={String(certificates)} />
      </section>

      <section>
        <SectionHeading title="Continue learning" action={<Link className="text-sm font-semibold text-[#285342]" to="/academy/student/my-learning">View all <ArrowRight className="ml-1 inline h-4 w-4" /></Link>} />
        {inProgress.length === 0 ? <EmptyState title="Ready for a new learning journey?" detail="Browse the catalogue and enrol in a course to get started." action={<Link className={buttonClass} to="/academy/courses">Explore courses</Link>} /> : (
          <div className="grid gap-4 lg:grid-cols-2">
            {inProgress.map(({ enrolment, course }) => {
              const lesson = getLessons(course).find((item) => item.id === enrolment.lastLessonId) ?? getLessons(course)[0]
              return <CourseProgressCard key={course.id} course={course} state={state} action={<Link className={buttonClass} to={`/academy/learn/${course.id}/${lesson.id}`}>Continue learning <ArrowRight className="h-4 w-4" /></Link>} />
            })}
          </div>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div>
          <SectionHeading title="My learning" action={<Link className="text-sm font-semibold text-[#285342]" to="/academy/student/my-learning">View all <ArrowRight className="ml-1 inline h-4 w-4" /></Link>} />
          <div className="grid gap-3 sm:grid-cols-2">
            {enrolled.slice(0, 4).map(({ enrolment, course }) => <CourseMiniCard key={course.id} course={course} state={state} status={enrolment.status} />)}
            {enrolled.length === 0 && <p className={`${cardClass} text-sm text-[#6B756E]`}>You haven’t enrolled in a course yet.</p>}
          </div>
        </div>
        <div>
          <SectionHeading title="Upcoming activities" action={<Link className="text-sm font-semibold text-[#285342]" to="/academy/student/assignments">Assignments</Link>} />
          <div className={`${cardClass} space-y-3`}>
            {upcoming.map((assignment) => <Link key={assignment.id} to="/academy/student/assignments" className="block rounded-xl bg-[#F6F5EF] p-3 hover:bg-[#EDF4EA]"><p className="font-medium text-[#202923]">{assignment.title}</p><p className="mt-1 text-xs text-[#6B756E]">Due {formatDate(assignment.dueAt)}</p></Link>)}
            {liveActivities.map((activity) => <Link key={activity.id} to="/academy/student/notifications" className="block rounded-xl bg-[#F6F5EF] p-3 hover:bg-[#EDF4EA]"><p className="font-medium text-[#202923]">{activity.title}</p><p className="mt-1 text-xs text-[#6B756E]">{formatDate(activity.startsAt)} · {activity.format}</p></Link>)}
            {upcoming.length === 0 && liveActivities.length === 0 && <p className="text-sm text-[#6B756E]">No upcoming activities. Great work!</p>}
            <Link to="/academy/student/notifications" className="flex items-center gap-2 border-t border-[#E6EAE5] pt-3 text-sm font-medium text-[#285342]"><Bell className="h-4 w-4" /> Academy announcements</Link>
            <Link to="/academy/student/assessments" className="flex items-center gap-2 border-t border-[#E6EAE5] pt-3 text-sm font-medium text-[#285342]"><CircleHelp className="h-4 w-4" /> Review assessments and results</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeading title="Recommended for you" action={<Link className="text-sm font-semibold text-[#285342]" to="/academy/courses">Browse catalogue</Link>} />
          <div className="grid gap-3">{recommended.map((course) => <CourseMiniCard key={course.id} course={course} state={state} />)}{recommended.length === 0 && <p className={`${cardClass} text-sm text-[#6B756E]`}>You’ve explored every course currently available.</p>}</div>
        </div>
        <div>
          <SectionHeading title="Recent activity" />
          <div className={`${cardClass} space-y-4`}>
            {state.activity.slice(0, 5).map((activity) => <div key={activity.id} className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#39845A]" /><div><p className="text-sm text-[#202923]">{activity.detail}</p><p className="mt-1 text-xs text-[#6B756E]">{relativeDate(activity.createdAt)}</p></div></div>)}
            {state.activity.length === 0 && <p className="text-sm text-[#6B756E]">Your learning activity will appear here.</p>}
          </div>
        </div>
      </section>
    </div>
  )
}

function CourseCatalogue() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All categories')
  const [level, setLevel] = useState('All levels')
  const [duration, setDuration] = useState('Any duration')
  const [type, setType] = useState('All courses')
  const [sort, setSort] = useState('Relevance')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const categories = ['All categories', ...new Set(academyCourses.map((course) => course.category))]

  let courses = academyCourses.filter((course) => {
    const text = `${course.title} ${course.description} ${course.instructor} ${course.category}`.toLowerCase()
    return text.includes(search.toLowerCase())
      && (category === 'All categories' || course.category === category)
      && (level === 'All levels' || course.level === level)
      && (duration === 'Any duration' || (duration === 'Under 3 hours' ? course.durationHours < 3 : duration === '3–5 hours' ? course.durationHours >= 3 && course.durationHours <= 5 : course.durationHours > 5))
      && (type === 'All courses' || (type === 'Free' ? course.price === 0 : course.price > 0))
  })
  if (sort === 'Newest') courses = [...courses].reverse()
  if (sort === 'Popularity') courses = [...courses].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  if (sort === 'Relevance' && search) courses = [...courses].sort((a, b) => Number(b.title.toLowerCase().includes(search.toLowerCase())) - Number(a.title.toLowerCase().includes(search.toLowerCase())))

  return (
    <div className="space-y-6">
      <PageIntro eyebrow="Leafy Academy catalogue" title="Find a course that moves you forward" description="Explore practical learning designed for healthier communities, sustainable agriculture and lifelong growth." />
      <div className={`${cardClass} space-y-4`}>
        <label className="flex items-center gap-3 rounded-xl border border-[#E6EAE5] px-4"><Search className="h-4 w-4 text-[#6B756E]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses, skills or instructors" className="w-full bg-transparent py-3 text-sm outline-none" /></label>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <SelectField label="Category" value={category} onChange={setCategory} options={categories} />
          <SelectField label="Skill level" value={level} onChange={setLevel} options={['All levels', 'Beginner', 'Intermediate', 'Advanced']} />
          <SelectField label="Duration" value={duration} onChange={setDuration} options={['Any duration', 'Under 3 hours', '3–5 hours', 'Over 5 hours']} />
          <SelectField label="Course type" value={type} onChange={setType} options={['All courses', 'Free', 'Paid']} />
          <SelectField label="Sort by" value={sort} onChange={setSort} options={['Relevance', 'Newest', 'Popularity']} />
        </div>
        <div className="flex items-center justify-between border-t border-[#E6EAE5] pt-3">
          <p className="text-sm text-[#6B756E]">{courses.length} course{courses.length === 1 ? '' : 's'} available</p>
          <div className="flex gap-2"><button type="button" aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')} className={`${secondaryButtonClass} px-3 py-2 ${layout === 'grid' ? 'bg-[#EDF4EA]' : ''}`}>Grid</button><button type="button" aria-pressed={layout === 'list'} onClick={() => setLayout('list')} className={`${secondaryButtonClass} px-3 py-2 ${layout === 'list' ? 'bg-[#EDF4EA]' : ''}`}>List</button><button type="button" onClick={() => { setSearch(''); setCategory('All categories'); setLevel('All levels'); setDuration('Any duration'); setType('All courses'); setSort('Relevance') }} className="text-sm font-medium text-[#285342]">Clear filters</button></div>
        </div>
      </div>
      {academyCourses.length === 0 ? <EmptyState title="No courses available" detail="New academy courses will be listed here when they are published." /> : courses.length === 0 ? <EmptyState title="No courses match those filters" detail="Try a different search or clear your filters to see all available courses." action={<button className={secondaryButtonClass} onClick={() => { setSearch(''); setCategory('All categories'); setLevel('All levels'); setDuration('Any duration'); setType('All courses') }}>Clear filters</button>} /> :
        <div className={layout === 'grid' ? 'grid gap-5 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
          {courses.map((course) => <CatalogueCard key={course.id} course={course} list={layout === 'list'} />)}
        </div>}
    </div>
  )
}

function CourseDetails({ state, updateState }: { state: AcademyState; updateState: (update: (current: AcademyState) => AcademyState) => void }) {
  const { courseId = '' } = useParams()
  const course = getCourse(courseId)
  const navigate = useNavigate()
  const [paymentNotice, setPaymentNotice] = useState('')
  if (!course) return <EmptyState title="Course not found" detail="This course may no longer be available." action={<Link className={buttonClass} to="/academy/courses">Back to catalogue</Link>} />
  const enrolment = state.enrolments.find((item) => item.courseId === course.id)
  const totalLessons = getLessons(course).length
  const start = () => {
    const first = getLessons(course)[0]
    if (!first) return
    navigate(`/academy/learn/${course.id}/${enrolment?.lastLessonId ?? first.id}`)
  }
  const enrolFree = () => {
    if (course.price !== 0 || enrolment) return
    const first = getLessons(course)[0]
    if (!first) return
    updateState((current) => ({
      ...current,
      enrolments: [...current.enrolments, { courseId: course.id, enrolledAt: new Date().toISOString(), status: 'active', lastLessonId: first.id, lastAccessedAt: new Date().toISOString() }],
      activity: [createActivity(`Enrolled in ${course.title}`), ...current.activity],
      notifications: [{ id: crypto.randomUUID(), title: 'Course enrolment confirmed', detail: `You are enrolled in ${course.title}. Your learning journey is ready.`, createdAt: new Date().toISOString(), href: `/academy/courses/${course.id}`, read: false }, ...current.notifications],
    }))
  }

  return (
    <div className="space-y-6">
      <Link to="/academy/courses" className="inline-flex items-center gap-2 text-sm font-medium text-[#285342]"><ArrowLeft className="h-4 w-4" /> Course catalogue</Link>
      <section className="overflow-hidden rounded-[1.75rem] border border-[#E6EAE5] bg-white">
        <div className="relative h-64 sm:h-80"><CourseCover src={course.image} alt="" className="absolute inset-0" /><div className="absolute inset-0 bg-gradient-to-t from-[#202923]/80 to-transparent" /><div className="absolute bottom-0 p-6 text-white sm:p-8"><span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{course.category} · {course.level}</span><h1 className="mt-4 max-w-3xl text-3xl font-semibold sm:text-5xl">{course.title}</h1></div></div>
        <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_300px] sm:p-8">
          <div>
            <p className="text-lg leading-8 text-[#4c5a51]">{course.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">{[['Duration', `${course.durationHours} hours`], ['Modules', String(course.modules.length)], ['Lessons', String(totalLessons)], ['Language', course.language]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#F6F5EF] p-3"><p className="text-xs text-[#6B756E]">{label}</p><p className="mt-1 font-semibold text-[#202923]">{value}</p></div>)}</div>
            <h2 className="mt-8 text-2xl font-semibold text-[#202923]">What you’ll learn</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">{course.outcomes.map((outcome) => <li key={outcome} className="flex gap-2 text-sm leading-6 text-[#4c5a51]"><Check className="mt-1 h-4 w-4 shrink-0 text-[#39845A]" />{outcome}</li>)}</ul>
            <h2 className="mt-8 text-2xl font-semibold text-[#202923]">Course curriculum</h2>
            <div className="mt-4 space-y-3">{course.modules.map((module, index) => <details key={module.id} open={index === 0} className="rounded-xl border border-[#E6EAE5]"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-semibold text-[#202923]"><span>{index + 1}. {module.title}</span><span className="text-xs font-normal text-[#6B756E]">{module.lessons.length} lessons · {module.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0)} min</span></summary><div className="space-y-2 border-t border-[#E6EAE5] p-3">{module.lessons.map((lesson) => <div key={lesson.id} className="flex items-center justify-between rounded-lg bg-[#F6F5EF] p-3 text-sm"><span>{lesson.title}</span><span className="flex items-center gap-3 text-xs text-[#6B756E]">{lesson.minutes} min{lesson.preview && <Link className="font-semibold text-[#285342]" to={`/academy/learn/${course.id}/${lesson.id}`}>Preview</Link>}</span></div>)}</div></details>)}</div>
            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-[#F0F5EF] p-5"><span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dce9d5] text-sm font-semibold text-[#285342]">{initials(course.instructor)}<img src={course.instructorImage} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-[#39845A]">Your instructor</p><p className="mt-1 text-lg font-semibold text-[#202923]">{course.instructor}</p><p className="mt-1 text-sm text-[#6B756E]">{course.instructorBio}</p></div></div>
          </div>
          <aside className="h-fit rounded-2xl border border-[#E6EAE5] bg-[#F6F5EF] p-5 lg:sticky lg:top-24">
            <p className="text-sm text-[#6B756E]">Course access</p><p className="mt-1 text-3xl font-semibold text-[#202923]">{course.price === 0 ? 'Free' : `KSh ${course.price.toLocaleString()}`}</p>
            <p className="mt-3 text-sm leading-6 text-[#6B756E]">{course.prerequisites}</p>
            {enrolment ? <div className="mt-5 space-y-3"><p className="rounded-xl bg-[#EDF4EA] p-3 text-sm font-medium text-[#285342]">{enrolment.status === 'completed' ? 'Course completed' : 'You’re enrolled in this course.'}</p><button className={buttonClass + ' w-full'} onClick={start}>{enrolment.status === 'completed' ? 'Review course' : 'Start learning'} <ArrowRight className="h-4 w-4" /></button></div> : course.price === 0 ? <button className={buttonClass + ' mt-5 w-full'} onClick={enrolFree}>Enrol now <ArrowRight className="h-4 w-4" /></button> : <div className="mt-5 space-y-3"><p className="text-xs leading-5 text-[#6B756E]">Checkout is not connected yet. No payment will be requested or enrolment confirmed. M-Pesa Daraja integration can be connected here.</p><button className={secondaryButtonClass + ' w-full'} onClick={() => setPaymentNotice('Payment is not available in this frontend preview. Your account has not been charged and you have not been enrolled.')}>Continue to payment</button>{paymentNotice && <p role="status" className="rounded-xl bg-[#fff4e8] p-3 text-xs leading-5 text-[#7b4a1b]">{paymentNotice}</p>}</div>}
            <div className="mt-5 space-y-2 border-t border-[#E6EAE5] pt-4 text-sm text-[#58645d]"><p>✓ Lifetime course access</p><p>✓ Downloadable learning resources</p><p>✓ Certificate after completion</p></div>
          </aside>
        </div>
      </section>
    </div>
  )
}

function MyLearning({ state }: { state: AcademyState }) {
  const [tab, setTab] = useState<'In Progress' | 'Not Started' | 'Completed'>('In Progress')
  const list = state.enrolments.map((enrolment) => ({ enrolment, course: getCourse(enrolment.courseId) })).filter((item): item is { enrolment: typeof state.enrolments[number]; course: AcademyCourse } => Boolean(item.course))
  const filtered = list.filter(({ enrolment, course }) => tab === 'Completed' ? enrolment.status === 'completed' : tab === 'In Progress' ? enrolment.status === 'active' && getCourseProgress(course, state) > 0 : enrolment.status === 'active' && getCourseProgress(course, state) === 0)
  return <div className="space-y-6"><PageIntro eyebrow="Your courses" title="My learning" description="Pick up a lesson, check your progress or revisit a completed course." /><div className="flex flex-wrap gap-2">{(['In Progress', 'Not Started', 'Completed'] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-sm font-medium ${tab === item ? 'bg-[#285342] text-white' : 'border border-[#E6EAE5] bg-white text-[#4c5a51]'}`}>{item} <span className="ml-1 opacity-70">({list.filter(({ enrolment, course }) => item === 'Completed' ? enrolment.status === 'completed' : item === 'In Progress' ? enrolment.status === 'active' && getCourseProgress(course, state) > 0 : enrolment.status === 'active' && getCourseProgress(course, state) === 0).length})</span></button>)}</div>{filtered.length === 0 ? <EmptyState title={`No ${tab.toLowerCase()} courses`} detail={tab === 'Completed' ? 'Your certificates will appear here when you complete an eligible course.' : 'Explore the catalogue to find your next course.'} action={<Link to="/academy/courses" className={buttonClass}>Explore courses</Link>} /> : <div className="grid gap-4 lg:grid-cols-2">{filtered.map(({ enrolment, course }) => <CourseProgressCard key={course.id} course={course} state={state} action={tab === 'Completed' ? <Link className={secondaryButtonClass} to={`/academy/student/certificates/${course.id}`}>View certificate <Award className="h-4 w-4" /></Link> : <Link className={buttonClass} to={`/academy/learn/${course.id}/${enrolment.lastLessonId}`}>{tab === 'Not Started' ? 'Start course' : 'Continue learning'} <ArrowRight className="h-4 w-4" /></Link>} />)}</div>}</div>
}

function LearningRoom({ state, updateState }: { state: AcademyState; updateState: (update: (current: AcademyState) => AcademyState) => void }) {
  const { courseId = '', lessonId = '' } = useParams()
  const course = getCourse(courseId)
  const enrolment = state.enrolments.find((item) => item.courseId === courseId)
  const navigate = useNavigate()
  const lessons = course ? getLessons(course) : []
  const activeIndex = lessons.findIndex((lesson) => lesson.id === lessonId)
  const lesson = lessons[activeIndex]
  const previewOnly = !enrolment && Boolean(lesson?.preview)
  if (!course || (!enrolment && !previewOnly)) return <Navigate to={course ? `/academy/courses/${courseId}` : '/academy/courses'} replace />
  if (!lesson) return <Navigate to={`/academy/learn/${course.id}/${enrolment?.lastLessonId ?? lessons[0]?.id ?? ''}`} replace />
  const complete = state.completedLessons[course.id] ?? []
  const lessonKey = `${course.id}:${lesson.id}`
  const progress = getCourseProgress(course, state)
  const videoPosition = state.videoPositions[lessonKey] ?? 0

  const saveVideoProgress = (seconds: number) => {
    if (!enrolment) return
    updateState((current) => ({
      ...current,
      videoPositions: { ...current.videoPositions, [lessonKey]: seconds },
      enrolments: current.enrolments.map((item) => item.courseId === course.id ? { ...item, lastLessonId: lesson.id, lastAccessedAt: new Date().toISOString() } : item),
    }))
  }
  const markComplete = () => {
    if (!enrolment) return
    if (complete.includes(lesson.id)) return
    updateState((current) => {
      const next: AcademyState = {
        ...current,
        completedLessons: { ...current.completedLessons, [course.id]: [...(current.completedLessons[course.id] ?? []), lesson.id] },
        learningMinutes: current.learningMinutes + lesson.minutes,
        enrolments: current.enrolments.map((item) => item.courseId === course.id ? { ...item, lastLessonId: lesson.id, lastAccessedAt: new Date().toISOString() } : item),
        activity: [createActivity(`Completed ${lesson.title}`), ...current.activity],
      }
      const updatedCourse = getCourse(course.id)
      if (updatedCourse && canCompleteCourse(updatedCourse, next)) {
        next.enrolments = next.enrolments.map((item) => item.courseId === course.id ? { ...item, status: 'completed' } : item)
        next.notifications = [{ id: crypto.randomUUID(), title: 'Course completed', detail: `You completed ${course.title}. Your certificate is ready.`, createdAt: new Date().toISOString(), href: `/academy/student/certificates/${course.id}`, read: false }, ...next.notifications]
        next.activity = [createActivity(`Completed ${course.title} and earned a certificate`), ...next.activity]
      }
      return next
    })
  }
  const goLesson = (lessonToOpen: Lesson) => {
    if (!enrolment && !lessonToOpen.preview) return
    if (enrolment) updateState((current) => ({ ...current, enrolments: current.enrolments.map((item) => item.courseId === course.id ? { ...item, lastLessonId: lessonToOpen.id, lastAccessedAt: new Date().toISOString() } : item) }))
    navigate(`/academy/learn/${course.id}/${lessonToOpen.id}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><Link to={previewOnly ? `/academy/courses/${course.id}` : '/academy/student/my-learning'} className="inline-flex items-center gap-2 text-sm font-medium text-[#285342]"><ArrowLeft className="h-4 w-4" /> {previewOnly ? 'Course details' : 'My learning'}</Link>{!previewOnly && <Link to={`/academy/assessments/${course.id}`} className={secondaryButtonClass}>Course assessment <ListChecks className="h-4 w-4" /></Link>}</div>
      {previewOnly && <p className="rounded-xl bg-[#EDF4EA] p-3 text-sm text-[#285342]">Course preview · enrol to save progress and unlock the full curriculum.</p>}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0 overflow-hidden rounded-[1.5rem] border border-[#E6EAE5] bg-white">
          <div className="border-b border-[#E6EAE5] p-5 sm:p-7"><p className="text-xs font-semibold uppercase tracking-wider text-[#39845A]">{course.title} · Module {course.modules.findIndex((module) => module.lessons.some((item) => item.id === lesson.id)) + 1}</p><h1 className="mt-2 text-2xl font-semibold text-[#202923] sm:text-3xl">{lesson.title}</h1><p className="mt-2 text-sm text-[#6B756E]">{lesson.minutes} minutes · {lesson.kind}</p></div>
          <div className="p-5 sm:p-7">
            {lesson.kind === 'video' && <div className="mb-6 overflow-hidden rounded-xl bg-[#202923]"><video key={lesson.id} controls className="aspect-video w-full" src={lesson.videoUrl} onLoadedMetadata={(event) => { if (videoPosition > 0) event.currentTarget.currentTime = videoPosition }} onTimeUpdate={(event) => saveVideoProgress(Math.floor(event.currentTarget.currentTime))} onPause={(event) => saveVideoProgress(Math.floor(event.currentTarget.currentTime))}><track kind="captions" /></video><p className="px-3 py-2 text-xs text-white/70">Playback speed is available in the player settings. Resume position is saved in this browser.</p></div>}
            {lesson.kind === 'presentation' && lesson.slides && <SlidesViewer key={lesson.id} slides={lesson.slides} />}
            {lesson.kind === 'pdf' && lesson.contentUrl && <div className="mb-6 overflow-hidden rounded-xl border border-[#E6EAE5]"><iframe title={`${lesson.title} PDF document`} src={lesson.contentUrl} className="h-[65vh] min-h-96 w-full" /><a href={lesson.contentUrl} target="_blank" rel="noreferrer" className={`${secondaryButtonClass} m-3`}>Open or download PDF <Download className="h-4 w-4" /></a></div>}
            {lesson.kind === 'external' && lesson.contentUrl && <a href={lesson.contentUrl} target="_blank" rel="noreferrer" className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-[#E6EAE5] bg-[#F6F5EF] p-4 text-sm font-medium text-[#285342]">Open external learning resource <ArrowRight className="h-4 w-4" /></a>}
            <div className="mx-auto max-w-3xl space-y-4 text-[1.02rem] leading-8 text-[#3d4b42]">{lesson.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
            {lesson.resources.length > 0 && <div className="mx-auto mt-8 max-w-3xl rounded-xl bg-[#F6F5EF] p-4"><h2 className="font-semibold text-[#202923]">Lesson resources</h2><div className="mt-3 flex flex-wrap gap-3">{lesson.resources.map((item) => <a key={item.id} href={item.url} download={item.kind === 'download' ? `${item.id}.txt` : undefined} target={item.kind === 'link' ? '_blank' : undefined} rel={item.kind === 'link' ? 'noreferrer' : undefined} className={secondaryButtonClass}><Download className="h-4 w-4" />{item.title}</a>)}</div></div>}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E6EAE5] pt-5">
              {!previewOnly && activeIndex > 0 ? <button className={secondaryButtonClass} onClick={() => goLesson(lessons[activeIndex - 1])}><ArrowLeft className="h-4 w-4" /> Previous lesson</button> : <span />}
              {!previewOnly && <button onClick={markComplete} disabled={complete.includes(lesson.id)} className={complete.includes(lesson.id) ? secondaryButtonClass : buttonClass}>{complete.includes(lesson.id) ? <><Check className="h-4 w-4" /> Completed</> : 'Mark as complete'}</button>}
              {previewOnly ? <Link className={buttonClass} to={`/academy/courses/${course.id}`}>Enrol to continue <ArrowRight className="h-4 w-4" /></Link> : activeIndex < lessons.length - 1 ? <button className={secondaryButtonClass} onClick={() => goLesson(lessons[activeIndex + 1])}>Next lesson <ArrowRight className="h-4 w-4" /></button> : <Link className={secondaryButtonClass} to={`/academy/assessments/${course.id}`}>Take assessment <ArrowRight className="h-4 w-4" /></Link>}
            </div>
          </div>
        </article>
        <aside className="h-fit rounded-[1.5rem] border border-[#E6EAE5] bg-white p-4 xl:sticky xl:top-24">
          <h2 className="font-semibold text-[#202923]">{course.title}</h2><div className="mt-3 flex items-center justify-between text-xs text-[#6B756E]"><span>Course progress</span><span>{progress}%</span></div><ProgressBar value={progress} />
          <div className="mt-5 space-y-4">{course.modules.map((module, moduleIndex) => <div key={module.id}><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6B756E]">Module {moduleIndex + 1} · {module.title}</p><div className="space-y-1">{module.lessons.map((item) => <button key={item.id} disabled={previewOnly && !item.preview} onClick={() => goLesson(item)} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs disabled:cursor-not-allowed disabled:opacity-40 ${item.id === lesson.id ? 'bg-[#EDF4EA] font-semibold text-[#285342]' : 'text-[#4c5a51] hover:bg-[#F6F5EF]'}`}><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d6dfd8]">{complete.includes(item.id) ? <Check className="h-3 w-3" /> : item.kind === 'video' ? <Play className="h-3 w-3" /> : <FileText className="h-3 w-3" />}</span><span className="flex-1">{item.title}</span><span>{item.minutes}m</span></button>)}</div></div>)}</div>
          {!previewOnly && <Link to="/academy/student/assignments" className="mt-4 flex items-center gap-2 border-t border-[#E6EAE5] pt-4 text-sm font-medium text-[#285342]"><FileText className="h-4 w-4" /> Course assignments</Link>}
        </aside>
      </div>
    </div>
  )
}

function QuizPage({ state, updateState }: { state: AcademyState; updateState: (update: (current: AcademyState) => AcademyState) => void }) {
  const { courseId = '' } = useParams()
  const course = getCourse(courseId)
  const enrolment = state.enrolments.find((item) => item.courseId === courseId)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [attemptResult, setAttemptResult] = useState<{ score: number; pending: number; passed: boolean; correctIds: string[] } | null>(null)
  if (!course || !enrolment) return <Navigate to={course ? `/academy/courses/${courseId}` : '/academy/courses'} replace />
  const questions = quizQuestions[course.quizId] ?? []
  const gradable = questions.filter((question) => question.correct)
  const pendingCount = questions.length - gradable.length
  const attempts = state.quizAttempts.filter((attempt) => attempt.courseId === course.id)
  const hasPassed = attempts.some((attempt) => attempt.passed)
  const attemptsRemaining = Math.max(0, 3 - attempts.length)
  const question = questions[currentQuestion]
  const canSubmit = !submitted && !hasPassed && attemptsRemaining > 0

  const submit = () => {
    if (!canSubmit) return
    const correctIds = gradable.filter((item) => {
      const answer = [...(answers[item.id] ?? [])].sort().join('|')
      return answer === [...(item.correct ?? [])].sort().join('|')
    }).map((item) => item.id)
    const score = gradable.length ? Math.round((correctIds.length / gradable.length) * 100) : 0
    const passed = gradable.length > 0 && score >= 70 && pendingCount === 0
    const attempt = { id: crypto.randomUUID(), courseId: course.id, score, submittedAt: currentIsoTimestamp(), passed }
    updateState((current) => {
      const next: AcademyState = { ...current, quizAttempts: [...current.quizAttempts, attempt], activity: [createActivity(`Submitted ${course.title} assessment`), ...current.activity] }
      if (passed && canCompleteCourse(course, next)) {
        next.enrolments = next.enrolments.map((item) => item.courseId === course.id ? { ...item, status: 'completed' } : item)
        next.notifications = [{ id: crypto.randomUUID(), title: 'Course completed', detail: `You completed ${course.title}. Your certificate is ready.`, createdAt: new Date().toISOString(), href: `/academy/student/certificates/${course.id}`, read: false }, ...next.notifications]
        next.activity = [createActivity(`Completed ${course.title} and earned a certificate`), ...next.activity]
      }
      return next
    })
    setAttemptResult({ score, pending: pendingCount, passed, correctIds })
    setSubmitted(true)
  }

  return <div className="mx-auto max-w-3xl space-y-6"><Link to={`/academy/learn/${course.id}/${enrolment.lastLessonId}`} className="inline-flex items-center gap-2 text-sm font-medium text-[#285342]"><ArrowLeft className="h-4 w-4" /> Return to course</Link><PageIntro eyebrow="Course assessment" title={course.title} description="Answer each question, then submit your attempt. Written responses are saved for instructor review and are not given automatic marks." />
    {attemptResult ? <div role="status" className={`${cardClass} space-y-4`}><div className="flex items-center gap-3"><CheckCircle2 className="h-8 w-8 text-[#39845A]" /><h2 className="text-2xl font-semibold text-[#202923]">Attempt submitted</h2></div><p className="text-[#4c5a51]">Automatically graded score: <strong>{attemptResult.score}%</strong>{attemptResult.passed ? ' — passed.' : ' — 70% is required to pass.'}</p>{questions.filter((item) => item.correct).map((item) => <div key={item.id} className="rounded-xl bg-[#F6F5EF] p-3 text-sm"><p className="font-medium text-[#202923]">{item.prompt}</p><p className={`mt-1 ${attemptResult.correctIds.includes(item.id) ? 'text-[#285342]' : 'text-[#9b422b]'}`}>{attemptResult.correctIds.includes(item.id) ? 'Correct' : 'Incorrect'}. {item.explanation}</p></div>)}{attemptResult.pending > 0 && <p className="rounded-xl bg-[#fff4e8] p-3 text-sm text-[#7b4a1b]">{attemptResult.pending} written response(s) are pending instructor review. They have not been automatically marked or counted as a pass.</p>}{attemptResult.passed && <p className="rounded-xl bg-[#EDF4EA] p-3 text-sm text-[#285342]">You passed this assessment.</p>}{!attemptResult.passed && attemptsRemaining > 0 && <button className={secondaryButtonClass} onClick={() => { setAnswers({}); setCurrentQuestion(0); setAttemptResult(null); setSubmitted(false) }}>Retake assessment ({attemptsRemaining} remaining)</button>}<Link className={buttonClass} to="/academy/student/assessments">View assessment history</Link></div> : hasPassed || attemptsRemaining === 0 ? <div className={`${cardClass} space-y-4`}><h2 className="text-xl font-semibold text-[#202923]">{hasPassed ? 'Assessment passed' : 'Attempt limit reached'}</h2><p className="text-sm leading-6 text-[#6B756E]">{hasPassed ? 'You have already passed this assessment. Your passing result is saved.' : 'You used all three attempts. Contact an instructor for another attempt.'}</p><Link className={secondaryButtonClass} to="/academy/student/assessments">View assessment history</Link></div> : <div className={`${cardClass} space-y-5`}><div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#6B756E]"><span>{questions.length} questions · Pass mark 70%</span><span>{attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining</span></div><ProgressBar value={questions.length ? ((currentQuestion + 1) / questions.length) * 100 : 0} /><div className="flex flex-wrap gap-2">{questions.map((item, index) => <button key={item.id} onClick={() => setCurrentQuestion(index)} aria-current={index === currentQuestion ? 'step' : undefined} className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${index === currentQuestion ? 'bg-[#285342] text-white' : answers[item.id]?.length ? 'bg-[#EDF4EA] text-[#285342]' : 'border border-[#E6EAE5] text-[#6B756E]'}`}>{index + 1}</button>)}</div>{question && <fieldset className="min-h-56 rounded-xl border border-[#E6EAE5] p-4"><legend className="px-1 text-base font-semibold text-[#202923]">{currentQuestion + 1}. {question.prompt}</legend>{question.type === 'short' || question.type === 'long' ? <textarea value={answers[question.id]?.[0] ?? ''} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: [event.target.value] }))} rows={question.type === 'long' ? 5 : 2} className="mt-3 w-full rounded-lg border border-[#E6EAE5] p-3 text-sm outline-none focus:border-[#285342]" placeholder="Write your response for instructor review" /> : <div className="mt-3 space-y-2">{question.options?.map((option) => <label key={option} className="flex items-center gap-3 rounded-lg bg-[#F6F5EF] p-3 text-sm text-[#3d4b42]"><input type={question.type === 'multiple' ? 'checkbox' : 'radio'} name={question.id} checked={(answers[question.id] ?? []).includes(option)} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: question.type === 'multiple' ? event.target.checked ? [...(current[question.id] ?? []), option] : (current[question.id] ?? []).filter((answer) => answer !== option) : [option] }))} />{option}</label>)}</div>}</fieldset>}<div className="flex flex-wrap justify-between gap-3"><button disabled={currentQuestion === 0} className={secondaryButtonClass} onClick={() => setCurrentQuestion((index) => Math.max(0, index - 1))}><ArrowLeft className="h-4 w-4" /> Previous</button>{currentQuestion < questions.length - 1 ? <button className={buttonClass} onClick={() => setCurrentQuestion((index) => Math.min(questions.length - 1, index + 1))}>Next <ArrowRight className="h-4 w-4" /></button> : <button className={buttonClass} onClick={submit}>Submit quiz <CheckCircle2 className="h-4 w-4" /></button>}</div></div>}
    <p className="text-xs text-[#6B756E]">Automatic scores and feedback are based on the configured answer key. Written responses require instructor grading.</p>
  </div>
}

function AssignmentsPage({ state, updateState }: { state: AcademyState; updateState: (update: (current: AcademyState) => AcademyState) => void }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const assignments = academyAssignments.filter((assignment) => state.enrolments.some((enrolment) => enrolment.courseId === assignment.courseId))

  const submit = (assignmentId: string) => {
    const assignment = academyAssignments.find((item) => item.id === assignmentId)
    if (!assignment) return
    const response = responses[assignmentId]?.trim() ?? ''
    const fileName = files[assignmentId] ?? ''
    if (!response && !fileName) {
      setErrors((current) => ({ ...current, [assignmentId]: 'Add a written response or select a file before submitting.' }))
      return
    }
    const submittedAt = new Date().toISOString()
    const isLate = Date.now() > new Date(assignment.dueAt).getTime()
    updateState((current) => ({
      ...current,
      assignmentSubmissions: [...current.assignmentSubmissions.filter((item) => item.assignmentId !== assignmentId), { assignmentId, response, fileName, submittedAt, status: isLate ? 'Late' : 'Submitted' }],
      activity: [createActivity(`Submitted ${assignment.title}${isLate ? ' (late)' : ''}`), ...current.activity],
      notifications: [{ id: crypto.randomUUID(), title: 'Assignment submitted', detail: `${assignment.title} has been saved in your learning record.`, createdAt: submittedAt, href: '/academy/student/assignments', read: false }, ...current.notifications],
    }))
    setErrors((current) => ({ ...current, [assignmentId]: '' }))
    setOpenId(null)
  }

  return <div className="space-y-6"><PageIntro eyebrow="Coursework" title="Assignments" description="Review project instructions, submit your work and follow the grading status." />{assignments.length === 0 ? <EmptyState title="No course assignments yet" detail="Enrol in a course to see its assignments here." action={<Link className={buttonClass} to="/academy/courses">Explore courses</Link>} /> : <div className="space-y-4">{assignments.map((assignment) => {
    const course = getCourse(assignment.courseId)
    const submission = state.assignmentSubmissions.find((item) => item.assignmentId === assignment.id)
    const late = submission?.status === 'Late'
    const status = submission?.status ?? (late ? 'Late' : openId === assignment.id ? 'In Progress' : 'Not Started')
    return <article key={assignment.id} className={`${cardClass} space-y-4`}><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#39845A]">{course?.title}</p><h2 className="mt-1 text-xl font-semibold text-[#202923]">{assignment.title}</h2><p className="mt-2 text-sm text-[#6B756E]">Due {formatDate(assignment.dueAt)} · {assignment.maxMarks} marks</p></div><StatusPill value={status} /></div><p className="text-sm leading-7 text-[#4c5a51]">{assignment.instructions}</p>{submission ? <div className="rounded-xl bg-[#F6F5EF] p-4"><p className="text-sm font-medium text-[#202923]">Submitted {formatDate(submission.submittedAt)}{submission.fileName && ` · ${submission.fileName}`}</p>{submission.status === 'Graded' ? <><p className="mt-2 text-sm text-[#4c5a51]">Feedback: {submission.feedback}</p><p className="mt-1 text-sm font-semibold text-[#285342]">Score: {submission.marks}/{assignment.maxMarks}</p></> : <p className="mt-2 text-sm text-[#6B756E]">Your work is awaiting instructor review.</p>}</div> : <><div className="text-xs text-[#6B756E]">Accepted files: {assignment.allowedTypes.join(', ')} · Maximum 5 MB. Demo mode stores the filename and text locally; files are not uploaded to a server.</div>{openId === assignment.id ? <div className="space-y-3"><textarea value={responses[assignment.id] ?? ''} onChange={(event) => setResponses((current) => ({ ...current, [assignment.id]: event.target.value }))} rows={4} className="w-full rounded-xl border border-[#E6EAE5] p-3 text-sm outline-none focus:border-[#285342]" placeholder="Write your response" /><input type="file" accept={assignment.allowedTypes.map((extension) => `.${extension}`).join(',')} onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const extension = file.name.split('.').pop()?.toLowerCase() ?? ''; if (!assignment.allowedTypes.includes(extension) || file.size > 5 * 1024 * 1024) { setErrors((current) => ({ ...current, [assignment.id]: file.size > 5 * 1024 * 1024 ? 'File exceeds the 5 MB limit.' : `File type .${extension} is not permitted.` })); event.target.value = ''; return } setFiles((current) => ({ ...current, [assignment.id]: file.name })); setErrors((current) => ({ ...current, [assignment.id]: '' })) }} className="block w-full text-sm text-[#4c5a51] file:mr-3 file:rounded-full file:border-0 file:bg-[#EDF4EA] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#285342]" />{files[assignment.id] && <p className="text-xs text-[#285342]">Selected: {files[assignment.id]}</p>}{errors[assignment.id] && <p role="alert" className="text-sm text-red-700">{errors[assignment.id]}</p>}<div className="flex gap-2"><button className={buttonClass} onClick={() => submit(assignment.id)}>Submit assignment</button><button className={secondaryButtonClass} onClick={() => setOpenId(null)}>Cancel</button></div></div> : <button className={secondaryButtonClass} onClick={() => setOpenId(assignment.id)}>Open assignment <ArrowRight className="h-4 w-4" /></button>}</>}</article>
  })}</div>}<p className="text-xs text-[#6B756E]">Instructor grading and secure file storage require the future academy API.</p></div>
}

function AssessmentHistory({ state }: { state: AcademyState }) {
  return <div className="space-y-6"><PageIntro eyebrow="Results" title="Assessments" description="See quiz attempts, automatically graded scores and manual-review status." /><div className={`${cardClass} overflow-x-auto`}><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-[#E6EAE5] text-xs uppercase text-[#6B756E]"><tr><th className="pb-3">Assessment</th><th className="pb-3">Submitted</th><th className="pb-3">Auto score</th><th className="pb-3">Result</th></tr></thead><tbody className="divide-y divide-[#E6EAE5]">{state.quizAttempts.map((attempt) => { const course = getCourse(attempt.courseId); const manual = (quizQuestions[course?.quizId ?? ''] ?? []).some((question) => !question.correct); return <tr key={attempt.id}><td className="py-4 font-medium text-[#202923]">{course?.title ?? 'Course assessment'}</td><td className="py-4 text-[#6B756E]">{formatDate(attempt.submittedAt)}</td><td className="py-4 text-[#202923]">{attempt.score}%</td><td className="py-4"><StatusPill value={manual ? 'Pending Review' : attempt.passed ? 'Passed' : 'Retry available'} /></td></tr> })}</tbody></table>{state.quizAttempts.length === 0 && <p className="py-8 text-center text-sm text-[#6B756E]">Your submitted assessments will appear here.</p>}</div>{state.enrolments.filter((item) => item.status === 'active').map((item) => { const course = getCourse(item.courseId); return course ? <Link key={item.courseId} to={`/academy/assessments/${item.courseId}`} className="inline-flex mr-2 mb-2 items-center gap-2 rounded-full border border-[#E6EAE5] bg-white px-4 py-2 text-sm font-medium text-[#285342]">Open {course.title} assessment <ArrowRight className="h-4 w-4" /></Link> : null })}</div>
}

function ProgressPage({ state }: { state: AcademyState }) {
  const enrolled = state.enrolments.map((enrolment) => ({ enrolment, course: getCourse(enrolment.courseId) })).filter((item): item is { enrolment: typeof state.enrolments[number]; course: AcademyCourse } => Boolean(item.course))
  const totalLessons = enrolled.reduce((sum, item) => sum + getLessons(item.course).length, 0)
  const completedLessons = enrolled.reduce((sum, item) => sum + (state.completedLessons[item.course.id] ?? []).length, 0)
  const average = enrolled.length ? Math.round(enrolled.reduce((sum, item) => sum + getCourseProgress(item.course, state), 0) / enrolled.length) : 0
  return <div className="space-y-6"><PageIntro eyebrow="Learning analytics" title="Your learning progress" description="A clear view of your course completion, assessment results and learning time." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={SlidersHorizontal} label="Overall course progress" value={`${average}%`} /><Metric icon={CheckCircle2} label="Lessons completed" value={`${completedLessons}/${totalLessons}`} /><Metric icon={Clock3} label="Learning hours" value={(state.learningMinutes / 60).toFixed(1)} /><Metric icon={Award} label="Completed courses" value={String(state.enrolments.filter((item) => item.status === 'completed').length)} /></div><section><SectionHeading title="Course-by-course progress" /><div className="space-y-3">{enrolled.map(({ course, enrolment }) => <div key={course.id} className={cardClass}><div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-[#202923]">{course.title}</p><p className="mt-1 text-xs text-[#6B756E]">{(state.completedLessons[course.id] ?? []).length} of {getLessons(course).length} lessons · {course.modules.filter((module) => module.lessons.every((lesson) => (state.completedLessons[course.id] ?? []).includes(lesson.id))).length} modules complete</p></div><span className="text-sm font-semibold text-[#285342]">{getCourseProgress(course, state)}%</span></div><ProgressBar value={getCourseProgress(course, state)} /><Link className="mt-3 inline-block text-xs font-semibold text-[#285342]" to={`/academy/learn/${course.id}/${enrolment.lastLessonId}`}>Open course</Link></div>)}</div></section><section className="grid gap-6 lg:grid-cols-2"><div><SectionHeading title="Quiz performance" /><div className={`${cardClass} space-y-4`}>{state.quizAttempts.map((attempt) => <div key={attempt.id}><div className="mb-1 flex justify-between text-sm"><span>{getCourse(attempt.courseId)?.title ?? 'Assessment'}</span><span className="font-semibold text-[#285342]">{attempt.score}%</span></div><ProgressBar value={attempt.score} /></div>)}{state.quizAttempts.length === 0 && <p className="text-sm text-[#6B756E]">Submit a quiz to see your results here.</p>}</div></div><div><SectionHeading title="Assignment performance" /><div className={`${cardClass} space-y-3`}>{state.assignmentSubmissions.map((submission) => { const assignment = academyAssignments.find((item) => item.id === submission.assignmentId); return <div key={submission.assignmentId} className="flex justify-between gap-3 text-sm"><span>{assignment?.title ?? 'Assignment'}</span><span className="font-medium text-[#285342]">{submission.marks !== undefined && assignment ? `${submission.marks}/${assignment.maxMarks}` : submission.status}</span></div> })}{state.assignmentSubmissions.length === 0 && <p className="text-sm text-[#6B756E]">Submitted assignments appear here.</p>}</div></div></section></div>
}

function CertificatesPage({ state }: { state: AcademyState }) {
  const certificates = state.enrolments.filter((enrolment) => enrolment.status === 'completed').map((enrolment) => ({ enrolment, course: getCourse(enrolment.courseId) })).filter((item): item is { enrolment: typeof state.enrolments[number]; course: AcademyCourse } => Boolean(item.course && canCompleteCourse(item.course, state)))
  return <div className="space-y-6"><PageIntro eyebrow="Achievements" title="My certificates" description="Certificates are issued only after required lessons and course assessments are complete." />{certificates.length === 0 ? <EmptyState title="No certificates yet" detail="Complete all required lessons and pass a course assessment to earn your first certificate." action={<Link to="/academy/student/my-learning" className={buttonClass}>Continue learning</Link>} /> : <div className="grid gap-4 md:grid-cols-2">{certificates.map(({ enrolment, course }) => <div key={course.id} className={`${cardClass} flex items-center gap-4`}><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]"><Award className="h-7 w-7" /></span><div className="min-w-0 flex-1"><h2 className="font-semibold text-[#202923]">{course.title}</h2><p className="mt-1 text-xs text-[#6B756E]">Completed {formatDate(enrolment.lastAccessedAt)}</p><Link className="mt-3 inline-flex text-sm font-semibold text-[#285342]" to={`/academy/student/certificates/${course.id}`}>View certificate <ArrowRight className="ml-1 h-4 w-4" /></Link></div></div>)}</div>}</div>
}

function CertificatePage({ state }: { state: AcademyState }) {
  const { courseId = '' } = useParams()
  const course = getCourse(courseId)
  const enrolment = state.enrolments.find((item) => item.courseId === courseId)
  if (!course || !enrolment || enrolment.status !== 'completed' || !canCompleteCourse(course, state)) return <EmptyState title="Certificate not available" detail="Complete this course's required lessons and assessment before accessing its certificate." action={<Link to="/academy/student/my-learning" className={buttonClass}>Back to my learning</Link>} />
  const certificateId = getCertificateId(course.id, enrolment.enrolledAt)
  const certificateHtml = `<!doctype html><html><head><meta charset="utf-8"><title>Leafy Academy Certificate</title><style>body{font-family:Georgia,serif;background:#f6f5ef;color:#202923;padding:48px}.certificate{max-width:900px;margin:auto;border:10px double #285342;padding:72px;text-align:center;background:white}.brand{color:#285342;letter-spacing:5px;text-transform:uppercase}.name{font-size:42px;border-bottom:1px solid #a4c68c;display:inline-block;padding:12px 30px}.course{font-size:30px;color:#285342}</style></head><body><main class="certificate"><p class="brand">Leafy Academy</p><h1>Certificate of Completion</h1><p>This certificate is proudly presented to</p><p class="name">${escapeHtml(state.profile.name)}</p><p>for successful completion of</p><p class="course">${escapeHtml(course.title)}</p><p>Completed ${formatDate(enrolment.lastAccessedAt)}</p><p>Authorised signatory · Leafy Academy</p><small>Certificate ID: ${certificateId}</small></main></body></html>`
  const download = () => { const blob = new Blob([certificateHtml], { type: 'text/html' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${course.id}-certificate.html`; anchor.click(); URL.revokeObjectURL(url) }
  const print = () => { const popup = window.open('', '_blank', 'noopener,noreferrer'); if (!popup) return; popup.document.write(certificateHtml); popup.document.close(); popup.focus(); popup.print() }
  return <div className="space-y-5"><Link to="/academy/student/certificates" className="inline-flex items-center gap-2 text-sm font-medium text-[#285342]"><ArrowLeft className="h-4 w-4" /> My certificates</Link><div className="rounded-[1.5rem] border-[8px] border-double border-[#285342] bg-white px-5 py-12 text-center shadow-xl sm:px-12"><p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#39845A]">Leafy Academy</p><h1 className="mt-6 text-3xl font-semibold text-[#202923] sm:text-5xl">Certificate of Completion</h1><p className="mt-8 text-[#6B756E]">This certificate is proudly presented to</p><p className="mx-auto mt-3 max-w-xl border-b border-[#A4C68C] px-4 pb-3 text-3xl font-medium text-[#285342] sm:text-4xl">{state.profile.name}</p><p className="mt-6 text-[#6B756E]">for successfully completing</p><h2 className="mt-2 text-2xl font-semibold text-[#285342] sm:text-3xl">{course.title}</h2><p className="mt-5 text-sm text-[#6B756E]">Completed {formatDate(enrolment.lastAccessedAt)}</p><p className="mt-8 text-sm font-medium text-[#202923]">Authorised signatory · Leafy Academy</p><p className="mt-4 text-xs text-[#6B756E]">Certificate ID: {certificateId}</p></div><div className="flex flex-wrap gap-3"><button className={buttonClass} onClick={download}><Download className="h-4 w-4" /> Download certificate</button><button className={secondaryButtonClass} onClick={print}>Print certificate</button></div><p className="text-xs text-[#6B756E]">Certificate verification will be available when the academy API is connected.</p></div>
}

function NotificationsPage({ state, updateState }: { state: AcademyState; updateState: (update: (current: AcademyState) => AcademyState) => void }) {
  const markRead = (id: string) => updateState((current) => ({ ...current, notifications: current.notifications.map((item) => item.id === id ? { ...item, read: true } : item) }))
  return <div className="space-y-6"><PageIntro eyebrow="Updates" title="Notifications" description="Course announcements, deadlines, results and account updates in one place." /><div className="flex justify-end"><button className={secondaryButtonClass} onClick={() => updateState((current) => ({ ...current, notifications: current.notifications.map((item) => ({ ...item, read: true })) }))}>Mark all as read</button></div><div className="space-y-3">{state.notifications.map((notification) => <article key={notification.id} className={`${cardClass} flex gap-4 ${notification.read ? 'opacity-75' : 'border-[#a4c68c]'}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]"><Bell className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold text-[#202923]">{notification.title}{!notification.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#d26945]" />}</h2><span className="text-xs text-[#6B756E]">{relativeDate(notification.createdAt)}</span></div><p className="mt-1 text-sm leading-6 text-[#6B756E]">{notification.detail}</p><div className="mt-3 flex gap-4"><Link to={notification.href} onClick={() => markRead(notification.id)} className="text-sm font-semibold text-[#285342]">Open update <ArrowRight className="ml-1 inline h-4 w-4" /></Link>{!notification.read && <button className="text-sm text-[#6B756E]" onClick={() => markRead(notification.id)}>Mark as read</button>}</div></div></article>)}{state.notifications.length === 0 && <EmptyState title="You’re all caught up" detail="New course updates and reminders will appear here." />}</div></div>
}

function ProfilePage({ state, updateState }: { state: AcademyState; updateState: (update: (current: AcademyState) => AcademyState) => void }) {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState(state.profile)
  const save = (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Enter your name and a valid email address.'); return }
    updateState((current) => ({ ...current, profile: { ...current.profile, ...form } }))
    setSaved(true); setError('')
  }
  return <div className="space-y-6"><PageIntro eyebrow="Your account" title="My profile" description="Keep your learner details and interests up to date." /><form onSubmit={save} className={`${cardClass} max-w-3xl space-y-5`}><div className="flex items-center gap-4"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#285342] text-xl font-semibold text-white">{initials(form.name)}</span><div><p className="font-semibold text-[#202923]">Learner profile</p><p className="text-xs text-[#6B756E]">Profile photo uploads will be enabled with the academy API.</p></div></div><div className="grid gap-4 sm:grid-cols-2"><TextField label="Full name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} /><TextField label="Email address" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} /><TextField label="Phone number" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} /></div><label className="block text-sm font-medium text-[#202923]">Biography<textarea rows={3} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} className="mt-2 w-full rounded-xl border border-[#E6EAE5] p-3 font-normal outline-none focus:border-[#285342]" /></label><label className="block text-sm font-medium text-[#202923]">Learning interests<input value={form.interests.join(', ')} onChange={(event) => setForm({ ...form, interests: event.target.value.split(',').map((interest) => interest.trim()).filter(Boolean) })} className="mt-2 w-full rounded-xl border border-[#E6EAE5] p-3 font-normal outline-none focus:border-[#285342]" /><span className="mt-1 block text-xs font-normal text-[#6B756E]">Separate interests with commas.</span></label>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}{saved && <p role="status" className="text-sm font-medium text-[#285342]">Profile saved in this browser.</p>}<button className={buttonClass}>Save profile</button></form></div>
}

function SettingsPage({ state, updateState }: { state: AcademyState; updateState: (update: (current: AcademyState) => AcademyState) => void }) {
  const [message, setMessage] = useState('')
  const toggle = (key: 'emailUpdates' | 'deadlineReminders') => updateState((current) => ({ ...current, profile: { ...current.profile, [key]: !current.profile[key] } }))
  return <div className="space-y-6"><PageIntro eyebrow="Preferences" title="Settings" description="Manage learning notifications and privacy preferences for this device." /><section className={`${cardClass} max-w-3xl space-y-5`}><h2 className="text-xl font-semibold text-[#202923]">Notifications</h2><PreferenceRow title="Academy email updates" detail="Course news and learning announcements." checked={state.profile.emailUpdates} onChange={() => toggle('emailUpdates')} /><PreferenceRow title="Deadline reminders" detail="Reminders for assignments and scheduled activities." checked={state.profile.deadlineReminders} onChange={() => toggle('deadlineReminders')} /><h2 className="border-t border-[#E6EAE5] pt-5 text-xl font-semibold text-[#202923]">Privacy</h2><label className="block text-sm text-[#4c5a51]">Learning profile visibility<select value={state.profile.privacy} onChange={(event) => updateState((current) => ({ ...current, profile: { ...current.profile, privacy: event.target.value as 'private' | 'academy' } }))} className="mt-2 block w-full rounded-xl border border-[#E6EAE5] bg-white p-3"><option value="private">Private</option><option value="academy">Visible to academy instructors</option></select></label><div className="border-t border-[#E6EAE5] pt-5"><h2 className="text-xl font-semibold text-[#202923]">Password management</h2><p className="mt-2 text-sm text-[#6B756E]">Password changes require secure identity verification and will be connected to the authentication service.</p><button className={`${secondaryButtonClass} mt-3`} onClick={() => setMessage('Password management requires the authentication backend. No password has been changed.')}>Request password change</button></div>{message && <p role="status" className="rounded-lg bg-[#F6F5EF] p-3 text-sm text-[#6B756E]">{message}</p>}<div className="border-t border-[#E6EAE5] pt-5"><p className="text-xs leading-5 text-[#6B756E]">Learning progress is stored in this browser’s local storage for this prototype. Clearing browser data will remove it.</p></div></section></div>
}

function CatalogueCard({ course, list }: { course: AcademyCourse; list: boolean }) {
  return <article className={`group overflow-hidden rounded-[1.5rem] border border-[#E6EAE5] bg-white shadow-[0_20px_50px_rgba(32,41,35,0.04)] ${list ? 'grid sm:grid-cols-[240px_1fr]' : ''}`}><Link to={`/academy/courses/${course.id}`} className={`relative block overflow-hidden ${list ? 'h-48 sm:h-full' : 'h-48'}`}><CourseCover src={course.image} alt="" className="h-full w-full transition duration-500 group-hover:scale-105" /><span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#285342]">{course.category}</span></Link><div className="flex flex-col p-5"><div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-[#6B756E]">{course.level}</span><span className="text-sm font-semibold text-[#285342]">{course.price === 0 ? 'Free' : `KSh ${course.price.toLocaleString()}`}</span></div><Link to={`/academy/courses/${course.id}`} className="mt-2 text-xl font-semibold text-[#202923] hover:text-[#285342]">{course.title}</Link><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B756E]">{course.description}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#6B756E]"><span>{course.instructor}</span><span>{course.durationHours} hours</span><span>{getLessons(course).length} lessons</span></div><Link className={`${secondaryButtonClass} mt-5 w-fit`} to={`/academy/courses/${course.id}`}>View course <ArrowRight className="h-4 w-4" /></Link></div></article>
}

function CourseProgressCard({ course, state, action }: { course: AcademyCourse; state: AcademyState; action: React.ReactNode }) {
  const completed = (state.completedLessons[course.id] ?? []).length
  return <article className={`${cardClass} flex flex-col gap-4 sm:flex-row`}><CourseCover src={course.image} alt="" className="h-40 w-full shrink-0 rounded-xl sm:h-32 sm:w-44" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-semibold uppercase tracking-wide text-[#39845A]">{course.category}</p><span className="text-sm font-semibold text-[#285342]">{getCourseProgress(course, state)}%</span></div><h3 className="mt-1 text-lg font-semibold text-[#202923]">{course.title}</h3><p className="mt-1 text-sm text-[#6B756E]">{course.instructor}</p><div className="mt-3"><ProgressBar value={getCourseProgress(course, state)} /></div><p className="mt-2 text-xs text-[#6B756E]">{completed} of {getLessons(course).length} lessons · Last accessed {relativeDate(state.enrolments.find((item) => item.courseId === course.id)?.lastAccessedAt ?? '')}</p><div className="mt-4">{action}</div></div></article>
}

function CourseMiniCard({ course, state, status }: { course: AcademyCourse; state: AcademyState; status?: string }) {
  return <Link to={`/academy/courses/${course.id}`} className="flex gap-3 rounded-xl border border-[#E6EAE5] bg-white p-3 transition hover:border-[#A4C68C]"><CourseCover src={course.image} alt="" className="h-16 w-20 shrink-0 rounded-lg" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#202923]">{course.title}</span><span className="mt-1 block text-xs text-[#6B756E]">{status ? `${status === 'completed' ? 'Completed' : `${getCourseProgress(course, state)}% complete`}` : `${course.level} · ${course.durationHours} hours`}</span></span><ChevronDown className="mt-2 h-4 w-4 -rotate-90 text-[#6B756E]" /></Link>
}

function CourseCover({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(false)
  return <div className={`relative overflow-hidden bg-[#e6efe2] ${className}`}>{failed ? <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#dce9d5] to-[#f0f5ef] text-[#285342]"><GraduationCap className="h-9 w-9" /></div> : <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />}</div>
}

function SlidesViewer({ slides }: { slides: string[] }) {
  const [activeSlide, setActiveSlide] = useState(0)
  return <section className="mx-auto mb-6 max-w-3xl rounded-xl bg-[#F0F5EF] p-5 sm:p-8" aria-label="Presentation slides"><p className="text-xs font-semibold uppercase tracking-wide text-[#39845A]">Slide {activeSlide + 1} of {slides.length}</p><p className="mt-4 min-h-28 text-xl font-medium leading-8 text-[#202923]">{slides[activeSlide]}</p><div className="mt-5 flex items-center justify-between"><button disabled={activeSlide === 0} onClick={() => setActiveSlide((current) => Math.max(0, current - 1))} className={secondaryButtonClass}><ArrowLeft className="h-4 w-4" /> Previous</button><button disabled={activeSlide === slides.length - 1} onClick={() => setActiveSlide((current) => Math.min(slides.length - 1, current + 1))} className={buttonClass}>Next slide <ArrowRight className="h-4 w-4" /></button></div></section>
}

function Metric({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string }) {
  return <div className={`${cardClass} flex items-center gap-4`}><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]"><Icon className="h-5 w-5" /></span><div><p className="text-xs text-[#6B756E]">{label}</p><p className="mt-1 text-2xl font-semibold text-[#202923]">{value}</p></div></div>
}

function SectionHeading({ title, action }: { title: string; action?: React.ReactNode }) {
  return <div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-xl font-semibold text-[#202923]">{title}</h2>{action}</div>
}

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#39845A]">{eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#202923] sm:text-4xl">{title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B756E]">{description}</p></header>
}

function EmptyState({ title, detail, action }: { title: string; detail: string; action?: React.ReactNode }) {
  return <div className={`${cardClass} flex min-h-56 flex-col items-center justify-center text-center`}><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]"><BookOpen className="h-5 w-5" /></span><h2 className="mt-4 text-xl font-semibold text-[#202923]">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#6B756E]">{detail}</p>{action && <div className="mt-5">{action}</div>}</div>
}

function ProgressBar({ value }: { value: number }) {
  return <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EDF1EC]" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-[#39845A] transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="text-xs font-medium text-[#6B756E]">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 block w-full rounded-lg border border-[#E6EAE5] bg-white px-3 py-2.5 text-sm text-[#202923] outline-none focus:border-[#285342]">{options.map((option) => <option key={option}>{option}</option>)}</select></label>
}

function TextField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block text-sm font-medium text-[#202923]">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E6EAE5] p-3 font-normal outline-none focus:border-[#285342]" /></label>
}

function PreferenceRow({ title, detail, checked, onChange }: { title: string; detail: string; checked: boolean; onChange: () => void }) {
  return <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-[#F6F5EF] p-4"><span><span className="block text-sm font-medium text-[#202923]">{title}</span><span className="mt-1 block text-xs text-[#6B756E]">{detail}</span></span><input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[#285342]" /></label>
}

function StatusPill({ value }: { value: string }) {
  const positive = ['Passed', 'Graded', 'Submitted'].includes(value)
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${positive ? 'bg-[#EDF4EA] text-[#285342]' : value === 'Late' || value === 'Pending Review' ? 'bg-[#fff4e8] text-[#7b4a1b]' : 'bg-[#F0F1EE] text-[#5d655f]'}`}>{value}</span>
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('')
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function relativeDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not accessed yet'
  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000))
  return days === 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character)
}
