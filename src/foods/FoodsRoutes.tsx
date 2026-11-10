import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CircleHelp, Download, Heart, Leaf, Minus, Package, Plus, Search, ShieldCheck,
  ShoppingBag, SlidersHorizontal, Truck, UserRound, UtensilsCrossed,
} from 'lucide-react'
import { foodCsv, loadFoodState, readFoodApi, saveFoodState } from './foodsService'
import {
  foodCartSubtotal, foodDiscount, foodProduct,
  type BulkRequest, type FoodAddress, type FoodCartItem, type FoodCategory,
  type FoodCheckoutDraft, type FoodInventoryRecord,
  type FoodOrder, type FoodPaymentSession, type FoodPaymentStatus, type FoodProduct,
  type FoodRole, type FoodState, type FoodSupplier, type FoodSupportTicket,
} from './foodsStore'

const button = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#285342] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f4032] disabled:cursor-not-allowed disabled:opacity-50'
const secondary = 'inline-flex items-center justify-center gap-2 rounded-full border border-[#dce4dc] bg-white px-4 py-2.5 text-sm font-medium text-[#285342] hover:border-[#285342]'
const card = 'rounded-2xl border border-[#e6eae5] bg-white p-5 shadow-[0_16px_40px_rgba(32,41,35,.04)]'
const money = (amount: number) => `KSh ${amount.toLocaleString('en-KE')}`
const now = () => new Date().toISOString()
const foodHero = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=85'

const customerLinks = [
  ['/foods/account', 'Overview'],
  ['/foods/orders', 'My orders'],
  ['/foods/wishlist', 'Wishlist'],
  ['/foods/addresses', 'Saved addresses'],
  ['/foods/reviews', 'My reviews'],
  ['/foods/subscriptions', 'Subscriptions'],
  ['/foods/support', 'Customer support'],
]

export function FoodsRoutes() {
  const [state, setState] = useState<FoodState>(() => loadFoodState())
  const location = useLocation()
  const isOperations = location.pathname.startsWith('/foods/manage')
  const isCustomerAccount = location.pathname.startsWith('/foods/account') || ['/foods/orders', '/foods/addresses', '/foods/reviews', '/foods/subscriptions', '/foods/support'].some((path) => location.pathname.startsWith(path))

  const update = (operation: (current: FoodState) => FoodState) => {
    setState((current) => {
      const next = operation(current)
      saveFoodState(next)
      return next
    })
  }

  return <div className="min-h-screen bg-[#F6F5EF] text-[#202923]">
    {isOperations && <header className="sticky top-0 z-40 border-b border-[#e6eae5] bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3 sm:px-6"><Link to="/foods/manage" className="flex items-center gap-2 font-semibold"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#285342] text-white"><UtensilsCrossed className="h-5 w-5" /></span>Leafy Foods Operations</Link><span className="hidden text-sm text-[#6B756E] sm:block">Staff workspace · role preview</span><Link to="/foods" className="text-sm font-medium text-[#285342]">Customer site</Link></div></header>}
    {!isOperations && <div className="border-b border-[#E6EAE5] bg-white/75">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <form className="relative flex min-w-[220px] flex-1 items-center rounded-full border border-[#e6eae5] bg-[#F6F5EF] px-4" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); window.location.href = `/foods/shop?q=${encodeURIComponent(String(data.get('q') ?? ''))}` }}>
          <Search className="h-4 w-4 shrink-0 text-[#758178]" />
          <input name="q" defaultValue={new URLSearchParams(location.search).get('q') ?? ''} placeholder="Search fresh food, groceries and meals" className="w-full bg-transparent px-3 py-2.5 text-sm outline-none" />
        </form>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/foods/wishlist" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e6eae5] text-[#285342] transition hover:bg-[#F6F5EF]" aria-label="Food wishlist"><Heart className="h-4 w-4" /></Link>
          <Link to="/foods/account" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e6eae5] text-[#285342] transition hover:bg-[#F6F5EF]" aria-label="Food account"><UserRound className="h-4 w-4" /></Link>
          <Link to="/foods/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#285342] text-white" aria-label={`Cart (${state.cart.reduce((sum, item) => sum + item.quantity, 0)} items)`}>
            <ShoppingBag className="h-4 w-4" />
            {state.cart.length > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A4C68C] px-1 text-[10px] font-bold text-[#202923]">{state.cart.reduce((sum, item) => sum + item.quantity, 0)}</span>}
          </Link>
        </div>
      </div>
    </div>}
    <main className={isOperations ? 'mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8' : 'mx-auto max-w-[1600px] px-4 py-7 sm:px-6 lg:px-8'}>
      {isCustomerAccount && <nav aria-label="Food account navigation" className="mb-5 flex gap-2 overflow-x-auto">{customerLinks.map(([to, label]) => <Link key={to} to={to} className={`${secondary} shrink-0 py-2 text-xs`}>{label}</Link>)}</nav>}
      <Routes>
        <Route index element={<FoodHome state={state} update={update} />} />
        <Route path="about" element={<FoodInfoPage />} />
        <Route path="contact" element={<FoodSupportPage state={state} update={update} />} />
        <Route path="shop" element={<FoodCatalogue state={state} update={update} />} />
        <Route path="category/:categoryId" element={<FoodCatalogue state={state} update={update} />} />
        <Route path="product/:productId" element={<FoodProductPage state={state} update={update} />} />
        <Route path="meals" element={<FoodCatalogue state={state} update={update} kind="meal" />} />
        <Route path="packages" element={<FoodCatalogue state={state} update={update} kind="package" />} />
        <Route path="cart" element={<FoodCartPage state={state} update={update} />} />
        <Route path="checkout" element={<FoodCheckoutPage state={state} update={update} />} />
        <Route path="payment" element={<FoodPaymentPage state={state} update={update} />} />
        <Route path="payment/:paymentId" element={<FoodPaymentPage state={state} update={update} />} />
        <Route path="orders" element={<FoodOrders state={state} update={update} />} />
        <Route path="orders/:orderId" element={<FoodOrderDetail state={state} update={update} />} />
        <Route path="wishlist" element={<FoodWishlist state={state} update={update} />} />
        <Route path="account" element={<FoodAccount state={state} update={update} />} />
        <Route path="addresses" element={<FoodAddresses state={state} update={update} />} />
        <Route path="reviews" element={<FoodReviews state={state} update={update} />} />
        <Route path="subscriptions" element={<FoodSubscriptions />} />
        <Route path="bulk" element={<BulkOrderPage state={state} update={update} />} />
        <Route path="support" element={<FoodSupportPage state={state} update={update} />} />
        <Route path="manage/*" element={<FoodOperations state={state} update={update} />} />
        <Route path="*" element={<Navigate to="/foods" replace />} />
      </Routes>
    </main>
    {!isOperations && <FoodFooter />}
  </div>
}

type FoodUpdate = (operation: (current: FoodState) => FoodState) => void

