import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { createApp } from './app.js'
import { connectDatabase } from './config/database.js'
import { env } from './config/env.js'
import { OrderStatusScheduler } from './realtime/order-status.scheduler.js'
import { MemoryOrderRepository } from './repositories/memory-order.repository.js'
import { MongoOrderRepository } from './repositories/mongo-order.repository.js'
import { OrderService } from './services/order.service.js'

export async function createServerApp() {
  const connected = await connectDatabase(env.mongodbUri)
  const repository = connected ? new MongoOrderRepository() : new MemoryOrderRepository()
  const httpServer = createServer()
  const io = new Server(httpServer, { cors: { origin: env.clientOrigin } })
  const service = new OrderService(repository)
  const scheduler = new OrderStatusScheduler(service, io)
  const app = createApp(service, scheduler, io)
  httpServer.on('request', app)
  return { app, httpServer, io }
}

export async function startServer() {
  const { httpServer } = await createServerApp()
  httpServer.listen(env.port, () => console.log(`Crave API listening on http://localhost:${env.port}`))
}
