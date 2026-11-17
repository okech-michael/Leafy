export type MarketRole = 'customer' | 'seller' | 'marketplace-manager' | 'super-admin'
export type PaymentStatus = 'Pending' | 'Initiated' | 'Awaiting Customer Action' | 'Successful' | 'Failed' | 'Cancelled' | 'Expired' | 'Reconciliation Required'
export type OrderStatus = 'Pending Payment' | 'Paid' | 'Confirmed' | 'Processing' | 'Ready for Dispatch' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Return Requested' | 'Refunded'

export interface ProductVariation {
  id: string
  name: string
  options: string[]
  required: boolean
}

export interface MarketProduct {
  id: string
  sellerId: string
  name: string
  description: string
  categoryId: string
  subcategory: string
  price: number
  previousPrice?: number
  images: string[]
  stock: number
  location: string
  specifications: Record<string, string>
  variations: ProductVariation[]
  status: 'active' | 'out-of-stock' | 'pending-review' | 'rejected' | 'archived'
  createdAt: string
}

export interface MarketSeller {
  id: string
  storeName: string
  description: string
  location: string
  verified: boolean
  logo: string
  cover: string
  categories: string[]
  contactEmail?: string
  contactPhone?: string
  status: 'approved' | 'pending' | 'suspended'
}

export interface CartItem {
  productId: string
  quantity: number
  variationSelections: Record<string, string>
}

export interface MarketAddress {
  id: string
  name: string
  phone: string
  county: string
  town: string
  area: string
  instructions: string
}

export interface MarketCheckoutDraft {
  fullName: string
  phone: string
  email: string
  county: string
  town: string
  area: string
  street: string
  buildingNumber: string
  instructions: string
  deliveryMethod: 'standard' | 'pickup'
  discountCode: string
}

export interface MarketPaymentSession {
  orderId: string
  orderNumber: string
  paymentId: string
  amount: number
  phone: string
  status: PaymentStatus
  receipt?: string
  message?: string
}

export interface OrderItem extends CartItem {
  name: string
  unitPrice: number
  sellerId: string
  image: string
}

export interface MarketOrder {
  id: string
  orderNumber: string
  items: OrderItem[]
  address: MarketAddress
  deliveryMethod: 'standard' | 'pickup'
  deliveryFee: number
  discount: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentId?: string
  mpesaReceipt?: string
  createdAt: string
  timeline: { status: OrderStatus; detail: string; createdAt: string }[]
  suborders: { sellerId: string; status: OrderStatus; trackingEvents: { detail: string; createdAt: string }[] }[]
}

export interface ProductReview {
  id: string
  productId: string
  customerName: string
  rating: number
  title: string
  body: string
  createdAt: string
  verifiedPurchase: boolean
  status: 'published' | 'pending' | 'rejected'
}

export interface ReturnRequest {
  id: string
  orderId: string
  productId: string
  reason: string
  explanation: string
  imageName?: string
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Awaiting Return' | 'Return Received' | 'Refund Processing' | 'Refunded'
  createdAt: string
}

export interface SellerApplication {
  id: string
  applicantName: string
  phone: string
  email: string
  storeName: string
  description: string
  location: string
  categories: string[]
  verificationInfo: string
  status: 'Pending' | 'Approved' | 'Rejected'
  createdAt: string
}

export interface MarketState {
  role: MarketRole
  cart: CartItem[]
  wishlist: string[]
  addresses: MarketAddress[]
  orders: MarketOrder[]
  reviews: ProductReview[]
  returnRequests: ReturnRequest[]
  sellerApplications: SellerApplication[]
  notifications: { id: string; title: string; detail: string; href: string; read: boolean; createdAt: string }[]
  recentSearches: string[]
  customer: { name: string; email: string; phone: string }
  cartDiscountCode: string
  checkoutDraft: MarketCheckoutDraft | null
  paymentSession: MarketPaymentSession | null
}