function FoodHome({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const categories = state.categories.filter((category) => category.active).sort((a, b) => a.order - b.order)
  const featured = state.products.filter((product) => product.active).slice(0, 4)
  return <div className="space-y-12">
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#202923] text-white"><img src={foodHero} alt="Fresh produce in a food market" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-50" /><div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#15231d]/90 via-[#15231d]/60 to-transparent" /><div className="w-full max-w-[1400px] px-6 py-20 sm:px-12 sm:py-28"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#A4C68C]">Leafy Foods · food products and business</p><h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Food products for customers, producers and partners.</h1><p className="mt-5 max-w-4xl text-base leading-7 text-white/90">Leafy Foods presents food products, packages and relevant business offerings, and connects food producers with customers and organisations.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/foods/shop" className="rounded-full bg-[#A4C68C] px-6 py-3 text-sm font-semibold text-[#202923]">Browse food offerings <ArrowRight className="ml-1 inline h-4 w-4" /></Link><Link to="/foods/bulk" className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold">Business supply enquiries</Link></div></div></section>
    <div role="status" className="rounded-xl border border-[#e8d8ae] bg-[#fff9e9] p-3 text-xs leading-5 text-[#604c27]"><strong>Preview catalogue.</strong> Product photos, descriptions and prices below are illustrative local demo data—not confirmation of current stock or an active Leafy Foods menu. No ratings are fabricated.</div>
    <section><SectionHeading eyebrow="Browse" title="Shop by category" action={<Link to="/foods/shop" className="text-sm font-semibold text-[#285342]">All food <ArrowRight className="ml-1 inline h-4 w-4" /></Link>} /><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{categories.map((category, index) => <Link key={category.id} to={`/foods/category/${category.id}`} className="rounded-2xl border border-[#e6eae5] bg-white p-4 transition hover:border-[#A4C68C]"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]">{index % 2 ? <Package className="h-5 w-5" /> : <Leaf className="h-5 w-5" />}</span><p className="mt-3 font-semibold">{category.name}</p><p className="mt-1 text-xs leading-5 text-[#6B756E]">{category.description}</p></Link>)}</div></section>
    <FoodShelf title="Featured food" eyebrow="Illustrative demo catalogue" products={featured} state={state} update={update} />
    <section className="grid gap-4 rounded-2xl bg-[#EDF4EA] p-5 sm:grid-cols-3 sm:p-7">{[[ShieldCheck, 'Clear order totals', 'Charges are shown before payment; the backend must calculate the authoritative total.'], [Truck, 'Delivery choices', 'Delivery options and fees depend on configured service areas.'], [CircleHelp, 'Customer support', 'Record an enquiry or order issue from your account.']].map(([Icon, title, detail]) => <article key={String(title)} className="flex gap-3 rounded-xl bg-white p-4"><Icon className="h-5 w-5 shrink-0 text-[#285342]" /><div><p className="font-semibold">{String(title)}</p><p className="mt-1 text-sm leading-6 text-[#6B756E]">{String(detail)}</p></div></article>)}</section>
    <section className="grid gap-5 rounded-2xl border border-[#e6eae5] bg-white p-6 md:grid-cols-2 md:items-center"><div><Eyebrow>For institutions and businesses</Eyebrow><h2 className="mt-2 text-2xl font-semibold">Ordering for a kitchen, school or workplace?</h2><p className="mt-2 text-sm leading-6 text-[#6B756E]">Tell us what you need and the supply schedule you have in mind. Requests are reviewed before quotations or credit terms are offered.</p><Link to="/foods/bulk" className={`${button} mt-4`}>Request a bulk quotation <ArrowRight className="h-4 w-4" /></Link></div><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80" alt="Prepared meal with fresh ingredients" className="h-56 w-full rounded-xl object-cover" /></section>
    <section className={`${card} flex flex-wrap items-center justify-between gap-4`}><div><Eyebrow>Connected across Leafy</Eyebrow><h2 className="mt-1 text-xl font-semibold">Meet growers through Leafy Market</h2><p className="mt-1 text-sm text-[#6B756E]">Browse participating sellers and fresh farm produce in the connected marketplace.</p></div><Link to="/market" className={secondary}>Visit Leafy Market <ArrowRight className="h-4 w-4" /></Link></section>
  </div>
}

function FoodCatalogue({ state, update, kind }: { state: FoodState; update: FoodUpdate; kind?: 'meal' | 'package' }) {
  const [params, setParams] = useSearchParams()
  const { categoryId } = useParams()
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('Relevance')
  const query = params.get('q') ?? ''
  const category = state.categories.find((item) => item.id === categoryId)
  let products = state.products.filter((product) => product.active)
  if (kind) products = products.filter((product) => product.kind === kind)
  if (categoryId) products = products.filter((product) => product.categoryId === categoryId)
  if (query) products = products.filter((product) => `${product.name} ${product.description} ${product.categoryId}`.toLowerCase().includes(query.toLowerCase()))
  if (minPrice) products = products.filter((product) => product.price >= Number(minPrice))
  if (maxPrice) products = products.filter((product) => product.price <= Number(maxPrice))
  if (sort === 'Price: low to high') products = [...products].sort((a, b) => a.price - b.price)
  if (sort === 'Price: high to low') products = [...products].sort((a, b) => b.price - a.price)
  if (sort === 'Newest') products = [...products].reverse()
  const title = kind === 'meal' ? 'Meals & menus' : kind === 'package' ? 'Food packages' : query ? `Search results for “${query}”` : category?.name ?? 'Shop food'
  return <div className="space-y-6"><SectionHeading eyebrow="Leafy Foods" title={title} detail={`${products.length} demo listing${products.length === 1 ? '' : 's'} · No availability or nutritional claims are implied by sample catalogue data.`} /><div className="rounded-xl border border-[#e8d8ae] bg-[#fff9e9] p-3 text-xs leading-5 text-[#604c27]">Catalogue and availability are illustrative. Real stock, product details and meal service hours require the food catalogue service.</div><div className="grid gap-5 lg:grid-cols-[230px_1fr]"><aside className={`${card} h-fit space-y-4`}><h2 className="flex items-center gap-2 font-semibold"><SlidersHorizontal className="h-4 w-4" /> Filters</h2><label className="block text-sm">Category<select value={categoryId ?? ''} onChange={(event) => window.location.href = event.target.value ? `/foods/category/${event.target.value}` : '/foods/shop'} className="mt-2 w-full rounded-lg border bg-white p-2.5"><option value="">All food</option>{state.categories.filter((item) => item.active).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><div className="grid grid-cols-2 gap-2"><label className="text-xs">Min KSh<input type="number" min="0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label><label className="text-xs">Max KSh<input type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label></div><label className="block text-sm">Sort<select value={sort} onChange={(event) => setSort(event.target.value)} className="mt-2 w-full rounded-lg border bg-white p-2.5">{['Relevance', 'Price: low to high', 'Price: high to low', 'Newest'].map((value) => <option key={value}>{value}</option>)}</select></label><button onClick={() => { setMinPrice(''); setMaxPrice(''); setSort('Relevance'); setParams({}) }} className="text-xs font-semibold text-[#285342]">Clear filters</button></aside><div>{products.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">{products.map((product) => <FoodProductCard key={product.id} product={product} state={state} update={update} />)}</div> : <EmptyState title="No food listings found" detail="Try another search or category. New listings appear when enabled by Leafy Foods." action={<Link to="/foods/shop" className={secondary}>Browse all food</Link>} />}</div></div></div>
}

function FoodProductCard({ product, state, update }: { product: FoodProduct; state: FoodState; update: FoodUpdate }) {
  const saved = state.wishlist.includes(product.id)
  return <article className="overflow-hidden rounded-2xl border border-[#e6eae5] bg-white"><Link to={`/foods/product/${product.id}`} className="relative block"><img src={product.image} alt="" className="aspect-square w-full object-cover" /><span className="absolute left-2 top-2 rounded-full bg-[#fff9e9] px-2 py-1 text-[10px] font-medium text-[#604c27]">Demo listing</span></Link><div className="p-3"><p className="text-[10px] uppercase tracking-wide text-[#39845A]">{state.categories.find((category) => category.id === product.categoryId)?.name}</p><Link to={`/foods/product/${product.id}`} className="mt-1 line-clamp-2 block min-h-10 text-sm font-semibold">{product.name}</Link><p className="mt-1 text-xs text-[#6B756E]">{money(product.price)} / {product.unit}</p><p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#6B756E]">{product.availability}</p><div className="mt-3 flex gap-2"><Link to={`/foods/product/${product.id}`} className={`${button} min-w-0 flex-1 px-2 py-2 text-xs`}>View item</Link><button aria-label={saved ? 'Remove from food wishlist' : 'Add to food wishlist'} onClick={() => update((current) => ({ ...current, wishlist: saved ? current.wishlist.filter((id) => id !== product.id) : [...current.wishlist, product.id] }))} className="rounded-full border p-2 text-[#285342]"><Heart className={`h-4 w-4 ${saved ? 'fill-[#285342]' : ''}`} /></button></div></div></article>
}

function FoodShelf({ title, eyebrow, products, state, update }: { title: string; eyebrow: string; products: FoodProduct[]; state: FoodState; update: FoodUpdate }) {
  return <section><SectionHeading eyebrow={eyebrow} title={title} action={<Link to="/foods/shop" className="text-sm font-semibold text-[#285342]">Shop all <ArrowRight className="inline h-4 w-4" /></Link>} /><div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{products.map((product) => <FoodProductCard key={product.id} product={product} state={state} update={update} />)}</div></section>
}

function FoodProductPage({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const { productId = '' } = useParams()
  const navigate = useNavigate()
  const product = foodProduct(state, productId)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [instructions, setInstructions] = useState('')
  const [message, setMessage] = useState('')
  if (!product || !product.active) return <EmptyState title="Food item unavailable" detail="This item is not in the current catalogue." action={<Link className={button} to="/foods/shop">Continue shopping</Link>} />
  const add = (buyNow = false) => {
    const missing = product.options.filter((option) => option.required && !selections[option.id])
    if (missing.length) { setMessage(`Choose ${missing.map((option) => option.name).join(' and ')} first.`); return }
    const line: FoodCartItem = { productId, quantity, selections, instructions: instructions.trim() }
    update((current) => ({ ...current, cart: addFoodLine(current.cart, line) }))
    if (buyNow) navigate('/foods/cart')
    else setMessage('Added to your cart. This is a demo listing; fulfilment requires backend confirmation.')
  }
  const unitPrice = product.price + Object.entries(selections).reduce((sum, [optionId, selected]) => sum + (product.options.find((option) => option.id === optionId)?.choices.find((choice) => choice.label === selected)?.priceAdjustment ?? 0), 0)
  return <div className="space-y-7"><Link to="/foods/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[#285342]"><ArrowLeft className="h-4 w-4" /> Continue shopping</Link><div className="grid gap-7 lg:grid-cols-2"><div><img src={product.image} alt={product.name} className="aspect-square w-full rounded-2xl object-cover" /><p className="mt-2 text-xs text-[#6B756E]">Illustrative catalogue image.</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-[#39845A]">{state.categories.find((category) => category.id === product.categoryId)?.name} · Demo listing</p><h1 className="mt-2 text-3xl font-semibold">{product.name}</h1><p className="mt-3 text-2xl font-semibold text-[#285342]">{money(unitPrice)} <span className="text-sm font-normal text-[#6B756E]">/ {product.unit}</span></p><p className="mt-4 leading-7 text-[#59665d]">{product.description}</p><p className="mt-3 rounded-lg bg-[#fff9e9] p-3 text-xs leading-5 text-[#604c27]">{product.availability}</p>{product.source && <p className="mt-3 text-sm">Source: {product.source}</p>}{product.storage && <p className="mt-2 text-sm">Storage: {product.storage}</p>}{product.preparation && <p className="mt-2 text-sm">Preparation: {product.preparation}</p>}{product.kind === 'meal' && <p className="mt-2 text-xs text-[#6B756E]">Preparation time and dietary details have not been verified or configured.</p>}{product.ingredients.length > 0 && <p className="mt-3 text-sm"><strong>Ingredients:</strong> {product.ingredients.join(', ')}</p>}{product.allergens.length > 0 && <p className="mt-2 text-sm"><strong>Allergens:</strong> {product.allergens.join(', ')}</p>}{product.nutrition && <p className="mt-2 text-sm"><strong>Nutrition:</strong> {product.nutrition}</p>}{product.bestBefore && <p className="mt-2 text-sm"><strong>Best before:</strong> {product.bestBefore}</p>}<div className="mt-5 space-y-4">{product.options.map((option) => <label key={option.id} className="block text-sm font-medium">{option.name}{option.required && <span className="text-[#a1462b]"> *</span>}<select value={selections[option.id] ?? ''} onChange={(event) => setSelections((current) => ({ ...current, [option.id]: event.target.value }))} className="mt-2 w-full rounded-xl border border-[#dce4dc] bg-white p-3"><option value="">Select {option.name.toLowerCase()}</option>{option.choices.map((choice) => <option key={choice.label} value={choice.label}>{choice.label}{choice.priceAdjustment ? ` (+${money(choice.priceAdjustment)})` : ''}</option>)}</select></label>)}{product.kind === 'meal' && <label className="block text-sm">Special preparation instructions<textarea rows={2} maxLength={280} value={instructions} onChange={(event) => setInstructions(event.target.value)} className="mt-2 w-full rounded-xl border p-3" placeholder="Optional · subject to kitchen confirmation" /></label>}<div className="flex items-center gap-3"><span className="text-sm">Quantity</span><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className={secondary}><Minus className="h-4 w-4" /></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)} className={secondary}><Plus className="h-4 w-4" /></button></div><p className="text-xs text-[#6B756E]">Final stock and ordering-window validation is performed by the service at checkout.</p><div className="flex flex-col gap-2 sm:flex-row"><button onClick={() => add()} className={`${button} flex-1`}>Add to cart <ShoppingBag className="h-4 w-4" /></button><button onClick={() => add(true)} className={`${secondary} flex-1`}>Buy now</button></div>{message && <p role="status" className="text-sm text-[#285342]">{message}</p>}</div></div></div><section className="grid gap-4 sm:grid-cols-2"><div className={card}><h2 className="font-semibold">Product information</h2><p className="mt-2 text-sm text-[#6B756E]">Origin, storage, ingredients, allergen and nutrition details are only shown when supplied and verified for this product.</p></div><div className={card}><h2 className="font-semibold">Customer reviews</h2><p className="mt-2 text-sm text-[#6B756E]">No verified reviews have been published for this demo catalogue.</p></div></section></div>
}

function FoodCartPage({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const [code, setCode] = useState(state.discountCode)
  const [notice, setNotice] = useState('')
  const items = state.cart.map((item) => ({ item, product: foodProduct(state, item.productId) })).filter((row): row is { item: FoodCartItem; product: FoodProduct } => Boolean(row.product))
  const subtotal = foodCartSubtotal(state)
  const discount = foodDiscount(subtotal, state.discountCode)
  const saveCode = () => {
    const accepted = code.trim().toUpperCase() === 'FOOD10' && subtotal >= 1500
    update((current) => ({ ...current, discountCode: accepted ? 'FOOD10' : '' }))
    setNotice(accepted ? 'FOOD10 applied to the demo cart.' : 'This code is not valid for this cart. FOOD10 is demo-only and requires KSh 1,500.')
  }
  const changeQuantity = (item: FoodCartItem, delta: number) => update((current) => ({
    ...current,
    cart: current.cart.map((line) => sameFoodLine(line, item) ? { ...line, quantity: Math.max(1, line.quantity + delta) } : line),
  }))
  const remove = (item: FoodCartItem) => update((current) => ({ ...current, cart: current.cart.filter((line) => !sameFoodLine(line, item)) }))
  return <div className="space-y-6"><SectionHeading eyebrow="Step 2 · Review your cart" title="Shopping cart" detail="Check products, options and quantities. Delivery details come after cart review." />{!items.length ? <EmptyState title="Your cart is empty" detail="Explore the food catalogue and add the items you want." action={<Link to="/foods/shop" className={button}>Shop food</Link>} /> : <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="space-y-3">{items.map(({ item, product }) => <article key={foodLineKey(item)} className={`${card} flex gap-4 p-4`}><Link to={`/foods/product/${product.id}`}><img src={product.image} alt="" className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28" /></Link><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><Link to={`/foods/product/${product.id}`} className="font-semibold">{product.name}</Link><p className="mt-1 text-xs text-[#6B756E]">{product.unit} · Unit price {money(foodUnitPrice(product, item))}</p>{Object.entries(item.selections).map(([id, value]) => <p key={id} className="mt-1 text-xs text-[#6B756E]">{product.options.find((option) => option.id === id)?.name}: {value}</p>)}{item.instructions && <p className="mt-1 text-xs text-[#6B756E]">Kitchen note: {item.instructions}</p>}</div><button onClick={() => remove(item)} aria-label={`Remove ${product.name}`} className="h-fit text-xs text-[#a1462b]">Remove</button></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><button aria-label={`Decrease ${product.name} quantity`} disabled={item.quantity <= 1} onClick={() => changeQuantity(item, -1)} className="rounded-full border p-1.5 disabled:opacity-40"><Minus className="h-3 w-3" /></button><span className="w-6 text-center text-sm">{item.quantity}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => changeQuantity(item, 1)} className="rounded-full border p-1.5"><Plus className="h-3 w-3" /></button></div><strong>{money(foodUnitPrice(product, item) * item.quantity)}</strong></div></div></article>)}</div><aside className={`${card} h-fit lg:sticky lg:top-24`}><h2 className="text-lg font-semibold">Order summary</h2><div className="mt-4 flex gap-2"><input aria-label="Promotional code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Promo code" className="min-w-0 flex-1 rounded-full border border-[#e6eae5] px-4 py-2 text-sm" /><button onClick={saveCode} className={secondary}>Apply</button></div>{notice && <p role="status" className="mt-2 text-xs text-[#285342]">{notice}</p>}<Summary label="Subtotal" value={money(subtotal)} /><Summary label="Discount" value={discount ? `−${money(discount)}` : money(0)} /><Summary label="Delivery" value="Confirmed at checkout" /><p className="mt-2 text-xs leading-5 text-[#6B756E]">No delivery fee or delivery slot is configured in this preview. Any applicable charges must be confirmed before payment.</p><div className="my-4 border-t" /><Summary label="Current items total" value={money(subtotal - discount)} strong /><Link to="/foods/shop" className={`${secondary} mt-5 w-full`}>Continue Shopping</Link><Link to="/foods/checkout" className={`${button} mt-2 w-full`}>Proceed to Checkout <ArrowRight className="h-4 w-4" /></Link></aside></div>}</div>
}

function FoodCheckoutPage({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const navigate = useNavigate()
  const preferred = state.addresses.find((address) => address.isDefault) ?? state.addresses[0]
  const [draft, setDraft] = useState<FoodCheckoutDraft>(() => state.checkoutDraft ?? {
    name: state.profile.name || preferred?.name || '',
    phone: state.profile.phone || preferred?.phone || '',
    email: state.profile.email || preferred?.email || '',
    county: preferred?.county ?? '', town: preferred?.town ?? '', area: preferred?.area ?? '',
    street: preferred?.street ?? '', buildingNumber: preferred?.buildingNumber ?? '',
    instructions: preferred?.instructions ?? '', deliveryMethod: 'standard',
    deliveryDate: '', deliveryWindow: '', discountCode: state.discountCode,
  })
  const [error, setError] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const items = state.cart.filter((item) => foodProduct(state, item.productId))
  if (!items.length) return <EmptyState title="Nothing to check out" detail="Add food items to your cart first." action={<Link to="/foods/shop" className={button}>Browse food</Link>} />
  const subtotal = foodCartSubtotal(state)
  const discount = foodDiscount(subtotal, draft.discountCode)
  const total = subtotal - discount
  const updateDraft = (key: keyof FoodCheckoutDraft, value: string) => setDraft((current) => ({ ...current, [key]: value }))
  const proceed = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.name.trim() || !isValidKenyanPhone(draft.phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email) || !draft.county.trim() || !draft.town.trim() || !draft.area.trim()) {
      setError('Enter your name, a valid Kenyan phone number and email, county, town and area.')
      return
    }
    if (!acceptedTerms) { setError('Please confirm the address and order details before continuing.'); return }
    if (draft.deliveryMethod === 'scheduled') { setError('Scheduled delivery is not configured for this service yet. Select standard delivery or pickup and confirm availability with support.'); return }
    const address: FoodAddress = {
      id: preferred?.id ?? crypto.randomUUID(), name: draft.name.trim(), phone: draft.phone.trim(),
      email: draft.email.trim(), county: draft.county.trim(), town: draft.town.trim(), area: draft.area.trim(),
      street: draft.street.trim(), buildingNumber: draft.buildingNumber.trim(), instructions: draft.instructions.trim(),
      isDefault: preferred?.isDefault ?? false,
    }
    update((current) => ({
      ...current,
      profile: { name: draft.name.trim(), phone: draft.phone.trim(), email: draft.email.trim() },
      checkoutDraft: { ...draft, discountCode: draft.discountCode.trim().toUpperCase() },
      checkoutAttemptKey: current.checkoutAttemptKey ?? crypto.randomUUID(),
      addresses: [address, ...current.addresses.filter((item) => item.id !== address.id)],
      discountCode: draft.discountCode.trim().toUpperCase(),
    }))
    navigate('/foods/payment')
  }
  const field = (key: keyof FoodCheckoutDraft, label: string, required = false, type = 'text') => <label className="block text-sm font-medium">{label}<input required={required} type={type} autoComplete={key === 'name' ? 'name' : key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'off'} value={draft[key]} onChange={(event) => updateDraft(key, event.target.value)} className="mt-2 block w-full rounded-xl border border-[#dce4dc] bg-white p-3 font-normal" /></label>
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><SectionHeading eyebrow="Step 3 · Checkout" title="Customer information & delivery" detail="Add recipient and delivery details, then review the order before payment." /><Link to="/foods/cart" className={secondary}><ArrowLeft className="h-4 w-4" /> Back to cart</Link></div><form onSubmit={proceed} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="space-y-5"><section className={`${card} space-y-4`}><h2 className="text-lg font-semibold">Customer information</h2><div className="grid gap-4 sm:grid-cols-2">{field('name', 'Full name', true)}{field('phone', 'Phone number', true, 'tel')}{field('email', 'Email address', true, 'email')}</div><p className="text-xs text-[#6B756E]">Available Leafy Foods profile details are pre-filled. Sign-in and profile synchronisation use the shared Leafy account service.</p></section><section className={`${card} space-y-4`}><h2 className="text-lg font-semibold">Delivery location</h2><div className="grid gap-4 sm:grid-cols-2">{field('county', 'County', true)}{field('town', 'Town or city', true)}{field('area', 'Estate or area', true)}{field('street', 'Street or building')}{field('buildingNumber', 'House, apartment or office')}</div><label className="block text-sm font-medium">Additional delivery instructions<textarea rows={3} value={draft.instructions} onChange={(event) => updateDraft('instructions', event.target.value)} className="mt-2 w-full rounded-xl border border-[#dce4dc] p-3 font-normal" /></label><p className="text-xs text-[#6B756E]">Map pin selection and delivery time slots are not configured. Please use the written address.</p><h3 className="pt-2 text-sm font-semibold">Delivery method</h3>{(['standard', 'pickup'] as const).map((method) => <label key={method} className="flex cursor-pointer gap-3 rounded-xl border border-[#dce4dc] p-3"><input type="radio" name="deliveryMethod" checked={draft.deliveryMethod === method} onChange={() => updateDraft('deliveryMethod', method)} /><span><strong className="block text-sm">{method === 'standard' ? 'Standard delivery' : 'Customer pickup'}</strong><span className="text-xs text-[#6B756E]">Availability, delivery fee and window must be confirmed by Leafy Foods before payment.</span></span></label>)}{field('deliveryDate', 'Preferred delivery date (request only)')}{field('deliveryWindow', 'Preferred time window (request only)')}</section><section className={`${card} space-y-3`}><h2 className="font-semibold">Save this delivery address</h2><p className="text-sm text-[#6B756E]">Your details will be saved in this browser. You can manage addresses from your account.</p></section></div><aside className={`${card} h-fit lg:sticky lg:top-24`}><h2 className="font-semibold">Order review</h2>{items.map((item) => { const product = foodProduct(state, item.productId); return product ? <div key={foodLineKey(item)} className="border-b border-[#e6eae5] py-3 text-sm"><div className="flex justify-between gap-3"><span>{product.name} × {item.quantity}</span><span>{money(foodUnitPrice(product, item) * item.quantity)}</span></div><p className="mt-1 text-xs text-[#6B756E]">{Object.values(item.selections).join(' · ')}</p></div> : null })}<Summary label="Subtotal" value={money(subtotal)} /><Summary label="Discount" value={discount ? `−${money(discount)}` : money(0)} /><Summary label="Delivery" value="To be confirmed" /><div className="my-3 border-t" /><Summary label="Estimated items total" value={money(total)} strong /><p className="mt-2 text-xs leading-5 text-[#6B756E]">Delivery or other service charges are not configured. The backend must return the full payable amount and terms before a payment prompt is sent.</p><label className="mt-4 flex items-start gap-2 text-xs leading-5"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} /><span>I have reviewed my item selection and entered a delivery address. I understand this estimate excludes unconfigured delivery charges.</span></label>{error && <p role="alert" className="mt-3 rounded-lg bg-[#fff0eb] p-3 text-sm text-[#9b422b]">{error}</p>}<button className={`${button} mt-4 w-full`}>Continue to Payment <ArrowRight className="h-4 w-4" /></button></aside></form></div>
}

function FoodPaymentPage({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const { paymentId = '' } = useParams()
  const navigate = useNavigate()
  const draft = state.checkoutDraft
  const session = state.paymentSession?.paymentId === paymentId ? state.paymentSession : null
  const [phone, setPhone] = useState(() => session?.phone ?? draft?.phone ?? '')
  const [status, setStatus] = useState<FoodPaymentStatus | null>(() => session?.status ?? null)
  const [message, setMessage] = useState('')
  const [paying, setPaying] = useState(false)
  const [checking, setChecking] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const order = state.orders.find((item) => item.paymentId === paymentId || item.id === session?.orderId)
  const reportedStatus = status ?? session?.status ?? order?.paymentStatus ?? 'Pending'
  const successful = reportedStatus === 'Successful' && order?.paymentStatus === 'Successful'
  const visibleStatus: FoodPaymentStatus = reportedStatus === 'Successful' && !successful ? 'Reconciliation Required' : reportedStatus
  const amount = order?.total ?? session?.amount
  const orderNumber = order?.number ?? session?.orderNumber
  const phoneError = foodPhoneError(phone)

  const checkStatus = useCallback(async () => {
    if (!paymentId || checking) return
    setChecking(true)
    try {
      const response = await fetch(`/api/foods/payments/${encodeURIComponent(paymentId)}`)
      const result = await readFoodApi<{ status?: FoodPaymentStatus; order?: FoodOrder; message?: string }>(response, 'The Leafy Foods payment-status service is unavailable.')
      if (!response.ok || !result.status) throw new Error(result.message || 'The payment status could not be retrieved.')
      setStatus(result.status)
      setMessage(result.message ?? foodPaymentMessage(result.status))
      if (result.order) {
        update((current) => {
          const confirmed = result.order?.paymentStatus === 'Successful' && result.order.status !== 'Pending Payment'
          const orderChanged = !current.orders.some((item) => item.id === result.order?.id && item.paymentStatus === result.order?.paymentStatus)
          return {
            ...current,
            cart: confirmed ? [] : current.cart,
            discountCode: confirmed ? '' : current.discountCode,
            checkoutDraft: confirmed ? null : current.checkoutDraft,
            checkoutAttemptKey: confirmed ? null : current.checkoutAttemptKey,
            paymentSession: current.paymentSession ? { ...current.paymentSession, status: result.order!.paymentStatus } : current.paymentSession,
            orders: [result.order!, ...current.orders.filter((item) => item.id !== result.order?.id)],
            notifications: confirmed && orderChanged ? [{ id: crypto.randomUUID(), title: 'Food order payment confirmed', detail: `Payment confirmed for order ${result.order!.number}.`, href: `/foods/orders/${result.order!.id}`, read: false, createdAt: now() }, ...current.notifications] : current.notifications,
          }
        })
      } else {
        update((current) => current.paymentSession?.paymentId === paymentId
          ? { ...current, paymentSession: { ...current.paymentSession, status: result.status! } }
          : current)
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Payment status could not be checked.')
    } finally {
      setChecking(false)
    }
  }, [checking, paymentId, update])

  useEffect(() => {
    if (!paymentId) {
      if (!draft) navigate('/foods/checkout', { replace: true })
      return
    }
    if (successful) return
    const timer = window.setInterval(() => { void checkStatus() }, 7000)
    return () => window.clearInterval(timer)
  }, [checkStatus, draft, navigate, paymentId, successful])

  const startPayment = async (event: FormEvent) => {
    event.preventDefault()
    if (!draft || paying || phoneError) return
    setPaying(true)
    setMessage('')
    try {
      const idempotencyKey = state.checkoutAttemptKey ?? crypto.randomUUID()
      if (!state.checkoutAttemptKey) update((current) => ({ ...current, checkoutAttemptKey: idempotencyKey }))
      const response = await fetch('/api/foods/payments/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify({
          customer: { name: draft.name, phone: draft.phone, email: draft.email },
          address: { county: draft.county, town: draft.town, area: draft.area, street: draft.street, buildingNumber: draft.buildingNumber, instructions: draft.instructions },
          deliveryMethod: draft.deliveryMethod,
          requestedDeliveryDate: draft.deliveryDate || undefined,
          requestedDeliveryWindow: draft.deliveryWindow || undefined,
          discountCode: foodDiscount(foodCartSubtotal(state), draft.discountCode) ? draft.discountCode : undefined,
          mpesaPhone: normalizeFoodPhone(phone),
          items: state.cart.map((item) => ({ productId: item.productId, quantity: item.quantity, selections: item.selections, instructions: item.instructions })),
        }),
      })
      const result = await readFoodApi<{ orderId?: string; orderNumber?: string; paymentId?: string; amount?: number; status?: FoodPaymentStatus; message?: string; order?: FoodOrder }>(response, 'The Leafy Foods payment service is unavailable.')
      if (!response.ok || !result.orderId || !result.orderNumber || !result.paymentId || !Number.isFinite(result.amount) || !result.status) {
        throw new Error(result.message || 'The server did not return a prepared order, authoritative total and payment status. Payment was not confirmed.')
      }
      const nextSession: FoodPaymentSession = {
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        paymentId: result.paymentId,
        amount: result.amount!,
        phone: normalizeFoodPhone(phone),
        status: result.status,
        message: result.message ?? foodPaymentMessage(result.status),
      }
      update((current) => ({
        ...current,
        profile: { name: draft.name, phone: draft.phone, email: draft.email },
        paymentSession: nextSession,
        ...(result.order ? { orders: [result.order, ...current.orders.filter((item) => item.id !== result.order?.id)] } : {}),
      }))
      setMessage(nextSession.message)
      navigate(`/foods/payment/${encodeURIComponent(nextSession.paymentId)}`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The payment request could not be started.')
    } finally {
      setPaying(false)
    }
  }

  const retry = async () => {
    if (!paymentId || retrying || !['Failed', 'Cancelled', 'Expired'].includes(visibleStatus)) return
    setRetrying(true)
    setMessage('')
    try {
      const response = await fetch(`/api/foods/payments/${encodeURIComponent(paymentId)}/retry`, { method: 'POST', headers: { 'Idempotency-Key': crypto.randomUUID() } })
      const result = await readFoodApi<{ paymentId?: string; orderId?: string; orderNumber?: string; amount?: number; status?: FoodPaymentStatus; message?: string }>(response, 'The payment retry service is unavailable.')
      if (!response.ok || !result.paymentId || !result.orderId || !result.status) throw new Error(result.message || 'The payment prompt could not be retried.')
      const nextSession: FoodPaymentSession = { orderId: result.orderId, orderNumber: result.orderNumber ?? orderNumber ?? '', paymentId: result.paymentId, amount: result.amount ?? amount ?? 0, phone: normalizeFoodPhone(phone), status: result.status, message: result.message ?? foodPaymentMessage(result.status) }
      setStatus(nextSession.status)
      setMessage(nextSession.message)
      update((current) => ({ ...current, paymentSession: nextSession }))
      if (nextSession.paymentId !== paymentId) navigate(`/foods/payment/${encodeURIComponent(nextSession.paymentId)}`, { replace: true })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Payment retry failed.')
    } finally {
      setRetrying(false)
    }
  }

  if (!paymentId && !draft) return <EmptyState title="Checkout details are missing" detail="Review your cart and enter customer and delivery details before payment." action={<Link to="/foods/cart" className={button}>Return to cart</Link>} />
  if (successful && order) return <FoodPaymentSuccess order={order} />
  if (paymentId) return <FoodPaymentWaiting status={visibleStatus} session={session} orderNumber={orderNumber} amount={amount} message={message} checking={checking} retrying={retrying} onCheck={() => void checkStatus()} onRetry={() => void retry()} />

  const estimate = foodCartSubtotal(state) - foodDiscount(foodCartSubtotal(state), draft?.discountCode ?? '')
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><SectionHeading eyebrow="Step 4 · Payment" title="Pay with M-Pesa" detail="Your order and delivery details are saved. Enter the mobile number that should receive the payment prompt." /><Link to="/foods/checkout" className={secondary}><ArrowLeft className="h-4 w-4" /> Edit checkout</Link></div><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"><form onSubmit={startPayment} className="overflow-hidden rounded-3xl border border-[#d8eadf] bg-white shadow-sm"><div className="bg-[#00A650] px-6 py-5 text-white"><p className="text-2xl font-bold tracking-tight">M-PESA</p><p className="mt-1 text-xs font-medium uppercase tracking-[.18em] text-white/90">Secure mobile payment</p></div><div className="space-y-5 p-5 sm:p-7"><h2 className="text-xl font-semibold text-[#1b1b1b]">Pay with M-Pesa</h2><p className="text-sm leading-6 text-[#333]">Enter your M-Pesa phone number below. We will send a payment request to your phone. Enter your M-Pesa PIN on your phone to complete the payment.</p><div className="rounded-xl bg-[#f3faf5] p-4 text-sm"><Summary label="Order number" value="Assigned securely by Leafy Foods service" /><Summary label="Estimated items total" value={money(estimate)} strong /><p className="mt-2 text-xs leading-5 text-[#6B756E]">Delivery and other unconfigured charges are not included. The service must return the full order total before prompting payment.</p></div><label className="block text-sm font-medium">M-Pesa phone number<input required inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="07XXXXXXXX, 01XXXXXXXX or 254XXXXXXXX" aria-invalid={Boolean(phoneError)} aria-describedby={phoneError ? 'food-phone-error' : 'food-phone-help'} className="mt-2 block w-full rounded-xl border border-[#cfd8d1] p-3 text-base outline-none focus:border-[#00A650] focus:ring-2 focus:ring-[#00A650]/20" /></label>{phoneError ? <p id="food-phone-error" role="alert" className="text-sm text-[#a1462b]">{phoneError}</p> : <p id="food-phone-help" className="text-xs text-[#59665d]">Accepted formats: 07XXXXXXXX, 01XXXXXXXX or 254XXXXXXXX.</p>}{message && <p role="alert" className="rounded-xl bg-[#fff0eb] p-3 text-sm text-[#9b422b]">{message}</p>}<button disabled={paying || Boolean(phoneError)} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00A650] px-5 py-3 text-sm font-semibold text-white hover:bg-[#008f45] disabled:opacity-50">{paying ? 'Sending secure payment request…' : 'Pay with M-Pesa'}</button><p className="text-xs leading-5 text-[#59665d]">Never enter your PIN on this website. The payment service must verify the Safaricom callback before confirming the order.</p></div></form><aside className={card}><h2 className="font-semibold">Order summary</h2>{state.cart.map((item) => { const product = foodProduct(state, item.productId); return product ? <div key={foodLineKey(item)} className="flex justify-between gap-3 border-b py-3 text-sm"><span>{product.name} × {item.quantity}</span><span>{money(foodUnitPrice(product, item) * item.quantity)}</span></div> : null })}<Summary label="Items subtotal" value={money(foodCartSubtotal(state))} /><Summary label="Discount" value={`−${money(foodDiscount(foodCartSubtotal(state), draft?.discountCode ?? ''))}`} /><Summary label="Delivery" value="To be confirmed" /><p className="mt-3 text-xs leading-5 text-[#6B756E]">Final total comes from the backend after product, stock and delivery validation.</p></aside></div></div>
}

function FoodPaymentWaiting({ status, session, orderNumber, amount, message, checking, retrying, onCheck, onRetry }: { status: FoodPaymentStatus; session: FoodPaymentSession | null; orderNumber?: string; amount?: number; message: string; checking: boolean; retrying: boolean; onCheck: () => void; onRetry: () => void }) {
  const waiting = ['Pending', 'Initiated', 'Awaiting Customer Action', 'Reconciliation Required'].includes(status)
  return <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#d8eadf] bg-white shadow-sm"><div className="bg-[#00A650] px-6 py-5 text-white"><p className="text-2xl font-bold">M-PESA</p><p className="text-xs uppercase tracking-[.18em] text-white/90">Secure mobile payment</p></div><div className="space-y-5 p-5 sm:p-7"><p className="text-xs font-semibold uppercase tracking-wide text-[#00A650]">Payment status</p><h1 className="text-2xl font-semibold">{foodPaymentTitle(status)}</h1><div className="rounded-xl bg-[#f3faf5] p-4"><Summary label="Order number" value={orderNumber ?? 'Loading…'} /><Summary label="Amount payable" value={amount === undefined ? 'Loading…' : money(amount)} strong /><Summary label="Prompt sent to" value={session?.phone ?? 'Confirmed M-Pesa number'} /></div><div className="flex items-start gap-3 rounded-xl border border-[#e6eee8] p-4"><span className={`mt-1 h-3 w-3 rounded-full bg-[#00A650] ${waiting ? 'animate-pulse' : ''}`} /><p className="text-sm leading-6 text-[#26352c]">{message || session?.message || foodPaymentMessage(status)}</p></div>{waiting && <p className="text-sm leading-6 text-[#59665d]">Check your phone and enter your M-Pesa PIN there. This page will wait for payment-service confirmation. Do not retry while a request is pending.</p>}<div className="flex flex-col gap-3 sm:flex-row"><button type="button" disabled={checking} onClick={onCheck} className="inline-flex flex-1 items-center justify-center rounded-full bg-[#00A650] px-5 py-3 text-sm font-semibold text-white hover:bg-[#008f45] disabled:opacity-50">{checking ? 'Checking status…' : 'Check Payment Status'}</button>{['Failed', 'Cancelled', 'Expired'].includes(status) && <button type="button" disabled={retrying} onClick={onRetry} className="inline-flex flex-1 items-center justify-center rounded-full border border-[#00A650] px-5 py-3 text-sm font-semibold text-[#008f45] disabled:opacity-50">{retrying ? 'Requesting…' : 'Retry Payment'}</button>}</div><p className="text-xs leading-5 text-[#6B756E]">Only the verified server response can confirm payment. Delayed callbacks remain pending; duplicate callbacks must be safely handled by the backend.</p></div></div>
}

function FoodPaymentSuccess({ order }: { order: FoodOrder }) {
  return <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[#d8eadf] bg-white shadow-sm"><div className="bg-[#00A650] px-6 py-7 text-white"><p className="text-sm font-semibold uppercase tracking-[.2em]">M-PESA · Payment confirmed</p><h1 className="mt-2 text-3xl font-semibold">Payment successful</h1><p className="mt-2 text-sm text-white/90">Your payment was verified by the payment service.</p></div><div className="space-y-4 p-6"><Summary label="Amount paid" value={money(order.total)} strong /><Summary label="M-Pesa receipt" value={order.receipt ?? 'Receipt pending from payment service'} /><Summary label="Order number" value={order.number} /><Summary label="Delivery location" value={`${order.address.area}, ${order.address.town}, ${order.address.county}`} /><p className="rounded-xl bg-[#f0f8f2] p-4 text-sm">Your order is confirmed. Order and preparation updates will appear in your account.</p><div className="flex flex-col gap-3 sm:flex-row"><Link className={`${button} flex-1`} to={`/foods/orders/${order.id}`}>View Order <ArrowRight className="h-4 w-4" /></Link><Link className={`${secondary} flex-1`} to="/foods/shop">Continue Shopping</Link></div></div></div>
}

function FoodOrders({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const [notice, setNotice] = useState('')
  const reorder = (order: FoodOrder) => {
    const unavailable = order.items.filter((item) => !foodProduct(state, item.productId)?.active)
    const available = order.items.filter((item) => foodProduct(state, item.productId)?.active).map((item) => ({ ...item, instructions: item.instructions ?? '' }))
    update((current) => ({ ...current, cart: mergeFoodCart(current.cart, available) }))
    setNotice(unavailable.length ? `Available items were added. ${unavailable.length} item(s) are no longer listed and were skipped.` : 'Current catalogue items added to your cart. Prices and availability must be checked again.')
  }
  return <div className="space-y-5"><SectionHeading eyebrow="Customer account" title="My food orders" detail="Payment and fulfilment states are displayed from local records or payment-service responses." />{notice && <p role="status" className="rounded-xl bg-[#EDF4EA] p-3 text-sm text-[#285342]">{notice} <Link className="font-semibold underline" to="/foods/cart">View cart</Link></p>}{state.orders.length ? <div className="space-y-3">{state.orders.map((order) => <article key={order.id} className={`${card} flex flex-wrap items-center justify-between gap-4`}><div><Link to={`/foods/orders/${order.id}`} className="font-semibold text-[#285342]">Order {order.number}</Link><p className="mt-1 text-xs text-[#6B756E]">{foodDate(order.createdAt)} · {order.items.length} item line(s)</p></div><div className="flex flex-wrap items-center gap-3"><span className="text-sm font-semibold">{money(order.total)}</span><Status value={order.status} /><button onClick={() => reorder(order)} className={secondary}>Reorder</button></div></article>)}</div> : <EmptyState title="No food orders yet" detail="Orders confirmed by the payment service will appear here." action={<Link to="/foods/shop" className={button}>Browse food</Link>} />}</div>
}

function FoodOrderDetail({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const { orderId = '' } = useParams()
  const [notice, setNotice] = useState('')
  const order = state.orders.find((item) => item.id === orderId)
  if (!order) return <EmptyState title="Order details unavailable" detail="Sign in with the account that placed the order or refresh from the order service." action={<Link to="/foods/orders" className={button}>My orders</Link>} />
  const downloadReceipt = () => {
    const lines = [['Leafy Foods receipt'], [`Order: ${order.number}`], [`Payment: ${order.paymentStatus}`], [`Status: ${order.status}`], [`Amount: ${money(order.total)}`], ...order.items.map((item) => [`${item.name} x ${item.quantity}`, money(item.unitPrice * item.quantity)])]
    foodCsv(`${order.number}-receipt.csv`, lines)
  }
  const reorder = () => {
    const available = order.items.filter((item) => foodProduct(state, item.productId)?.active)
    update((current) => ({ ...current, cart: mergeFoodCart(current.cart, available) }))
    setNotice(`${available.length} available item line(s) added to cart. Current prices and options will apply.`)
  }
  const canCancel = ['Pending Payment', 'Paid', 'Confirmed'].includes(order.status) && order.paymentStatus !== 'Successful'
  return <div className="space-y-6"><Link to="/foods/orders" className="inline-flex items-center gap-2 text-sm text-[#285342]"><ArrowLeft className="h-4 w-4" /> My orders</Link><section className={`${card} flex flex-wrap items-start justify-between gap-4`}><div><Eyebrow>Order tracking</Eyebrow><h1 className="mt-1 text-2xl font-semibold">Order {order.number}</h1><p className="mt-1 text-sm text-[#6B756E]">Placed {foodDate(order.createdAt)}</p></div><div className="space-y-2 text-right"><Status value={order.status} /><p className="text-sm">Payment: <strong>{foodPaymentTitle(order.paymentStatus)}</strong></p>{order.receipt && <p className="text-xs text-[#6B756E]">M-Pesa receipt {order.receipt}</p>}<button onClick={downloadReceipt} className={secondary}><Download className="h-4 w-4" /> Download receipt</button></div></section><div className="grid gap-5 lg:grid-cols-2"><section className={card}><h2 className="font-semibold">Items</h2>{order.items.map((item, index) => <div key={`${item.productId}-${index}`} className="flex justify-between gap-3 border-b py-3 text-sm"><div><p>{item.name} × {item.quantity}</p><p className="text-xs text-[#6B756E]">{Object.values(item.selections).join(' · ')}</p></div><span>{money(item.unitPrice * item.quantity)}</span></div>)}<Summary label="Items subtotal" value={money(order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0))} /><Summary label="Delivery" value={money(order.deliveryFee)} /><Summary label="Discount" value={`−${money(order.discount)}`} /><Summary label="Total" value={money(order.total)} strong /></section><section className={card}><h2 className="font-semibold">Delivery details</h2><p className="mt-3 text-sm leading-6 text-[#59665d]">{order.address.name}<br />{order.address.buildingNumber} {order.address.street}<br />{order.address.area}, {order.address.town}<br />{order.address.county}<br />{order.address.phone}<br />{order.address.instructions}</p><p className="mt-3 text-xs text-[#6B756E]">Delivery method: {order.deliveryMethod}. No live GPS tracking is available.</p></section></div><section className={card}><h2 className="font-semibold">Order timeline</h2><ol className="mt-4 space-y-4">{order.timeline.map((event, index) => <li key={`${event.status}-${event.createdAt}-${index}`} className="flex gap-3"><span className="mt-1 h-3 w-3 rounded-full bg-[#39845A]" /><div><p className="text-sm font-medium">{event.status} — {event.detail}</p><p className="mt-1 text-xs text-[#6B756E]">{foodDateTime(event.createdAt)}</p></div></li>)}</ol><p className="mt-4 text-xs text-[#6B756E]">Tracking events depend on fulfilment updates from Leafy Foods. Live rider location is not configured.</p></section><div className="flex flex-wrap gap-2"><button onClick={reorder} className={button}>Reorder items</button>{canCancel && <button onClick={() => setNotice('Cancellation requests require the order service. This preview has not changed the order status.')} className={secondary}>Request cancellation</button>}{order.paymentStatus === 'Successful' && ['Delivered', 'Confirmed'].includes(order.status) && <Link to={`/foods/reviews?order=${order.id}`} className={secondary}>Review an item</Link>}</div>{notice && <p role="status" className="text-sm text-[#285342]">{notice}</p>}</div>
}

function FoodWishlist({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const products = state.wishlist.map((id) => foodProduct(state, id)).filter((item): item is FoodProduct => Boolean(item))
  const add = (product: FoodProduct) => update((current) => ({ ...current, cart: addFoodLine(current.cart, { productId: product.id, quantity: 1, selections: {}, instructions: '' }) }))
  return <div className="space-y-5"><SectionHeading eyebrow="Customer account" title="Food wishlist" detail="Saved items live in this browser prototype. Shared-account wishlist sync is not configured." />{products.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{products.map((product) => <div key={product.id}><FoodProductCard product={product} state={state} update={update} /><button onClick={() => add(product)} disabled={product.options.some((option) => option.required)} className={`${secondary} mt-2 w-full text-xs`}>Add to cart</button></div>)}</div> : <EmptyState title="No saved food items" detail="Save products from the catalogue with the heart button." action={<Link to="/foods/shop" className={button}>Discover food</Link>} />}</div>
}

function FoodAccount({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const [profile, setProfile] = useState(state.profile)
  const [message, setMessage] = useState('')
  const save = (event: FormEvent) => {
    event.preventDefault()
    if (!profile.name.trim() || !isValidKenyanPhone(profile.phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) { setMessage('Enter a name, valid Kenyan phone number and valid email address.'); return }
    update((current) => ({ ...current, profile }))
    setMessage('Profile saved in this browser. Sign-in data remains managed by shared Leafy accounts.')
  }
  return <div className="space-y-6"><SectionHeading eyebrow="Customer account" title={`Welcome${profile.name ? `, ${profile.name}` : ''}`} detail="Manage your food orders and account contact details." /><div className="grid gap-3 sm:grid-cols-3">{[['Orders', state.orders.length], ['Wishlist items', state.wishlist.length], ['Open support tickets', state.tickets.filter((ticket) => ticket.status === 'Open').length]].map(([label, value]) => <div key={String(label)} className={card}><p className="text-xs text-[#6B756E]">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>)}</div><div className="grid gap-5 lg:grid-cols-2"><form onSubmit={save} className={`${card} space-y-4`}><h2 className="font-semibold">Profile & contact</h2><FoodTextInput label="Full name" value={profile.name} onChange={(name) => setProfile((current) => ({ ...current, name }))} required /><FoodTextInput label="Phone number" value={profile.phone} onChange={(phone) => setProfile((current) => ({ ...current, phone }))} type="tel" required /><FoodTextInput label="Email address" value={profile.email} onChange={(email) => setProfile((current) => ({ ...current, email }))} type="email" required />{message && <p role="status" className="text-sm text-[#285342]">{message}</p>}<button className={button}>Save profile</button><p className="text-xs text-[#6B756E]">Password, privacy and notification preferences use the shared Leafy account service.</p></form><section className={card}><h2 className="font-semibold">Recent orders</h2>{state.orders.length ? <div className="mt-3 space-y-3">{state.orders.slice(0, 4).map((order) => <Link key={order.id} to={`/foods/orders/${order.id}`} className="flex justify-between gap-3 border-b py-3 text-sm"><span>{order.number} · {order.status}</span><strong>{money(order.total)}</strong></Link>)}</div> : <p className="mt-3 text-sm text-[#6B756E]">No order history yet.</p>}<Link className="mt-4 inline-block text-sm font-semibold text-[#285342]" to="/foods/orders">View all orders</Link></section></div></div>
}

function FoodAddresses({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const [message, setMessage] = useState('')
  const saveAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const address: FoodAddress = {
      id: crypto.randomUUID(), name: String(data.get('name') ?? '').trim(), phone: String(data.get('phone') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(), county: String(data.get('county') ?? '').trim(), town: String(data.get('town') ?? '').trim(),
      area: String(data.get('area') ?? '').trim(), street: String(data.get('street') ?? '').trim(), buildingNumber: String(data.get('buildingNumber') ?? '').trim(),
      instructions: String(data.get('instructions') ?? '').trim(), isDefault: state.addresses.length === 0,
    }
    update((current) => ({ ...current, addresses: [address, ...current.addresses] }))
    event.currentTarget.reset()
    setMessage('Address saved on this device.')
  }
  return <div className="space-y-5"><SectionHeading eyebrow="Customer account" title="Saved delivery addresses" detail="Addresses are stored in this browser prototype; use only data you are comfortable storing locally." /><div className="grid gap-4 md:grid-cols-2">{state.addresses.map((address) => <article key={address.id} className={card}><div className="flex items-start justify-between gap-3"><h2 className="font-semibold">{address.name}{address.isDefault && <span className="ml-2 rounded-full bg-[#EDF4EA] px-2 py-1 text-[10px] text-[#285342]">Default</span>}</h2><button onClick={() => update((current) => ({ ...current, addresses: current.addresses.filter((item) => item.id !== address.id) }))} className="text-xs text-[#a1462b]">Delete</button></div><p className="mt-2 text-sm leading-6 text-[#6B756E]">{address.buildingNumber} {address.street}<br />{address.area}, {address.town}, {address.county}<br />{address.phone} · {address.email}</p>{!address.isDefault && <button onClick={() => update((current) => ({ ...current, addresses: current.addresses.map((item) => ({ ...item, isDefault: item.id === address.id })) }))} className="mt-3 text-xs font-semibold text-[#285342]">Set as default</button>}</article>)}</div><form onSubmit={saveAddress} className={`${card} grid gap-3 sm:grid-cols-2`}><h2 className="font-semibold sm:col-span-2">Add address</h2>{['name:Recipient name', 'phone:Phone number', 'email:Email address', 'county:County', 'town:Town or city', 'area:Estate or area', 'street:Street or building', 'buildingNumber:House or office number'].map((entry) => { const [name, label] = entry.split(':'); return <label key={name} className="block text-sm">{label}<input required={['name', 'phone', 'email', 'county', 'town', 'area'].includes(name)} name={name} type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'} className="mt-1 w-full rounded-lg border p-3" /></label> })}<label className="text-sm sm:col-span-2">Delivery instructions<textarea name="instructions" rows={2} className="mt-1 w-full rounded-lg border p-3" /></label><button className={button}>Save address</button>{message && <p role="status" className="text-sm text-[#285342]">{message}</p>}</form></div>
}

function FoodReviews({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const params = new URLSearchParams(window.location.search)
  const order = state.orders.find((item) => item.id === params.get('order') && item.paymentStatus === 'Successful')
  const eligible = order?.items ?? state.orders.filter((item) => item.paymentStatus === 'Successful').flatMap((item) => item.items)
  const [notice, setNotice] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const productId = String(data.get('productId') ?? '')
    const orderId = order?.id ?? state.orders.find((item) => item.paymentStatus === 'Successful' && item.items.some((line) => line.productId === productId))?.id
    if (!productId || !orderId) { setNotice('Select an item from a successfully paid order.'); return }
    const review = { id: crypto.randomUUID(), productId, orderId, rating: Number(data.get('rating')), title: String(data.get('title') ?? '').trim(), body: String(data.get('body') ?? '').trim(), status: 'Pending moderation' as const, createdAt: now() }
    update((current) => ({ ...current, reviews: [review, ...current.reviews] }))
    event.currentTarget.reset()
    setNotice('Review submitted for moderation. It is not published yet.')
  }
  return <div className="space-y-5"><SectionHeading eyebrow="Customer account" title="My food reviews" detail="Only reviews connected to paid orders are eligible. Ratings are hidden until moderation publishes a review." />{eligible.length > 0 && <form onSubmit={submit} className={`${card} grid gap-3 sm:grid-cols-2`}><h2 className="font-semibold sm:col-span-2">Review a purchase</h2><label className="text-sm">Purchased item<select name="productId" required className="mt-1 w-full rounded-lg border bg-white p-3"><option value="">Select item</option>{eligible.map((item, index) => <option key={`${item.productId}-${index}`} value={item.productId}>{item.name}</option>)}</select></label><label className="text-sm">Rating<select name="rating" className="mt-1 w-full rounded-lg border bg-white p-3">{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></label><FoodNamedField name="title" label="Review title" /><label className="text-sm sm:col-span-2">Your review<textarea name="body" required rows={3} className="mt-1 w-full rounded-lg border p-3" /></label><button className={button}>Submit for moderation</button>{notice && <p role="status" className="text-sm text-[#285342]">{notice}</p>}</form>}{state.reviews.length ? <section className={card}><RecordList rows={state.reviews.map((review) => ({ title: review.title, detail: `${foodProduct(state, review.productId)?.name ?? 'Food item'} · ${review.rating}/5 · ${foodDate(review.createdAt)}`, status: review.status }))} /></section> : <EmptyState title="No reviews submitted" detail="After a qualifying purchase, you can leave feedback for moderation." />}</div>
}

function FoodSubscriptions() {
  return <div className="space-y-5"><SectionHeading eyebrow="Customer account" title="Food subscriptions" detail="No recurring food packages are currently configured." /><EmptyState title="No subscriptions available" detail="Weekly, fortnightly and monthly orders will appear here only when Leafy Foods enables a subscription service. No automatic charges are configured." action={<Link to="/foods/packages" className={secondary}>Browse food packages</Link>} /><p className="text-xs leading-5 text-[#6B756E]">Any future recurring order requires explicit customer consent and an authorised payment arrangement; this preview never charges automatically.</p></div>
}

function BulkOrderPage({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const [notice, setNotice] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const request: BulkRequest = {
      id: crypto.randomUUID(), businessName: String(data.get('businessName') ?? '').trim(),
      contactName: String(data.get('contactName') ?? '').trim(), phone: String(data.get('phone') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(), location: String(data.get('location') ?? '').trim(),
      businessType: String(data.get('businessType') ?? ''), registrationInfo: String(data.get('registrationInfo') ?? '').trim(),
      products: String(data.get('products') ?? '').trim(), schedule: String(data.get('schedule') ?? '').trim(),
      status: 'Submitted', createdAt: now(),
    }
    if (!request.businessName || !request.contactName || !isValidKenyanPhone(request.phone) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email) || !request.products) {
      setNotice('Enter the business and contact details, a valid phone and email, and the requested products.')
      return
    }
    update((current) => ({ ...current, bulkRequests: [request, ...current.bulkRequests], notifications: [{ id: crypto.randomUUID(), title: 'Bulk quotation request received', detail: `${request.businessName} · Request ${request.id.slice(0, 8)}`, href: '/foods/bulk', read: false, createdAt: now() }, ...current.notifications] }))
    event.currentTarget.reset()
    setNotice('Request recorded for review. Pricing, credit and order acceptance are not automatic.')
  }
  return <div className="mx-auto max-w-5xl space-y-6"><SectionHeading eyebrow="Business & institutional orders" title="Request a bulk food quotation" detail="For restaurants, hotels, schools, offices and caterers. Requests are reviewed by Leafy Foods; submitting a form does not confirm stock, price, credit or an order." /><div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><form onSubmit={submit} className={`${card} grid gap-4 sm:grid-cols-2`}><FoodNamedField name="businessName" label="Business name" required /><FoodNamedField name="contactName" label="Contact person" required /><FoodNamedField name="phone" label="Phone number" type="tel" required /><FoodNamedField name="email" label="Email address" type="email" required /><label className="block text-sm">Business type<select name="businessType" className="mt-1 w-full rounded-lg border bg-white p-3">{['Restaurant', 'Hotel', 'School', 'Office', 'Catering business', 'Retailer', 'Other'].map((value) => <option key={value}>{value}</option>)}</select></label><FoodNamedField name="location" label="Delivery location" required /><FoodNamedField name="registrationInfo" label="Business registration information (if required)" /><FoodNamedField name="schedule" label="Requested supply schedule" placeholder="One-time, weekly, monthly…" /><label className="block text-sm sm:col-span-2">Products, quantities and requirements<textarea name="products" required rows={4} className="mt-1 w-full rounded-lg border p-3" placeholder="Please describe approximate product quantities and any handling requirements." /></label><p className="text-xs leading-5 text-[#6B756E] sm:col-span-2">No negotiated prices, discounts or credit terms are promised. An authorised foods manager must review and approve any quotation.</p><button className={`${button} sm:col-span-2`}>Submit quotation request</button>{notice && <p role="status" className="text-sm text-[#285342] sm:col-span-2">{notice}</p>}</form><aside className={`${card} h-fit`}><h2 className="font-semibold">How bulk ordering works</h2><ol className="mt-4 space-y-3 text-sm leading-6 text-[#59665d]">{['Tell us about your business and supply needs.', 'Leafy Foods reviews product availability and delivery area.', 'An authorised team member prepares a quotation where possible.', 'You review and approve the quotation before an order is confirmed.'].map((item, index) => <li key={item} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EDF4EA] text-xs font-semibold text-[#285342]">{index + 1}</span>{item}</li>)}</ol><p className="mt-4 text-xs text-[#6B756E]">Requests saved in this browser: {state.bulkRequests.length}. Business data is not sent to Leafy staff in this prototype.</p></aside></div></div>
}

function FoodSupportPage({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const [notice, setNotice] = useState('')
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const ticket: FoodSupportTicket = { id: crypto.randomUUID(), category: String(data.get('category') ?? ''), orderId: String(data.get('orderId') ?? '').trim(), message: String(data.get('message') ?? '').trim(), status: 'Open', createdAt: now() }
    if (!ticket.message) { setNotice('Please describe your question or concern.'); return }
    update((current) => ({ ...current, tickets: [ticket, ...current.tickets], notifications: [{ id: crypto.randomUUID(), title: 'Food support request recorded', detail: `Ticket ${ticket.id.slice(0, 8)} · ${ticket.category}`, href: '/foods/support', read: false, createdAt: now() }, ...current.notifications] }))
    event.currentTarget.reset()
    setNotice(`Support ticket ${ticket.id.slice(0, 8)} recorded in this browser. The support API is not connected.`)
  }
  return <div className="mx-auto max-w-4xl space-y-6"><SectionHeading eyebrow="Customer support" title="How can we help?" detail="Ask about an order or product, request an order change, or report a delivery issue. Changes and refunds require review; this form does not promise an outcome." /><div className="grid gap-5 md:grid-cols-2"><form onSubmit={submit} className={`${card} space-y-4`}><label className="block text-sm">Enquiry type<select name="category" className="mt-1 w-full rounded-lg border bg-white p-3">{['Product question', 'Order issue', 'Delivery issue', 'Request order change', 'Refund request', 'Complaint', 'Other'].map((value) => <option key={value}>{value}</option>)}</select></label><label className="block text-sm">Related order (optional)<select name="orderId" className="mt-1 w-full rounded-lg border bg-white p-3"><option value="">Select an order</option>{state.orders.map((order) => <option key={order.id} value={order.id}>{order.number}</option>)}</select></label><label className="block text-sm">Message<textarea name="message" required minLength={5} rows={5} className="mt-1 w-full rounded-lg border p-3" /></label><button className={button}>Create support ticket</button>{notice && <p role="status" className="text-sm text-[#285342]">{notice}</p>}</form><section className={card}><h2 className="font-semibold">Your support tickets</h2>{state.tickets.length ? <RecordList rows={state.tickets.map((ticket) => ({ title: `${ticket.category} · ${ticket.id.slice(0, 8)}`, detail: `${ticket.message} · ${foodDate(ticket.createdAt)}`, status: ticket.status }))} /> : <p className="mt-3 text-sm text-[#6B756E]">No support tickets yet.</p>}<p className="mt-4 text-xs leading-5 text-[#6B756E]">Ticket assignment, customer replies and resolution history require the support service.</p></section></div></div>
}

function FoodInfoPage() {
  return <div className="mx-auto max-w-4xl space-y-6 py-8"><Link to="/foods" className="text-sm font-semibold text-[#285342]">← Leafy Foods home</Link><SectionHeading eyebrow="About Leafy Foods" title="Food choices for everyday nourishment" detail="Leafy Foods is designed to connect customers to food products, prepared meals and packages that are actively offered by Leafy. The catalogue in this preview is illustrative and does not confirm that products or services are currently operating." /><div className="grid gap-4 md:grid-cols-3">{[['Shop food', 'Search an enabled catalogue and review item details before ordering.'], ['Business ordering', 'Submit bulk requirements for review and quotation.'], ['Connected divisions', 'Discover growers through Leafy Market and agriculture learning through Leafy Academy.']].map(([title, detail]) => <article key={title} className={card}><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-[#6B756E]">{detail}</p></article>)}</div><div className="flex flex-wrap gap-3"><Link to="/foods/shop" className={button}>Browse demo catalogue</Link><Link to="/foods/contact" className={secondary}>Contact support</Link></div></div>
}

type OperationsTab = 'Overview' | 'Products' | 'Categories' | 'Orders' | 'Inventory' | 'Kitchen' | 'Delivery' | 'Suppliers' | 'Bulk requests' | 'Support' | 'Reviews' | 'Reports'

function FoodOperations({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const [tab, setTab] = useState<OperationsTab>('Overview')
  const [role, setRole] = useState<FoodRole>(state.role)
  const canManage = role === 'foods-manager' || role === 'super-admin'
  const canKitchen = canManage || role === 'kitchen-staff'
  const canDeliver = canManage || role === 'delivery-staff'
  if (!canManage && !canKitchen && !canDeliver) return <div className="mx-auto max-w-2xl py-10"><section className={`${card} space-y-4`}><span className="inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-3 py-1 text-xs text-[#79501c]"><ShieldCheck className="h-4 w-4" /> Restricted operations preview</span><h1 className="text-2xl font-semibold">Staff workspace</h1><p className="text-sm leading-6 text-[#6B756E]">Production access must be verified by the shared Leafy account service. This local role selector only changes preview navigation and is not an authorization control.</p><label className="block max-w-sm text-sm">Local role preview<select value={role} onChange={(event) => { const nextRole = event.target.value as FoodRole; setRole(nextRole); update((current) => ({ ...current, role: nextRole })) }} className="mt-2 w-full rounded-lg border bg-white p-3">{['customer', 'foods-manager', 'kitchen-staff', 'delivery-staff', 'super-admin'].map((value) => <option key={value} value={value}>{value.replaceAll('-', ' ')}</option>)}</select></label><Link to="/foods" className={secondary}>Return to customer site</Link></section></div>
  const tabs: OperationsTab[] = canManage ? ['Overview', 'Products', 'Categories', 'Orders', 'Inventory', 'Kitchen', 'Delivery', 'Suppliers', 'Bulk requests', 'Support', 'Reviews', ...(role === 'super-admin' ? ['Reports' as const] : [])] : role === 'kitchen-staff' ? ['Kitchen'] : ['Delivery']
  const applyTab = (next: OperationsTab) => setTab(next)
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-3"><SectionHeading eyebrow="Leafy Foods operations · local role preview" title={tab === 'Overview' ? 'Foods operations' : tab} detail="These interfaces act on browser-local preview data. Live catalogue, orders, inventory and staff permissions require authenticated Foods APIs." /><label className="text-xs">Preview role<select value={role} onChange={(event) => { const nextRole = event.target.value as FoodRole; setRole(nextRole); update((current) => ({ ...current, role: nextRole })); setTab(nextRole === 'kitchen-staff' ? 'Kitchen' : nextRole === 'delivery-staff' ? 'Delivery' : 'Overview') }} className="ml-2 rounded-lg border bg-white p-2">{['customer', 'foods-manager', 'kitchen-staff', 'delivery-staff', 'super-admin'].map((value) => <option key={value} value={value}>{value.replaceAll('-', ' ')}</option>)}</select></label></div><nav className="flex gap-2 overflow-x-auto border-b border-[#e6eae5] pb-3">{tabs.map((item) => <button key={item} onClick={() => applyTab(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm ${tab === item ? 'bg-[#285342] text-white' : 'border bg-white text-[#4d5a52]'}`}>{item}</button>)}</nav>{tab === 'Overview' && canManage && <FoodOperationsOverview state={state} />}{tab === 'Products' && canManage && <FoodProductManager state={state} update={update} />}{tab === 'Categories' && canManage && <FoodCategoryManager state={state} update={update} />}{tab === 'Orders' && canManage && <FoodOrderManager state={state} update={update} />}{tab === 'Inventory' && canManage && <FoodInventoryManager state={state} update={update} />}{tab === 'Kitchen' && canKitchen && <FoodKitchen state={state} update={update} />}{tab === 'Delivery' && canDeliver && <FoodDelivery state={state} update={update} />}{tab === 'Suppliers' && canManage && <FoodSuppliers state={state} update={update} />}{tab === 'Bulk requests' && canManage && <FoodBulkManager state={state} update={update} />}{tab === 'Support' && canManage && <FoodSupportManager state={state} update={update} />}{tab === 'Reviews' && canManage && <FoodReviewManager state={state} update={update} />}{tab === 'Reports' && role === 'super-admin' && <FoodReports state={state} />}</div>
}

function FoodOperationsOverview({ state }: { state: FoodState }) {
  const paidOrders = state.orders.filter((order) => order.paymentStatus === 'Successful')
  const openOrders = state.orders.filter((order) => !['Delivered', 'Cancelled', 'Refunded'].includes(order.status))
  const cards = [['Active catalogue items', state.products.filter((item) => item.active).length], ['Open orders', openOrders.length], ['Bulk requests to review', state.bulkRequests.filter((item) => ['Submitted', 'Under review'].includes(item.status)).length], ['Support tickets to review', state.tickets.filter((item) => ['Open', 'Under review'].includes(item.status)).length]]
  return <div className="space-y-5"><p className="rounded-xl border border-[#e8d8ae] bg-[#fff9e9] p-3 text-xs leading-5 text-[#604c27]">Local preview only. These browser records are not operational data and are not shared with a production Foods team.</p><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value]) => <div key={String(label)} className={card}><p className="text-sm text-[#6B756E]">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}</div><div className="grid gap-5 lg:grid-cols-2"><section className={card}><h2 className="font-semibold">Recent orders</h2>{state.orders.length ? <RecordList rows={state.orders.slice(0, 6).map((order) => ({ title: `${order.number} · ${order.status}`, detail: `${order.items.length} item line(s) · ${foodDate(order.createdAt)}`, status: foodPaymentTitle(order.paymentStatus) }))} /> : <p className="mt-3 text-sm text-[#6B756E]">No orders have been returned from a live service or created in this preview.</p>}</section><section className={card}><h2 className="font-semibold">Attention needed</h2><RecordList rows={[{ title: 'Unreviewed food enquiries', detail: 'Customer service review', status: String(state.tickets.filter((item) => item.status === 'Open').length) }, { title: 'Unmoderated reviews', detail: 'Customer review moderation', status: String(state.reviews.filter((item) => item.status === 'Pending moderation').length) }, { title: 'Low demo stock batches', detail: 'Check inventory records and expiry dates', status: String(state.inventory.filter((item) => item.quantity <= 5).length) }]} /></section></div><section className={card}><h2 className="font-semibold">Successful payments recorded by the connected service</h2><p className="mt-2 text-sm text-[#6B756E]">{paidOrders.length} order(s) have a successful payment status. This prototype receives no orders because the required backend is not configured.</p></section></div>
}

function FoodProductManager({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const [notice, setNotice] = useState('')
  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const categoryId = String(data.get('categoryId') ?? '')
    const price = Number(data.get('price'))
    const unit = String(data.get('unit') ?? '').trim()
    const description = String(data.get('description') ?? '').trim()
    const image = String(data.get('image') ?? '').trim()
    const kind = String(data.get('kind') ?? 'produce') as FoodProduct['kind']
    if (!name || !state.categories.some((category) => category.id === categoryId) || !Number.isFinite(price) || price <= 0 || !unit || !description || !image) { setNotice('Enter a product name, valid category, positive price, unit, description and image URL.'); return }
    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${crypto.randomUUID().slice(0, 6)}`
    const product: FoodProduct = { id: slug, name, categoryId, kind, price, unit, description, image, images: [image], source: '', storage: '', preparation: '', ingredients: [], allergens: [], nutrition: '', bestBefore: '', options: [], preparationMinutes: null, dietaryTags: [], availability: 'Local unpublished preview. Confirm stock, handling and delivery before order acceptance.', active: false, demo: true }
    update((current) => ({ ...current, products: [product, ...current.products] }))
    event.currentTarget.reset()
    setNotice('Product added as an unpublished local preview listing. Publishing does not update a live catalogue.')
  }
  const setActive = (id: string, active: boolean) => update((current) => ({ ...current, products: current.products.map((product) => product.id === id ? { ...product, active } : product) }))
  return <div className="space-y-5"><p className="rounded-xl border border-[#e8d8ae] bg-[#fff9e9] p-3 text-xs leading-5 text-[#604c27]">All changes remain in this browser. New listings are unpublished; active demo listings remain clearly marked as illustrative in the customer catalogue.</p><form onSubmit={create} className={`${card} grid gap-3 sm:grid-cols-2 lg:grid-cols-3`}><h2 className="font-semibold sm:col-span-2 lg:col-span-3">Add catalogue listing</h2><FoodNamedField name="name" label="Product name" required /><label className="text-sm">Category<select name="categoryId" required className="mt-1 w-full rounded-lg border bg-white p-3">{state.categories.filter((item) => item.active).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="text-sm">Product type<select name="kind" className="mt-1 w-full rounded-lg border bg-white p-3">{[['produce', 'Fresh produce'], ['grocery', 'Food essential'], ['meal', 'Prepared meal'], ['package', 'Food package']].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><FoodNamedField name="price" label="Illustrative unit price (KES)" type="number" required min="1" /><FoodNamedField name="unit" label="Unit / pack size" required /><FoodNamedField name="image" label="Image URL" type="url" required /><FoodNamedField name="description" label="Description" required /><button className={`${button} sm:col-span-2 lg:col-span-3`}>Save unpublished preview listing</button>{notice && <p role="status" className="text-sm text-[#285342] sm:col-span-2 lg:col-span-3">{notice}</p>}</form><section className={`${card} overflow-x-auto`}><h2 className="font-semibold">Catalogue ({state.products.length})</h2><table className="mt-4 w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b text-xs text-[#6B756E]"><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Preview price</th><th className="p-3">Visibility</th><th className="p-3">Action</th></tr></thead><tbody>{state.products.map((product) => <tr key={product.id} className="border-b last:border-0"><td className="p-3"><div className="flex items-center gap-3"><img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover" /><div><p className="font-medium">{product.name}</p><p className="text-xs text-[#6B756E]">{product.demo ? 'Illustrative demo' : 'Local preview'}</p></div></div></td><td className="p-3">{state.categories.find((category) => category.id === product.categoryId)?.name ?? 'Uncategorised'}</td><td className="p-3">{money(product.price)} / {product.unit}</td><td className="p-3"><Status value={product.active ? 'Published · demo only' : 'Unpublished'} /></td><td className="p-3"><button onClick={() => setActive(product.id, !product.active)} className={secondary}>{product.active ? 'Unpublish' : 'Publish demo'}</button></td></tr>)}</tbody></table></section></div>
}

function FoodCategoryManager({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const [notice, setNotice] = useState('')
  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const description = String(data.get('description') ?? '').trim()
    if (!name || !description) { setNotice('Category name and description are required.'); return }
    const baseId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const category: FoodCategory = { id: `${baseId}-${crypto.randomUUID().slice(0, 5)}`, name, description, active: false, order: state.categories.length + 1 }
    update((current) => ({ ...current, categories: [...current.categories, category] }))
    event.currentTarget.reset()
    setNotice('Category added as an unpublished local preview.')
  }
  return <div className="space-y-5"><form onSubmit={create} className={`${card} grid gap-3 sm:grid-cols-[1fr_2fr_auto]`}><FoodNamedField name="name" label="Category name" required /><FoodNamedField name="description" label="Description" required /><button className={button}>Add category</button>{notice && <p role="status" className="text-sm text-[#285342] sm:col-span-3">{notice}</p>}</form><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{state.categories.map((category) => <article key={category.id} className={card}><div className="flex items-start justify-between gap-2"><div><h2 className="font-semibold">{category.name}</h2><p className="mt-1 text-sm text-[#6B756E]">{category.description}</p></div><Status value={category.active ? 'Active' : 'Hidden'} /></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => update((current) => ({ ...current, categories: current.categories.map((item) => item.id === category.id ? { ...item, active: !item.active } : item) }))} className={secondary}>{category.active ? 'Hide' : 'Activate preview'}</button><button disabled={state.products.some((product) => product.categoryId === category.id)} onClick={() => update((current) => ({ ...current, categories: current.categories.filter((item) => item.id !== category.id) }))} className={`${secondary} disabled:opacity-40`}>Delete if unused</button></div>{state.products.some((product) => product.categoryId === category.id) && <p className="mt-2 text-xs text-[#6B756E]">Contains products; reassignment is needed before deletion.</p>}</article>)}</div></div>
}

function FoodOrderManager({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const statuses: FoodOrder['status'][] = ['Pending Payment', 'Paid', 'Confirmed', 'Accepted', 'In Kitchen', 'Preparing', 'Ready for Collection', 'Ready for Dispatch', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refund Requested', 'Refunded']
  if (!state.orders.length) return <EmptyState title="No orders to manage" detail="Orders will appear when returned by the connected, authoritative Foods order service. This browser preview does not create fictitious orders." />
  return <div className="space-y-3">{state.orders.map((order) => <article key={order.id} className={card}><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-semibold">{order.number}</h2><p className="mt-1 text-xs text-[#6B756E]">{foodDateTime(order.createdAt)} · {order.items.length} lines · {money(order.total)}</p><p className="mt-2 text-sm">{order.address.name} · {order.address.town}, {order.address.county}</p><p className="mt-1 text-xs text-[#6B756E]">{order.items.map((item) => `${item.name} × ${item.quantity}`).join(' · ')}</p></div><div className="space-y-2 text-right"><Status value={foodPaymentTitle(order.paymentStatus)} /><p><Status value={order.status} /></p></div></div><div className="mt-4 flex flex-wrap items-center gap-2"><label className="text-xs">Local preview status<select value={order.status} onChange={(event) => { const status = event.target.value as FoodOrder['status']; update((current) => ({ ...current, orders: current.orders.map((item) => item.id === order.id ? { ...item, status, timeline: [...item.timeline, { status, detail: 'Updated in local staff preview; not sent to order service.', createdAt: now() }] } : item) })) }} className="ml-2 rounded-lg border bg-white p-2 text-sm">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><Link to={`/foods/orders/${order.id}`} className={secondary}>View details</Link></div><p className="mt-3 text-xs text-[#6B756E]">Changing this preview status does not update a customer order. Payment status is read-only and can only be confirmed by verified backend callbacks.</p></article>)}</div>
}

function FoodInventoryManager({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const [notice, setNotice] = useState('')
  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const quantity = Number(data.get('quantity'))
    const purchaseCost = Number(data.get('purchaseCost'))
    const productId = String(data.get('productId') ?? '')
    const batch = String(data.get('batch') ?? '').trim()
    const expiryDate = String(data.get('expiryDate') ?? '')
    if (!state.products.some((product) => product.id === productId) || !batch || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(purchaseCost) || purchaseCost < 0 || !expiryDate) { setNotice('Select a product and enter a batch, positive quantity, valid cost and expiry date.'); return }
    const record: FoodInventoryRecord = { id: crypto.randomUUID(), productId, batch, quantity, unit: state.products.find((product) => product.id === productId)?.unit ?? '', supplier: String(data.get('supplier') ?? '').trim(), purchaseCost, expiryDate, storage: String(data.get('storage') ?? '').trim(), createdAt: now() }
    update((current) => ({ ...current, inventory: [record, ...current.inventory] }))
    event.currentTarget.reset()
    setNotice('Inventory batch recorded in this browser only. Stock is not synchronized to checkout.')
  }
  return <div className="space-y-5"><p className="rounded-xl border border-[#e8d8ae] bg-[#fff9e9] p-3 text-xs leading-5 text-[#604c27]">Inventory preview is not a stock ledger. Quantities do not reserve stock, alter catalogue availability, or affect order acceptance.</p><form onSubmit={create} className={`${card} grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}><h2 className="font-semibold sm:col-span-2 lg:col-span-4">Record a batch</h2><label className="text-sm">Product<select name="productId" required className="mt-1 w-full rounded-lg border bg-white p-3">{state.products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label><FoodNamedField name="batch" label="Batch / lot number" required /><FoodNamedField name="quantity" label="Quantity" type="number" min="0.01" step="any" required /><FoodNamedField name="expiryDate" label="Expiry / best-before date" type="date" required /><FoodNamedField name="supplier" label="Supplier (optional)" /><FoodNamedField name="purchaseCost" label="Purchase cost (KES)" type="number" min="0" step="any" required /><FoodNamedField name="storage" label="Storage location" /><button className={`${button} self-end`}>Record batch</button>{notice && <p role="status" className="text-sm text-[#285342] sm:col-span-2 lg:col-span-4">{notice}</p>}</form><div className={`${card} overflow-x-auto`}><h2 className="font-semibold">Batch records ({state.inventory.length})</h2>{state.inventory.length ? <table className="mt-4 w-full min-w-[780px] text-left text-sm"><thead><tr className="border-b text-xs text-[#6B756E]"><th className="p-3">Product / batch</th><th className="p-3">Quantity</th><th className="p-3">Supplier</th><th className="p-3">Expiry</th><th className="p-3">Storage</th><th className="p-3">Recorded</th><th /></tr></thead><tbody>{state.inventory.map((record) => <tr key={record.id} className="border-b last:border-0"><td className="p-3">{state.products.find((product) => product.id === record.productId)?.name ?? 'Removed product'}<p className="text-xs text-[#6B756E]">{record.batch}</p></td><td className="p-3">{record.quantity} {record.unit}</td><td className="p-3">{record.supplier || '—'}</td><td className="p-3">{record.expiryDate}</td><td className="p-3">{record.storage || '—'}</td><td className="p-3">{foodDate(record.createdAt)}</td><td className="p-3"><button onClick={() => update((current) => ({ ...current, inventory: current.inventory.filter((item) => item.id !== record.id) }))} className="text-xs text-[#a1462b]">Remove preview</button></td></tr>)}</tbody></table> : <p className="mt-3 text-sm text-[#6B756E]">No inventory batches recorded.</p>}</div></div>
}

function FoodKitchen({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const orders = state.orders.filter((order) => order.paymentStatus === 'Successful' && order.items.some((line) => foodProduct(state, line.productId)?.kind === 'meal') && !['Delivered', 'Cancelled', 'Refunded'].includes(order.status))
  const steps: FoodOrder['status'][] = ['Confirmed', 'In Kitchen', 'Preparing', 'Ready for Collection', 'Ready for Dispatch']
  return <div className="space-y-4"><p className="rounded-xl border border-[#e8d8ae] bg-[#fff9e9] p-3 text-xs leading-5 text-[#604c27]">Kitchen staff role preview. Only successfully paid orders are shown; changes are stored locally and do not notify customers or a live kitchen.</p>{orders.length ? orders.map((order) => <article key={order.id} className={card}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">Order {order.number}</h2><p className="mt-1 text-xs text-[#6B756E]">{foodDateTime(order.createdAt)} · {order.address.town}</p></div><Status value={order.status} /></div><div className="mt-4 space-y-3">{order.items.filter((line) => foodProduct(state, line.productId)?.kind === 'meal').map((line, index) => <div key={`${line.productId}-${index}`} className="rounded-xl bg-[#f7f8f4] p-3 text-sm"><strong>{line.quantity} × {line.name}</strong>{Object.values(line.selections).length > 0 && <p className="mt-1 text-xs text-[#6B756E]">{Object.values(line.selections).join(' · ')}</p>}{line.instructions && <p className="mt-1 text-xs">Kitchen request: {line.instructions}</p>}</div>)}</div><label className="mt-4 block text-sm">Preparation status<select value={steps.includes(order.status) ? order.status : 'Confirmed'} onChange={(event) => { const status = event.target.value as FoodOrder['status']; update((current) => ({ ...current, orders: current.orders.map((item) => item.id === order.id ? { ...item, status, timeline: [...item.timeline, { status, detail: 'Kitchen preview update; not sent to order service.', createdAt: now() }] } : item) })) }} className="mt-2 rounded-lg border bg-white p-3">{steps.map((status) => <option key={status}>{status}</option>)}</select></label></article>) : <EmptyState title="Kitchen queue is clear" detail="Eligible meal orders appear here only after verified successful payment." />}</div>
}

function FoodDelivery({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const orders = state.orders.filter((order) => order.paymentStatus === 'Successful' && ['Ready for Dispatch', 'Dispatched', 'Out for Delivery', 'Delivered'].includes(order.status))
  const [rider, setRider] = useState('')
  const [notice, setNotice] = useState('')
  return <div className="space-y-4"><p className="rounded-xl border border-[#e8d8ae] bg-[#fff9e9] p-3 text-xs leading-5 text-[#604c27]">Delivery role preview only. Customer addresses are personal data; access must be protected by authenticated, least-privilege server authorization in production.</p>{orders.length ? orders.map((order) => <article key={order.id} className={card}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">{order.number}</h2><p className="mt-1 text-xs text-[#6B756E]">{order.address.name} · {order.address.phone}</p><p className="mt-2 text-sm">{order.address.buildingNumber} {order.address.street}, {order.address.area}, {order.address.town}, {order.address.county}</p>{order.address.instructions && <p className="mt-1 text-xs text-[#6B756E]">Instructions: {order.address.instructions}</p>}</div><Status value={order.status} /></div><p className="mt-3 text-xs text-[#6B756E]">Assigned to: {order.assignedTo || 'Not assigned'}</p><div className="mt-4 flex flex-wrap gap-2"><input aria-label={`Rider for ${order.number}`} value={rider} onChange={(event) => setRider(event.target.value)} placeholder="Local rider name / ID" className="rounded-lg border p-2 text-sm" /><button onClick={() => { if (!rider.trim()) { setNotice('Enter a local rider name or ID first.'); return } update((current) => ({ ...current, orders: current.orders.map((item) => item.id === order.id ? { ...item, assignedTo: rider.trim() } : item) })); setRider(''); setNotice(`Local assignment updated for ${order.number}.`) }} className={secondary}>Assign preview rider</button><button onClick={() => { const issue = window.prompt('Record a local delivery exception (for example: customer unavailable):'); if (!issue?.trim()) return; update((current) => ({ ...current, orders: current.orders.map((item) => item.id === order.id ? { ...item, deliveryIssue: issue.trim() } : item) })); setNotice(`Delivery exception recorded for ${order.number} in this browser.`) }} className={secondary}>Record delivery issue</button></div>{order.deliveryIssue && <p className="mt-3 rounded-lg bg-[#fff4e8] p-3 text-xs text-[#79501c]">Local delivery note: {order.deliveryIssue}</p>}</article>) : <EmptyState title="No paid orders ready for delivery" detail="Only verified paid orders marked ready for dispatch or already dispatched are included." />}{notice && <p role="status" className="text-sm text-[#285342]">{notice}</p>}</div>
}

function FoodSuppliers({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const [notice, setNotice] = useState('')
  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const supplier: FoodSupplier = { id: crypto.randomUUID(), name: String(data.get('name') ?? '').trim(), contact: String(data.get('contact') ?? '').trim(), location: String(data.get('location') ?? '').trim(), products: String(data.get('products') ?? '').trim(), notes: String(data.get('notes') ?? '').trim() }
    if (!supplier.name || !supplier.contact || !supplier.products) { setNotice('Supplier name, contact and supplied products are required.'); return }
    update((current) => ({ ...current, suppliers: [supplier, ...current.suppliers] }))
    event.currentTarget.reset()
    setNotice('Supplier record saved in this browser only.')
  }
  return <div className="space-y-5"><p className="rounded-xl border border-[#e8d8ae] bg-[#fff9e9] p-3 text-xs leading-5 text-[#604c27]">Supplier information is local preview data. No supplier has been vetted, contracted or connected to catalogue availability.</p><form onSubmit={create} className={`${card} grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}><FoodNamedField name="name" label="Supplier / farm name" required /><FoodNamedField name="contact" label="Contact details" required /><FoodNamedField name="location" label="Location" /><FoodNamedField name="products" label="Products supplied" required /><FoodNamedField name="notes" label="Notes" /><button className={`${button} self-end`}>Add supplier record</button></form>{notice && <p role="status" className="text-sm text-[#285342]">{notice}</p>}<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{state.suppliers.length ? state.suppliers.map((supplier) => <article key={supplier.id} className={card}><div className="flex justify-between gap-2"><h2 className="font-semibold">{supplier.name}</h2><button onClick={() => update((current) => ({ ...current, suppliers: current.suppliers.filter((item) => item.id !== supplier.id) }))} className="text-xs text-[#a1462b]">Remove</button></div><p className="mt-2 text-sm">{supplier.products}</p><p className="mt-1 text-xs text-[#6B756E]">{supplier.location} · {supplier.contact}</p>{supplier.notes && <p className="mt-2 text-xs text-[#6B756E]">{supplier.notes}</p>}</article>) : <p className="text-sm text-[#6B756E]">No supplier records.</p>}</div></div>
}

function FoodBulkManager({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const statuses: BulkRequest['status'][] = ['Submitted', 'Under review', 'Quotation prepared', 'Approved', 'Declined']
  return <div className="space-y-3">{state.bulkRequests.length ? state.bulkRequests.map((request) => <article key={request.id} className={card}><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">{request.businessName}</h2><p className="mt-1 text-xs text-[#6B756E]">{request.businessType} · {request.contactName} · {request.phone} · {request.email}</p><p className="mt-2 text-sm">{request.products}</p><p className="mt-1 text-xs text-[#6B756E]">{request.location} · {request.schedule || 'Schedule not provided'}</p></div><Status value={request.status} /></div><label className="mt-4 block text-sm">Local review status<select value={request.status} onChange={(event) => { const status = event.target.value as BulkRequest['status']; update((current) => ({ ...current, bulkRequests: current.bulkRequests.map((item) => item.id === request.id ? { ...item, status } : item) })) }} className="mt-1 rounded-lg border bg-white p-2">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><p className="mt-2 text-xs text-[#6B756E]">Status is not a quotation, supply commitment, approval of credit or confirmed order.</p></article>) : <EmptyState title="No bulk quotation requests" detail="Requests submitted from the business ordering page appear here in this browser preview." />}</div>
}

function FoodSupportManager({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const statuses: FoodSupportTicket['status'][] = ['Open', 'Under review', 'Resolved', 'Closed']
  return <div className="space-y-3">{state.tickets.length ? state.tickets.map((ticket) => <article key={ticket.id} className={card}><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">{ticket.category} · {ticket.id.slice(0, 8)}</h2><p className="mt-1 text-sm leading-6">{ticket.message}</p><p className="mt-1 text-xs text-[#6B756E]">{ticket.orderId ? `Order ${ticket.orderId} · ` : ''}{foodDateTime(ticket.createdAt)}</p></div><Status value={ticket.status} /></div><label className="mt-4 block text-sm">Local ticket status<select value={ticket.status} onChange={(event) => { const status = event.target.value as FoodSupportTicket['status']; update((current) => ({ ...current, tickets: current.tickets.map((item) => item.id === ticket.id ? { ...item, status } : item) })) }} className="mt-1 rounded-lg border bg-white p-2">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><p className="mt-2 text-xs text-[#6B756E]">Customer identity and replies are unavailable until the support service and authenticated account context are connected.</p></article>) : <EmptyState title="No support requests" detail="Customer enquiries created in the support page appear here." />}</div>
}

function FoodReviewManager({ state, update }: { state: FoodState; update: FoodUpdate }) {
  const statuses: FoodState['reviews'][number]['status'][] = ['Pending moderation', 'Published', 'Rejected']
  return <div className="space-y-3">{state.reviews.length ? state.reviews.map((review) => <article key={review.id} className={card}><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">{review.title || 'Customer review'} · {review.rating}/5</h2><p className="mt-2 text-sm leading-6">{review.body}</p><p className="mt-1 text-xs text-[#6B756E]">{state.products.find((product) => product.id === review.productId)?.name ?? review.productId} · paid order {review.orderId.slice(0, 8)} · {foodDate(review.createdAt)}</p></div><Status value={review.status} /></div><label className="mt-4 block text-sm">Moderation status<select value={review.status} onChange={(event) => { const status = event.target.value as FoodState['reviews'][number]['status']; update((current) => ({ ...current, reviews: current.reviews.map((item) => item.id === review.id ? { ...item, status } : item) })) }} className="mt-1 rounded-lg border bg-white p-2">{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><p className="mt-2 text-xs text-[#6B756E]">Publishing exposes the review only after moderation in this browser; production publishing must be server-authorized.</p></article>) : <EmptyState title="No reviews to moderate" detail="Reviews submitted by verified purchasers appear here after the review service is connected." />}</div>
}

function FoodReports({ state }: { state: FoodState }) {
  const successful = state.orders.filter((order) => order.paymentStatus === 'Successful')
  const report = () => foodCsv('leafy-foods-paid-orders-preview.csv', [['Order number', 'Created at', 'Payment status', 'Order status', 'Amount KES', 'Receipt'], ...successful.map((order) => [order.number, order.createdAt, order.paymentStatus, order.status, String(order.total), order.receipt ?? ''])])
  const gross = successful.reduce((total, order) => total + order.total, 0)
  return <div className="space-y-5"><p className="rounded-xl border border-[#e8d8ae] bg-[#fff9e9] p-3 text-xs leading-5 text-[#604c27]">Super-admin financial report preview. Values are derived only from order records marked payment-successful by the connected service; this prototype has no live order/payment backend.</p><div className="grid gap-3 sm:grid-cols-3"><div className={card}><p className="text-sm text-[#6B756E]">Verified paid orders</p><p className="mt-2 text-3xl font-semibold">{successful.length}</p></div><div className={card}><p className="text-sm text-[#6B756E]">Recorded order totals</p><p className="mt-2 text-3xl font-semibold">{money(gross)}</p></div><div className={card}><p className="text-sm text-[#6B756E]">Refunded payments</p><p className="mt-2 text-3xl font-semibold">{state.orders.filter((order) => order.paymentStatus === 'Successful' && order.status === 'Refunded').length}</p></div></div><button onClick={report} className={secondary}><Download className="h-4 w-4" /> Export paid-order preview CSV</button><div className={card}><h2 className="font-semibold">Financial report records</h2>{successful.length ? <RecordList rows={successful.map((order) => ({ title: `${order.number} · ${money(order.total)}`, detail: `${order.receipt ? `M-Pesa receipt ${order.receipt} · ` : ''}${foodDateTime(order.createdAt)}`, status: order.paymentStatus }))} /> : <p className="mt-3 text-sm text-[#6B756E]">No verified paid orders are available to report.</p>}</div></div>
}

function FoodFooter() {
  return <footer className="mt-14 border-t border-[#e6eae5] bg-white"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8"><div><Link to="/foods" className="font-semibold">Leafy Foods</Link><p className="mt-2 max-w-xs text-sm leading-6 text-[#6B756E]">Food shopping and nourishment within the Leafy ecosystem.</p></div><div><h2 className="text-sm font-semibold">Shop</h2><div className="mt-3 grid gap-2 text-sm text-[#59665d]"><Link to="/foods/shop">All food</Link><Link to="/foods/meals">Meals</Link><Link to="/foods/packages">Packages</Link><Link to="/foods/cart">Shopping cart</Link></div></div><div><h2 className="text-sm font-semibold">About</h2><div className="mt-3 grid gap-2 text-sm text-[#59665d]"><Link to="/foods/about">About Leafy Foods</Link><Link to="/foods/bulk">Business & bulk orders</Link><Link to="/foods/contact">Customer support</Link></div></div><div><h2 className="text-sm font-semibold">Explore Leafy</h2><div className="mt-3 grid gap-2 text-sm text-[#59665d]"><Link to="/market">Leafy Market</Link><Link to="/farms">Leafy Farms</Link><Link to="/academy">Leafy Academy</Link></div></div></div><div className="border-t border-[#e6eae5] py-4 text-center text-xs text-[#6B756E]">Catalogue listings and order availability depend on active service configuration.</div></footer>
}

function SectionHeading({ eyebrow, title, detail, action }: { eyebrow?: string; title: string; detail?: string; action?: ReactNode }) {
  return <div className="flex flex-wrap items-end justify-between gap-3"><div>{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}<h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>{detail && <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B756E]">{detail}</p>}</div>{action}</div>
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[.16em] text-[#39845A]">{children}</p>
}

function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return <section className={`${card} py-10 text-center`}><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]"><ShoppingBag className="h-5 w-5" /></div><h2 className="mt-4 text-lg font-semibold">{title}</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#6B756E]">{detail}</p>{action && <div className="mt-5">{action}</div>}</section>
}

function Summary({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className={`flex justify-between gap-4 py-2 text-sm ${strong ? 'border-t border-[#e6eae5] pt-3 font-semibold' : 'text-[#59665d]'}`}><span>{label}</span><span>{value}</span></div>
}

function Status({ value }: { value: string }) {
  const textTone = /success|paid|delivered|published|active|approved|resolved/i.test(value)
    ? 'text-[#285342]'
    : /failed|cancel|declined|reject|expired/i.test(value)
      ? 'text-[#9b422b]'
      : /pending|review|initiated|kitchen|dispatch|ready|awaiting|hidden|unpublished/i.test(value)
        ? 'text-[#79501c]'
        : 'text-[#59665d]'
  return <span className={`text-xs font-medium ${textTone}`}>{value}</span>
}

function RecordList({ rows }: { rows: { title: string; detail: string; status: string }[] }) {
  return <ul className="mt-3 divide-y divide-[#e6eae5]">{rows.map((row, index) => <li key={`${row.title}-${index}`} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="text-sm font-medium">{row.title}</p><p className="mt-1 text-xs text-[#6B756E]">{row.detail}</p></div><Status value={row.status} /></li>)}</ul>
}

function FoodNamedField({ name, label, type = 'text', required = false, min, step, placeholder }: { name: string; label: string; type?: string; required?: boolean; min?: string; step?: string; placeholder?: string }) {
  return <label className="block text-sm">{label}<input name={name} type={type} required={required} min={min} step={step} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-[#dce4dc] bg-white p-3 outline-none focus:border-[#39845A] focus:ring-2 focus:ring-[#39845A]/15" /></label>
}

function FoodTextInput({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <label className="block text-sm">{label}<input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-[#dce4dc] bg-white p-3 outline-none focus:border-[#39845A]" /></label>
}

function foodLineKey(item: FoodCartItem): string {
  return `${item.productId}:${JSON.stringify(Object.entries(item.selections).sort(([a], [b]) => a.localeCompare(b)))}:${item.instructions}`
}

function sameFoodLine(a: FoodCartItem, b: FoodCartItem): boolean {
  return foodLineKey(a) === foodLineKey(b)
}

function addFoodLine(cart: FoodCartItem[], next: FoodCartItem): FoodCartItem[] {
  const match = cart.find((item) => sameFoodLine(item, next))
  if (!match) return [...cart, next]
  return cart.map((item) => sameFoodLine(item, next) ? { ...item, quantity: item.quantity + next.quantity } : item)
}

function mergeFoodCart(cart: FoodCartItem[], additions: FoodCartItem[]): FoodCartItem[] {
  return additions.reduce(addFoodLine, cart)
}

function foodUnitPrice(product: FoodProduct, item: FoodCartItem): number {
  return product.price + Object.entries(item.selections).reduce((sum, [id, label]) => {
    const option = product.options.find((candidate) => candidate.id === id)
    return sum + (option?.choices.find((choice) => choice.label === label)?.priceAdjustment ?? 0)
  }, 0)
}

function isValidKenyanPhone(phone: string): boolean {
  const digits = phone.replace(/[\s()+-]/g, '')
  return /^(?:254|0)(?:7|1)\d{8}$/.test(digits)
}

function foodPhoneError(phone: string): string {
  if (!phone.trim()) return 'Enter the M-Pesa phone number.'
  return isValidKenyanPhone(phone) ? '' : 'Enter a valid Kenyan mobile number, such as 0712345678, 0112345678 or 254712345678.'
}

function normalizeFoodPhone(phone: string): string {
  const digits = phone.replace(/[\s()+-]/g, '')
  return digits.startsWith('0') ? `254${digits.slice(1)}` : digits
}

function foodPaymentTitle(status: FoodPaymentStatus): string {
  return status === 'Successful' ? 'Payment successful' : status === 'Awaiting Customer Action' ? 'Check your phone' : status === 'Reconciliation Required' ? 'Confirmation pending' : status
}

function foodPaymentMessage(status: FoodPaymentStatus): string {
  const messages: Record<FoodPaymentStatus, string> = {
    Pending: 'Payment is waiting to be initiated.',
    Initiated: 'Payment request sent. Please check your phone and enter your M-Pesa PIN.',
    'Awaiting Customer Action': 'Payment request sent. Please check your phone and enter your M-Pesa PIN.',
    Successful: 'Payment confirmed by the payment service.',
    Failed: 'The payment did not complete. Check the message on your phone before retrying.',
    Cancelled: 'The payment request was cancelled. You can retry when ready.',
    Expired: 'The payment request timed out. You can safely request a new prompt.',
    'Reconciliation Required': 'Payment confirmation is being checked. Do not retry until the order status has been verified.',
  }
  return messages[status]
}

function foodDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function foodDateTime(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}
