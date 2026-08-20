import { Check, Info, X } from 'lucide-react'

type ToastProps = { message: string; tone: 'success' | 'info'; onClose: () => void }

export function Toast({ message, tone, onClose }: ToastProps) {
  return <div className={`toast toast-${tone}`} role="status" aria-live="polite"><span className="toast-icon">{tone === 'success' ? <Check size={15} /> : <Info size={15} />}</span><span>{message}</span><button type="button" onClick={onClose} aria-label="Dismiss notification"><X size={15} /></button></div>
}
