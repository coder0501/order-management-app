import type { Order, OrderStatus } from '../domain/order.js'
import type { OrderRepository } from './order.repository.js'

export class MemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, Order>()

  async create(order: Order) {
    this.orders.set(order.id, order)
    return order
  }

  async findById(id: string) {
    return this.orders.get(id) ?? null
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = this.orders.get(id)
    if (!order) return null
    const updatedOrder = { ...order, status }
    this.orders.set(id, updatedOrder)
    return updatedOrder
  }

  async delete(id: string) {
    return this.orders.delete(id)
  }
}
