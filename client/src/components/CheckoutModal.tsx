import { Check, X } from 'lucide-react'
import type { CustomerDetails } from '../types'

type CheckoutModalProps = { details: CustomerDetails; total: number; error: string; onDetailsChange: (details: CustomerDetails) => void; onClose: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }

export function CheckoutModal({ details, total, error, onDetailsChange, onClose, onSubmit }: CheckoutModalProps) {
  return <div className="overlay checkout-overlay"><form className="checkout-modal" onSubmit={onSubmit}><div className="drawer-head"><div><p className="eyebrow">Almost there</p><h2>Delivery details</h2></div><button className="icon-button" onClick={onClose} type="button" aria-label="Close checkout"><X size={20} /></button></div><label>Name<input required value={details.name} onChange={(event) => onDetailsChange({ ...details, name: event.target.value })} placeholder="Alex Morgan" /></label><label>Address<input required value={details.address} onChange={(event) => onDetailsChange({ ...details, address: event.target.value })} placeholder="12 Willow Street" /></label><label>Phone number<input required type="tel" pattern="[0-9 +()-]{8,}" value={details.phone} onChange={(event) => onDetailsChange({ ...details, phone: event.target.value })} placeholder="(555) 123-4567" /></label>{error && <p role="alert" className="checkout-error">{error}</p>}<div className="checkout-total"><span>You'll pay</span><strong>${total.toFixed(2)}</strong></div><button className="primary-button checkout-button" type="submit">Place order <Check size={17} /></button></form></div>
}
