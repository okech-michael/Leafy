export type FoundationRole =
  | 'participant'
  | 'foundation-admin'
  | 'programme-manager'
  | 'programme-coordinator'
  | 'volunteer-coordinator'
  | 'communications-officer'
  | 'finance-officer'
  | 'content-editor'
  | 'super-admin'

export type ApplicationStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'More Information Required'
  | 'Approved'
  | 'Rejected'
  | 'Withdrawn'

export interface FoundationFocusArea {
  id: string
  title: string
  description: string
  objectives: string[]
  image: string
}

export interface FoundationProfile {
  heroHeadline: string
  heroIntroduction: string
  mission: string
  vision: string
  values: string[]
}

export interface FoundationProgramme {
  id: string
  slug: string
  name: string
  description: string
  objectives: string
  targetParticipants: string
  location: string
  status: 'Upcoming' | 'Active' | 'Completed' | 'Archived'
  startDate: string
  endDate: string
  eligibility: string
  applicationOpen: boolean
  focusAreaId: string
  image: string
  coordinator: string
}

export interface FoundationStory {
  id: string
  slug: string
  title: string
  introduction: string
  body: string
  author: string
  featured: boolean
  publicationDate: string
  consentStatus: 'Pending' | 'Confirmed' | 'Declined'
  status: 'Draft' | 'Review' | 'Published'
  coverImage: string
  programmeId: string
}

export interface FoundationVolunteerApplication {
  id: string
  fullName: string
  email: string
  phone: string
  location: string
  interests: string[]
  skills: string
  availability: string
  motivation: string
  supportingFileName: string
  privacyConsent: boolean
  status: ApplicationStatus
  createdAt: string
}

export interface FoundationProgrammeApplication {
  id: string
  programmeId: string
  participantName: string
  email: string
  phone: string
  motivation: string
  status: ApplicationStatus
  createdAt: string
}

export interface FoundationEvent {
  id: string
  title: string
  description: string
  date: string
  venue: string
  capacity: number
  registrationOpen: boolean
}

export interface FoundationEventRegistration {
  id: string
  eventId: string
  name: string
  email: string
  registeredAt: string
}

export interface FoundationImpactIndicator {
  id: string
  name: string
  description: string
  value: number | null
  unit: string
  reportingPeriod: string
  evidenceSource: string
  verificationStatus: 'Pending' | 'Verified' | 'Rejected'
  updatedAt: string
}

export interface FoundationState {
  role: FoundationRole
  profile: FoundationProfile
  participant: { name: string; email: string; phone: string; location: string }
  programmes: FoundationProgramme[]
  stories: FoundationStory[]
  volunteerApplications: FoundationVolunteerApplication[]
  programmeApplications: FoundationProgrammeApplication[]
  events: FoundationEvent[]
  eventRegistrations: FoundationEventRegistration[]
  impactIndicators: FoundationImpactIndicator[]
}

export const foundationFocusAreas: FoundationFocusArea[] = [
  {
    id: 'education',
    title: 'Education & learning opportunities',
    description: 'Support access to learning, knowledge and the tools people need to shape their own futures.',
    objectives: ['Make learning opportunities easier to access', 'Connect learners with relevant skills and resources', 'Support community-led learning'],
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'youth',
    title: 'Youth empowerment',
    description: 'Create space for young people to develop ideas, practical skills and pathways to opportunity.',
    objectives: ['Listen to young people and their priorities', 'Build practical skills and confidence', 'Connect youth with mentors and opportunities'],
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'women',
    title: 'Women & community empowerment',
    description: 'Strengthen community participation and support people working toward shared goals.',
    objectives: ['Support inclusive community leadership', 'Improve access to useful resources', 'Encourage locally led initiatives'],
    image: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'skills',
    title: 'Skills & economic opportunity',
    description: 'Help people explore skills, knowledge and connections that can support livelihoods.',
    objectives: ['Explore practical skills development', 'Connect people to relevant ecosystem services', 'Support locally relevant economic ideas'],
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'environment',
    title: 'Environmental conservation',
    description: 'Encourage care for the natural systems that sustain communities and future generations.',
    objectives: ['Promote environmental awareness', 'Support responsible local stewardship', 'Connect communities with relevant expertise'],
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1400&q=85',
  },
  {
    id: 'community',
    title: 'Community development & wellbeing',
    description: 'Work alongside communities to understand priorities and shape thoughtful, sustainable responses.',
    objectives: ['Listen to community priorities', 'Build inclusive participation', 'Support transparent, accountable initiatives'],
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=85',
  },
]

export const initialFoundationState: FoundationState = {
  role: 'participant',
  profile: {
    heroHeadline: 'A better future begins when we invest in people.',
    heroIntroduction: 'Every community has potential. Every individual has a story. We believe meaningful opportunities can help people build stronger lives and create lasting change.',
    mission: 'Support people and communities through meaningful opportunities, empowerment and sustainable development.',
    vision: 'A future where people and communities can access opportunities to grow, contribute and thrive.',
    values: ['Human dignity', 'Opportunity', 'Inclusion', 'Integrity', 'Participation', 'Sustainability', 'Accountability'],
  },
  participant: { name: '', email: '', phone: '', location: '' },
  programmes: [],
  stories: [],
  volunteerApplications: [],
  programmeApplications: [],
  events: [],
  eventRegistrations: [],
  impactIndicators: [],
}
