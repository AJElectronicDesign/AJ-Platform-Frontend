import type { DeliveryOrderRepository } from '@/features/delivery-orders/domain/delivery-order-repository'
import { HttpDeliveryOrderRepository } from '@/features/delivery-orders/infrastructure/http-delivery-order-repository'

export function createDeliveryOrderRepository(): DeliveryOrderRepository {
  return new HttpDeliveryOrderRepository()
}
