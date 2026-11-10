import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, BadgeCheck, CircleHelp, Heart, MapPin, Menu,
  Minus, Plus, Search, ShieldCheck, ShoppingBag, SlidersHorizontal, Truck, UserRound, X,
} from 'lucide-react'
import {
  cartDiscount, cartItemCount, cartSubtotal, categoryFor, getDeliveryFee,
  itemSelectionKey, loadMarketState, marketCategories, marketProducts, marketReviews,
  marketSellers, productFor, saveMarketState, sellerFor,
  type CartItem, type MarketAddress, type MarketOrder, type MarketProduct, type MarketRole,
  type MarketCheckoutDraft, type MarketState, type OrderStatus, type PaymentStatus, type ProductReview,
} from './marketStore'
import { LeafyLogo } from '../LeafyLogo'

const primary = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#285342] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1e4032] disabled:cursor-not-allowed disabled:opacity-50'
const secondary = 'inline-flex items-center justify-center gap-2 rounded-full border border-[#dce4dc] bg-white px-4 py-2.5 text-sm font-medium text-[#285342] hover:border-[#285342]'
const panel = 'rounded-2xl border border-[#e6eae5] bg-white p-5 shadow-[0_16px_40px_rgba(32,41,35,.04)]'
const money = (amount: number) => `KSh ${amount.toLocaleString('en-KE')}`
const now = () => new Date().toISOString()

