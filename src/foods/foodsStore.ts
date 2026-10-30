export type FoodPaymentStatus =
  | 'Pending'
  | 'Initiated'
  | 'Awaiting Customer Action'
  | 'Successful'
  | 'Failed'
  | 'Cancelled'
  | 'Expired'
  | 'Reconciliation Required'

export type FoodOrderStatus =
  | 'Pending Payment'
  | 'Paid'
  | 'Confirmed'
  | 'Accepted'
  | 'In Kitchen'
  | 'Preparing'
  | 'Ready for Collection'
  | 'Ready for Dispatch'
  | 'Dispatched'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refund Requested'
  | 'Refunded'

export type FoodRole = 'customer' | 'foods-manager' | 'kitchen-staff' | 'delivery-staff' | 'super-admin'
export type FoodKind = 'produce' | 'grocery' | 'meal' | 'package'

export interface FoodCategory {
  id: string
  name: string
  description: string
  active: boolean
  order: number
}

export interface FoodOption {
  id: string
  name: string
  choices: { label: string; priceAdjustment: number }[]
  required: boolean
}

export interface FoodProduct {
  id: string
  name: string
  description: string
  categoryId: string
  kind: FoodKind
  price: number
  unit: string
  image: string
  images: string[]
  source: string
  storage: string
  preparation: string
  ingredients: string[]
  allergens: string[]
  nutrition: string
  bestBefore: string
  options: FoodOption[]
  preparationMinutes: number | null
  dietaryTags: string[]
  availability: string
  active: boolean
  demo: boolean
}

export interface FoodCartItem {
  productId: string
  quantity: number
  selections: Record<string, string>
  instructions: string
}

export interface FoodAddress {
  id: string
  name: string
  phone: string
  email: string
  county: string
  town: string
  area: string
  street: string
  buildingNumber: string
  instructions: string
  isDefault: boolean
}

export interface FoodCheckoutDraft {
  name: string
  phone: string
  email: string
  county: string
  town: string
  area: string
  street: string
  buildingNumber: string
  instructions: string
  deliveryMethod: 'standard' | 'pickup' | 'scheduled'
  deliveryDate: string
  deliveryWindow: string
  discountCode: string
}

export interface FoodOrderLine extends FoodCartItem {
  name: string
  unitPrice: number
  unit: string
  image: string
}

export interface FoodOrder {
  id: string
  number: string
  items: FoodOrderLine[]
  address: FoodAddress
  deliveryMethod: FoodCheckoutDraft['deliveryMethod']
  deliveryFee: number
  discount: number
  total: number
  paymentStatus: FoodPaymentStatus
  status: FoodOrderStatus
  paymentId?: string
  receipt?: string
  assignedTo?: string
  deliveryIssue?: string
  createdAt: string
  timeline: { status: FoodOrderStatus; detail: string; createdAt: string }[]
}

export interface FoodPaymentSession {
  orderId: string
  orderNumber: string
  paymentId: string
  amount: number
  phone: string
  status: FoodPaymentStatus
  message: string
}

export interface FoodReview {
  id: string
  productId: string
  orderId: string
  rating: number
  title: string
  body: string
  status: 'Pending moderation' | 'Published' | 'Rejected'
  createdAt: string
}

export interface BulkRequest {
  id: string
  businessName: string
  contactName: string
  phone: string
  email: string
  location: string
  businessType: string
  registrationInfo: string
  products: string
  schedule: string
  status: 'Submitted' | 'Under review' | 'Quotation prepared' | 'Approved' | 'Declined'
  createdAt: string
}

export interface FoodSupportTicket {
  id: string
  category: string
  orderId: string
  message: string
  status: 'Open' | 'Under review' | 'Resolved' | 'Closed'
  createdAt: string
}

export interface FoodNotification {
  id: string
  title: string
  detail: string
  href: string
  read: boolean
  createdAt: string
}

export interface FoodInventoryRecord {
  id: string
  productId: string
  batch: string
  quantity: number
  unit: string
  supplier: string
  purchaseCost: number
  expiryDate: string
  storage: string
  createdAt: string
}

export interface FoodSupplier {
  id: string
  name: string
  contact: string
  location: string
  products: string
  notes: string
}

export interface FoodState {
  role: FoodRole
  profile: { name: string; email: string; phone: string }
  categories: FoodCategory[]
  products: FoodProduct[]
  cart: FoodCartItem[]
  wishlist: string[]
  addresses: FoodAddress[]
  checkoutDraft: FoodCheckoutDraft | null
  checkoutAttemptKey: string | null
  orders: FoodOrder[]
  paymentSession: FoodPaymentSession | null
  discountCode: string
  reviews: FoodReview[]
  bulkRequests: BulkRequest[]
  tickets: FoodSupportTicket[]
  notifications: FoodNotification[]
  inventory: FoodInventoryRecord[]
  suppliers: FoodSupplier[]
}

export const foodCategories: FoodCategory[] = [
  { id: 'vegetables', name: 'Vegetables', description: 'Fresh seasonal vegetables.', active: true, order: 1 },
  { id: 'fruits', name: 'Fruits', description: 'Seasonal fruits and fruit baskets.', active: true, order: 2 },
  { id: 'grains', name: 'Cereals & grains', description: 'Grains, flour and pantry staples.', active: true, order: 3 },
  { id: 'tubers', name: 'Tubers & roots', description: 'Root crops and tubers.', active: true, order: 4 },
  { id: 'legumes', name: 'Legumes', description: 'Beans, peas and pulses.', active: true, order: 5 },
  { id: 'herbs', name: 'Fresh herbs', description: 'Fresh culinary herbs.', active: true, order: 6 },
  { id: 'groceries', name: 'Food essentials', description: 'Everyday cooking and grocery essentials.', active: true, order: 7 },
  { id: 'meals', name: 'Prepared meals', description: 'Prepared meals where service is enabled.', active: true, order: 8 },
  { id: 'packages', name: 'Food packages', description: 'Curated baskets and food packages.', active: true, order: 9 },
]

