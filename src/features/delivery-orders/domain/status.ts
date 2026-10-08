import type { DeliveryOrderStatus } from '@/features/delivery-orders/domain/delivery-order'

/** Semaphore used by the status chip: pendiente rojo, parcial naranja, completada verde, cancelada gris. */
export const DELIVERY_STATUS_TONE = {
  pending: 'red',
  partial: 'orange',
  completed: 'green',
  cancelled: 'gray',
} as const

export type DeliveryStatusTone = (typeof DELIVERY_STATUS_TONE)[DeliveryOrderStatus]

export function deliveryStatusTone(status: DeliveryOrderStatus): DeliveryStatusTone {
  return DELIVERY_STATUS_TONE[status]
}

export const DELIVERY_STATUS_CHIP_CLASS: Record<DeliveryStatusTone, string> = {
  red: 'bg-red-50 text-red-800',
  orange: 'bg-orange-50 text-orange-800',
  green: 'bg-emerald-50 text-emerald-800',
  gray: 'bg-zinc-100 text-zinc-600',
}
