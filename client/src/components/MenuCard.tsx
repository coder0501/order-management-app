import { Minus, Plus, Star } from 'lucide-react'
import type { MenuItem } from '../types'

type MenuCardProps = { item: MenuItem; quantity: number; onQuantityChange: (id: number, change: number) => void }

export function MenuCard({ item, quantity, onQuantityChange }: MenuCardProps) {
  return <article className="menu-card"><div className="food-image"><img src={item.image} alt={item.name} />{item.popular && <span className="popular-tag">Popular</span>}<button className="quick-add" onClick={() => onQuantityChange(item.id, 1)} type="button" aria-label={`Add ${item.name} to cart`}><Plus size={19} /></button></div><div className="food-info"><div className="food-top"><h3>{item.name}</h3><span className="rating"><Star size={13} fill="currentColor" /> {item.rating}</span></div><p>{item.description}</p><div className="food-bottom"><strong>${item.price.toFixed(2)}</strong>{quantity ? <div className="quantity-control"><button onClick={() => onQuantityChange(item.id, -1)} type="button" aria-label="Decrease quantity"><Minus size={14} /></button><span>{quantity}</span><button onClick={() => onQuantityChange(item.id, 1)} type="button" aria-label="Increase quantity"><Plus size={14} /></button></div> : <button className="add-button" onClick={() => onQuantityChange(item.id, 1)} type="button">Add to order <Plus size={15} /></button>}</div></div></article>
}
