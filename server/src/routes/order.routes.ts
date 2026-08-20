import { Router } from 'express'
import type { OrderStatus } from '../domain/order.js'
import type { OrderStatusScheduler } from '../realtime/order-status.scheduler.js'
import type { OrderService } from '../services/order.service.js'
import { createOrderSchema, updateOrderStatusSchema } from '../validation/order.schemas.js'

export function createOrderRouter(service: OrderService, scheduler: OrderStatusScheduler) {
  const router = Router()

  router.get('/:id', async (request, response) => {
    const order = await service.findOrder(request.params.id)
    if (!order) return response.status(404).json({ error: 'Order not found' })
    return response.json({ data: order })
  })

  router.post('/', async (request, response) => {
    const parsed = createOrderSchema.safeParse(request.body)
    if (!parsed.success) return response.status(400).json({ error: 'Invalid order details', fields: parsed.error.flatten().fieldErrors })
    try {
      const order = await service.createOrder(parsed.data)
      scheduler.schedule(order.id)
      return response.status(201).json({ data: order })
    } catch (error) {
      return response.status(400).json({ error: error instanceof Error ? error.message : 'Unable to create order' })
    }
  })

  router.patch('/:id/status', async (request, response) => {
    const parsed = updateOrderStatusSchema.safeParse(request.body)
    if (!parsed.success) return response.status(400).json({ error: 'Invalid status' })
    const order = await service.updateStatus(request.params.id, parsed.data.status as OrderStatus)
    if (!order) return response.status(404).json({ error: 'Order not found' })
    scheduler.publish(order)
    return response.json({ data: order })
  })

  router.delete('/:id', async (request, response) => {
    const deleted = await service.deleteOrder(request.params.id)
    if (!deleted) return response.status(404).json({ error: 'Order not found' })
    return response.status(204).send()
  })

  return router
}
