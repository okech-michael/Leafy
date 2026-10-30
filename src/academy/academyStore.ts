export type LessonKind = 'video' | 'reading' | 'resource' | 'exercise' | 'pdf' | 'presentation' | 'external'
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface LessonResource {
  id: string
  title: string
  url: string
  kind: 'link' | 'download'
}

export interface Lesson {
  id: string
  title: string
  kind: LessonKind
  minutes: number
  preview?: boolean
  body: string[]
  videoUrl?: string
  contentUrl?: string
  slides?: string[]
  resources: LessonResource[]
}

export interface CourseModule {
  id: string
  title: string
  lessons: Lesson[]
}

export interface AcademyCourse {
  id: string
  title: string
  category: string
  level: CourseLevel
  durationHours: number
  instructor: string
  instructorBio: string
  instructorImage: string
  description: string
  image: string
  price: number
  language: string
  prerequisites: string
  outcomes: string[]
  modules: CourseModule[]
  quizId: string
  assessmentRequired: boolean
  featured?: boolean
}

export interface CourseEnrolment {
  courseId: string
  enrolledAt: string
  status: 'active' | 'completed'
  lastLessonId: string
  lastAccessedAt: string
}

export interface QuizAttempt {
  id: string
  courseId: string
  score: number
  submittedAt: string
  passed: boolean
}

export interface AssignmentSubmission {
  assignmentId: string
  response: string
  fileName: string
  submittedAt: string
  status: 'Submitted' | 'Under Review' | 'Graded' | 'Late'
  feedback?: string
  marks?: number
}

export interface AcademyNotification {
  id: string
  title: string
  detail: string
  createdAt: string
  href: string
  read: boolean
}

export interface AcademyProfile {
  name: string
  email: string
  phone: string
  bio: string
  interests: string[]
  emailUpdates: boolean
  deadlineReminders: boolean
  privacy: 'private' | 'academy'
}

export interface AcademyState {
  profile: AcademyProfile
  enrolments: CourseEnrolment[]
  completedLessons: Record<string, string[]>
  videoPositions: Record<string, number>
  quizAttempts: QuizAttempt[]
  assignmentSubmissions: AssignmentSubmission[]
  notifications: AcademyNotification[]
  learningMinutes: number
  activity: { id: string; detail: string; createdAt: string }[]
}

