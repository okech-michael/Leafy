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
  soldCount: number
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
  { id: 'produce', name: 'Fresh Produce', description: 'Seasonal fruits and vegetables from local growers.', image: photos('photo-1540420773420-3366772f4999')[0] },
  { id: 'groceries', name: 'Food & Groceries', description: 'Pantry essentials and thoughtfully made foods.', image: photos('photo-1542838132-92c53300491e')[0] },
  { id: 'farm', name: 'Farm Products', description: 'Products and supplies for resilient farms.', image: photos('photo-1464226184884-fa52ac9fcf7a')[0] },
  { id: 'fashion', name: 'Clothing & Fashion', description: 'Considered essentials from independent makers.', image: photos('photo-1483985988355-763728e1935b')[0] },
  { id: 'beauty', name: 'Beauty & Personal Care', description: 'Everyday care from local, independent producers.', image: photos('photo-1608248543803-ba4f8c70ae0b')[0] },
  { id: 'home', name: 'Home & Lifestyle', description: 'Useful goods for a more considered home.', image: photos('photo-1600210492486-724fe5c67fb0')[0] },
  { id: 'electronics', name: 'Electronics & Accessories', description: 'Practical accessories and everyday technology.', image: photos('photo-1498049794561-7780e7231661')[0] },
  { id: 'handmade', name: 'Handmade Products', description: 'Distinctive craft and small-batch products.', image: photos('photo-1452860606245-08befc0ff44b')[0] },
  { id: 'agriculture', name: 'Agricultural Supplies', description: 'Tools and inputs to support productive farms.', image: photos('photo-1592982537447-6f2a6a0a9ca3')[0] },
]

export const marketSellers: MarketSeller[] = [
  { id: 'green-grove', storeName: 'Green Grove Collective', description: 'A grower-led collective offering seasonal produce sourced from small farms around Central Kenya.', location: 'Kiambu County', verified: true, logo: 'GG', cover: photos('photo-1472396961693-142e6e269027')[0], categories: ['Fresh Produce', 'Farm Products'], contactEmail: 'hello@greengrove.example', status: 'approved' },
  { id: 'earth-and-grain', storeName: 'Earth & Grain', description: 'Small-batch pantry goods made with carefully sourced ingredients and a respect for local food traditions.', location: 'Nairobi County', verified: true, logo: 'EG', cover: photos('photo-1490645935967-10de6ba17061')[0], categories: ['Food & Groceries'], contactEmail: 'orders@earthgrain.example', status: 'approved' },
  { id: 'woven-roots', storeName: 'Woven Roots Studio', description: 'Home and lifestyle pieces made in partnership with independent Kenyan makers.', location: 'Nairobi County', verified: true, logo: 'WR', cover: photos('photo-1494438639946-1ebd1d20bf85')[0], categories: ['Home & Lifestyle', 'Handmade Products'], status: 'approved' },
  { id: 'farmstead-tools', storeName: 'Farmstead Tools', description: 'Practical tools and locally relevant supplies for growers and small farms.', location: 'Nakuru County', verified: false, logo: 'FT', cover: photos('photo-1592982537447-6f2a6a0a9ca3')[0], categories: ['Agricultural Supplies'], status: 'approved' },
]

