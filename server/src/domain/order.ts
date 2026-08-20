export const orderStatuses = ['received', 'preparing', 'out_for_delivery'] as const
export type OrderStatus = typeof orderStatuses[number]

export type CustomerDetails = { name: string; address: string; phone: string }
export type RequestedOrderItem = { menuItemId: number; quantity: number }
export type PricedOrderItem = RequestedOrderItem & { price: number }
export type Order = { id: string; customer: CustomerDetails; items: PricedOrderItem[]; status: OrderStatus; total: number; createdAt: Date }
