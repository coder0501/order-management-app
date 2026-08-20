import cors from 'cors'
import express from 'express'
import type { Server } from 'socket.io'
import { menuRouter } from './routes/menu.routes.js'
import { createOrderRouter } from './routes/order.routes.js'
import type { OrderStatusScheduler } from './realtime/order-status.scheduler.js'
import type { OrderService } from './services/order.service.js'

export function createApp(service: OrderService, scheduler: OrderStatusScheduler, io: Server) {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.get('/', (_request, response) => response.json({ name: 'Crave Order API', status: 'ok' }))
  app.get('/health', (_request, response) => response.json({ ok: true }))
  app.use('/api/menu', menuRouter)
  app.use('/api/orders', createOrderRouter(service, scheduler))
  io.on('connection', (socket) => socket.on('order:watch', (orderId: string) => socket.join(orderId)))
  return app
}