const foodPhoto = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85'

export const sampleFoodProducts: FoodProduct[] = [
  {
    id: 'seasonal-vegetable-basket', name: 'Seasonal Vegetable Basket',
    description: 'A sample basket featuring seasonal vegetables. Final contents depend on confirmed supplier availability.',
    categoryId: 'vegetables', kind: 'produce', price: 850, unit: 'basket', image: foodPhoto,
    images: [foodPhoto], source: '', storage: '', preparation: '', ingredients: [], allergens: [],
    nutrition: '', bestBefore: '', options: [{ id: 'basket-size', name: 'Basket size', choices: [{ label: 'Regular', priceAdjustment: 0 }, { label: 'Family', priceAdjustment: 650 }], required: true }],
    preparationMinutes: null, dietaryTags: [], availability: 'Sample listing · confirm availability', active: true, demo: true,
  },
  {
    id: 'fresh-fruit-mix', name: 'Fresh Fruit Mix',
    description: 'An illustrative selection of seasonal fruit. Contents are confirmed with the supplier before fulfilment.',
    categoryId: 'fruits', kind: 'produce', price: 700, unit: 'pack', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=85'], source: '', storage: '', preparation: '', ingredients: [], allergens: [],
    nutrition: '', bestBefore: '', options: [{ id: 'fruit-pack', name: 'Pack size', choices: [{ label: 'Small', priceAdjustment: 0 }, { label: 'Large', priceAdjustment: 550 }], required: true }],
    preparationMinutes: null, dietaryTags: [], availability: 'Sample listing · confirm availability', active: true, demo: true,
  },
  {
    id: 'whole-grain-flour', name: 'Whole Grain Flour',
    description: 'Sample pantry product. Ingredients, source and storage details should be confirmed from the supplier label.',
    categoryId: 'grains', kind: 'grocery', price: 320, unit: '1 kg pack', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=85'], source: '', storage: '', preparation: '', ingredients: [], allergens: [],
    nutrition: '', bestBefore: '', options: [], preparationMinutes: null, dietaryTags: [], availability: 'Sample listing · confirm availability', active: true, demo: true,
  },
  {
    id: 'family-meal-bowl', name: 'Family Meal Bowl',
    description: 'Illustrative prepared-meal menu item. Verify ingredients and preparation information before publishing a real menu.',
    categoryId: 'meals', kind: 'meal', price: 950, unit: 'serving', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85'], source: '', storage: '', preparation: '', ingredients: [], allergens: [],
    nutrition: '', bestBefore: '', options: [{ id: 'portion', name: 'Portion', choices: [{ label: 'Single', priceAdjustment: 0 }, { label: 'Double', priceAdjustment: 650 }], required: true }, { id: 'add-on', name: 'Add-on', choices: [{ label: 'No add-on', priceAdjustment: 0 }, { label: 'Seasonal side', priceAdjustment: 180 }], required: true }],
    preparationMinutes: null, dietaryTags: [], availability: 'Demo menu item · ordering schedule not configured', active: true, demo: true,
  },
  {
    id: 'weekly-food-basket', name: 'Weekly Food Basket',
    description: 'Sample package listing. Basket contents and substitutions require confirmation before purchase.',
    categoryId: 'packages', kind: 'package', price: 2400, unit: 'basket', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85',
    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=85'], source: '', storage: '', preparation: '', ingredients: [], allergens: [],
    nutrition: '', bestBefore: '', options: [{ id: 'custom-basket', name: 'Basket preference', choices: [{ label: 'As listed', priceAdjustment: 0 }, { label: 'Request substitutions', priceAdjustment: 0 }], required: true }],
    preparationMinutes: null, dietaryTags: [], availability: 'Sample package · contents to be confirmed', active: true, demo: true,
  },
]

export const initialFoodState: FoodState = {
  role: 'customer',
  profile: { name: '', email: '', phone: '' },
  categories: foodCategories,
  products: sampleFoodProducts,
  cart: [],
  wishlist: [],
  addresses: [],
  checkoutDraft: null,
  checkoutAttemptKey: null,
  orders: [],
  paymentSession: null,
  discountCode: '',
  reviews: [],
  bulkRequests: [],
  tickets: [],
  notifications: [],
  inventory: [],
  suppliers: [],
}

export function foodProduct(state: FoodState, id: string): FoodProduct | undefined {
  return state.products.find((product) => product.id === id)
}

export function foodCartSubtotal(state: FoodState): number {
  return state.cart.reduce((total, item) => {
    const product = foodProduct(state, item.productId)
    if (!product) return total
    const options = Object.entries(item.selections).reduce((sum, [optionId, label]) => {
      const option = product.options.find((itemOption) => itemOption.id === optionId)
      return sum + (option?.choices.find((choice) => choice.label === label)?.priceAdjustment ?? 0)
    }, 0)
    return total + (product.price + options) * item.quantity
  }, 0)
}

export function foodDiscount(subtotal: number, code: string): number {
  return code.trim().toUpperCase() === 'FOOD10' && subtotal >= 1500 ? Math.round(subtotal * 0.1) : 0
}
