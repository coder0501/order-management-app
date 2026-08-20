import type { Server } from 'socket.io'
import type { Order, OrderStatus } from '../domain/order.js'
import { orderStatuses } from '../domain/order.js'
import type { OrderService } from '../services/order.service.js'

export class OrderStatusScheduler {
  constructor(private readonly service: OrderService, private readonly io: Server) {}

  schedule(orderId: string) {
    orderStatuses.slice(1).forEach((status, index) => {
      setTimeout(() => void this.advance(orderId, status), (index + 1) * 5000)
    })
  }

  publish(order: Order) {
    this.io.to(order.id).emit('order:updated', order)
  }

  private async advance(orderId: string, status: OrderStatus) {
    const order = await this.service.updateStatus(orderId, status)
    if (order) this.publish(order)
  }
}