export function MarketRoutes() {
  const [state, setState] = useState<MarketState>(() => loadMarketState())
  const [mobileMenu, setMobileMenu] = useState(false)
  const location = useLocation()
  const isMarketWorkspace = location.pathname.startsWith('/market/manage') ||
    (location.pathname.startsWith('/market/seller/') && !location.pathname.startsWith('/market/seller/apply'))

  const update = useCallback((operation: (current: MarketState) => MarketState) => {
    setState((current) => {
      const next = operation(current)
      saveMarketState(next)
      return next
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#F6F5EF] text-[#202923]">
      {isMarketWorkspace ? <header className="sticky top-0 z-40 border-b border-[#e6eae5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/market" aria-label="Leafy Market" className="flex shrink-0 items-center gap-2.5">
            <LeafyLogo className="h-10 w-20" />
            <span><strong className="block leading-5">Market</strong><small className="text-[10px] uppercase tracking-[.22em] text-[#718078]">Shop with purpose</small></span>
          </Link>
          <div className="hidden flex-1 lg:block"><MarketSearch /></div>
          <nav className="ml-auto hidden items-center gap-5 text-sm font-medium lg:flex">
            <NavLink to="/market/products" className={marketNavClass}>Shop</NavLink>
            <NavLink to="/market/stores" className={marketNavClass}>Stores</NavLink>
            <Link to="/market/seller/apply" className="text-[#285342]">Become a seller</Link>
            <Link to="/market/account" aria-label="Account" className="rounded-full border border-[#e6eae5] p-2"><UserRound className="h-4 w-4" /></Link>
            <Link to="/market/wishlist" aria-label="Wishlist" className="rounded-full border border-[#e6eae5] p-2"><Heart className="h-4 w-4" /></Link>
            <Link to="/market/cart" aria-label="Shopping cart" className="relative rounded-full bg-[#285342] p-2 text-white"><ShoppingBag className="h-4 w-4" />{cartItemCount(state.cart) > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A4C68C] px-1 text-[10px] font-bold text-[#202923]">{cartItemCount(state.cart)}</span>}</Link>
          </nav>
          <button type="button" className="ml-auto rounded-full border border-[#e6eae5] p-2 lg:hidden" aria-label="Toggle market navigation" aria-expanded={mobileMenu} onClick={() => setMobileMenu((open) => !open)}>{mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
        <div className="px-4 pb-3 lg:hidden"><MarketSearch /></div>
        {mobileMenu && <nav className="grid gap-3 border-t border-[#e6eae5] bg-white px-4 py-4 text-sm lg:hidden"><Link to="/market/products" onClick={() => setMobileMenu(false)}>Shop all products</Link><Link to="/market/stores" onClick={() => setMobileMenu(false)}>Seller stores</Link><Link to="/market/wishlist" onClick={() => setMobileMenu(false)}>Wishlist</Link><Link to="/market/cart" onClick={() => setMobileMenu(false)}>Cart ({cartItemCount(state.cart)})</Link><Link to="/market/account" onClick={() => setMobileMenu(false)}>My account & orders</Link><Link to="/market/seller/apply" onClick={() => setMobileMenu(false)}>Become a seller</Link></nav>}
      </header> : <div className="border-b border-[#E6EAE5] bg-white/75">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-[220px] flex-1"><MarketSearch /></div>
          <nav aria-label="Market shortcuts" className="hidden items-center gap-4 text-sm font-medium text-[#536057] md:flex">
            <NavLink to="/market/products" className={marketNavClass}>Shop</NavLink>
            <NavLink to="/market/stores" className={marketNavClass}>Stores</NavLink>
            <Link to="/market/seller/apply" className="whitespace-nowrap text-[#285342] hover:text-[#1f4032]">Become a seller</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/market/account" aria-label="Account" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e6eae5] text-[#285342] hover:bg-[#F6F5EF]"><UserRound className="h-4 w-4" /></Link>
            <Link to="/market/wishlist" aria-label="Wishlist" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e6eae5] text-[#285342] hover:bg-[#F6F5EF]"><Heart className="h-4 w-4" /></Link>
            <Link to="/market/cart" aria-label={`Shopping cart (${cartItemCount(state.cart)} items)`} className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#285342] text-white"><ShoppingBag className="h-4 w-4" />{cartItemCount(state.cart) > 0 && <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A4C68C] px-1 text-[10px] font-bold text-[#202923]">{cartItemCount(state.cart)}</span>}</Link>
          </div>
        </div>
      </div>}
      <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 lg:px-8">
        <p role="status" className="mb-6 rounded-xl border border-[#e8d8ae] bg-[#fff9e9] p-3 text-xs leading-5 text-[#604c27]"><strong>Marketplace prototype.</strong> Seed products and seller profiles are illustrative, not verified offers or live suppliers. Saved data is browser-local; seller verification, fulfilment and payment services are not connected.</p>
        <Routes>
          <Route index element={<MarketHome state={state} update={update} />} />
          <Route path="products" element={<ProductCatalogue state={state} update={update} />} />
          <Route path="products/:productId" element={<ProductDetails state={state} update={update} />} />
          <Route path="category/:categoryId" element={<ProductCatalogue state={state} update={update} />} />
          <Route path="stores" element={<StoresPage />} />
          <Route path="stores/:sellerId" element={<StorePage state={state} update={update} />} />
          <Route path="cart" element={<CartPage state={state} update={update} />} />
          <Route path="checkout" element={<CheckoutPage state={state} update={update} />} />
          <Route path="payment" element={<PaymentStatusPage state={state} update={update} />} />
          <Route path="payment/:paymentId" element={<PaymentStatusPage state={state} update={update} />} />
          <Route path="orders" element={<OrdersPage state={state} />} />
          <Route path="orders/:orderId" element={<OrderDetailPage state={state} update={update} />} />
          <Route path="wishlist" element={<WishlistPage state={state} update={update} />} />
          <Route path="account/*" element={<CustomerAccount state={state} update={update} />} />
          <Route path="seller/apply" element={<SellerApplicationPage update={update} />} />
          <Route path="seller/*" element={<SellerPortal state={state} update={update} />} />
          <Route path="manage/*" element={<MarketAdminPortal state={state} update={update} />} />
          <Route path="*" element={<Navigate to="/market" replace />} />
        </Routes>
      </main>
      <MarketFooter />
    </div>
  )
}

function marketNavClass({ isActive }: { isActive: boolean }) {
  return `transition hover:text-[#285342] ${isActive ? 'text-[#285342]' : 'text-[#4d5a52]'}`
}

async function readApiResponse<T>(response: Response, unavailableMessage: string): Promise<T> {
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`${unavailableMessage} (HTTP ${response.status}; no JSON response was returned).`)
  }
  try {
    return await response.json() as T
  } catch (error) {
    throw new Error(`${unavailableMessage} (HTTP ${response.status}; the response was invalid JSON).`, { cause: error })
  }
}

function MarketSearch() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const suggestions = query.trim() ? marketProducts.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : []
  const submit = (event: FormEvent) => {
    event.preventDefault()
    navigate(`/market/products?q=${encodeURIComponent(query)}`)
  }
  return <form onSubmit={submit} className="relative flex w-full items-center rounded-full border border-[#e6eae5] bg-[#F6F5EF] px-4 focus-within:border-[#39845A]">
    <Search className="h-4 w-4 shrink-0 text-[#758178]" />
    <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') setQuery('') }} placeholder="Search products, categories and stores" className="w-full bg-transparent px-3 py-2.5 text-sm outline-none" />
    {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}><X className="h-4 w-4 text-[#758178]" /></button>}
    {suggestions.length > 0 && <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#e6eae5] bg-white p-2 shadow-xl">{suggestions.map((product) => <Link key={product.id} to={`/market/products/${product.id}`} onClick={() => setQuery('')} className="flex items-center gap-3 rounded-lg p-2 text-sm hover:bg-[#F6F5EF]"><img src={product.images[0]} alt="" className="h-10 w-10 rounded object-cover" /><span>{product.name}</span></Link>)}<button className="w-full px-2 py-2 text-left text-xs font-semibold text-[#285342]" onClick={() => navigate(`/market/products?q=${encodeURIComponent(query)}`)}>See all search results</button></div>}
  </form>
}

function MarketHome({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const featured = marketProducts.filter((product) => product.status === 'active').slice(0, 4)
  const [email, setEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState('')
  const subscribe = (event: FormEvent) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setNewsletterMessage('Enter a valid email address.'); return }
    update((current) => ({ ...current, notifications: [{ id: crypto.randomUUID(), title: 'Market updates requested', detail: 'Your email preference has been recorded in this browser prototype.', href: '/market/account', read: false, createdAt: now() }, ...current.notifications] }))
    setNewsletterMessage('Thanks. Your preference has been saved on this device.')
    setEmail('')
  }
  return <div className="space-y-12">
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#202923] text-white">
      <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=85" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#15231d]/90 via-[#15231d]/60 to-transparent" />
      <div className="w-full max-w-[1400px] px-6 py-20 sm:px-12 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[.28em] text-[#A4C68C]">Leafy Market · agricultural commerce</p>
        <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight tracking-[-.04em] sm:text-6xl">Connecting agricultural products with opportunity.</h1>
        <p className="mt-5 max-w-4xl text-base leading-7 text-white/85">Leafy Market is the commercial connection point for agricultural producers, food businesses, innovators, buyers and potential partners.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/market/products" className="rounded-full bg-[#A4C68C] px-6 py-3 text-sm font-semibold text-[#202923]">Explore products <ArrowRight className="ml-1 inline h-4 w-4" /></Link><Link to="/market#categories" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white">Shop by category</Link></div>
      </div>
    </section>
    <section id="categories"><SectionTitle eyebrow="Find your kind of good" title="Shop by category" action={<Link to="/market/products" className="text-sm font-semibold text-[#285342]">All products <ArrowRight className="ml-1 inline h-4 w-4" /></Link>} /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{marketCategories.slice(0, 10).map((category) => <Link key={category.id} to={`/market/category/${category.id}`} className="group relative h-40 overflow-hidden rounded-2xl bg-[#dfe8dc] sm:h-48"><img src={category.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#202923]/80 to-transparent" /><div className="absolute bottom-3 left-3 right-3 text-white"><p className="text-sm font-semibold">{category.name}</p></div></Link>)}</div></section>
    <ProductShelf title="Agricultural and food products" eyebrow="Illustrative listings" products={featured} state={state} update={update} />
    <section><SectionTitle eyebrow="Producer profiles · examples" title="Explore who supplies the listings" action={<Link to="/market/stores" className="text-sm font-semibold text-[#285342]">View producer profiles <ArrowRight className="ml-1 inline h-4 w-4" /></Link>} /><div className="grid gap-4 md:grid-cols-3">{marketSellers.filter((seller) => seller.status === 'approved').map((seller) => <SellerCard key={seller.id} seller={seller} />)}</div></section>
    <section className="rounded-2xl border border-[#e6eae5] bg-white p-6"><p className="text-xs font-semibold uppercase tracking-wider text-[#39845A]">Agricultural innovation connections</p><h2 className="mt-2 text-2xl font-semibold">Help promising ideas reach the people who can support them.</h2><p className="mt-3 max-w-4xl text-sm leading-7 text-[#6B756E]">Leafy’s intended role includes connecting agricultural innovators with organisations and individuals who can offer incubation, funding, research validation, technical assistance, mentorship and routes to market. A real request, review and partner-matching process has not yet been implemented.</p></section>
    <section className="grid gap-3 rounded-2xl bg-[#EDF4EA] p-5 sm:grid-cols-3 sm:p-7">{[{ icon: ShieldCheck, title: 'Payment handling', detail: 'Checkout is a prototype; payment confirmation requires a configured backend and verified provider callbacks.' }, { icon: Truck, title: 'Order fulfilment', detail: 'Order updates require live seller and fulfilment operations.' }, { icon: CircleHelp, title: 'Buyer support', detail: 'Support policies and a connected enquiry service must be established before launch.' }].map(({ icon: Icon, title, detail }) => <div key={title} className="flex gap-3 rounded-xl bg-white p-4"><Icon className="h-5 w-5 shrink-0 text-[#285342]" /><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-[#6B756E]">{detail}</p></div></div>)}</section>
    <section className="rounded-2xl border border-[#e6eae5] bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-6"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#39845A]">Market notes</p><h2 className="mt-1 text-2xl font-semibold">Good finds, delivered occasionally.</h2><p className="mt-2 text-sm text-[#6B756E]">Choose whether you’d like to hear about new makers and seasonal collections.</p></div><form onSubmit={subscribe} className="mt-4 flex w-full max-w-md gap-2 sm:mt-0"><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="min-w-0 flex-1 rounded-full border border-[#e6eae5] px-4 py-3 text-sm outline-none focus:border-[#285342]" /><button className={primary}>Subscribe</button>{newsletterMessage && <p role="status" className="basis-full text-xs text-[#285342]">{newsletterMessage}</p>}</form></section>
  </div>
}

type UpdateMarket = (operation: (current: MarketState) => MarketState) => void

function ProductShelf({ title, eyebrow, products, state, update }: { title: string; eyebrow: string; products: MarketProduct[]; state: MarketState; update: UpdateMarket }) {
  return <section><SectionTitle eyebrow={eyebrow} title={title} action={<Link to="/market/products" className="text-sm font-semibold text-[#285342]">View all <ArrowRight className="ml-1 inline h-4 w-4" /></Link>} /><div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{products.map((product) => <ProductCard key={product.id} product={product} state={state} update={update} />)}</div></section>
}

function ProductCatalogue({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const [params, setParams] = useSearchParams()
  const { categoryId } = useParams()
  const [seller, setSeller] = useState('All sellers')
  const [availability, setAvailability] = useState('Available')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('Relevance')
  const query = params.get('q') ?? ''
  const [itemsPerPage, setItemsPerPage] = useState(8)
  let items = marketProducts.filter((product) => product.status === 'active')
  if (categoryId) items = items.filter((product) => product.categoryId === categoryId)
  if (query) items = items.filter((product) => `${product.name} ${product.description} ${product.subcategory} ${sellerFor(product.sellerId)?.storeName ?? ''}`.toLowerCase().includes(query.toLowerCase()))
  if (seller !== 'All sellers') items = items.filter((product) => product.sellerId === seller)
  if (availability === 'In stock') items = items.filter((product) => product.stock > 0)
  if (availability === 'Out of stock') items = items.filter((product) => product.stock === 0)
  if (minPrice) items = items.filter((product) => product.price >= Number(minPrice))
  if (maxPrice) items = items.filter((product) => product.price <= Number(maxPrice))
  if (sort === 'Price: low to high') items.sort((a, b) => a.price - b.price)
  if (sort === 'Price: high to low') items.sort((a, b) => b.price - a.price)
  if (sort === 'Newest') items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const category = categoryFor(categoryId ?? '')
  return <div className="space-y-6"><SectionTitle eyebrow={category?.name ?? 'Leafy Market'} title={query ? `Results for “${query}”` : category?.name ?? 'Discover products'} description={`${items.length} illustrative listings · Prices and availability are not confirmed. Product ratings display only after verified customer reviews.`} /><div className="grid gap-5 lg:grid-cols-[235px_1fr]"><aside className={`${panel} h-fit space-y-4`}><p className="flex items-center gap-2 font-semibold"><SlidersHorizontal className="h-4 w-4" /> Filters</p><label className="block text-xs font-medium text-[#6B756E]">Seller<select value={seller} onChange={(event) => setSeller(event.target.value)} className="mt-1 w-full rounded-lg border border-[#e6eae5] bg-white p-2.5 text-sm text-[#202923]"><option>All sellers</option>{marketSellers.filter((item) => item.status === 'approved').map((item) => <option key={item.id} value={item.id}>{item.storeName}</option>)}</select></label><div className="grid grid-cols-2 gap-2"><label className="text-xs text-[#6B756E]">Min KSh<input inputMode="numeric" value={minPrice} onChange={(event) => setMinPrice(event.target.value.replace(/\D/g, ''))} className="mt-1 w-full rounded-lg border border-[#e6eae5] p-2 text-sm" /></label><label className="text-xs text-[#6B756E]">Max KSh<input inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value.replace(/\D/g, ''))} className="mt-1 w-full rounded-lg border border-[#e6eae5] p-2 text-sm" /></label></div><label className="block text-xs font-medium text-[#6B756E]">Availability<select value={availability} onChange={(event) => setAvailability(event.target.value)} className="mt-1 w-full rounded-lg border border-[#e6eae5] bg-white p-2.5 text-sm text-[#202923]"><option>Available</option><option>In stock</option><option>Out of stock</option><option>All products</option></select></label><div className="space-y-2 border-t border-[#e6eae5] pt-3"><p className="text-xs font-semibold text-[#202923]">Categories</p>{marketCategories.map((item) => <Link key={item.id} to={`/market/category/${item.id}`} className={`block text-sm ${item.id === categoryId ? 'font-semibold text-[#285342]' : 'text-[#647067]'}`}>{item.name}</Link>)}</div><button className="text-sm font-semibold text-[#285342]" onClick={() => { setSeller('All sellers'); setMinPrice(''); setMaxPrice(''); setAvailability('Available'); setSort('Relevance'); setParams({}) }}>Clear filters</button></aside><div><div className="mb-4 flex justify-end"><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products" className="rounded-full border border-[#e6eae5] bg-white px-4 py-2 text-sm"><option>Relevance</option><option>Newest</option><option>Price: low to high</option><option>Price: high to low</option></select></div>{items.length === 0 ? <EmptyMarket title={query ? 'No matching products' : 'No products in this collection'} detail="Try changing your search or filters. Product availability may change as sellers update stock." action={<button onClick={() => { setParams({}); setAvailability('All products') }} className={secondary}>Clear search and filters</button>} /> : <><div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">{items.slice(0, itemsPerPage).map((product) => <ProductCard key={product.id} product={product} state={state} update={update} />)}</div>{itemsPerPage < items.length && <div className="mt-6 text-center"><button className={secondary} onClick={() => setItemsPerPage((count) => count + 8)}>Load more</button></div>}</>}</div></div></div>
}

function ProductCard({ product, state, update }: { product: MarketProduct; state: MarketState; update: UpdateMarket }) {
  const [notice, setNotice] = useState('')
  const seller = sellerFor(product.sellerId)
  const reviews = [...marketReviews, ...state.reviews].filter((review) => review.productId === product.id && review.status === 'published')
  const isSaved = state.wishlist.includes(product.id)
  const add = () => {
    if (product.stock < 1) return
    if (product.variations.some((variation) => variation.required)) { setNotice('Choose required product options on the product page.'); return }
    const item: CartItem = { productId: product.id, quantity: 1, variationSelections: {} }
    update((current) => ({ ...current, cart: incrementCartItem(current.cart, item, product.stock) }))
    setNotice('Added to your cart.')
  }
  return <article className="group overflow-hidden rounded-2xl border border-[#e6eae5] bg-white shadow-sm"><div className="relative"><Link to={`/market/products/${product.id}`}><img src={product.images[0]} alt={product.name} loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]" /></Link><button type="button" onClick={() => update((current) => ({ ...current, wishlist: isSaved ? current.wishlist.filter((id) => id !== product.id) : [...current.wishlist, product.id] }))} aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'} className="absolute right-2 top-2 rounded-full bg-white/95 p-2 text-[#285342] shadow"><Heart className={`h-4 w-4 ${isSaved ? 'fill-[#285342]' : ''}`} /></button>{product.previousPrice && <span className="absolute left-2 top-2 rounded-full bg-[#d26945] px-2.5 py-1 text-[10px] font-semibold text-white">{Math.round((1 - product.price / product.previousPrice) * 100)}% off</span>}</div><div className="p-3 sm:p-4"><Link to={`/market/products/${product.id}`} className="line-clamp-2 min-h-10 font-semibold text-[#202923] hover:text-[#285342]">{product.name}</Link><Link to={`/market/stores/${product.sellerId}`} className="mt-1 block truncate text-xs text-[#6B756E]">{seller?.storeName}{seller?.verified && <BadgeCheck className="ml-1 inline h-3 w-3 text-[#39845A]" />}</Link><div className="mt-2 flex items-center justify-between gap-2"><span className="font-semibold text-[#285342]">{money(product.price)}</span>{product.previousPrice && <del className="text-xs text-[#88938a]">{money(product.previousPrice)}</del>}</div><p className="mt-1 text-xs text-[#6B756E]">{reviews.length ? `${averageRating(reviews)} · ${reviews.length} review${reviews.length === 1 ? '' : 's'}` : 'No reviews yet'} · {product.stock ? `${product.stock} in stock` : 'Out of stock'}</p><button disabled={product.stock < 1} className={`${primary} mt-3 w-full px-3 py-2.5 text-xs`} onClick={add}>{product.stock ? 'Add to cart' : 'Out of stock'} <ShoppingBag className="h-3.5 w-3.5" /></button>{notice && <p role="status" className="mt-2 text-xs text-[#285342]">{notice}</p>}</div></article>
}

function ProductDetails({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const { productId = '' } = useParams()
  const product = productFor(productId)
  const navigate = useNavigate()
  const [imageIndex, setImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [variations, setVariations] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')
  const [contactOpen, setContactOpen] = useState(false)
  const [reviewSort, setReviewSort] = useState('Newest')
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', body: '' })
  if (!product) return <EmptyMarket title="Product not found" detail="This product may have been removed or is no longer available." action={<Link className={primary} to="/market/products">Browse products</Link>} />
  const seller = sellerFor(product.sellerId)
  const reviews = [...marketReviews, ...state.reviews].filter((review) => review.productId === product.id && review.status === 'published').sort((a, b) => reviewSort === 'Highest rated' ? b.rating - a.rating : b.createdAt.localeCompare(a.createdAt))
  const canReview = state.orders.some((order) => order.status === 'Delivered' && order.items.some((item) => item.productId === product.id)) && !state.reviews.some((review) => review.productId === product.id && review.verifiedPurchase)
  const addToCart = (buyNow = false) => {
    const missing = product.variations.filter((variation) => variation.required && !variations[variation.id])
    if (missing.length) { setNotice(`Choose ${missing.map((item) => item.name).join(' and ')} first.`); return }
    if (quantity > product.stock) { setNotice('Requested quantity exceeds available stock.'); return }
    update((current) => ({ ...current, cart: incrementCartItem(current.cart, { productId: product.id, quantity, variationSelections: variations }, product.stock) }))
    if (buyNow) navigate('/market/cart')
    else setNotice('Added to your cart.')
  }
  const submitReview = (event: FormEvent) => {
    event.preventDefault()
    if (!canReview) return
    const review: ProductReview = { id: crypto.randomUUID(), productId: product.id, customerName: state.customer.name || 'Market customer', rating: reviewForm.rating, title: reviewForm.title.trim(), body: reviewForm.body.trim(), createdAt: now(), verifiedPurchase: true, status: 'pending' }
    update((current) => ({ ...current, reviews: [review, ...current.reviews] }))
    setNotice('Review submitted for moderation. It will be published after review.')
    setReviewForm({ rating: 5, title: '', body: '' })
  }
  const related = marketProducts.filter((item) => item.id !== product.id && item.categoryId === product.categoryId && item.status === 'active').slice(0, 3)
  const sellerItems = marketProducts.filter((item) => item.sellerId === product.sellerId && item.id !== product.id && item.status === 'active').slice(0, 3)
  return <div className="space-y-9"><Link to="/market/products" className="inline-flex items-center gap-2 text-sm font-medium text-[#285342]"><ArrowLeft className="h-4 w-4" /> Continue shopping</Link><div className="grid gap-8 lg:grid-cols-2"><div><button type="button" onClick={() => setImageIndex((index) => (index + 1) % product.images.length)} aria-label="Show next product image" className="block w-full overflow-hidden rounded-2xl bg-white"><img src={product.images[imageIndex]} alt={product.name} className="aspect-square w-full object-cover" /></button><div className="mt-3 flex gap-2">{product.images.map((image, index) => <button key={image} type="button" onClick={() => setImageIndex(index)} className={`overflow-hidden rounded-lg border-2 ${index === imageIndex ? 'border-[#285342]' : 'border-transparent'}`}><img src={image} alt={`${product.name} view ${index + 1}`} className="h-16 w-16 object-cover" /></button>)}</div><p className="mt-2 text-xs text-[#6B756E]">Select an image to enlarge it in the gallery.</p></div><div><div className="flex flex-wrap gap-2"><Link to={`/market/category/${product.categoryId}`} className="rounded-full bg-[#EDF4EA] px-3 py-1 text-xs text-[#285342]">{categoryFor(product.categoryId)?.name}</Link><span className="rounded-full bg-white px-3 py-1 text-xs text-[#58645d]">{product.stock ? `${product.stock} available` : 'Out of stock'}</span></div><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1><p className="mt-2 text-sm text-[#6B756E]">By <Link to={`/market/stores/${product.sellerId}`} className="font-semibold text-[#285342]">{seller?.storeName}</Link>{seller?.verified && <BadgeCheck className="ml-1 inline h-4 w-4 text-[#39845A]" />}</p><div className="mt-4 flex items-baseline gap-3"><span className="text-3xl font-semibold text-[#285342]">{money(product.price)}</span>{product.previousPrice && <><del className="text-[#88938a]">{money(product.previousPrice)}</del><span className="text-xs font-semibold text-[#b95032]">{Math.round((1 - product.price / product.previousPrice) * 100)}% off</span></>}</div><p className="mt-5 leading-7 text-[#59665d]">{product.description}</p><div className="mt-6 space-y-4">{product.variations.map((variation) => <label key={variation.id} className="block text-sm font-medium">{variation.name}{variation.required && <span className="text-[#b95032]"> *</span>}<select value={variations[variation.id] ?? ''} onChange={(event) => setVariations((current) => ({ ...current, [variation.id]: event.target.value }))} className="mt-2 block w-full rounded-xl border border-[#dce4dc] bg-white p-3"><option value="">Select {variation.name.toLowerCase()}</option>{variation.options.map((option) => <option key={option}>{option}</option>)}</select></label>)}<div className="flex items-center gap-3"><span className="text-sm font-medium">Quantity</span><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className={secondary}><Minus className="h-4 w-4" /></button><span className="w-8 text-center">{quantity}</span><button aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} className={secondary}><Plus className="h-4 w-4" /></button><span className="text-xs text-[#6B756E]">Max {product.stock}</span></div></div><div className="mt-6 grid gap-2 sm:grid-cols-2"><button disabled={!product.stock} className={primary} onClick={() => addToCart(false)}>Add to cart <ShoppingBag className="h-4 w-4" /></button><button disabled={!product.stock} className={secondary} onClick={() => addToCart(true)}>Buy now</button></div><div className="mt-3 flex flex-wrap gap-2"><button className={secondary} onClick={() => update((current) => ({ ...current, wishlist: current.wishlist.includes(product.id) ? current.wishlist.filter((id) => id !== product.id) : [...current.wishlist, product.id] }))}><Heart className={`h-4 w-4 ${state.wishlist.includes(product.id) ? 'fill-[#285342]' : ''}`} /> {state.wishlist.includes(product.id) ? 'Saved' : 'Add to wishlist'}</button>{seller?.contactEmail && <button className={secondary} onClick={() => setContactOpen((open) => !open)}>Contact seller</button>}</div>{contactOpen && seller?.contactEmail && <p className="mt-3 rounded-xl bg-[#EDF4EA] p-3 text-sm text-[#285342]">Seller contact: {seller.contactEmail}. Use your email client to contact the store. Please do not include payment details in messages.</p>}{notice && <p role="status" className="mt-3 text-sm text-[#285342]">{notice}</p>}<p className="mt-6 flex items-start gap-2 rounded-xl bg-[#EDF4EA] p-4 text-sm leading-6 text-[#405247]"><Truck className="mt-0.5 h-4 w-4 shrink-0" /> Seller location: {product.location}. Delivery method and applicable charges are confirmed at checkout; availability depends on seller and destination.</p><div className="mt-5"><h2 className="text-xl font-semibold">Specifications</h2><dl className="mt-3 divide-y divide-[#e6eae5] rounded-xl bg-white px-4">{Object.entries(product.specifications).map(([label, value]) => <div key={label} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-[#6B756E]">{label}</dt><dd className="text-right font-medium">{value}</dd></div>)}</dl></div><p className="mt-4 text-xs leading-5 text-[#6B756E]">Returns follow the marketplace returns policy and seller eligibility. A refund is not guaranteed by submitting a request.</p></div></div>
    <ReviewsSection reviews={reviews} sort={reviewSort} setSort={setReviewSort} canReview={canReview} reviewForm={reviewForm} setReviewForm={setReviewForm} submitReview={submitReview} />
    <ProductShelf title="You might also like" eyebrow="Related products" products={related} state={state} update={update} />
    {sellerItems.length > 0 && <ProductShelf title={`More from ${seller?.storeName}`} eyebrow="Seller store" products={sellerItems} state={state} update={update} />}
  </div>
}

function ReviewsSection({ reviews, sort, setSort, canReview, reviewForm, setReviewForm, submitReview }: { reviews: ProductReview[]; sort: string; setSort: (sort: string) => void; canReview: boolean; reviewForm: { rating: number; title: string; body: string }; setReviewForm: (form: { rating: number; title: string; body: string }) => void; submitReview: (event: FormEvent) => void }) {
  return <section className="border-t border-[#e6eae5] pt-7"><div className="flex flex-wrap items-end justify-between gap-3"><SectionTitle eyebrow="Customer feedback" title="Reviews" description={reviews.length ? `${averageRating(reviews)} from ${reviews.length} published review${reviews.length === 1 ? '' : 's'}` : 'No published reviews yet. We do not display unverified sample ratings.'} /><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort reviews" className="rounded-full border border-[#e6eae5] bg-white px-3 py-2 text-sm"><option>Newest</option><option>Highest rated</option></select></div><div className="mt-4 space-y-3">{reviews.map((review) => <article key={review.id} className={`${panel} p-4`}><div className="flex justify-between gap-4"><div><p className="font-semibold">{review.title}</p><p className="mt-1 text-xs text-[#6B756E]">{review.customerName} · {formatDate(review.createdAt)} {review.verifiedPurchase && '· Verified purchase'}</p></div><span className="text-sm font-semibold text-[#285342]">{'★'.repeat(review.rating)}</span></div><p className="mt-3 text-sm leading-6 text-[#59665d]">{review.body}</p></article>)}</div>{canReview && <form onSubmit={submitReview} className={`${panel} mt-5 space-y-3`}><h3 className="font-semibold">Review a verified purchase</h3><select value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })} className="rounded-lg border border-[#e6eae5] p-2 text-sm" aria-label="Rating">{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select><input required value={reviewForm.title} onChange={(event) => setReviewForm({ ...reviewForm, title: event.target.value })} placeholder="Review title" className="block w-full rounded-lg border border-[#e6eae5] p-3 text-sm" /><textarea required rows={3} value={reviewForm.body} onChange={(event) => setReviewForm({ ...reviewForm, body: event.target.value })} placeholder="Share your experience" className="block w-full rounded-lg border border-[#e6eae5] p-3 text-sm" /><button className={primary}>Submit for moderation</button><p className="text-xs text-[#6B756E]">Only delivered purchases are eligible. Reviews require moderator approval before publishing.</p></form>}</section>
}

function StoresPage() {
  return <div className="space-y-6"><SectionTitle eyebrow="Independent sellers" title="Meet the stores" description="Browse approved sellers, learn about their work and shop their current product listings." /><div className="grid gap-5 md:grid-cols-2">{marketSellers.filter((seller) => seller.status === 'approved').map((seller) => <SellerCard key={seller.id} seller={seller} large />)}</div></div>
}

function SellerCard({ seller, large = false }: { seller: (typeof marketSellers)[number]; large?: boolean }) {
  const products = marketProducts.filter((product) => product.sellerId === seller.id && product.status === 'active')
  return <article className={`overflow-hidden rounded-2xl border border-[#e6eae5] bg-white ${large ? '' : 'shadow-sm'}`}><Link to={`/market/stores/${seller.id}`}><img src={seller.cover} alt="" className={`${large ? 'h-48' : 'h-36'} w-full object-cover`} /></Link><div className="p-5"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#285342] font-semibold text-white">{seller.logo}</span><div><Link to={`/market/stores/${seller.id}`} className="font-semibold text-[#202923] hover:text-[#285342]">{seller.storeName}</Link><p className="text-xs text-[#6B756E]"><MapPin className="mr-1 inline h-3 w-3" />{seller.location} {seller.verified && <><BadgeCheck className="ml-1 inline h-3 w-3 text-[#39845A]" /> Verified</>}</p></div></div><p className="mt-4 text-sm leading-6 text-[#6B756E]">{seller.description}</p><div className="mt-4 flex items-center justify-between text-xs text-[#6B756E]"><span>{seller.categories.join(' · ')}</span><span>{products.length} active product{products.length === 1 ? '' : 's'}</span></div><Link to={`/market/stores/${seller.id}`} className={`${secondary} mt-4`}>Visit store <ArrowRight className="h-4 w-4" /></Link></div></article>
}

function StorePage({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const { sellerId = '' } = useParams()
  const seller = sellerFor(sellerId)
  if (!seller || seller.status !== 'approved') return <EmptyMarket title="Store unavailable" detail="This seller's store is not currently available." action={<Link to="/market/stores" className={primary}>Browse stores</Link>} />
  const items = marketProducts.filter((product) => product.sellerId === seller.id && product.status === 'active')
  return <div className="space-y-6"><div className="overflow-hidden rounded-2xl border border-[#e6eae5] bg-white"><img src={seller.cover} alt="" className="h-52 w-full object-cover sm:h-72" /><div className="flex flex-wrap items-center gap-4 p-5 sm:p-7"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#285342] text-lg font-semibold text-white">{seller.logo}</span><div className="flex-1"><div className="flex items-center gap-2"><h1 className="text-2xl font-semibold">{seller.storeName}</h1>{seller.verified && <BadgeCheck className="h-5 w-5 text-[#39845A]" />}</div><p className="mt-1 text-sm text-[#6B756E]"><MapPin className="mr-1 inline h-4 w-4" />{seller.location}</p></div><span className="rounded-full bg-[#EDF4EA] px-3 py-1 text-xs text-[#285342]">{seller.verified ? 'Verified seller' : 'Marketplace seller'}</span></div><p className="max-w-3xl px-5 pb-6 text-sm leading-7 text-[#59665d] sm:px-7">{seller.description}</p></div><SectionTitle eyebrow={seller.categories.join(' · ')} title="Products from this store" /><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{items.map((product) => <ProductCard key={product.id} product={product} state={state} update={update} />)}</div>{seller.contactEmail && <p className="text-xs text-[#6B756E]">Public store contact: {seller.contactEmail}</p>}</div>
}

function CartPage({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const items = state.cart.map((item) => ({ item, product: productFor(item.productId) })).filter((row): row is { item: CartItem; product: MarketProduct } => Boolean(row.product))
  const subtotal = cartSubtotal(state.cart)
  const discount = cartDiscount(subtotal, state.cartDiscountCode)
  const delivery = getDeliveryFee('standard', state.cart)
  const applyCode = () => {
    if (code.trim().toUpperCase() === 'LEAFY10' && subtotal >= 1000) {
      update((current) => ({ ...current, cartDiscountCode: 'LEAFY10' }))
      setMessage('LEAFY10 applied: 10% off eligible items.')
      return
    }
    update((current) => ({ ...current, cartDiscountCode: '' }))
    setMessage('That code is not valid for this cart. LEAFY10 applies to orders of KSh 1,000 or more.')
  }
  const mutateQuantity = (item: CartItem, delta: number) => {
    const product = productFor(item.productId)
    if (!product) return
    update((current) => ({ ...current, cart: current.cart.map((entry) => itemSelectionKey(entry) === itemSelectionKey(item) ? { ...entry, quantity: Math.min(product.stock, entry.quantity + delta) } : entry).filter((entry) => entry.quantity > 0) }))
  }
  return <div className="space-y-6"><SectionTitle eyebrow="Step 2 of 4 · Shopping cart" title="Shopping cart" description="Review your products and quantities before adding customer or delivery details at checkout." />{items.length === 0 ? <EmptyMarket title="Your cart is empty" detail="Find fresh products and independent sellers across Leafy Market." action={<Link className={primary} to="/market/products">Browse products</Link>} /> : <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="space-y-3">{items.map(({ item, product }) => <article key={itemSelectionKey(item)} className={`${panel} flex gap-4 p-4`}><Link to={`/market/products/${product.id}`}><img src={product.images[0]} alt="" className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28" /></Link><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><Link to={`/market/products/${product.id}`} className="font-semibold hover:text-[#285342]">{product.name}</Link><p className="mt-1 text-xs text-[#6B756E]">{sellerFor(product.sellerId)?.storeName}</p>{Object.entries(item.variationSelections).map(([key, value]) => <p key={key} className="mt-1 text-xs text-[#6B756E]">{product.variations.find((variation) => variation.id === key)?.name}: {value}</p>)}<p className="mt-1 text-xs text-[#6B756E]">Unit price: {money(product.price)}</p></div><button aria-label={`Remove ${product.name}`} onClick={() => update((current) => ({ ...current, cart: current.cart.filter((entry) => itemSelectionKey(entry) !== itemSelectionKey(item)) }))} className="h-fit text-xs text-[#a1462b]">Remove</button></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><button aria-label="Decrease quantity" disabled={item.quantity <= 1} onClick={() => mutateQuantity(item, -1)} className="rounded-full border p-1.5 disabled:opacity-40"><Minus className="h-3 w-3" /></button><span className="w-5 text-center text-sm">{item.quantity}</span><button aria-label="Increase quantity" disabled={item.quantity >= product.stock} onClick={() => mutateQuantity(item, 1)} className="rounded-full border p-1.5 disabled:opacity-40"><Plus className="h-3 w-3" /></button><span className="ml-1 text-xs text-[#6B756E]">{product.stock} available</span></div><strong>Subtotal: {money(product.price * item.quantity)}</strong></div></div></article>)}</div><aside className={`${panel} h-fit lg:sticky lg:top-24`}><h2 className="text-lg font-semibold">Order summary</h2><div className="mt-4 flex gap-2"><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Discount code" className="min-w-0 flex-1 rounded-full border border-[#e6eae5] px-4 py-2 text-sm" /><button onClick={applyCode} className={secondary}>Apply</button></div>{state.cartDiscountCode && <p className="mt-2 text-xs text-[#285342]">Applied: {state.cartDiscountCode}</p>}{message && <p role="status" className="mt-2 text-xs text-[#285342]">{message}</p>}<SummaryLine label="Subtotal" value={money(subtotal)} /><SummaryLine label="Discount" value={discount ? `−${money(discount)}` : money(0)} /><SummaryLine label="Estimated delivery" value={delivery ? money(delivery) : 'Free'} /><p className="mt-2 text-xs leading-5 text-[#6B756E]">Estimated standard delivery is KSh 250 per seller. Final options and charges are confirmed at checkout.</p><div className="my-4 border-t border-[#e6eae5]" /><SummaryLine label="Total" value={money(subtotal + delivery - discount)} strong /><Link to="/market/products" className={`${secondary} mt-5 w-full`}>Continue shopping</Link><Link to="/market/checkout" className={`${primary} mt-2 w-full`}>Proceed to Checkout <ArrowRight className="h-4 w-4" /></Link></aside></div>}</div>
}

function CheckoutPage({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const navigate = useNavigate()
  const existingAddress = state.addresses[0]
  const [draft, setDraft] = useState<MarketCheckoutDraft>(() => state.checkoutDraft ?? {
    fullName: state.customer.name || existingAddress?.name || '',
    phone: state.customer.phone || existingAddress?.phone || '',
    email: state.customer.email || '',
    county: existingAddress?.county ?? '',
    town: existingAddress?.town ?? '',
    area: existingAddress?.area ?? '',
    street: '',
    buildingNumber: '',
    instructions: existingAddress?.instructions ?? '',
    deliveryMethod: 'standard',
    discountCode: state.cartDiscountCode,
  })
  const [error, setError] = useState('')
  const items = state.cart.map((item) => ({ item, product: productFor(item.productId) })).filter((row): row is { item: CartItem; product: MarketProduct } => Boolean(row.product))
  if (!items.length) return <EmptyMarket title="Nothing to check out" detail="Add at least one product to your cart first." action={<Link to="/market/products" className={primary}>Browse products</Link>} />
  const subtotal = cartSubtotal(state.cart)
  const discount = cartDiscount(subtotal, draft.discountCode)
  const delivery = getDeliveryFee(draft.deliveryMethod, state.cart)
  const total = subtotal + delivery - discount
  const setField = (field: keyof MarketCheckoutDraft, value: string) => setDraft((current) => ({ ...current, [field]: value }))
  const continueToPayment = (event: FormEvent) => {
    event.preventDefault()
    if (!draft.fullName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email) || paymentPhoneError(draft.phone) || !draft.county.trim() || !draft.town.trim() || !draft.area.trim()) {
      setError('Enter your full name, a valid email, phone number, county, town or city, and area to continue.')
      return
    }
    for (const { item, product } of items) {
      if (item.quantity > product.stock) { setError(`${product.name} no longer has enough stock. Please update your cart.`); return }
      if (product.variations.some((variation) => variation.required && !item.variationSelections[variation.id])) { setError(`Select required options for ${product.name} before checkout.`); return }
    }
    update((current) => ({
      ...current,
      checkoutDraft: draft,
      cartDiscountCode: draft.discountCode,
      customer: { name: draft.fullName.trim(), email: draft.email.trim(), phone: draft.phone.trim() },
      addresses: [{
        id: existingAddress?.id ?? crypto.randomUUID(),
        name: draft.fullName.trim(),
        phone: draft.phone.trim(),
        county: draft.county.trim(),
        town: draft.town.trim(),
        area: draft.area.trim(),
        instructions: [draft.street.trim(), draft.buildingNumber.trim(), draft.instructions.trim()].filter(Boolean).join(', '),
      }, ...current.addresses.filter((address) => address.id !== existingAddress?.id)],
    }))
    navigate('/market/payment')
  }
  const field = (name: keyof MarketCheckoutDraft, label: string, required = false, type = 'text') => (
    <label className="block text-sm font-medium">{label}<input required={required} type={type} autoComplete={name === 'fullName' ? 'name' : name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'off'} value={draft[name]} onChange={(event) => setField(name, event.target.value)} className="mt-2 block w-full rounded-xl border border-[#dce4dc] bg-white p-3 font-normal" /></label>
  )
  return <div className="mx-auto max-w-6xl space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><SectionTitle eyebrow="Step 3 of 4 · Checkout" title="Customer information & delivery" description="Confirm who should receive this order and where it should be delivered. Payment is a separate next step." /><Link to="/market/cart" className={`${secondary} shrink-0`}><ArrowLeft className="h-4 w-4" /> Back to cart</Link></div><form onSubmit={continueToPayment} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"><div className="space-y-5"><section className={`${panel} space-y-4`}><h2 className="text-lg font-semibold">Customer information</h2><div className="grid gap-4 sm:grid-cols-2">{field('fullName', 'Full name', true)}{field('phone', 'Phone number', true, 'tel')}{field('email', 'Email address', true, 'email')}</div><p className="text-xs text-[#6B756E]">Existing Leafy account details are pre-filled when available and can be updated for this order.</p></section><section className={`${panel} space-y-4`}><h2 className="text-lg font-semibold">Delivery location</h2><div className="grid gap-4 sm:grid-cols-2">{field('county', 'County', true)}{field('town', 'Town or city', true)}{field('area', 'Estate or area', true)}{field('street', 'Street or building name')}{field('buildingNumber', 'House, apartment or office number')}</div><label className="block text-sm font-medium">Additional delivery instructions<textarea value={draft.instructions} onChange={(event) => setField('instructions', event.target.value)} rows={3} className="mt-2 block w-full rounded-xl border border-[#dce4dc] bg-white p-3 font-normal" /></label><p className="text-xs leading-5 text-[#6B756E]">Map pin selection is not available in this version. Use the written address and instructions to identify your location.</p><h3 className="pt-2 text-sm font-semibold">Delivery method</h3><label className="flex cursor-pointer gap-3 rounded-xl border border-[#dce4dc] p-3"><input type="radio" name="deliveryMethod" checked={draft.deliveryMethod === 'standard'} onChange={() => setField('deliveryMethod', 'standard')} /><span><strong className="block text-sm">Standard delivery · {money(getDeliveryFee('standard', state.cart))}</strong><span className="text-xs text-[#6B756E]">Estimated charge based on current seller count; delivery times are not configured.</span></span></label><label className="flex cursor-pointer gap-3 rounded-xl border border-[#dce4dc] p-3"><input type="radio" name="deliveryMethod" checked={draft.deliveryMethod === 'pickup'} onChange={() => setField('deliveryMethod', 'pickup')} /><span><strong className="block text-sm">Seller-arranged pickup · Free</strong><span className="text-xs text-[#6B756E]">Confirm pickup availability with sellers after order placement.</span></span></label></section></div><aside className={`${panel} h-fit lg:sticky lg:top-24`}><h2 className="text-lg font-semibold">Order summary</h2>{items.map(({ item, product }) => <div key={itemSelectionKey(item)} className="flex justify-between gap-3 border-b border-[#e6eae5] py-3 text-sm"><span>{product.name} × {item.quantity}</span><span>{money(product.price * item.quantity)}</span></div>)}<SummaryLine label="Subtotal" value={money(subtotal)} /><SummaryLine label="Estimated delivery" value={delivery ? money(delivery) : 'Free'} /><SummaryLine label="Discount" value={discount ? `−${money(discount)}` : money(0)} /><div className="my-3 border-t border-[#e6eae5]" /><SummaryLine label="Estimated total" value={money(total)} strong /><p className="mt-2 text-xs leading-5 text-[#6B756E]">The backend will re-check prices, stock, discounts and delivery before creating the order. The displayed total is an estimate.</p>{error && <p role="alert" className="mt-4 rounded-xl bg-[#fff0eb] p-3 text-sm text-[#9b422b]">{error}</p>}<button className={`${primary} mt-5 w-full`}>Continue to Payment <ArrowRight className="h-4 w-4" /></button></aside></form></div>
}

function PaymentStatusPage({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const { paymentId = '' } = useParams()
  const navigate = useNavigate()
  const draft = state.checkoutDraft
  const savedSession = state.paymentSession?.paymentId === paymentId ? state.paymentSession : null
  const [phone, setPhone] = useState(() => draft?.phone ?? savedSession?.phone ?? '')
  const [status, setStatus] = useState<PaymentStatus | null>(() => savedSession?.status ?? null)
  const [message, setMessage] = useState('')
  const [checking, setChecking] = useState(false)
  const [paying, setPaying] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const order = state.orders.find((item) => item.paymentId === paymentId || item.id === savedSession?.orderId)
  const reportedStatus = status ?? savedSession?.status ?? order?.paymentStatus ?? 'Pending'
  const succeeded = Boolean(paymentId) && reportedStatus === 'Successful' && order?.paymentStatus === 'Successful'
  const visibleStatus = reportedStatus === 'Successful' && !succeeded ? 'Reconciliation Required' : reportedStatus
  const amount = order?.total ?? savedSession?.amount
  const orderNumber = order?.orderNumber ?? savedSession?.orderNumber
  const phoneError = paymentPhoneError(phone)

  const checkStatus = useCallback(async () => {
    if (!paymentId || checking) return
    setChecking(true)
    try {
      const response = await fetch(`/api/market/payments/${encodeURIComponent(paymentId)}`)
      const result = await readApiResponse<{ status?: PaymentStatus; order?: MarketOrder; message?: string }>(response, 'The payment status service is unavailable.')
      if (!response.ok || !result.status) throw new Error(result.message || 'Could not retrieve payment status.')
      setStatus(result.status)
      setMessage(result.message ?? paymentStatusDetail(result.status))
      if (result.order) {
        update((current) => {
          const old = current.orders.find((item) => item.id === result.order?.id)
          const changed = !old || old.paymentStatus !== result.order?.paymentStatus || old.status !== result.order?.status
          const confirmed = result.order?.paymentStatus === 'Successful'
          return {
            ...current,
            cart: confirmed ? [] : current.cart,
            cartDiscountCode: confirmed ? '' : current.cartDiscountCode,
            checkoutDraft: confirmed ? null : current.checkoutDraft,
            orders: [result.order!, ...current.orders.filter((item) => item.id !== result.order?.id)],
            paymentSession: current.paymentSession ? {
              ...current.paymentSession,
              orderNumber: result.order!.orderNumber,
              amount: result.order!.total,
              status: result.order!.paymentStatus,
              receipt: result.order!.mpesaReceipt,
            } : current.paymentSession,
            notifications: changed && confirmed ? [{ id: crypto.randomUUID(), title: 'Market order paid', detail: `Payment confirmed for order ${result.order!.orderNumber}.`, href: `/market/orders/${result.order!.id}`, read: false, createdAt: now() }, ...current.notifications] : current.notifications,
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
  }, [paymentId, checking, update])

  useEffect(() => {
    if (!paymentId) {
      if (!draft) navigate('/market/checkout', { replace: true })
      return
    }
    if (succeeded) return
    const timer = window.setInterval(() => { void checkStatus() }, 5000)
    return () => window.clearInterval(timer)
  }, [paymentId, draft, succeeded, navigate, checkStatus])

  const startPayment = async (event: FormEvent) => {
    event.preventDefault()
    if (!draft || paying || phoneError) return
    setPaying(true)
    setMessage('')
    try {
      const response = await fetch('/api/market/payments/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify({
          customer: { name: draft.fullName.trim(), email: draft.email.trim(), phone: draft.phone.trim() },
          address: {
            name: draft.fullName.trim(),
            phone: draft.phone.trim(),
            county: draft.county.trim(),
            town: draft.town.trim(),
            area: draft.area.trim(),
            street: draft.street.trim(),
            buildingNumber: draft.buildingNumber.trim(),
            instructions: draft.instructions.trim(),
          },
          deliveryMethod: draft.deliveryMethod,
          discountCode: draft.discountCode || undefined,
          mpesaPhone: normalizeKenyanPhone(phone),
          items: state.cart.map((item) => ({ productId: item.productId, quantity: item.quantity, variations: item.variationSelections })),
        }),
      })
      const result = await readApiResponse<{ orderId?: string; orderNumber?: string; paymentId?: string; amount?: number; total?: number; status?: PaymentStatus; message?: string; order?: MarketOrder }>(response, 'The payment service is unavailable.')
      const authoritativeAmount = result.amount ?? result.total ?? result.order?.total
      if (!response.ok || !result.paymentId || !result.orderId || !result.orderNumber || !Number.isFinite(authoritativeAmount)) {
        throw new Error(result.message || 'The server did not return a confirmed order and authoritative amount. No payment was confirmed.')
      }
      const sessionStatus = result.status ?? 'Awaiting Customer Action'
      const session = {
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        paymentId: result.paymentId,
        amount: authoritativeAmount!,
        phone: normalizeKenyanPhone(phone),
        status: sessionStatus,
        message: result.message ?? paymentStatusDetail(sessionStatus),
      }
      update((current) => ({
        ...current,
        customer: { ...current.customer, name: draft.fullName.trim(), email: draft.email.trim(), phone: draft.phone.trim() },
        paymentSession: session,
        ...(result.order ? { orders: [result.order, ...current.orders.filter((item) => item.id !== result.order?.id)] } : {}),
      }))
      setMessage(session.message)
      navigate(`/market/payment/${encodeURIComponent(session.paymentId)}`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The payment request could not be started.')
    } finally {
      setPaying(false)
    }
  }

  const retry = async () => {
    if (!paymentId || retrying) return
    setRetrying(true)
    setMessage('')
    try {
      const response = await fetch(`/api/market/payments/${encodeURIComponent(paymentId)}/retry`, {
        method: 'POST',
        headers: { 'Idempotency-Key': crypto.randomUUID() },
      })
      const result = await readApiResponse<{ paymentId?: string; orderId?: string; orderNumber?: string; amount?: number; status?: PaymentStatus; message?: string }>(response, 'The payment retry service is unavailable.')
      if (!response.ok || !result.paymentId || !result.orderId) throw new Error(result.message || 'The payment prompt could not be retried.')
      const nextStatus = result.status ?? 'Awaiting Customer Action'
      setStatus(nextStatus)
      setMessage(result.message ?? paymentStatusDetail(nextStatus))
      update((current) => current.paymentSession ? {
        ...current,
        paymentSession: {
          ...current.paymentSession,
          paymentId: result.paymentId!,
          orderId: result.orderId!,
          orderNumber: result.orderNumber ?? current.paymentSession.orderNumber,
          amount: result.amount ?? current.paymentSession.amount,
          status: nextStatus,
          phone: normalizeKenyanPhone(phone),
          message: result.message,
        },
      } : current)
      if (result.paymentId !== paymentId) navigate(`/market/payment/${encodeURIComponent(result.paymentId)}`, { replace: true })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Payment retry failed.')
    } finally {
      setRetrying(false)
    }
  }

  if (!paymentId && !draft) return <EmptyMarket title="Checkout details are missing" detail="Return to your cart and enter customer and delivery details before payment." action={<Link to="/market/cart" className={primary}>Return to cart</Link>} />

  if (succeeded && order) return <div className="mx-auto max-w-2xl space-y-5"><section className="overflow-hidden rounded-3xl border border-[#d9eadf] bg-white shadow-sm"><div className="bg-[#00A650] px-6 py-7 text-white"><p className="text-sm font-semibold uppercase tracking-[.2em]">M-PESA · Payment confirmed</p><h1 className="mt-2 text-3xl font-semibold">Payment successful</h1><p className="mt-2 text-sm text-white/90">Your payment was verified by the payment service.</p></div><div className="space-y-4 p-6"><SummaryLine label="Amount paid" value={money(order.total)} strong /><SummaryLine label="M-Pesa receipt" value={order.mpesaReceipt ?? 'Receipt pending'} /><SummaryLine label="Order number" value={order.orderNumber} /><p className="rounded-xl bg-[#f0f8f2] p-4 text-sm leading-6 text-[#26352c]">Your order is confirmed. Order updates will be available from your account.</p><div className="flex flex-col gap-3 sm:flex-row"><Link className="inline-flex flex-1 items-center justify-center rounded-full bg-[#00A650] px-5 py-3 text-sm font-semibold text-white hover:bg-[#008f45]" to={`/market/orders/${order.id}`}>View Order</Link><Link className={`${secondary} flex-1`} to="/market/products">Continue Shopping</Link></div></div></section></div>

  if (paymentId) return <div className="mx-auto max-w-2xl space-y-5"><section className="overflow-hidden rounded-3xl border border-[#d9eadf] bg-white shadow-sm"><div className="bg-[#00A650] px-6 py-5 text-white"><p className="text-2xl font-bold tracking-tight">M-PESA</p><p className="mt-1 text-xs font-medium uppercase tracking-[.18em] text-white/90">Secure mobile payment</p></div><div className="space-y-5 p-5 sm:p-7"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#00A650]">Payment status</p><h1 className="mt-1 text-2xl font-semibold">{statusMessage(visibleStatus)}</h1></div><div className="rounded-2xl bg-[#f3faf5] p-4"><SummaryLine label="Order number" value={orderNumber ?? 'Loading…'} /><SummaryLine label="Amount payable" value={amount === undefined ? 'Loading…' : money(amount)} strong /><SummaryLine label="Prompt sent to" value={savedSession?.phone ?? normalizeKenyanPhone(phone)} /></div><div className="flex items-start gap-3 rounded-xl border border-[#e6eee8] p-4"><span className="mt-1 h-3 w-3 animate-pulse rounded-full bg-[#00A650]" /><p className="text-sm leading-6 text-[#26352c]">{message || 'Payment request sent. Please check your phone and enter your M-Pesa PIN. Waiting for verified payment confirmation…'}</p></div>{message && ['cancel', 'incorrect', 'insufficient', 'timeout', 'network', 'failed'].some((phrase) => message.toLowerCase().includes(phrase)) && <p role="status" className="rounded-xl bg-[#fff5eb] p-3 text-sm text-[#74451b]">{message}</p>}{message && (message.includes('unavailable') || message.includes('HTTP')) && <p role="alert" className="rounded-xl bg-[#fff0eb] p-3 text-sm text-[#9b422b]">{message}</p>}<div className="flex flex-col gap-3 sm:flex-row"><button type="button" disabled={checking} onClick={() => void checkStatus()} className="inline-flex flex-1 items-center justify-center rounded-full bg-[#00A650] px-5 py-3 text-sm font-semibold text-white hover:bg-[#008f45] disabled:opacity-50">{checking ? 'Checking status…' : 'Check Payment Status'}</button>{['Failed', 'Cancelled', 'Expired'].includes(visibleStatus) && <button type="button" disabled={retrying} onClick={() => void retry()} className="inline-flex flex-1 items-center justify-center rounded-full border border-[#00A650] px-5 py-3 text-sm font-semibold text-[#008f45] disabled:opacity-50">{retrying ? 'Sending new request…' : 'Retry Payment'}</button>}</div><p className="text-xs leading-5 text-[#59665d]">Keep this page open while we wait for the payment provider. Only a verified server callback can confirm your order. Do not share your M-Pesa PIN.</p><Link to="/market/orders" className="inline-block text-sm font-semibold text-[#285342]">View my orders</Link></div></section></div>

  return <div className="mx-auto max-w-6xl space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><SectionTitle eyebrow="Step 4 of 4 · Payment" title="Pay with M-Pesa" description="Your checkout information and order summary are saved. Enter the number that should receive the payment prompt." /><Link to="/market/checkout" className={secondary}><ArrowLeft className="h-4 w-4" /> Edit checkout</Link></div><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]"><form onSubmit={startPayment} className="overflow-hidden rounded-3xl border border-[#d9eadf] bg-white shadow-sm"><div className="bg-[#00A650] px-6 py-5 text-white"><p className="text-2xl font-bold tracking-tight">M-PESA</p><p className="mt-1 text-xs font-medium uppercase tracking-[.18em] text-white/90">Secure mobile payment</p></div><div className="space-y-5 p-5 sm:p-7"><h2 className="text-xl font-semibold text-[#1b1b1b]">Pay with M-Pesa</h2><p className="text-sm leading-6 text-[#333]">Enter your M-Pesa phone number below. We will send a payment request to your phone. Enter your M-Pesa PIN on your phone to complete the payment.</p><div className="rounded-xl bg-[#f3faf5] p-4 text-sm"><p><strong>Order number:</strong> Assigned securely by the marketplace when the payment request is created.</p><p className="mt-2"><strong>Estimated amount:</strong> {money(cartSubtotal(state.cart) + getDeliveryFee(draft?.deliveryMethod ?? 'standard', state.cart) - cartDiscount(cartSubtotal(state.cart), draft?.discountCode ?? ''))}</p></div><label className="block text-sm font-medium text-[#1b1b1b]">M-Pesa phone number<input required inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="07XXXXXXXX, 01XXXXXXXX or 254XXXXXXXX" aria-invalid={Boolean(phoneError)} aria-describedby={phoneError ? 'mpesa-phone-error' : 'mpesa-phone-help'} className="mt-2 block w-full rounded-xl border border-[#cfd8d1] p-3 text-base outline-none focus:border-[#00A650] focus:ring-2 focus:ring-[#00A650]/20" /></label>{phoneError ? <p id="mpesa-phone-error" role="alert" className="text-sm text-[#a1462b]">{phoneError}</p> : <p id="mpesa-phone-help" className="text-xs text-[#59665d]">Accepted formats: 07XXXXXXXX, 01XXXXXXXX, or 254XXXXXXXX.</p>}{message && <p role="alert" className="rounded-xl bg-[#fff0eb] p-3 text-sm text-[#9b422b]">{message}</p>}<button disabled={paying || Boolean(phoneError)} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00A650] px-5 py-3 text-sm font-semibold text-white hover:bg-[#008f45] disabled:cursor-not-allowed disabled:opacity-50">{paying ? 'Sending secure payment request…' : 'Pay with M-Pesa'} <ArrowRight className="h-4 w-4" /></button><p className="text-xs leading-5 text-[#59665d]">Your order amount is recalculated and validated by the server. Never enter your PIN on this website.</p></div></form><aside className={`${panel} h-fit`}><h2 className="font-semibold">Order summary</h2>{state.cart.map((item) => { const product = productFor(item.productId); return product ? <div key={itemSelectionKey(item)} className="flex justify-between gap-3 border-b border-[#e6eae5] py-3 text-sm"><span>{product.name} × {item.quantity}</span><span>{money(product.price * item.quantity)}</span></div> : null })}<SummaryLine label="Subtotal" value={money(cartSubtotal(state.cart))} /><SummaryLine label="Estimated delivery" value={money(getDeliveryFee(draft?.deliveryMethod ?? 'standard', state.cart))} /><SummaryLine label="Discount" value={`−${money(cartDiscount(cartSubtotal(state.cart), draft?.discountCode ?? ''))}`} /><div className="my-3 border-t border-[#e6eae5]" /><SummaryLine label="Estimated total" value={money(cartSubtotal(state.cart) + getDeliveryFee(draft?.deliveryMethod ?? 'standard', state.cart) - cartDiscount(cartSubtotal(state.cart), draft?.discountCode ?? ''))} strong /><p className="mt-3 text-xs leading-5 text-[#6B756E]">The exact payable amount will be returned by the backend with the created order.</p></aside></div></div>
}

function OrdersPage({ state }: { state: MarketState }) {
  return <div className="space-y-6"><SectionTitle eyebrow="Your purchases" title="My orders" description="Payment and fulfilment states are taken from order events. Select an order to view its timeline." />{state.orders.length === 0 ? <EmptyMarket title="No orders yet" detail="Your order history will appear after the payment backend creates your first order." action={<Link to="/market/products" className={primary}>Browse products</Link>} /> : <div className="space-y-3">{state.orders.map((order) => <Link key={order.id} to={`/market/orders/${order.id}`} className={`${panel} flex flex-wrap items-center justify-between gap-4 hover:border-[#A4C68C]`}><div><p className="font-semibold">Order {order.orderNumber}</p><p className="mt-1 text-xs text-[#6B756E]">{formatDate(order.createdAt)} · {order.items.length} line item(s)</p></div><div className="flex items-center gap-3"><span className="text-sm font-semibold">{money(order.total)}</span><StatusChip value={order.status} /><ArrowRight className="h-4 w-4 text-[#285342]" /></div></Link>)}</div>}</div>
}

function OrderDetailPage({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const { orderId = '' } = useParams()
  const order = state.orders.find((item) => item.id === orderId)
  const [returnProduct, setReturnProduct] = useState('')
  const [reason, setReason] = useState('Damaged or defective')
  const [explanation, setExplanation] = useState('')
  const [message, setMessage] = useState('')
  if (!order) return <EmptyMarket title="Order details unavailable" detail="Refresh payment status or sign in to the account that placed the order." action={<Link className={primary} to="/market/orders">My orders</Link>} />
  const receipt = () => {
    const body = [`Leafy Market receipt`, `Order: ${order.orderNumber}`, `Status: ${order.status}`, `Payment: ${order.paymentStatus}`, `Total: ${money(order.total)}`, ...order.items.map((item) => `${item.name} × ${item.quantity} — ${money(item.unitPrice * item.quantity)}`)].join('\n')
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${order.orderNumber}-receipt.txt`; anchor.click(); URL.revokeObjectURL(url)
  }
  const submitReturn = (event: FormEvent) => {
    event.preventDefault()
    const item = order.items.find((product) => product.productId === returnProduct)
    if (!item || order.status === 'Cancelled' || order.status === 'Refunded') { setMessage('Select an eligible purchased item.'); return }
    update((current) => ({ ...current, returnRequests: [{ id: crypto.randomUUID(), orderId: order.id, productId: item.productId, reason, explanation: explanation.trim(), status: 'Submitted', createdAt: now() }, ...current.returnRequests], orders: current.orders.map((existing) => existing.id === order.id ? { ...existing, status: 'Return Requested' } : existing), notifications: [{ id: crypto.randomUUID(), title: 'Return request received', detail: `Your request for ${item.name} is awaiting review.`, href: `/market/orders/${order.id}`, read: false, createdAt: now() }, ...current.notifications] }))
    setMessage('Request submitted for review. Refunds are not confirmed until the payment process is verified.')
  }
  const timeline = order.timeline
  return <div className="space-y-6"><Link to="/market/orders" className="inline-flex items-center gap-2 text-sm font-medium text-[#285342]"><ArrowLeft className="h-4 w-4" /> My orders</Link><section className={`${panel} flex flex-wrap items-center justify-between gap-4`}><div><p className="text-xs uppercase tracking-wide text-[#39845A]">Order confirmation / tracking</p><h1 className="mt-1 text-2xl font-semibold">Order {order.orderNumber}</h1><p className="mt-1 text-sm text-[#6B756E]">Placed {formatDate(order.createdAt)}</p></div><div className="space-y-2 text-right"><StatusChip value={order.status} /><p className="text-sm">Payment: <strong>{statusMessage(order.paymentStatus)}</strong></p>{order.mpesaReceipt && <p className="text-xs text-[#6B756E]">M-Pesa receipt {order.mpesaReceipt}</p>}<button className={secondary} onClick={receipt}>Download receipt</button></div></section><div className="grid gap-5 lg:grid-cols-2"><section className={`${panel}`}><h2 className="font-semibold">Items</h2>{order.items.map((item) => <div key={itemSelectionKey(item)} className="flex justify-between gap-3 border-b border-[#e6eae5] py-3 text-sm"><span>{item.name} × {item.quantity}</span><span>{money(item.unitPrice * item.quantity)}</span></div>)}<SummaryLine label="Delivery" value={money(order.deliveryFee)} /><SummaryLine label="Discount" value={`−${money(order.discount)}`} /><SummaryLine label="Paid" value={money(order.total)} strong /></section><section className={`${panel}`}><h2 className="font-semibold">Delivery details</h2><p className="mt-3 text-sm leading-6 text-[#59665d]">{order.address.name}<br />{order.address.area}, {order.address.town}<br />{order.address.county}<br />{order.address.phone}<br />{order.address.instructions}</p><p className="mt-3 text-xs text-[#6B756E]">Delivery method: {order.deliveryMethod === 'pickup' ? 'Seller-arranged pickup' : 'Standard seller delivery'}. No live GPS tracking is available; fulfilment is recorded by seller event updates.</p></section></div><section className={`${panel}`}><h2 className="font-semibold">Order timeline</h2><ol className="mt-4 space-y-4">{timeline.map((event, index) => <li key={`${event.status}-${event.createdAt}-${index}`} className="flex gap-3"><span className="mt-1 h-3 w-3 rounded-full bg-[#39845A]" /><div><p className="text-sm font-medium">{event.status} — {event.detail}</p><p className="mt-1 text-xs text-[#6B756E]">{formatDateTime(event.createdAt)}</p></div></li>)}</ol><h3 className="mt-6 border-t border-[#e6eae5] pt-4 text-sm font-semibold">Seller fulfilment</h3>{order.suborders.map((suborder) => <div key={suborder.sellerId} className="mt-3 rounded-xl bg-[#F6F5EF] p-3"><p className="text-sm font-medium">{sellerFor(suborder.sellerId)?.storeName ?? 'Seller'} · {suborder.status}</p>{suborder.trackingEvents.map((event) => <p key={event.createdAt} className="mt-1 text-xs text-[#6B756E]">{event.detail} · {formatDateTime(event.createdAt)}</p>)}</div>)}</section>{order.paymentStatus === 'Successful' && !['Cancelled', 'Refunded'].includes(order.status) && <form onSubmit={submitReturn} className={`${panel} space-y-3`}><h2 className="font-semibold">Cancellation or return request</h2><p className="text-xs leading-5 text-[#6B756E]">Eligibility depends on the item policy and order status. Submitting a request does not guarantee approval or refund.</p><select required value={returnProduct} onChange={(event) => setReturnProduct(event.target.value)} className="w-full rounded-lg border border-[#e6eae5] bg-white p-3 text-sm"><option value="">Select an item</option>{order.items.map((item) => <option key={item.productId} value={item.productId}>{item.name}</option>)}</select><select value={reason} onChange={(event) => setReason(event.target.value)} className="w-full rounded-lg border border-[#e6eae5] bg-white p-3 text-sm">{['Damaged or defective', 'Incorrect item', 'Not as described', 'Other'].map((option) => <option key={option}>{option}</option>)}</select><textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} rows={3} placeholder="Explain your request" className="w-full rounded-lg border border-[#e6eae5] p-3 text-sm" /><button className={secondary}>Submit request</button>{message && <p role="status" className="text-sm text-[#285342]">{message}</p>}</form>}</div>
}

function WishlistPage({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const saved = state.wishlist.map((id) => productFor(id)).filter((product): product is MarketProduct => Boolean(product))
  const moveToCart = (product: MarketProduct) => {
    if (product.stock < 1) return
    if (product.variations.some((variation) => variation.required)) return
    update((current) => ({ ...current, wishlist: current.wishlist.filter((id) => id !== product.id), cart: incrementCartItem(current.cart, { productId: product.id, quantity: 1, variationSelections: {} }, product.stock) }))
  }
  return <div className="space-y-6"><SectionTitle eyebrow="Saved for later" title="Wishlist" description="Your saved items are stored on this device for this prototype. Sign-in sync requires the shared Leafy account service." />{saved.length === 0 ? <EmptyMarket title="Nothing saved yet" detail="Tap the heart on a product to keep it on your wishlist." action={<Link className={primary} to="/market/products">Discover products</Link>} /> : <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{saved.map((product) => <div key={product.id}><ProductCard product={product} state={state} update={update} /><button disabled={!product.stock || product.variations.some((variation) => variation.required)} onClick={() => moveToCart(product)} className={`${secondary} mt-2 w-full text-xs`}>Move to cart</button></div>)}</div>}</div>
}

function CustomerAccount({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const location = window.location.pathname
  const [form, setForm] = useState(state.customer)
  const [message, setMessage] = useState('')
  const save = (event: FormEvent) => {
    event.preventDefault()
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.phone.trim()) { setMessage('Name, valid email and phone are required.'); return }
    update((current) => ({ ...current, customer: form }))
    setMessage('Profile saved in this browser.')
  }
  const links = [{ path: '/market/account', label: 'Overview' }, { path: '/market/orders', label: 'My orders' }, { path: '/market/wishlist', label: 'Wishlist' }, { path: '/market/account/addresses', label: 'Saved addresses' }, { path: '/market/account/reviews', label: 'My reviews' }, { path: '/market/account/returns', label: 'Returns & refunds' }, { path: '/market/account/notifications', label: 'Notifications' }, { path: '/market/account/profile', label: 'Profile & security' }]
  const sub = location.replace('/market/account', '')
  return <div className="space-y-6"><SectionTitle eyebrow="Leafy account" title="Your Market account" description="Use your shared Leafy identity for marketplace purchases. Secure authentication is pending the shared account integration." /><div className="grid gap-5 lg:grid-cols-[220px_1fr]"><nav className={`${panel} h-fit space-y-1`}>{links.map((link) => <NavLink key={link.path} to={link.path} end={link.path === '/market/account'} className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-[#285342] text-white' : 'text-[#4d5a52] hover:bg-[#F6F5EF]'}`}>{link.label}</NavLink>)}</nav><div className="space-y-5">{sub === '/addresses' ? <AddressBook state={state} update={update} /> : sub === '/reviews' ? <MyReviews state={state} /> : sub === '/returns' ? <ReturnRequests state={state} /> : sub === '/notifications' ? <MarketNotifications state={state} update={update} /> : sub === '/profile' ? <form onSubmit={save} className={`${panel} max-w-2xl space-y-4`}><h2 className="font-semibold">Profile and security</h2><TextInput label="Full name" value={form.name} onChange={(name) => setForm({ ...form, name })} /><TextInput label="Email address" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} /><TextInput label="Phone number" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} /><p className="text-xs text-[#6B756E]">Password changes and account security will be handled through shared Leafy authentication.</p>{message && <p role="status" className="text-sm text-[#285342]">{message}</p>}<button className={primary}>Save profile</button></form> : <div className="space-y-5"><div className={`${panel} grid gap-4 sm:grid-cols-3`}><AccountStat label="Orders" value={String(state.orders.length)} /><AccountStat label="Wishlist items" value={String(state.wishlist.length)} /><AccountStat label="Notifications" value={String(state.notifications.filter((item) => !item.read).length)} /></div><div className={`${panel} space-y-3`}><h2 className="font-semibold">Recent orders</h2>{state.orders.slice(0, 3).map((order) => <Link key={order.id} to={`/market/orders/${order.id}`} className="flex items-center justify-between rounded-xl bg-[#F6F5EF] p-3 text-sm"><span>{order.orderNumber} · {formatDate(order.createdAt)}</span><StatusChip value={order.status} /></Link>)}{state.orders.length === 0 && <p className="text-sm text-[#6B756E]">Your orders will appear here after the payment service confirms them.</p>}<Link className="text-sm font-semibold text-[#285342]" to="/market/orders">View all orders <ArrowRight className="inline h-4 w-4" /></Link></div><p className="text-xs text-[#6B756E]">Local prototype profile is not an authenticated identity. Account data must move to the shared Leafy backend before production.</p></div>}</div></div></div>
}

function AddressBook({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const [address, setAddress] = useState<MarketAddress>({ id: '', name: state.customer.name, phone: state.customer.phone, county: '', town: '', area: '', instructions: '' })
  const [error, setError] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!address.name.trim() || !address.phone.trim() || !address.county.trim() || !address.town.trim() || !address.area.trim()) { setError('Complete the required address fields.'); return }
    update((current) => ({ ...current, addresses: [{ ...address, id: crypto.randomUUID() }, ...current.addresses] }))
    setAddress({ id: '', name: state.customer.name, phone: state.customer.phone, county: '', town: '', area: '', instructions: '' })
    setError('Address saved on this device.')
  }
  return <div className="space-y-4"><div className={`${panel} space-y-3`}><h2 className="font-semibold">Saved addresses</h2>{state.addresses.map((item) => <div key={item.id} className="flex justify-between gap-3 rounded-xl bg-[#F6F5EF] p-3 text-sm"><span><strong>{item.name}</strong><br />{item.area}, {item.town}, {item.county}<br />{item.phone}</span><button aria-label={`Remove ${item.name} address`} onClick={() => update((current) => ({ ...current, addresses: current.addresses.filter((saved) => saved.id !== item.id) }))} className="text-xs text-[#a1462b]">Remove</button></div>)}{state.addresses.length === 0 && <p className="text-sm text-[#6B756E]">No saved addresses.</p>}</div><form onSubmit={submit} className={`${panel} space-y-3`}><h2 className="font-semibold">Add address</h2><AddressFields address={address} setAddress={setAddress} />{error && <p role="status" className="text-sm text-[#285342]">{error}</p>}<button className={primary}>Save address</button></form></div>
}

function MyReviews({ state }: { state: MarketState }) {
  const reviews = state.reviews.filter((review) => review.customerName === (state.customer.name || 'Market customer'))
  return <div className={`${panel}`}><h2 className="font-semibold">My reviews</h2><div className="mt-4 space-y-3">{reviews.map((review) => <div key={review.id} className="rounded-xl bg-[#F6F5EF] p-3"><p className="font-medium">{productFor(review.productId)?.name}</p><p className="mt-1 text-sm">{review.title} · {review.rating}/5</p><StatusChip value={review.status === 'pending' ? 'Under Review' : review.status} /></div>)}</div>{reviews.length === 0 && <p className="mt-3 text-sm text-[#6B756E]">No reviews submitted yet. Verified purchase reviews appear after moderation.</p>}</div>
}

function ReturnRequests({ state }: { state: MarketState }) {
  return <div className={`${panel}`}><h2 className="font-semibold">Returns & refunds</h2><div className="mt-4 space-y-3">{state.returnRequests.map((item) => <div key={item.id} className="rounded-xl bg-[#F6F5EF] p-3"><p className="font-medium">{productFor(item.productId)?.name}</p><p className="mt-1 text-xs text-[#6B756E]">{item.reason} · {formatDate(item.createdAt)}</p><StatusChip value={item.status} /></div>)}</div>{state.returnRequests.length === 0 && <p className="mt-3 text-sm text-[#6B756E]">No return or refund requests. To request a return, open an eligible order.</p>}</div>
}

function MarketNotifications({ state, update }: { state: MarketState; update: UpdateMarket }) {
  return <div className="space-y-3"><div className="flex justify-between"><h2 className="text-lg font-semibold">Notifications</h2><button className="text-sm text-[#285342]" onClick={() => update((current) => ({ ...current, notifications: current.notifications.map((item) => ({ ...item, read: true })) }))}>Mark all read</button></div>{state.notifications.map((item) => <article key={item.id} className={`${panel} flex justify-between gap-3`}><div><p className="font-medium">{item.title}{!item.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#d26945]" />}</p><p className="mt-1 text-sm text-[#6B756E]">{item.detail}</p><Link to={item.href} onClick={() => update((current) => ({ ...current, notifications: current.notifications.map((notice) => notice.id === item.id ? { ...notice, read: true } : notice) }))} className="mt-2 inline-block text-xs font-semibold text-[#285342]">Open update</Link></div><span className="text-xs text-[#6B756E]">{formatDate(item.createdAt)}</span></article>)}{state.notifications.length === 0 && <EmptyMarket title="No updates" detail="Payment and fulfilment updates will appear here." />}</div>
}

function SellerApplicationPage({ update }: { update: UpdateMarket }) {
  const [values, setValues] = useState({ applicantName: '', phone: '', email: '', storeName: '', description: '', location: '', categories: '', verificationInfo: '' })
  const [notice, setNotice] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!values.applicantName.trim() || !values.phone.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || !values.storeName.trim() || !values.location.trim() || !values.verificationInfo.trim()) { setNotice('Complete all required fields with a valid email address.'); return }
    update((current) => ({ ...current, sellerApplications: [{ ...values, categories: values.categories.split(',').map((category) => category.trim()).filter(Boolean), id: crypto.randomUUID(), status: 'Pending', createdAt: now() }, ...current.sellerApplications], notifications: [{ id: crypto.randomUUID(), title: 'Seller application received', detail: 'Your application is awaiting marketplace review.', href: '/market/account/notifications', read: false, createdAt: now() }, ...current.notifications] }))
    setNotice('Application submitted for review. Approval is not automatic.')
  }
  const field = (key: keyof typeof values, label: string, required = true, multiline = false) => <label className="block text-sm font-medium">{label}{multiline ? <textarea required={required} rows={3} value={values[key]} onChange={(event) => setValues({ ...values, [key]: event.target.value })} className="mt-2 block w-full rounded-xl border border-[#dce4dc] p-3 font-normal" /> : <input required={required} value={values[key]} onChange={(event) => setValues({ ...values, [key]: event.target.value })} className="mt-2 block w-full rounded-xl border border-[#dce4dc] p-3 font-normal" />}</label>
  return <div className="mx-auto max-w-3xl space-y-6"><SectionTitle eyebrow="Seller onboarding" title="Bring your store to Leafy Market" description="Share your business information for marketplace review. Verification documents are not uploaded or stored by this frontend prototype." /><form onSubmit={submit} className={`${panel} space-y-4 sm:p-7`}><div className="grid gap-4 sm:grid-cols-2">{field('applicantName', 'Applicant name')}{field('phone', 'Phone number')}{field('email', 'Email address')}{field('storeName', 'Proposed store name')}{field('location', 'Business location')}{field('categories', 'Product categories (comma separated)')}</div>{field('description', 'Business description', true, true)}{field('verificationInfo', 'Verification information / reference', true, true)}<p className="text-xs leading-5 text-[#6B756E]">Only the information needed to review this application should be provided. Do not enter passwords, payment PINs or unrelated personal data.</p><button className={primary}>Submit seller application</button>{notice && <p role="status" className="text-sm text-[#285342]">{notice}</p>}</form></div>
}

function SellerPortal({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const [tab, setTab] = useState('Overview')
  const [notice, setNotice] = useState('')
  const [productForm, setProductForm] = useState({ name: '', description: '', categoryId: 'produce', price: '', stock: '' })
  const sellerId = 'green-grove'
  const products = marketProducts.filter((product) => product.sellerId === sellerId)
  const orderLines = state.orders.flatMap((order) => order.items.filter((item) => item.sellerId === sellerId).map((item) => ({ order, item })))
  if (state.role !== 'seller') return <RoleGate required="seller" state={state} update={update} title="Seller workspace" detail="Seller access requires an approved seller identity from shared Leafy authentication." />
  const submitProduct = (event: FormEvent) => {
    event.preventDefault()
    const price = Number(productForm.price)
    const stock = Number(productForm.stock)
    if (!productForm.name.trim() || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) { setNotice('Enter a product name, a valid positive KSh price and a whole-number stock quantity.'); return }
    const product: MarketProduct = { id: crypto.randomUUID(), sellerId, name: productForm.name.trim(), description: productForm.description.trim(), categoryId: productForm.categoryId, subcategory: 'Seller listing', price, images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'], stock, location: sellerFor(sellerId)?.location ?? 'Kenya', specifications: {}, variations: [], status: 'pending-review', createdAt: now() }
    update((current) => ({ ...current, sellerApplications: current.sellerApplications, notifications: [{ id: crypto.randomUUID(), title: 'Product listing submitted', detail: `${product.name} is waiting for marketplace approval.`, href: '/market/seller/products', read: false, createdAt: now() }, ...current.notifications] }))
    setNotice(`${product.name} was drafted for review. The live catalogue is read-only in this frontend preview.`)
    setProductForm({ name: '', description: '', categoryId: 'produce', price: '', stock: '' })
  }
  const updateOrder = (orderId: string, status: OrderStatus) => update((current) => ({ ...current, orders: current.orders.map((order) => order.id !== orderId ? order : { ...order, status, timeline: [...order.timeline, { status, detail: `Seller updated fulfilment to ${status.toLowerCase()}.`, createdAt: now() }], suborders: order.suborders.map((suborder) => suborder.sellerId === sellerId ? { ...suborder, status, trackingEvents: [...suborder.trackingEvents, { detail: `Seller updated fulfilment to ${status.toLowerCase()}.`, createdAt: now() }] } : suborder) }) }))
  const tabs = ['Overview', 'Products', 'Orders', 'Store profile', 'Reviews']
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-3"><SectionTitle eyebrow="Seller workspace · demo preview role" title="Green Grove Collective" description="Seller views should be scoped to the signed-in seller by the backend. The local role preview is not an access-control mechanism." /><Link className={secondary} to="/market/seller/apply">Seller application</Link></div><div className="flex flex-wrap gap-2">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-sm ${tab === item ? 'bg-[#285342] text-white' : 'border bg-white text-[#4d5a52]'}`}>{item}</button>)}</div>
    {tab === 'Overview' && <><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><AccountStat label="Products" value={String(products.length)} /><AccountStat label="Active listings" value={String(products.filter((product) => product.status === 'active').length)} /><AccountStat label="Pending orders" value={String(orderLines.filter(({ order }) => !['Delivered', 'Cancelled'].includes(order.status)).length)} /><AccountStat label="Customer reviews" value={String(state.reviews.filter((review) => products.some((product) => product.id === review.productId)).length)} /></div><div className={`${panel}`}><h2 className="font-semibold">Recent order activity</h2><p className="mt-2 text-sm text-[#6B756E]">{orderLines.length ? `${orderLines.length} seller-specific line(s) across the orders in this browser.` : 'New paid orders assigned to this store will appear here.'}</p><p className="mt-2 text-xs text-[#6B756E]">No seller revenue figures are shown. Payment success can only be recorded by the payment backend.</p></div></>}
    {tab === 'Products' && <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]"><form onSubmit={submitProduct} className={`${panel} space-y-3`}><h2 className="font-semibold">Create a product listing</h2><input required value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="Product name" className="w-full rounded-lg border p-3 text-sm" /><textarea value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} placeholder="Description" rows={3} className="w-full rounded-lg border p-3 text-sm" /><select value={productForm.categoryId} onChange={(event) => setProductForm({ ...productForm, categoryId: event.target.value })} className="w-full rounded-lg border bg-white p-3 text-sm">{marketCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><div className="grid grid-cols-2 gap-2"><input required inputMode="decimal" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} placeholder="Price KSh" className="w-full rounded-lg border p-3 text-sm" /><input required inputMode="numeric" value={productForm.stock} onChange={(event) => setProductForm({ ...productForm, stock: event.target.value })} placeholder="Stock" className="w-full rounded-lg border p-3 text-sm" /></div><p className="text-xs text-[#6B756E]">Image upload and listing persistence require the marketplace API. New drafts are not published or added to the customer catalogue in this preview.</p><button className={primary}>Submit for approval</button>{notice && <p role="status" className="text-sm text-[#285342]">{notice}</p>}</form><div className={`${panel}`}><h2 className="font-semibold">Your catalogues</h2><div className="mt-3 space-y-2">{products.map((product) => <div key={product.id} className="flex justify-between gap-2 rounded-lg bg-[#F6F5EF] p-3 text-sm"><span>{product.name} · {product.stock} stock</span><StatusChip value={product.status} /></div>)}</div></div></div>}
    {tab === 'Orders' && <div className={`${panel} space-y-3`}><h2 className="font-semibold">Seller order fulfilment</h2>{orderLines.map(({ order, item }) => <div key={`${order.id}-${item.productId}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F6F5EF] p-3"><div><p className="font-medium">{item.name} × {item.quantity}</p><p className="text-xs text-[#6B756E]">{order.orderNumber} · Delivery to {order.address.town}, {order.address.county}</p></div><div className="flex items-center gap-2"><StatusChip value={order.status} /><select aria-label={`Update status for ${order.orderNumber}`} disabled={order.paymentStatus !== 'Successful'} value={order.status} onChange={(event) => updateOrder(order.id, event.target.value as OrderStatus)} className="rounded-lg border bg-white p-2 text-xs"><option>Paid</option><option>Confirmed</option><option>Processing</option><option>Ready for Dispatch</option><option>Shipped</option><option>Out for Delivery</option><option>Delivered</option></select></div></div>)}{orderLines.length === 0 && <p className="text-sm text-[#6B756E]">Orders assigned to this seller appear after verified payment.</p>}<p className="text-xs text-[#6B756E]">Payment status is read-only for sellers; only fulfilment events may be updated.</p></div>}
    {tab === 'Store profile' && <div className={`${panel}`}><h2 className="font-semibold">{sellerFor(sellerId)?.storeName}</h2><p className="mt-2 text-sm leading-6 text-[#6B756E]">{sellerFor(sellerId)?.description}</p><p className="mt-2 text-sm">{sellerFor(sellerId)?.location} · Verified seller</p></div>}
    {tab === 'Reviews' && <MyReviews state={state} />}
  </div>
}

function MarketAdminPortal({ state, update }: { state: MarketState; update: UpdateMarket }) {
  const [tab, setTab] = useState('Overview')
  const [productStatus, setProductStatus] = useState<Record<string, string>>({})
  if (!['marketplace-manager', 'super-admin'].includes(state.role)) return <RoleGate required="marketplace-manager" state={state} update={update} title="Marketplace management" detail="Only an authenticated marketplace manager or Leafy Super Admin can access operational controls. Payment reporting is reserved for Super Admin." />
  const tabs = ['Overview', 'Products', 'Sellers', 'Orders', 'Returns', ...(state.role === 'super-admin' ? ['Payments'] : [])]
  const applications = state.sellerApplications
  const orders = state.orders
  const revenue = orders.filter((order) => order.paymentStatus === 'Successful').reduce((sum, order) => sum + order.total, 0)
  const changeOrder = (orderId: string, status: OrderStatus) => update((current) => ({ ...current, orders: current.orders.map((order) => order.id === orderId ? { ...order, status, timeline: [...order.timeline, { status, detail: `Marketplace manager updated order status to ${status}.`, createdAt: now() }] } : order) }))
  return <div className="space-y-6"><SectionTitle eyebrow={`Marketplace administration · ${state.role}`} title="Market operations" description="Role labels in this local prototype are for UI review only. In production, all privileges must be enforced using shared-authenticated server-side roles." /><div className="flex flex-wrap gap-2">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-sm ${tab === item ? 'bg-[#285342] text-white' : 'border bg-white text-[#4d5a52]'}`}>{item}</button>)}</div>
    {tab === 'Overview' && <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><AccountStat label="Catalogue items" value={String(marketProducts.length)} /><AccountStat label="Pending seller applications" value={String(applications.filter((application) => application.status === 'Pending').length)} /><AccountStat label="Orders" value={String(orders.length)} /><AccountStat label={state.role === 'super-admin' ? 'Verified payment totals' : 'Payments'} value={state.role === 'super-admin' ? money(revenue) : 'Restricted'} /></div>}
    {tab === 'Products' && <div className={`${panel} space-y-3`}><h2 className="font-semibold">Listing review queue</h2>{marketProducts.map((product) => <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F6F5EF] p-3"><span className="text-sm">{product.name} · {sellerFor(product.sellerId)?.storeName} · {money(product.price)}</span><div className="flex items-center gap-2"><StatusChip value={productStatus[product.id] ?? product.status} /><button className="text-xs font-semibold text-[#285342]" onClick={() => setProductStatus({ ...productStatus, [product.id]: 'Approved for listing (preview)' })}>Approve preview</button><button className="text-xs text-[#9b422b]" onClick={() => setProductStatus({ ...productStatus, [product.id]: 'Rejected (preview)' })}>Reject preview</button></div></div>)}<p className="text-xs text-[#6B756E]">Approval actions are presentation-only. Catalogue changes require authenticated API writes and audit logging.</p></div>}
    {tab === 'Sellers' && <div className={`${panel} space-y-3`}><h2 className="font-semibold">Seller applications</h2>{applications.map((application) => <div key={application.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F6F5EF] p-3"><div><p className="font-medium">{application.storeName} · {application.applicantName}</p><p className="text-xs text-[#6B756E]">{application.location} · {application.email}</p><StatusChip value={application.status} /></div><div className="flex gap-2"><button className={secondary} onClick={() => update((current) => ({ ...current, sellerApplications: current.sellerApplications.map((item) => item.id === application.id ? { ...item, status: 'Approved' } : item) }))}>Approve preview</button><button className="text-sm text-[#9b422b]" onClick={() => update((current) => ({ ...current, sellerApplications: current.sellerApplications.map((item) => item.id === application.id ? { ...item, status: 'Rejected' } : item) }))}>Reject</button></div></div>)}{applications.length === 0 && <p className="text-sm text-[#6B756E]">No applications received.</p>}</div>}
    {tab === 'Orders' && <div className={`${panel} space-y-3`}><h2 className="font-semibold">Marketplace order management</h2>{orders.map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F6F5EF] p-3"><span>{order.orderNumber} · {order.items.length} items · {order.paymentStatus}</span><select value={order.status} onChange={(event) => changeOrder(order.id, event.target.value as OrderStatus)} className="rounded-lg border bg-white p-2 text-xs"><option>Paid</option><option>Confirmed</option><option>Processing</option><option>Ready for Dispatch</option><option>Shipped</option><option>Out for Delivery</option><option>Delivered</option><option>Cancelled</option></select></div>)}</div>}
    {tab === 'Returns' && <div className={`${panel} space-y-3`}><h2 className="font-semibold">Return and refund requests</h2>{state.returnRequests.map((item) => <div key={item.id} className="flex flex-wrap justify-between gap-3 rounded-xl bg-[#F6F5EF] p-3"><span>{productFor(item.productId)?.name} · {item.reason}</span><div className="flex gap-2"><StatusChip value={item.status} /><button className="text-xs font-semibold text-[#285342]" onClick={() => update((current) => ({ ...current, returnRequests: current.returnRequests.map((request) => request.id === item.id ? { ...request, status: 'Under Review' } : request) }))}>Mark under review</button></div></div>)}{state.returnRequests.length === 0 && <p className="text-sm text-[#6B756E]">No return requests.</p>}<p className="text-xs text-[#6B756E]">Refund completion is not editable here. It must follow a verified payment-provider refund callback.</p></div>}
    {tab === 'Payments' && state.role === 'super-admin' && <div className={`${panel} space-y-3`}><h2 className="font-semibold">Super Admin payment oversight</h2><p className="text-sm text-[#6B756E]">Totals shown only from backend-verified successful order objects. No verified transactions are stored in this frontend demo.</p><div className="grid gap-3 sm:grid-cols-3"><AccountStat label="Paid order total" value={money(revenue)} /><AccountStat label="Pending transactions" value={String(orders.filter((order) => ['Pending', 'Initiated', 'Awaiting Customer Action'].includes(order.paymentStatus)).length)} /><AccountStat label="Reconciliation required" value={String(orders.filter((order) => order.paymentStatus === 'Reconciliation Required').length)} /></div></div>}
  </div>
}

function RoleGate({ required, state, update, title, detail }: { required: 'seller' | 'marketplace-manager'; state: MarketState; update: UpdateMarket; title: string; detail: string }) {
  return <div className="mx-auto max-w-2xl space-y-5"><SectionTitle eyebrow="Restricted workspace" title={title} description={detail} /><div className={`${panel} space-y-4`}><p className="rounded-xl bg-[#fff4e8] p-3 text-sm text-[#79501c]">This prototype has no shared authentication or server-side role checks. This role preview only reveals mock UI; never use it to authorize production operations.</p><label className="block text-sm font-medium">Local UI preview<select value={state.role} onChange={(event) => update((current) => ({ ...current, role: event.target.value as MarketRole }))} className="mt-2 w-full rounded-xl border border-[#e6eae5] bg-white p-3"><option value="customer">Customer</option><option value="seller">Seller preview</option><option value="marketplace-manager">Marketplace manager preview</option><option value="super-admin">Super Admin preview</option></select></label><p className="text-xs text-[#6B756E]">Required role: {required}. Server checks must remain authoritative regardless of this control.</p></div></div>
}

function AddressFields({ address, setAddress }: { address: MarketAddress; setAddress: (address: MarketAddress) => void }) {
  const field = (key: keyof MarketAddress, label: string, required = true) => <label className="block text-sm font-medium">{label}<input required={required} value={address[key]} onChange={(event) => setAddress({ ...address, [key]: event.target.value })} className="mt-2 block w-full rounded-xl border border-[#dce4dc] p-3 font-normal" /></label>
  return <><div className="grid gap-3 sm:grid-cols-2">{field('name', 'Recipient name')}{field('phone', 'Contact phone')}{field('county', 'County')}{field('town', 'Town')}{field('area', 'Area or estate')}</div><label className="block text-sm font-medium">Building or delivery instructions<input value={address.instructions} onChange={(event) => setAddress({ ...address, instructions: event.target.value })} className="mt-2 block w-full rounded-xl border border-[#dce4dc] p-3 font-normal" /></label></>
}

function TextInput({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block text-sm font-medium">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full rounded-xl border border-[#dce4dc] p-3 font-normal" /></label>
}

function SectionTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="flex flex-wrap items-end justify-between gap-4"><div>{eyebrow && <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#39845A]">{eyebrow}</p>}<h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#202923] sm:text-3xl">{title}</h1>{description && <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B756E]">{description}</p>}</div>{action}</div>
}

function EmptyMarket({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-[#e6eae5] bg-white p-6 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDF4EA] text-[#285342]"><ShoppingBag className="h-5 w-5" /></span><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#6B756E]">{detail}</p>{action && <div className="mt-5">{action}</div>}</div>
}

function SummaryLine({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className={`mt-3 flex justify-between gap-4 text-sm ${strong ? 'text-base font-semibold' : 'text-[#59665d]'}`}><span>{label}</span><span>{value}</span></div>
}

function AccountStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-[#F6F5EF] p-4"><p className="text-xs text-[#6B756E]">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>
}

function StatusChip({ value }: { value: string }) {
  const positive = ['Paid', 'Delivered', 'Successful', 'Approved', 'active', 'published'].includes(value)
  return <span className={`text-xs font-medium ${positive ? 'text-[#285342]' : ['Failed', 'Rejected', 'Cancelled', 'Out of stock'].includes(value) ? 'text-[#9b422b]' : 'text-[#79501c]'}`}>{value}</span>
}

function MarketFooter() {
  return <footer className="mt-14 border-t border-[#e6eae5] bg-white"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:px-6 md:grid-cols-3 lg:px-8"><div><p className="font-semibold">Leafy Market</p><p className="mt-2 max-w-sm text-sm leading-6 text-[#6B756E]">A marketplace connecting customers with growers and independent sellers.</p></div><div className="space-y-2 text-sm"><p className="font-semibold">Shop</p><Link className="block text-[#6B756E]" to="/market/products">All products</Link><Link className="block text-[#6B756E]" to="/market/stores">Stores</Link><Link className="block text-[#6B756E]" to="/market/seller/apply">Become a seller</Link></div><div className="space-y-2 text-sm"><p className="font-semibold">Support & policies</p><p className="text-[#6B756E]">Payments are confirmed by the payment provider.</p><p className="text-[#6B756E]">Return eligibility depends on order and item policy.</p><Link className="block text-[#285342]" to="/">Back to Leafy</Link></div></div><div className="border-t border-[#e6eae5] py-3 text-center text-xs text-[#6B756E]">© 2026 Leafy Market · Prices shown in Kenyan Shillings</div></footer>
}

function incrementCartItem(cart: CartItem[], newItem: CartItem, stock: number) {
  const key = itemSelectionKey(newItem)
  const existing = cart.find((item) => itemSelectionKey(item) === key)
  if (existing) return cart.map((item) => itemSelectionKey(item) === key ? { ...item, quantity: Math.min(stock, item.quantity + newItem.quantity) } : item)
  return [...cart, { ...newItem, quantity: Math.min(stock, newItem.quantity) }]
}

function averageRating(reviews: ProductReview[]) {
  if (!reviews.length) return '—'
  return (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
}

function statusMessage(status: PaymentStatus) {
  const messages: Record<PaymentStatus, string> = {
    Pending: 'Payment is pending',
    Initiated: 'Payment request initiated',
    'Awaiting Customer Action': 'Check your phone and enter your PIN',
    Successful: 'Payment confirmed by Safaricom',
    Failed: 'Payment failed',
    Cancelled: 'Payment was cancelled',
    Expired: 'Payment prompt expired',
    'Reconciliation Required': 'Payment is being reconciled',
  }
  return messages[status]
}

function paymentPhoneError(phone: string): string | null {
  const compact = phone.replace(/[\s-]/g, '')
  if (!compact) return 'Enter the Kenyan mobile number that should receive the payment prompt.'
  if (!/^(?:0[17]\d{8}|\+?254[17]\d{8})$/.test(compact)) {
    return 'Enter a valid Kenyan mobile number, such as 0712345678, 0112345678 or 254712345678.'
  }
  return null
}

function normalizeKenyanPhone(phone: string): string {
  const compact = phone.replace(/[\s-]/g, '').replace(/^\+/, '')
  if (compact.startsWith('0')) return `254${compact.slice(1)}`
  return compact
}

function paymentStatusDetail(status: PaymentStatus): string {
  const details: Record<PaymentStatus, string> = {
    Pending: 'Waiting for the payment service to process your request.',
    Initiated: 'Payment request sent. Please check your phone and enter your M-Pesa PIN.',
    'Awaiting Customer Action': 'Payment request sent. Please check your phone and enter your M-Pesa PIN.',
    Successful: 'Payment successful and verified. Your order is confirmed.',
    Failed: 'The payment could not be completed. Check your M-Pesa balance and phone, then retry.',
    Cancelled: 'The payment prompt was cancelled. You can safely request a new prompt.',
    Expired: 'The payment request timed out. Check payment status before retrying.',
    'Reconciliation Required': 'Your payment is being reconciled. Please wait for confirmation before retrying.',
  }
  return details[status]
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

function formatDateTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}
