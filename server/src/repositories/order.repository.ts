import type { Order, OrderStatus } from '../domain/order.js'

export interface OrderRepository {
  create(order: Order): Promise<Order>
  findById(id: string): Promise<Order | null>
  updateStatus(id: string, status: OrderStatus): Promise<Order | null>
  delete(id: string): Promise<boolean>
}
