import { Check } from 'lucide-react'

const statusSteps = ['Order received', 'Preparing', 'Out for delivery']

type OrderStatusProps = { activeStatus: number; onDismiss: () => void }

export function OrderStatus({ activeStatus, onDismiss }: OrderStatusProps) {
  return <section className="order-banner"><div className="order-title"><span className="success-icon"><Check size={18} /></span><div><p className="eyebrow">Order #004821</p><h2>{statusSteps[activeStatus]}</h2></div></div><div className="status-track">{statusSteps.map((step, index) => <div className={`status-step ${index <= activeStatus ? 'complete' : ''}`} key={step}><span>{index < activeStatus ? <Check size={13} /> : index + 1}</span><small>{step}</small></div>)}</div><button className="text-button" onClick={onDismiss} type="button">Dismiss</button></section>
}
