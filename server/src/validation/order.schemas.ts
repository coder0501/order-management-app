import { z } from 'zod'
import { orderStatuses } from '../domain/order.js'

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2),
    address: z.string().trim().min(5),
    phone: z.string().trim().regex(/^[0-9 +()-]{8,}$/),
  }),
  items: z.array(z.object({ menuItemId: z.number().int(), quantity: z.number().int().min(1).max(20) })).min(1),
})

export const updateOrderStatusSchema = z.object({ status: z.enum(orderStatuses) })
export type CreateOrderInput = z.infer<typeof createOrderSchema>