const photos = (id: string, widths = [1200, 900]) => widths.map((width) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`)

export const marketCategories = [
  { id: 'produce', name: 'Farm Produce', description: 'Seasonal crops and produce from agricultural producers.', image: photos('photo-1540420773420-3366772f4999')[0] },
  { id: 'groceries', name: 'Food Products', description: 'Food products and pantry offerings from producers.', image: photos('photo-1542838132-92c53300491e')[0] },
  { id: 'agriculture', name: 'Agricultural Supplies', description: 'Tools and inputs to support productive farms.', image: photos('photo-1592982537447-6f2a6a0a9ca3')[0] },
]

export const marketSellers: MarketSeller[] = [
  { id: 'green-grove', storeName: 'Green Grove Collective', description: 'Illustrative producer profile offering seasonal produce from participating farms.', location: 'Kiambu County', verified: false, logo: 'GG', cover: photos('photo-1472396961693-142e6e269027')[0], categories: ['Fresh Produce', 'Farm Produce'], status: 'approved' },
  { id: 'earth-and-grain', storeName: 'Earth & Grain', description: 'Illustrative food producer profile for small-batch pantry products.', location: 'Nairobi County', verified: false, logo: 'EG', cover: photos('photo-1490645935967-10de6ba17061')[0], categories: ['Food Products'], status: 'approved' },
  { id: 'farmstead-tools', storeName: 'Farmstead Tools', description: 'Illustrative supplier profile for locally relevant farm tools and supplies.', location: 'Nakuru County', verified: false, logo: 'FT', cover: photos('photo-1592982537447-6f2a6a0a9ca3')[0], categories: ['Agricultural Supplies'], status: 'approved' },
]

export const marketProducts: MarketProduct[] = [
  { id: 'avocado-box', sellerId: 'green-grove', name: 'Seasonal Avocado Box', description: 'Illustrative produce listing. Harvest quantities and availability must be confirmed by the producer.', categoryId: 'produce', subcategory: 'Fruit', price: 650, previousPrice: 780, images: photos('photo-1523049673857-eb18f1d7b578'), stock: 18, location: 'Kiambu County', specifications: { 'Pack size': '6–8 pieces', Sourcing: 'Smallholder farms', Storage: 'Cool, dry place' }, variations: [{ id: 'ripeness', name: 'Ripeness', options: ['Ready to eat', 'Ripen at home'], required: true }], status: 'active', createdAt: '2026-10-28T08:00:00Z' },
  { id: 'market-greens', sellerId: 'green-grove', name: 'Market Greens Bundle', description: 'Illustrative seasonal produce listing. Varieties and quantities depend on confirmed producer availability.', categoryId: 'produce', subcategory: 'Vegetables', price: 420, images: photos('photo-1540420773420-3366772f4999'), stock: 22, location: 'Kiambu County', specifications: { 'Pack size': 'Approx. 1.5 kg', Sourcing: 'Local growers', Storage: 'Refrigerate after delivery' }, variations: [{ id: 'bundle', name: 'Bundle size', options: ['Regular', 'Family'], required: true }], status: 'active', createdAt: '2026-10-26T08:00:00Z' },
  { id: 'grain-mix', sellerId: 'earth-and-grain', name: 'Whole Grain Breakfast Mix', description: 'Illustrative food product listing. Ingredients and packaging must be confirmed from the supplier before publication.', categoryId: 'groceries', subcategory: 'Pantry', price: 580, images: photos('photo-1517673132405-a56a62b18caf'), stock: 15, location: 'Nairobi County', specifications: { Weight: '750 g', Ingredients: 'Whole grains', Storage: 'Store in a cool, dry place' }, variations: [{ id: 'weight', name: 'Pack size', options: ['750 g', '1.5 kg'], required: true }], status: 'active', createdAt: '2026-10-27T08:00:00Z' },
  { id: 'herbal-tea', sellerId: 'earth-and-grain', name: 'Kenyan Herbal Tea Selection', description: 'Illustrative food product listing. Producer, ingredients and availability must be confirmed before publication.', categoryId: 'groceries', subcategory: 'Drinks', price: 900, images: photos('photo-1544787219-7f47ccb76574'), stock: 12, location: 'Nairobi County', specifications: { Weight: '60 g', 'Tea bags': '20', Storage: 'Keep sealed and dry' }, variations: [{ id: 'flavour', name: 'Blend', options: ['Lemongrass', 'Ginger & hibiscus'], required: true }], status: 'active', createdAt: '2026-10-24T08:00:00Z' },
  { id: 'seedling-tray', sellerId: 'farmstead-tools', name: 'Reusable Seedling Tray', description: 'Illustrative agricultural supply listing. Confirm suitability and availability with the supplier before purchase.', categoryId: 'agriculture', subcategory: 'Growing equipment', price: 750, images: photos('photo-1416879595882-3373a0480b5b'), stock: 0, location: 'Nakuru County', specifications: { Cells: '50', Material: 'Reusable plastic', Care: 'Wash before reuse' }, variations: [], status: 'out-of-stock', createdAt: '2026-10-20T08:00:00Z' },
  { id: 'produce-crate', sellerId: 'green-grove', name: 'Seasonal Produce Crate', description: 'Illustrative produce listing. Contents, quantities and dispatch must be confirmed by the producer.', categoryId: 'produce', subcategory: 'Produce boxes', price: 1600, images: photos('photo-1542838132-92c53300491e'), stock: 9, location: 'Kiambu County', specifications: { 'Pack size': 'Approx. 5 kg', Sourcing: 'Local farms', 'Seasonal note': 'Contents may change' }, variations: [], status: 'active', createdAt: '2026-10-29T12:00:00Z' },
]

export const marketReviews: ProductReview[] = []

const STORAGE_KEY = 'leafy-market-state-v1'

export const initialMarketState: MarketState = {
  role: 'customer',
  cart: [],
  wishlist: [],
  addresses: [],
  orders: [],
  reviews: [],
  returnRequests: [],
  sellerApplications: [],
  notifications: [],
  recentSearches: [],
  customer: { name: '', email: '', phone: '' },
  cartDiscountCode: '',
  checkoutDraft: null,
  paymentSession: null,
}

export function loadMarketState(): MarketState {
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return initialMarketState
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') throw new Error('Stored market state is malformed.')
    return { ...initialMarketState, ...(parsed as Partial<MarketState>) }
  } catch (error) {
    console.error('Unable to load saved Leafy Market state.', error)
    window.localStorage.removeItem(STORAGE_KEY)
    return initialMarketState
  }
}

export function saveMarketState(state: MarketState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export const sellerFor = (sellerId: string) => marketSellers.find((seller) => seller.id === sellerId)
export const productFor = (productId: string) => marketProducts.find((product) => product.id === productId)
export const categoryFor = (categoryId: string) => marketCategories.find((category) => category.id === categoryId)

export function cartSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + (productFor(item.productId)?.price ?? 0) * item.quantity, 0)
}

export function cartDiscount(subtotal: number, code: string): number {
  return code.trim().toUpperCase() === 'LEAFY10' && subtotal >= 1000 ? Math.round(subtotal * 0.1) : 0
}

export function getDeliveryFee(method: 'standard' | 'pickup', cart: CartItem[]): number {
  if (method === 'pickup' || cart.length === 0) return 0
  const sellers = new Set(cart.map((item) => productFor(item.productId)?.sellerId).filter(Boolean))
  return sellers.size * 250
}

export function cartItemCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}

export function itemSelectionKey(item: CartItem): string {
  return `${item.productId}:${Object.entries(item.variationSelections).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join('&')}`
}

export function canReviewProduct(productId: string, state: MarketState): boolean {
  return state.orders.some((order) => order.status === 'Delivered' && order.items.some((item) => item.productId === productId))
}

export function orderItemsFromCart(cart: CartItem[]): OrderItem[] {
  return cart.flatMap((item) => {
    const product = productFor(item.productId)
    if (!product) return []
    return [{ ...item, name: product.name, unitPrice: product.price, sellerId: product.sellerId, image: product.images[0] }]
  })
}
