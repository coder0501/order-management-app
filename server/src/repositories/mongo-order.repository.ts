import type { Order, OrderStatus } from '../domain/order.js'
import { OrderModel, toOrder } from '../models/order.model.js'
import type { OrderRepository } from './order.repository.js'

export class MongoOrderRepository implements OrderRepository {
  async create(order: Order) {
    const document = await OrderModel.create({ ...order, _id: order.id })
    return toOrder(document.toObject())
  }

  async findById(id: string) {
    const document = await OrderModel.findById(id).lean()
    return document ? toOrder(document) : null
  }

  async updateStatus(id: string, status: OrderStatus) {
    const document = await OrderModel.findByIdAndUpdate(id, { status }, { new: true }).lean()
    return document ? toOrder(document) : null
  }

  async delete(id: string) {
    return Boolean(await OrderModel.findByIdAndDelete(id).lean())
  }
}