const image = (photo: string) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1200&q=80`

const resource = (id: string, title: string, kind: 'link' | 'download' = 'download'): LessonResource => ({
  id,
  title,
  kind,
  url: `data:text/plain;charset=utf-8,${encodeURIComponent(`${title}\nLeafy Academy learning resource.`)}`,
})

export const academyCourses: AcademyCourse[] = [
  {
    id: 'healthy-food-systems',
    title: 'Healthy Food Systems',
    category: 'Nutrition',
    level: 'Beginner',
    durationHours: 3,
    instructor: 'Dr. Nia Wanjiku',
    instructorBio: 'Nutrition educator focused on practical, culturally relevant approaches to healthy food systems.',
    instructorImage: image('photo-1551836022-d5d88e9218df'),
    description: 'Understand how food moves from farm to table, and learn practical ways to make nutritious choices at home and in your community.',
    image: image('photo-1547592180-85f173990554'),
    price: 0,
    language: 'English',
    prerequisites: 'No prior experience required.',
    outcomes: ['Read a balanced plate and plan practical meals', 'Explain how local food systems affect nutrition', 'Apply safe food storage and preparation practices'],
    quizId: 'food-systems-check',
    assessmentRequired: true,
    featured: true,
    modules: [
      {
        id: 'food-module-1',
        title: 'Food, health and everyday choices',
        lessons: [
          { id: 'food-lesson-1', title: 'Welcome to healthy food systems', kind: 'video', minutes: 8, preview: true, videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', body: ['Welcome to this practical introduction to healthy food systems.', 'In this lesson, connect everyday food choices with health, local livelihoods and the environment.'], resources: [resource('food-guide-1', 'Healthy food systems guide')] },
          { id: 'food-lesson-2', title: 'Building a balanced plate', kind: 'reading', minutes: 12, body: ['A balanced plate combines a variety of vegetables and fruit, a useful source of protein, and a staple that provides energy.', 'Use foods that are familiar and available in your community. A healthy plan should be practical, affordable and enjoyable.', 'Try: choose one meal this week and identify how you could add variety or improve its balance.'], resources: [resource('plate-planner', 'Weekly plate planner')] },
        ],
      },
      {
        id: 'food-module-2',
        title: 'Safe, sustainable food practices',
        lessons: [
          { id: 'food-lesson-3', title: 'Food safety at home', kind: 'reading', minutes: 10, body: ['Keep preparation surfaces clean, separate raw and ready-to-eat food, and follow safe cooking and storage practices.', 'When in doubt about the safety of food, do not taste it. Follow local public health guidance.'], resources: [resource('food-safety-checklist', 'Food safety checklist')] },
          { id: 'food-lesson-4', title: 'A practical meal-planning exercise', kind: 'exercise', minutes: 15, body: ['Plan one day of meals using ingredients available to you.', 'For each meal, note the main energy food, protein source, vegetables or fruit, and one way to reduce waste.', 'Use the downloadable worksheet to save your plan.'], resources: [resource('meal-planning-worksheet', 'Meal planning worksheet')] },
        ],
      },
    ],
  },
  {
    id: 'regenerative-growing',
    title: 'Introduction to Regenerative Growing',
    category: 'Agriculture',
    level: 'Beginner',
    durationHours: 5,
    instructor: 'Peter Mwangi',
    instructorBio: 'Agronomist and farmer trainer supporting soil health and climate-resilient growing practices.',
    instructorImage: image('photo-1500648767791-00dcc994a43e'),
    description: 'Explore soil health, biodiversity and practical growing methods that support resilient farms and landscapes.',
    image: image('photo-1464226184884-fa52ac9fcf7a'),
    price: 0,
    language: 'English',
    prerequisites: 'Curiosity about farming or food production.',
    outcomes: ['Describe core soil-health principles', 'Identify ways to protect biodiversity', 'Create a simple seasonal observation plan'],
    quizId: 'regenerative-check',
    assessmentRequired: true,
    featured: true,
    modules: [
      { id: 'farm-module-1', title: 'Start with the soil', lessons: [
        { id: 'farm-lesson-1', title: 'Observe your growing environment', kind: 'video', minutes: 9, preview: true, videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', body: ['Begin by observing the place where you grow. Notice the soil surface, water flow, shade and plant variety.'], resources: [resource('farm-observation-sheet', 'Farm observation sheet')] },
        { id: 'farm-lesson-2', title: 'Soil as a living system', kind: 'reading', minutes: 14, body: ['Healthy soil is a living system. Its structure, organic matter, moisture and organisms affect how well plants grow.', 'Small, locally suitable changes can reduce erosion and support soil cover.'], resources: [resource('soil-health-notes', 'Soil health field notes')] },
      ] },
      { id: 'farm-module-2', title: 'Design for resilience', lessons: [
        { id: 'farm-lesson-3', title: 'Biodiversity on the farm', kind: 'reading', minutes: 13, body: ['Diverse plants and habitats can support pollinators, beneficial organisms and more resilient production.', 'Map the different plants and habitats you see around a growing area.'], resources: [resource('biodiversity-map', 'Biodiversity mapping worksheet')] },
        { id: 'farm-lesson-4', title: 'Your seasonal action plan', kind: 'exercise', minutes: 18, body: ['Choose one manageable action to test this season.', 'Record the starting conditions, what you changed and what you observed. Share what you learn with your group.'], resources: [resource('seasonal-plan', 'Seasonal action plan')] },
      ] },
    ],
  },
  {
    id: 'community-leadership',
    title: 'Community Leadership in Practice',
    category: 'Community',
    level: 'Intermediate',
    durationHours: 4,
    instructor: 'Amina Otieno',
    instructorBio: 'Community facilitator with experience in inclusive programme design and participatory learning.',
    instructorImage: image('photo-1580489944761-15a19d654956'),
    description: 'Build practical skills for listening, collaboration and inclusive action in community settings.',
    image: image('photo-1529156069898-49953e39b3ac'),
    price: 0,
    language: 'English',
    prerequisites: 'No formal prerequisite. Community or volunteer experience is useful.',
    outcomes: ['Facilitate inclusive conversations', 'Map community assets and priorities', 'Plan a small collaborative action'],
    quizId: 'leadership-check',
    assessmentRequired: true,
    modules: [
      { id: 'lead-module-1', title: 'Listen and learn', lessons: [
        { id: 'lead-lesson-1', title: 'The practice of active listening', kind: 'reading', minutes: 12, preview: true, body: ['Good community work starts with listening rather than assuming.', 'Create space for different voices and reflect back what you hear before moving to solutions.'], resources: [resource('listening-prompts', 'Active listening prompts')] },
        { id: 'lead-lesson-2', title: 'Mapping community assets', kind: 'exercise', minutes: 16, body: ['List the people, places, skills and networks that already contribute to wellbeing in your community.', 'Think about how different groups can participate in decisions.'], resources: [resource('asset-map', 'Community asset map')] },
      ] },
      { id: 'lead-module-2', title: 'Turn insight into action', lessons: [
        { id: 'lead-lesson-3', title: 'Inclusive group decisions', kind: 'video', minutes: 11, videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', body: ['This lesson introduces practical ways to make group decisions transparent and inclusive.'], resources: [] },
        { id: 'lead-lesson-4', title: 'Plan one small action', kind: 'exercise', minutes: 20, body: ['Choose a local priority, identify partners and agree on a first manageable step.', 'Define how you will hear from the people affected and how you will reflect on the result.'], resources: [resource('action-plan', 'Community action plan')] },
      ] },
    ],
  },
  {
    id: 'nutrition-practice',
    title: 'Nutrition for Everyday Wellbeing',
    category: 'Nutrition',
    level: 'Intermediate',
    durationHours: 6,
    instructor: 'Dr. Nia Wanjiku',
    instructorBio: 'Nutrition educator focused on practical, culturally relevant approaches to healthy food systems.',
    instructorImage: image('photo-1551836022-d5d88e9218df'),
    description: 'Turn nutrition principles into approachable routines for households, schools and community programmes.',
    image: image('photo-1490645935967-10de6ba17061'),
    price: 1800,
    language: 'English',
    prerequisites: 'Completion of Healthy Food Systems or equivalent experience.',
    outcomes: ['Discuss nutrition needs in context', 'Design realistic wellbeing routines', 'Communicate nutrition information responsibly'],
    quizId: 'nutrition-practice-check',
    assessmentRequired: true,
    modules: [
      { id: 'nutrition-module-1', title: 'Nutrition in context', lessons: [
        { id: 'nutrition-lesson-1', title: 'Everyday nutrition foundations', kind: 'reading', minutes: 14, preview: true, body: ['Nutrition supports growth, energy and health throughout life.', 'Needs vary by person and circumstance. Use trusted guidance and avoid one-size-fits-all claims.'], resources: [resource('nutrition-foundations', 'Nutrition foundations')] },
        { id: 'nutrition-lesson-2', title: 'Communicating with care', kind: 'video', minutes: 10, videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', body: ['Communicate health information with respect and acknowledge individual context.'], resources: [] },
      ] },
      { id: 'nutrition-module-2', title: 'Build a practical plan', lessons: [
        { id: 'nutrition-lesson-3', title: 'Routine design', kind: 'exercise', minutes: 18, body: ['Choose a small nutrition habit that feels realistic for your household or programme.', 'Describe the routine, possible barriers and a supportive adjustment.'], resources: [resource('routine-plan', 'Wellbeing routine planner')] },
      ] },
    ],
  },
  {
    id: 'digital-learning',
    title: 'Digital Skills for Learning',
    category: 'Digital Skills',
    level: 'Beginner',
    durationHours: 2,
    instructor: 'Maya Kariuki',
    instructorBio: 'Learning designer helping communities build confidence with digital tools.',
    instructorImage: image('photo-1544005313-94ddf0286df2'),
    description: 'Develop confidence with digital learning tools, safe online practices and independent study habits.',
    image: image('photo-1522202176988-66273c2fd55f'),
    price: 0,
    language: 'English',
    prerequisites: 'Access to a phone, tablet or computer is helpful.',
    outcomes: ['Navigate a learning platform', 'Organise digital learning materials', 'Use safer online practices'],
    quizId: 'digital-skills-check',
    assessmentRequired: true,
    modules: [
      { id: 'digital-module-1', title: 'Learn online with confidence', lessons: [
        { id: 'digital-lesson-1', title: 'Getting started with online learning', kind: 'video', minutes: 7, preview: true, videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', body: ['Online learning works best when you set a regular time, keep notes and ask for help when you need it.'], resources: [resource('study-checklist', 'Digital study checklist')] },
        { id: 'digital-lesson-2', title: 'Organise your learning', kind: 'reading', minutes: 9, body: ['Create a folder for course files, keep a simple task list and record questions as they arise.'], resources: [resource('study-planner', 'Weekly study planner')] },
      ] },
      { id: 'digital-module-2', title: 'Stay safe and keep practising', lessons: [
        { id: 'digital-lesson-3', title: 'Safer online habits', kind: 'reading', minutes: 10, body: ['Use unique passwords, protect personal information and be cautious with unexpected links.', 'When using a shared device, sign out after your session.'], resources: [resource('online-safety', 'Online safety reminders')] },
        { id: 'digital-lesson-4', title: 'Slides: a simple weekly study routine', kind: 'presentation', minutes: 8, body: ['Review these short slides to plan a sustainable weekly learning routine.'], slides: ['Choose a regular study time that fits your week.', 'Break larger learning goals into small, focused sessions.', 'Review notes and write down questions after each session.'], resources: [resource('weekly-study-planner', 'Weekly study planner')] },
        { id: 'digital-lesson-5', title: 'PDF: digital study notes', kind: 'pdf', minutes: 6, contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', body: ['Open the PDF learning notes in the document viewer. You can also download the file for offline study.'], resources: [] },
        { id: 'digital-lesson-6', title: 'External resource: keep learning safely', kind: 'external', minutes: 7, contentUrl: 'https://www.un.org/sustainabledevelopment/', body: ['Open this external resource in a new tab. External resources are provided for further learning and may have their own terms and privacy practices.'], resources: [] },
      ] },
    ],
  },
]

export interface AcademyAssignment {
  id: string
  courseId: string
  title: string
  instructions: string
  dueAt: string
  maxMarks: number
  allowedTypes: string[]
}

export const academyAssignments: AcademyAssignment[] = [
  { id: 'food-plan-assignment', courseId: 'healthy-food-systems', title: 'Design a balanced one-day meal plan', instructions: 'Create a realistic one-day meal plan using ingredients available in your community. Briefly explain how your plan includes variety, food safety and reduced waste.', dueAt: '2026-12-15T23:59:00+03:00', maxMarks: 20, allowedTypes: ['pdf', 'doc', 'docx', 'txt'] },
  { id: 'farm-observation-assignment', courseId: 'regenerative-growing', title: 'Growing environment observation', instructions: 'Submit a short observation of soil cover, water flow and plant diversity in a growing area. Include one practical action you would test.', dueAt: '2026-12-21T23:59:00+03:00', maxMarks: 25, allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'txt'] },
  { id: 'leadership-action-assignment', courseId: 'community-leadership', title: 'Community action outline', instructions: 'Describe a small collaborative action, the people who should shape it and how you will learn from the outcome.', dueAt: '2026-12-28T23:59:00+03:00', maxMarks: 25, allowedTypes: ['pdf', 'doc', 'docx', 'txt'] },
]

export const academyEvents = [
  { id: 'soil-health-live', title: 'Live class: ask an agronomist', courseId: 'regenerative-growing', startsAt: '2026-11-05T16:00:00+03:00', format: 'Online session' },
  { id: 'food-systems-circle', title: 'Learner discussion: local food systems', courseId: 'healthy-food-systems', startsAt: '2026-11-12T15:00:00+03:00', format: 'Community session' },
]

export interface QuizQuestion {
  id: string
  prompt: string
  type: 'single' | 'multiple' | 'trueFalse' | 'short' | 'long'
  options?: string[]
  correct?: string[]
  explanation: string
}

export const quizQuestions: Record<string, QuizQuestion[]> = {
  'food-systems-check': [
    { id: 'food-q1', prompt: 'Which meal-planning choice best supports variety?', type: 'single', options: ['Choose one food group every day', 'Include different available foods across the week', 'Avoid all locally grown foods'], correct: ['Include different available foods across the week'], explanation: 'Variety across available foods can make a practical eating pattern more balanced.' },
    { id: 'food-q2', prompt: 'Separating raw and ready-to-eat foods is a useful food-safety practice.', type: 'trueFalse', options: ['True', 'False'], correct: ['True'], explanation: 'Separating raw and ready-to-eat foods helps reduce cross-contamination risk.' },
    { id: 'food-q3', prompt: 'Name one safe food storage practice.', type: 'short', explanation: 'This written response is saved for review and is not automatically scored.' },
  ],
  'regenerative-check': [
    { id: 'farm-q1', prompt: 'Why is keeping soil covered often useful?', type: 'single', options: ['It can help reduce erosion and support soil life', 'It prevents all pests', 'It removes the need to observe crops'], correct: ['It can help reduce erosion and support soil life'], explanation: 'Soil cover can reduce erosion and support moisture and soil organisms.' },
    { id: 'farm-q2', prompt: 'Describe one way to observe biodiversity on a farm.', type: 'short', explanation: 'Written responses are not automatically graded.' },
  ],
  'leadership-check': [
    { id: 'lead-q1', prompt: 'What is a useful starting point for community-led action?', type: 'single', options: ['Listening to people affected', 'Choosing a solution before meeting anyone', 'Only inviting people who agree'], correct: ['Listening to people affected'], explanation: 'Listening helps shape action around lived experience and local priorities.' },
    { id: 'lead-q2', prompt: 'Select all practices that help inclusive group decisions.', type: 'multiple', options: ['Make space for different voices', 'Explain how decisions are made', 'Ignore disagreement'], correct: ['Make space for different voices', 'Explain how decisions are made'], explanation: 'Participation and transparent decisions support inclusion.' },
  ],
  'nutrition-practice-check': [
    { id: 'nutrition-q1', prompt: 'Nutrition advice should account for individual context.', type: 'trueFalse', options: ['True', 'False'], correct: ['True'], explanation: 'Nutrition guidance should be respectful of individual needs and circumstances.' },
    { id: 'nutrition-q2', prompt: 'Name one way to make a wellbeing routine more practical.', type: 'long', explanation: 'This response is saved for instructor review and receives no automatic marks.' },
  ],
  'digital-skills-check': [
    { id: 'digital-q1', prompt: 'What is a safer habit when using a shared device?', type: 'single', options: ['Stay signed in for the next person', 'Sign out after your session', 'Share your password with classmates'], correct: ['Sign out after your session'], explanation: 'Signing out helps protect your account on shared devices.' },
    { id: 'digital-q2', prompt: 'A unique password for each account is a safer practice.', type: 'trueFalse', options: ['True', 'False'], correct: ['True'], explanation: 'Unique passwords limit the impact if one password is exposed.' },
  ],
}

const STORAGE_KEY = 'leafy-academy-state-v1'

const defaultState: AcademyState = {
  profile: {
    name: 'Alex Maina',
    email: 'alex.maina@example.com',
    phone: '+254 700 000 000',
    bio: 'Curious learner exploring food systems and community wellbeing.',
    interests: ['Nutrition', 'Agriculture', 'Community'],
    emailUpdates: true,
    deadlineReminders: true,
    privacy: 'academy',
  },
  enrolments: [
    { courseId: 'healthy-food-systems', enrolledAt: '2026-09-10T09:00:00.000Z', status: 'active', lastLessonId: 'food-lesson-2', lastAccessedAt: '2026-10-28T11:00:00.000Z' },
    { courseId: 'regenerative-growing', enrolledAt: '2026-10-02T09:00:00.000Z', status: 'active', lastLessonId: 'farm-lesson-1', lastAccessedAt: '2026-10-22T11:00:00.000Z' },
    { courseId: 'digital-learning', enrolledAt: '2026-08-02T09:00:00.000Z', status: 'completed', lastLessonId: 'digital-lesson-3', lastAccessedAt: '2026-09-01T11:00:00.000Z' },
  ],
  completedLessons: {
    'healthy-food-systems': ['food-lesson-1'],
    'regenerative-growing': [],
    'digital-learning': ['digital-lesson-1', 'digital-lesson-2', 'digital-lesson-3', 'digital-lesson-4', 'digital-lesson-5', 'digital-lesson-6'],
  },
  videoPositions: {},
  quizAttempts: [
    { id: 'seed-attempt-digital', courseId: 'digital-learning', score: 100, submittedAt: '2026-09-01T11:00:00.000Z', passed: true },
  ],
  assignmentSubmissions: [
    { assignmentId: 'leadership-action-assignment', response: 'Sample response awaiting instructor review.', fileName: '', submittedAt: '2026-10-14T09:30:00.000Z', status: 'Graded', feedback: 'Clear, inclusive plan. Consider adding a follow-up date.', marks: 21 },
  ],
  notifications: [
    { id: 'welcome', title: 'Welcome to Leafy Academy', detail: 'Your learning space is ready. Explore courses and start at your own pace.', createdAt: '2026-10-20T08:00:00.000Z', href: '/academy/courses', read: false },
    { id: 'deadline', title: 'Assignment deadline reminder', detail: 'Your meal planning assignment is due on 15 December.', createdAt: '2026-10-26T08:00:00.000Z', href: '/academy/assignments', read: false },
    { id: 'course-news', title: 'New course available', detail: 'Explore Nutrition for Everyday Wellbeing in the catalogue.', createdAt: '2026-10-28T08:00:00.000Z', href: '/academy/courses/nutrition-practice', read: true },
  ],
  learningMinutes: 155,
  activity: [
    { id: 'activity-1', detail: 'Completed Welcome to healthy food systems', createdAt: '2026-10-28T11:00:00.000Z' },
    { id: 'activity-2', detail: 'Enrolled in Introduction to Regenerative Growing', createdAt: '2026-10-22T11:00:00.000Z' },
    { id: 'activity-3', detail: 'Earned a certificate in Digital Skills for Learning', createdAt: '2026-09-01T11:00:00.000Z' },
  ],
}

export function loadAcademyState(): AcademyState {
  if (typeof window === 'undefined') return defaultState
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) return defaultState
  try {
    const parsed: unknown = JSON.parse(saved)
    if (typeof parsed !== 'object' || parsed === null) throw new Error('Stored academy state is not an object.')
    return { ...defaultState, ...(parsed as Partial<AcademyState>) }
  } catch (error) {
    console.error('Unable to load saved academy state.', error)
    window.localStorage.removeItem(STORAGE_KEY)
    return defaultState
  }
}

export function saveAcademyState(state: AcademyState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function createActivity(detail: string): AcademyState['activity'][number] {
  return { id: crypto.randomUUID(), detail, createdAt: new Date().toISOString() }
}

export function getCourse(courseId: string): AcademyCourse | undefined {
  return academyCourses.find((course) => course.id === courseId)
}

export function getLessons(course: AcademyCourse): Lesson[] {
  return course.modules.flatMap((module) => module.lessons)
}

export function getCourseProgress(course: AcademyCourse, state: AcademyState): number {
  const lessons = getLessons(course)
  if (lessons.length === 0) return 0
  const completed = state.completedLessons[course.id] ?? []
  return Math.round((completed.filter((id) => lessons.some((lesson) => lesson.id === id)).length / lessons.length) * 100)
}

export function canCompleteCourse(course: AcademyCourse, state: AcademyState): boolean {
  const lessonsComplete = getCourseProgress(course, state) === 100
  const quizPassed = !course.assessmentRequired || state.quizAttempts.some((attempt) => attempt.courseId === course.id && attempt.passed)
  return lessonsComplete && quizPassed
}

export function getCertificateId(courseId: string, enrolledAt: string): string {
  const seed = `${courseId}-${enrolledAt}`.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0).toString(36).toUpperCase()
  return `LA-${seed.padStart(6, '0')}`
}

export function resetAcademyState(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}
