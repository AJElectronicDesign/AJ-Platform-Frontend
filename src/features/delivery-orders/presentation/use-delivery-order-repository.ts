import { useState } from 'react'
import type { DeliveryOrderRepository } from '@/features/delivery-orders/domain/delivery-order-repository'
import { createDeliveryOrderRepository } from '@/features/delivery-orders/infrastructure/create-delivery-order-repository'

export function useDeliveryOrderRepository(): DeliveryOrderRepository {
  const [repository] = useState(createDeliveryOrderRepository)
  return repository
}