export const marketProducts: MarketProduct[] = [
  { id: 'avocado-box', sellerId: 'green-grove', name: 'Seasonal Avocado Box', description: 'A carefully packed box of ripe and ripening avocados from participating small farms. Harvest quantities vary by season.', categoryId: 'produce', subcategory: 'Fruit', price: 650, previousPrice: 780, images: photos('photo-1523049673857-eb18f1d7b578'), stock: 18, location: 'Kiambu County', specifications: { 'Pack size': '6–8 pieces', Sourcing: 'Smallholder farms', Storage: 'Cool, dry place' }, variations: [{ id: 'ripeness', name: 'Ripeness', options: ['Ready to eat', 'Ripen at home'], required: true }], status: 'active', createdAt: '2026-10-28T08:00:00Z', soldCount: 34 },
  { id: 'market-greens', sellerId: 'green-grove', name: 'Market Greens Bundle', description: 'A seasonal mix of leafy greens, selected and packed after harvest. Exact varieties depend on availability.', categoryId: 'produce', subcategory: 'Vegetables', price: 420, images: photos('photo-1540420773420-3366772f4999'), stock: 22, location: 'Kiambu County', specifications: { 'Pack size': 'Approx. 1.5 kg', Sourcing: 'Local growers', Storage: 'Refrigerate after delivery' }, variations: [{ id: 'bundle', name: 'Bundle size', options: ['Regular', 'Family'], required: true }], status: 'active', createdAt: '2026-10-26T08:00:00Z', soldCount: 29 },
  { id: 'grain-mix', sellerId: 'earth-and-grain', name: 'Whole Grain Breakfast Mix', description: 'A versatile whole-grain mix for breakfast porridge or baking, prepared in small batches.', categoryId: 'groceries', subcategory: 'Pantry', price: 580, images: photos('photo-1517673132405-a56a62b18caf'), stock: 15, location: 'Nairobi County', specifications: { Weight: '750 g', Ingredients: 'Whole grains', Storage: 'Store in a cool, dry place' }, variations: [{ id: 'weight', name: 'Pack size', options: ['750 g', '1.5 kg'], required: true }], status: 'active', createdAt: '2026-10-27T08:00:00Z', soldCount: 41 },
  { id: 'herbal-tea', sellerId: 'earth-and-grain', name: 'Kenyan Herbal Tea Selection', description: 'A small selection of herbal infusions sourced from Kenyan producers. See packaging for ingredients.', categoryId: 'groceries', subcategory: 'Drinks', price: 900, images: photos('photo-1544787219-7f47ccb76574'), stock: 12, location: 'Nairobi County', specifications: { Weight: '60 g', 'Tea bags': '20', Storage: 'Keep sealed and dry' }, variations: [{ id: 'flavour', name: 'Blend', options: ['Lemongrass', 'Ginger & hibiscus'], required: true }], status: 'active', createdAt: '2026-10-24T08:00:00Z', soldCount: 18 },
  { id: 'woven-basket', sellerId: 'woven-roots', name: 'Handwoven Market Basket', description: 'A practical handwoven basket made by independent Kenyan makers. Natural material and finish may vary.', categoryId: 'handmade', subcategory: 'Accessories', price: 1850, previousPrice: 2200, images: photos('photo-1590736969955-71cc94901144'), stock: 7, location: 'Nairobi County', specifications: { Material: 'Natural fibre', 'Approx. dimensions': '35 × 25 cm', Care: 'Keep dry' }, variations: [{ id: 'size', name: 'Size', options: ['Medium', 'Large'], required: true }], status: 'active', createdAt: '2026-10-29T08:00:00Z', soldCount: 12 },
  { id: 'seedling-tray', sellerId: 'farmstead-tools', name: 'Reusable Seedling Tray', description: 'Reusable nursery tray intended for starting seedlings. Confirm suitability for your growing setup before use.', categoryId: 'agriculture', subcategory: 'Growing equipment', price: 750, images: photos('photo-1416879595882-3373a0480b5b'), stock: 0, location: 'Nakuru County', specifications: { Cells: '50', Material: 'Reusable plastic', Care: 'Wash before reuse' }, variations: [], status: 'out-of-stock', createdAt: '2026-10-20T08:00:00Z', soldCount: 9 },
  { id: 'produce-crate', sellerId: 'green-grove', name: 'Seasonal Produce Crate', description: 'A rotating selection of seasonal vegetables and fruit. Contents are confirmed by the seller before dispatch.', categoryId: 'produce', subcategory: 'Produce boxes', price: 1600, images: photos('photo-1542838132-92c53300491e'), stock: 9, location: 'Kiambu County', specifications: { 'Pack size': 'Approx. 5 kg', Sourcing: 'Local farms', 'Seasonal note': 'Contents may change' }, variations: [], status: 'active', createdAt: '2026-10-29T12:00:00Z', soldCount: 15 },
  { id: 'linen-tote', sellerId: 'woven-roots', name: 'Everyday Cotton Tote', description: 'A reusable everyday tote made by an independent textile maker.', categoryId: 'fashion', subcategory: 'Bags', price: 1200, images: photos('photo-1590874103328-eac38a683ce7'), stock: 11, location: 'Nairobi County', specifications: { Material: 'Cotton', Care: 'Cold wash' }, variations: [{ id: 'colour', name: 'Colour', options: ['Natural', 'Olive'], required: true }], status: 'active', createdAt: '2026-10-25T10:00:00Z', soldCount: 21 },
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
