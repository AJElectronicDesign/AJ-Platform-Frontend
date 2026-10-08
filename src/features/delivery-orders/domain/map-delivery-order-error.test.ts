import { describe, expect, it } from 'vitest'
import { mapDeliveryOrderError } from '@/features/delivery-orders/domain/map-delivery-order-error'
import { mapLineQuantityErrors } from '@/features/delivery-orders/domain/validation'
import { ApiError } from '@/shared/infrastructure/http/api-error'

describe('mapDeliveryOrderError', () => {
  it('keeps DELIVERY_QUANTITY_EXCEEDS_PENDING on lines.{i}.quantity', () => {
    const mapped = mapDeliveryOrderError(
      new ApiError(409, 'La cantidad supera lo pendiente por entregar', 'DELIVERY_QUANTITY_EXCEEDS_PENDING', [
        {
          path: 'lines.0.quantity',
          message: 'La cantidad supera lo pendiente por entregar (1.5000)',
          code: 'DELIVERY_QUANTITY_EXCEEDS_PENDING',
        },
      ]),
    )

    expect(mapped.fieldMessages).toEqual({
      'lines.0.quantity': 'La cantidad supera lo pendiente por entregar (1.5000)',
    })
    expect(mapped.fieldDetailCodes['lines.0.quantity']).toBe('DELIVERY_QUANTITY_EXCEEDS_PENDING')
    expect(mapped.bannerCode).toBeNull()
    expect(mapLineQuantityErrors(mapped.fieldMessages, ['line-1'])).toEqual({
      'line-1': 'La cantidad supera lo pendiente por entregar (1.5000)',
    })
  })

  it('puts certificate prefix conflicts on the prefix field', () => {
    const taken = mapDeliveryOrderError(
      new ApiError(409, 'Ese prefijo ya lo usa otro cliente', 'CERTIFICATE_PREFIX_TAKEN', [
        { path: 'certificatePrefix', message: 'Ese prefijo ya lo usa otro cliente', code: 'CERTIFICATE_PREFIX_TAKEN' },
      ]),
    )
    const locked = mapDeliveryOrderError(
      new ApiError(409, 'El prefijo no se puede cambiar cuando ya hay entregas', 'CERTIFICATE_PREFIX_LOCKED', [
        { path: 'certificatePrefix', message: 'El prefijo no se puede cambiar cuando ya hay entregas', code: 'CERTIFICATE_PREFIX_LOCKED' },
      ]),
    )
    const invalid = mapDeliveryOrderError(
      new ApiError(400, 'Request validation failed', 'VALIDATION_ERROR', [
        {
          path: 'certificatePrefix',
          message: 'Debe tener de 2 a 12 letras o dígitos y terminar con una letra',
          code: 'CERTIFICATE_PREFIX_INVALID',
        },
      ]),
    )

    expect(taken.fieldCodes.certificatePrefix).toBe('CERTIFICATE_PREFIX_TAKEN')
    expect(taken.fieldMessages.certificatePrefix).toBe('Ese prefijo ya lo usa otro cliente')
    expect(locked.fieldCodes.certificatePrefix).toBe('CERTIFICATE_PREFIX_LOCKED')
    expect(invalid.fieldDetailCodes.certificatePrefix).toBe('CERTIFICATE_PREFIX_INVALID')
    expect(invalid.fieldCodes.certificatePrefix).toBe('CERTIFICATE_PREFIX_INVALID')
  })

  it('maps a due date before the start date onto dueDate', () => {
    const mapped = mapDeliveryOrderError(
      new ApiError(400, 'Request validation failed', 'VALIDATION_ERROR', [
        {
          path: 'dueDate',
          message: 'La fecha compromiso no puede ser anterior a la fecha de inicio',
          code: 'DUE_BEFORE_START',
        },
      ]),
    )

    expect(mapped.fieldMessages.dueDate).toBe('La fecha compromiso no puede ser anterior a la fecha de inicio')
    expect(mapped.fieldDetailCodes.dueDate).toBe('DUE_BEFORE_START')
    expect(mapped.bannerCode).toBeNull()
  })

  it('treats a concurrent update as retryable', () => {
    const mapped = mapDeliveryOrderError(
      new ApiError(409, 'Otro cambio está en curso. Intenta de nuevo.', 'CONCURRENT_UPDATE', [
        { path: '', message: 'Otro cambio está en curso. Intenta de nuevo.', code: 'CONCURRENT_UPDATE' },
      ]),
    )

    expect(mapped.retryable).toBe(true)
    expect(mapped.bannerCode).toBe('concurrent_update')
    expect(mapped.fieldMessages).toEqual({})
  })
})
