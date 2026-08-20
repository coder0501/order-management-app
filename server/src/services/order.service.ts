import mongoose from 'mongoose'
import { menu } from '../domain/menu.js'
import type { Order, OrderStatus } from '../domain/order.js'
import type { CreateOrderInput } from '../validation/order.schemas.js'
import type { OrderRepository } from '../repositories/order.repository.js'

const DELIVERY_FEE = 2.5

export class OrderService {
  constructor(private readonly repository: OrderRepository) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const items = input.items.map((item) => {
      const menuItem = menu.find((candidate) => candidate.id === item.menuItemId)
      if (!menuItem) throw new Error('One or more menu items are unavailable')
      return { ...item, price: menuItem.price }
    })
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, DELIVERY_FEE)
    const order: Order = { id: new mongoose.Types.ObjectId().toString(), customer: input.customer, items, status: 'received', total, createdAt: new Date() }
    return this.repository.create(order)
  }

  findOrder(id: string) { return this.repository.findById(id) }
  updateStatus(id: string, status: OrderStatus) { return this.repository.updateStatus(id, status) }
  deleteOrder(id: string) { return this.repository.delete(id) }
}
