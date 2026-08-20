import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, Clock3, ShoppingBag } from 'lucide-react'
import { io } from 'socket.io-client'
import { CartDrawer } from './components/CartDrawer'
import { CheckoutModal } from './components/CheckoutModal'
import { MenuCard } from './components/MenuCard'
import { OrderStatus } from './components/OrderStatus'
import { Toast } from './components/Toast'
import { menu } from './data/menu'
import type { Category, CustomerDetails } from './types'
import './App.css'

const statusSteps = ['Order received', 'Preparing', 'Out for delivery']
const statuses = ['received', 'preparing', 'out_for_delivery'] as const
type FieldErrors = Partial<Record<keyof CustomerDetails, string>>

function validateCustomerDetails(details: CustomerDetails): FieldErrors {
  const errors: FieldErrors = {}
  if (details.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (details.address.trim().length < 5) errors.address = 'Please enter a complete delivery address.'
  if (!/^[0-9 +()-]{8,}$/.test(details.phone.trim())) errors.phone = 'Enter a valid phone number with at least 8 characters.'
  return errors
}

async function createOrderRequest(payload: { customer: CustomerDetails; items: { menuItemId: number; quantity: number }[] }) {
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
  let lastError: Error | null = null

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(`${apiUrl}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const result = await response.json().catch(() => null) as { data?: { id: string }; error?: string } | null
      if (!response.ok) {
        const error = new Error(result?.error ?? 'The kitchen could not accept this order.')
        if (![502, 503, 504].includes(response.status)) throw error
        throw Object.assign(error, { retryable: true })
      }
      if (!result?.data?.id) throw new Error('The kitchen returned an invalid order response.')
      return result.data
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('The order request failed.')
      if (attempt === 0 && error instanceof Error && 'retryable' in error) await new Promise((resolve) => window.setTimeout(resolve, 1500))
    }
  }

  throw lastError ?? new Error('The order request failed.')
}

function App() {
  const [category, setCategory] = useState<Category>('All')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [activeStatus, setActiveStatus] = useState(0)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'info' } | null>(null)
  const [details, setDetails] = useState<CustomerDetails>({ name: '', address: '', phone: '' })
  const filteredMenu = menu.filter((item) => category === 'All' || (category === 'Popular' ? item.popular : item.category === category))
  const cartItems = menu.filter((item) => cart[item.id])
  const itemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * cart[item.id], 0)
  const deliveryFee = subtotal > 0 ? 2.5 : 0
  const total = subtotal + deliveryFee

  useEffect(() => {
    if (!orderPlaced || !orderId) return
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
    const socket = io(apiUrl)
    socket.on('connect', () => socket.emit('order:watch', orderId))
    socket.on('order:updated', (order: { status: string }) => {
      const nextStatus = statuses.indexOf(order.status as (typeof statuses)[number])
      if (nextStatus >= 0) setActiveStatus(nextStatus)
    })
    return () => { socket.disconnect() }
  }, [orderPlaced, orderId])

  useEffect(() => {
    if (!orderPlaced || orderId || activeStatus >= statusSteps.length - 1) return
    const timer = window.setTimeout(() => setActiveStatus((status) => status + 1), 5000)
    return () => window.clearTimeout(timer)
  }, [orderPlaced, orderId, activeStatus])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const updateQuantity = (id: number, change: number) => setCart((current) => {
    const nextQuantity = (current[id] ?? 0) + change
    if (nextQuantity <= 0) { const next = { ...current }; delete next[id]; return next }
    if (change > 0) {
      const item = menu.find((menuItem) => menuItem.id === id)
      if (item) setToast({ message: `${item.name} added to your order`, tone: 'success' })
    }
    return { ...current, [id]: nextQuantity }
  })

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    const validationErrors = validateCustomerDetails(details)
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      setCheckoutError('Please correct the highlighted delivery details.')
      setToast({ message: 'Please check your delivery details.', tone: 'info' })
      return
    }
    setCheckoutError('')
    setFieldErrors({})
    setIsSubmitting(true)
    try {
      const order = await createOrderRequest({ customer: details, items: cartItems.map((item) => ({ menuItemId: item.id, quantity: cart[item.id] })) })
      setOrderId(order.id)
      setIsCheckoutOpen(false); setIsCartOpen(false); setOrderPlaced(true); setActiveStatus(0)
      setToast({ message: 'Order placed. The kitchen is on it.', tone: 'success' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The order request failed.'
      setCheckoutError(`${message} Please try again.`)
      setToast({ message: 'Order was not placed. Please try again.', tone: 'info' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">C</span> crave<span className="brand-dot">.</span></a><nav><a href="#menu">Menu</a><a href="#how-it-works">How it works</a></nav><button className="cart-button" type="button" onClick={() => setIsCartOpen(true)} aria-label="Open cart"><ShoppingBag size={19} /><span>Cart</span>{itemCount > 0 && <b>{itemCount}</b>}</button></header>
    <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">Good food, no fuss <span>✦</span></p><h1>Made for your<br /><em>next craving.</em></h1><p className="hero-text">Handcrafted comfort food, delivered while it is still worth talking about.</p><a className="primary-button" href="#menu">Explore the menu <ArrowRight size={17} /></a></div><div className="hero-photo"><img src={menu[0].image} alt="Truffle mushroom pizza" /><div className="delivery-badge"><Clock3 size={18} /><div><strong>25–35 min</strong><span>Estimated delivery</span></div></div></div></section>
    {orderPlaced && <OrderStatus activeStatus={activeStatus} onDismiss={() => setOrderPlaced(false)} />}
    <section className="menu-section" id="menu"><div className="section-heading"><div><p className="eyebrow">The good stuff</p><h2>Pick your pleasure</h2></div><p className="section-note">Everything is made fresh to order,<br />with ingredients we would eat ourselves.</p></div><div className="category-tabs">{(['All', 'Popular', 'Pizza', 'Burgers', 'Sides'] as Category[]).map((item) => <button className={category === item ? 'active' : ''} onClick={() => setCategory(item)} type="button" key={item}>{item}</button>)}</div><div className="menu-grid">{filteredMenu.map((item) => <MenuCard item={item} quantity={cart[item.id] ?? 0} onQuantityChange={updateQuantity} key={item.id} />)}</div></section>
    <section className="promise" id="how-it-works"><div><span className="promise-number">01</span><h3>Choose what<br />feels good.</h3></div><div><span className="promise-number">02</span><h3>We make it<br />with care.</h3></div><div><span className="promise-number">03</span><h3>You enjoy the<br />good part.</h3></div></section>
    <footer><span className="brand">crave<span className="brand-dot">.</span></span><span>© 2025 Crave Kitchen</span><span>Fresh food for ordinary days.</span></footer>
    {isCartOpen && <CartDrawer items={cartItems} cart={cart} subtotal={subtotal} deliveryFee={deliveryFee} total={total} onQuantityChange={updateQuantity} onClose={() => setIsCartOpen(false)} onCheckout={() => setIsCheckoutOpen(true)} />}
    {isCheckoutOpen && <CheckoutModal details={details} total={total} error={checkoutError} fieldErrors={fieldErrors} isSubmitting={isSubmitting} onDetailsChange={(nextDetails) => { setDetails(nextDetails); setFieldErrors((current) => ({ ...current, name: undefined, address: undefined, phone: undefined })) }} onClose={() => setIsCheckoutOpen(false)} onSubmit={submitOrder} />}
    {toast && <Toast message={toast.message} tone={toast.tone} onClose={() => setToast(null)} />}
  </main>
}

export default App
