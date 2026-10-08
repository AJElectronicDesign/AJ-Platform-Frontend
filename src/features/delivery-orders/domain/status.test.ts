import { describe, expect, it } from 'vitest'
import { DELIVERY_STATUS_CHIP_CLASS, DELIVERY_STATUS_TONE, deliveryStatusTone } from '@/features/delivery-orders/domain/status'

describe('delivery status chip', () => {
  it('maps each status to the semaphore color', () => {
    expect(deliveryStatusTone('pending')).toBe('red')
    expect(deliveryStatusTone('partial')).toBe('orange')
    expect(deliveryStatusTone('completed')).toBe('green')
    expect(deliveryStatusTone('cancelled')).toBe('gray')
    expect(DELIVERY_STATUS_TONE).toEqual({
      pending: 'red',
      partial: 'orange',
      completed: 'green',
      cancelled: 'gray',
    })
  })

  it('uses a distinct chip class for each tone', () => {
    expect(DELIVERY_STATUS_CHIP_CLASS.red).toContain('bg-red-50')
    expect(DELIVERY_STATUS_CHIP_CLASS.orange).toContain('bg-orange-50')
    expect(DELIVERY_STATUS_CHIP_CLASS.green).toContain('bg-emerald-50')
    expect(DELIVERY_STATUS_CHIP_CLASS.gray).toContain('bg-zinc-100')
  })
})
