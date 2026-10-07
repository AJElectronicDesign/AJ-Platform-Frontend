import { describe, expect, it } from 'vitest'
import { mapClientError } from '@/features/clients/domain/map-client-error'
import { mappedToFieldErrors } from '@/features/clients/presentation/messages'
import { clients as en } from '@/shared/i18n/locales/en/clients'
import { clients as es } from '@/shared/i18n/locales/es/clients'
import { ApiError } from '@/shared/infrastructure/http/api-error'

describe('mappedToFieldErrors', () => {
  it('translates a known detail code and falls back to the server message', () => {
    const mapped = mapClientError(
      new ApiError(400, 'Request validation failed', 'VALIDATION_ERROR', [
        {
          path: 'phone',
          message: 'El teléfono y la clave de país deben indicarse juntos o dejarse vacíos',
          code: 'PHONE_PAIR_REQUIRED',
        },
        { path: 'notes', message: 'Mensaje no catalogado', code: 'NOT_A_REAL_CODE' },
        { path: 'email', message: 'Invalid email' },
      ]),
    )

    expect(mappedToFieldErrors(en, mapped)).toEqual({
      phone: en.detailCodes.PHONE_PAIR_REQUIRED,
      notes: 'Mensaje no catalogado',
      email: 'Invalid email',
    })
    expect(mappedToFieldErrors(es, mapped).phone).toBe(es.detailCodes.PHONE_PAIR_REQUIRED)
    expect(mappedToFieldErrors(es, mapped).email).toBe('Invalid email')
  })

  it('uses the conflict translation when details name the field', () => {
    const mapped = mapClientError(
      new ApiError(409, 'A client with this RFC already exists', 'CLIENT_RFC_EXISTS', [
        { path: 'rfc', message: 'A client with this RFC already exists' },
      ]),
    )

    expect(mappedToFieldErrors(es, mapped).rfc).toBe(es.errors.rfcExists)
    expect(mappedToFieldErrors(en, mapped).rfc).toBe(en.errors.rfcExists)
  })

  it('still translates a conflict that arrives without a path', () => {
    const mapped = mapClientError(
      new ApiError(409, 'A client with this quote prefix already exists', 'CLIENT_QUOTE_PREFIX_EXISTS'),
    )

    expect(mappedToFieldErrors(es, mapped)).toEqual({ quotePrefix: es.errors.quotePrefixExists })
  })
})
