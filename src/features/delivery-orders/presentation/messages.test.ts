import { describe, expect, it } from 'vitest'
import { mapDeliveryOrderError } from '@/features/delivery-orders/domain/map-delivery-order-error'
import { deliverySubmitBanner, mappedToFieldErrors } from '@/features/delivery-orders/presentation/messages'
import { deliveryOrders } from '@/shared/i18n/locales/es/delivery-orders'
import { ApiError } from '@/shared/infrastructure/http/api-error'

describe('deliverySubmitBanner', () => {
  it('falls back to the Spanish message when the detail path is not a field', () => {
    const mapped = mapDeliveryOrderError(
      new ApiError(400, 'Request validation failed', 'VALIDATION_ERROR', [
        {
          path: 'lines.0.orderItemId',
          message: 'La partida no pertenece a esta orden.',
          code: 'ORDER_LINE_NOT_FOUND',
        },
        {
          path: 'lines.1.orderItemId',
          message: 'La partida ya está en esta entrega.',
          code: 'DUPLICATE_ORDER_LINE',
        },
      ]),
    )
    const fields = mappedToFieldErrors(deliveryOrders, mapped)

    expect(mapped.bannerCode).toBeNull()
    expect(deliverySubmitBanner(deliveryOrders, mapped, fields, ['line-1', 'line-2'])).toBe(
      'La partida no pertenece a esta orden. La partida ya está en esta entrega.',
    )
  })

  it('leaves a rendered quantity error off the banner', () => {
    const mapped = mapDeliveryOrderError(
      new ApiError(409, 'La cantidad supera lo pendiente por entregar', 'DELIVERY_QUANTITY_EXCEEDS_PENDING', [
        {
          path: 'lines.0.quantity',
          message: 'La cantidad supera lo pendiente por entregar (1.5000)',
          code: 'DELIVERY_QUANTITY_EXCEEDS_PENDING',
        },
      ]),
    )
    const fields = mappedToFieldErrors(deliveryOrders, mapped)

    expect(deliverySubmitBanner(deliveryOrders, mapped, fields, ['line-1'])).toBeNull()
  })

  it('banners a quantity error whose index does not match a submitted line', () => {
    const mapped = mapDeliveryOrderError(
      new ApiError(409, 'La cantidad supera lo pendiente por entregar', 'DELIVERY_QUANTITY_EXCEEDS_PENDING', [
        {
          path: 'lines.3.quantity',
          message: 'La cantidad supera lo pendiente por entregar (1.5000)',
          code: 'DELIVERY_QUANTITY_EXCEEDS_PENDING',
        },
      ]),
    )
    const fields = mappedToFieldErrors(deliveryOrders, mapped)

    expect(deliverySubmitBanner(deliveryOrders, mapped, fields, ['line-1'])).toBe(
      'La cantidad supera lo pendiente por entregar (1.5000)',
    )
  })

  it('keeps the status banner and appends an undisplayed detail', () => {
    const mapped = mapDeliveryOrderError(
      new ApiError(409, 'No se puede modificar una orden de entrega cancelada.', 'DELIVERY_ORDER_CANCELLED', [
        {
          path: 'lines.0.orderItemId',
          message: 'La partida no pertenece a esta orden.',
          code: 'ORDER_LINE_NOT_FOUND',
        },
      ]),
    )
    const fields = mappedToFieldErrors(deliveryOrders, mapped)

    expect(deliverySubmitBanner(deliveryOrders, mapped, fields, ['line-1'])).toBe(
      'No se puede modificar una orden de entrega cancelada. La partida no pertenece a esta orden.',
    )
  })
})
