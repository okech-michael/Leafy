export type FarmsRole = 'farmer' | 'worker' | 'expert' | 'farms-admin' | 'super-admin'
export type ActivityStatus = 'Planned' | 'In progress' | 'Completed' | 'Overdue'
export type SupportStatus = 'Submitted' | 'Awaiting Assignment' | 'Assigned' | 'In Progress' | 'Response Provided' | 'Resolved' | 'Closed'

export interface FarmerProfile {
  fullName: string
  phone: string
  email: string
  county: string
  subCounty: string
  ward: string
  village: string
  experience: string
  interests: string[]
  language: string
  bio: string
}

export interface Farm {
  id: string
  name: string
  location: string
  county: string
  subCounty: string
  ward: string
  village: string
  size: number
  sizeUnit: string
  landUse: string
  latitude: string
  longitude: string
  activities: string[]
  irrigation: string
  soil: string
  description: string
  createdAt: string
  image: string
}

export interface CropRecord {
  id: string
  farmId: string
  name: string
  category: string
  variety: string
  plot: string
  plantingDate: string
  expectedHarvestDate: string
  area: number
  areaUnit: string
  stage: string
  irrigation: string
  health: string
  notes: string
}

export interface PlantingSeason {
  id: string
  farmId: string
  cropId: string
  name: string
  startDate: string
  expectedEndDate: string
  status: 'Planned' | 'Active' | 'Completed' | 'Paused'
  area: number
  areaUnit: string
  notes: string
}

export interface FarmActivity {
  id: string
  farmId: string
  cropId: string
  title: string
  type: string
  date: string
  assignedTo: string
  reminder: boolean
  status: ActivityStatus
  notes: string
}

export interface FarmInput {
  id: string
  farmId: string
  name: string
  category: string
  quantity: number
  unit: string
  minimum: number
  cost: number
  supplier: string
  purchaseDate: string
  applicationDate: string
}

export interface HarvestRecord {
  id: string
  farmId: string
  cropId: string
  date: string
  quantity: number
  unit: string
  grade: string
  storage: string
  intendedUse: string
  notes: string
}

export interface LivestockRecord {
  id: string
  farmId: string
  category: string
  breed: string
  quantity: number
  acquiredOn: string
  purpose: string
  notes: string
}

export interface FinanceRecord {
  id: string
  farmId: string
  direction: 'Income' | 'Expense'
  category: string
  amount: number
  date: string
  description: string
}

export interface ExpertRequest {
  id: string
  farmId: string
  subject: string
  category: string
  description: string
  urgency: string
  contactMethod: string
  status: SupportStatus
  createdAt: string
}

export interface FarmsNotification {
  id: string
  title: string
  detail: string
  href: string
  createdAt: string
  read: boolean
}

export interface WorkerAssignment {
  id: string
  farmId: string
  name: string
  email: string
  role: 'Farm Manager' | 'Farm Worker' | 'Agricultural Consultant'
  permissions: string[]
}

export interface ProduceDraft {
  id: string
  farmId: string
  cropId: string
  productName: string
  variety: string
  quantity: number
  unit: string
  grade: string
  price: number
  location: string
  availableDate: string
  status: 'Draft' | 'Seller setup required' | 'Submitted'
}

export interface FarmsState {
  role: FarmsRole
  profile: FarmerProfile | null
  farms: Farm[]
  crops: CropRecord[]
  seasons: PlantingSeason[]
  activities: FarmActivity[]
  inputs: FarmInput[]
  harvests: HarvestRecord[]
  livestock: LivestockRecord[]
  finances: FinanceRecord[]
  expertRequests: ExpertRequest[]
  notifications: FarmsNotification[]
  workers: WorkerAssignment[]
  produceDrafts: ProduceDraft[]
}

export const initialFarmsState: FarmsState = {
  role: 'farmer',
  profile: null,
  farms: [],
  crops: [],
  seasons: [],
  activities: [],
  inputs: [],
  harvests: [],
  livestock: [],
  finances: [],
  expertRequests: [],
  notifications: [],
  workers: [],
  produceDrafts: [],
}

export const farmingInterests = [
  'Crop farming', 'Livestock farming', 'Poultry farming', 'Dairy farming',
  'Horticulture', 'Fruit farming', 'Aquaculture', 'Mixed farming', 'Other',
]

export const cropStages = [
  'Land preparation', 'Planting', 'Germination', 'Vegetative growth',
  'Flowering', 'Fruiting', 'Maturity', 'Harvesting',
]

export const activityTypes = [
  'Land preparation', 'Planting', 'Irrigation', 'Fertiliser application',
  'Weeding', 'Pest observation', 'Pruning', 'Livestock care', 'Harvesting', 'Other',
]

export const farmingResources = [
  {
    id: 'soil-basics',
    category: 'Soil management',
    title: 'Start with what you know about your soil',
    detail: 'Keep notes on soil texture, drainage and crop performance. A soil test from a qualified local service can help guide nutrient decisions.',
    checklist: ['Note where water collects after rain', 'Record soil observations by plot', 'Keep any laboratory test results with farm records'],
  },
  {
    id: 'safe-inputs',
    category: 'Farm inputs',
    title: 'Keep a safe farm-input record',
    detail: 'Record product labels, quantities, dates and the person responsible. Follow label instructions and local rules for any regulated input.',
    checklist: ['Keep inputs in their original labelled containers', 'Store away from children, animals and food', 'Use only as directed by the product label and qualified guidance'],
  },
  {
    id: 'harvest-care',
    category: 'Post-harvest handling',
    title: 'Plan for careful harvesting and storage',
    detail: 'Harvest timing, clean handling and suitable storage can reduce avoidable losses. Requirements vary by crop and local conditions.',
    checklist: ['Prepare clean containers before harvest', 'Separate damaged produce', 'Record harvested quantity, grade and storage location'],
  },
  {
    id: 'climate-records',
    category: 'Climate-smart agriculture',
    title: 'Use farm records to plan around changing seasons',
    detail: 'Local rainfall and planting conditions vary. Keep dates and observations so decisions can be informed by your farm history and trusted local advisories.',
    checklist: ['Record rainfall observations with dates', 'Note planting and emergence dates', 'Confirm seasonal advice with a local agricultural extension professional'],
  },
]

export const programmeExamples = [
  {
    id: 'programme-demo-training',
    title: 'Farmer field learning sessions',
    description: 'Illustrative programme listing: practical peer learning sessions can be managed here when a Leafy Farms programme is published.',
    location: 'Location to be announced',
    eligibility: 'Details provided by the programme organiser',
    status: 'Example only',
  },
]

export const expertDirectory: { id: string; name: string; expertise: string[]; coverage: string; bio: string }[] = []
