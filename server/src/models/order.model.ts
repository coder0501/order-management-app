import mongoose, { Schema } from 'mongoose'
import type { Order } from '../domain/order.js'

const orderSchema = new Schema({
  _id: { type: String, required: true },
  customer: { name: { type: String, required: true }, address: { type: String, required: true }, phone: { type: String, required: true } },
  items: [{ menuItemId: { type: Number, required: true }, quantity: { type: Number, required: true }, price: { type: Number, required: true } }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['received', 'preparing', 'out_for_delivery'], required: true },
  createdAt: { type: Date, required: true },
}, { versionKey: false })

export const OrderModel = mongoose.models.Order ?? mongoose.model('Order', orderSchema)

export function toOrder(document: unknown): Order {
  const value = document as Order & { _id?: string }
  return { ...value, id: value.id ?? value._id! }
}
