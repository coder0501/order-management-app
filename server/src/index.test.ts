import request from 'supertest'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from './app.js'
import { OrderStatusScheduler } from './realtime/order-status.scheduler.js'
import { MemoryOrderRepository } from './repositories/memory-order.repository.js'
import { OrderService } from './services/order.service.js'

describe('order API', () => {
  let orderId = ''
  const io = new Server(createServer())
  const service = new OrderService(new MemoryOrderRepository())
  const scheduler = new OrderStatusScheduler(service, io)
  const app = createApp(service, scheduler, io)

  beforeEach(async () => {
    const response = await request(app).post('/api/orders').send({
      customer: { name: 'Test User', address: '12 Willow Street', phone: '555-123-4567' },
      items: [{ menuItemId: 1, quantity: 2 }],
    })
    orderId = response.body.data.id
  })

  it('returns the menu', async () => {
    const response = await request(app).get('/api/menu')
    expect(response.status).toBe(200)
    expect(response.body.data).toHaveLength(6)
  })

  it('rejects invalid customer details', async () => {
    const response = await request(app).post('/api/orders').send({ customer: { name: 'A' }, items: [] })
    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Invalid order details')
  })

  it('rejects unavailable menu items', async () => {
    const response = await request(app).post('/api/orders').send({ customer: { name: 'Test User', address: '12 Willow Street', phone: '555-123-4567' }, items: [{ menuItemId: 99, quantity: 1 }] })
    expect(response.status).toBe(400)
    expect(response.body.error).toContain('unavailable')
  })

  it('creates and retrieves an order', async () => {
    const response = await request(app).get(`/api/orders/${orderId}`)
    expect(response.status).toBe(200)
    expect(response.body.data.total).toBe(38.5)
    expect(response.body.data.status).toBe('received')
  })

  it('updates an order status', async () => {
    const response = await request(app).patch(`/api/orders/${orderId}/status`).send({ status: 'preparing' })
    expect(response.status).toBe(200)
    expect(response.body.data.status).toBe('preparing')
  })

  it('deletes an order', async () => {
    const response = await request(app).delete(`/api/orders/${orderId}`)
    expect(response.status).toBe(204)
    const lookup = await request(app).get(`/api/orders/${orderId}`)
    expect(lookup.status).toBe(404)
  })
})