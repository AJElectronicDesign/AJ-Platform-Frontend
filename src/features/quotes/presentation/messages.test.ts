import { describe, expect, it } from 'vitest'
import { mapQuoteError } from '@/features/quotes/domain/map-quote-error'
import { mappedToFieldErrors, quoteBannerMessage } from '@/features/quotes/presentation/messages'
import { quotes as en } from '@/shared/i18n/locales/en/quotes'
import { quotes as es } from '@/shared/i18n/locales/es/quotes'
import { ApiError } from '@/shared/infrastructure/http/api-error'

describe('mappedToFieldErrors', () => {
  it('translates a known detail code and falls back to the server message', () => {
    const mapped = mapQuoteError(
      new ApiError(400, 'Request validation failed', 'VALIDATION_ERROR', [
        {
          path: 'items.0.quantity',
          message: 'Debe ser mayor que cero',
          code: 'QUANTITY_NOT_POSITIVE',
        },
        { path: 'notes', message: 'Mensaje no catalogado', code: 'NOT_A_REAL_CODE' },
        { path: 'requestedByEmail', message: 'Invalid email' },
      ]),
    )

    expect(mappedToFieldErrors(en, mapped)).toEqual({
      'items.0.quantity': en.detailCodes.QUANTITY_NOT_POSITIVE,
      notes: 'Mensaje no catalogado',
      requestedByEmail: 'Invalid email',
    })
    expect(mappedToFieldErrors(es, mapped)['items.0.quantity']).toBe(
      es.detailCodes.QUANTITY_NOT_POSITIVE,
    )
    expect(mappedToFieldErrors(es, mapped).requestedByEmail).toBe('Invalid email')
  })

  it('uses the conflict translation when details name the field', () => {
    const mapped = mapQuoteError(
      new ApiError(409, 'Client is inactive', 'CLIENT_INACTIVE', [
        { path: 'clientId', message: 'Client is inactive' },
      ]),
    )

    expect(mappedToFieldErrors(es, mapped).clientId).toBe(es.errors.clientInactive)
    expect(mappedToFieldErrors(en, mapped).clientId).toBe(en.errors.clientInactive)
    expect(quoteBannerMessage(es, mapped)).toBe(es.errors.clientInactive)
  })

  it('translates an empty quote even when the server message is English', () => {
    const mapped = mapQuoteError(
      new ApiError(409, 'A quote needs at least one line item before it can be sent', 'QUOTE_EMPTY', [
        { path: 'items', message: 'A quote needs at least one line item before it can be sent' },
      ]),
    )

    expect(mappedToFieldErrors(es, mapped).items).toBe(es.errors.empty)
    expect(quoteBannerMessage(en, mapped)).toBe(en.errors.empty)
  })

  it('translates a version conflict as a banner and keeps version off the fields', () => {
    const mapped = mapQuoteError(
      new ApiError(409, 'The quote was updated by someone else', 'QUOTE_VERSION_CONFLICT', [
        { path: 'version', message: 'The quote was updated by someone else' },
      ]),
    )

    expect(mappedToFieldErrors(es, mapped)).toEqual({})
    expect(quoteBannerMessage(es, mapped)).toBe(es.errors.versionConflict)
    expect(quoteBannerMessage(en, mapped)).toBe(en.errors.versionConflict)
  })
})
