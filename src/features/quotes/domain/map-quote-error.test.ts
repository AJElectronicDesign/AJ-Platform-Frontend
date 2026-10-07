import { describe, expect, it } from 'vitest'
import { mapQuoteError } from '@/features/quotes/domain/map-quote-error'
import { ApiError } from '@/shared/infrastructure/http/api-error'

describe('mapQuoteError', () => {
  it('keeps validation messages and detail codes on each path', () => {
    const mapped = mapQuoteError(
      new ApiError(400, 'Request validation failed', 'VALIDATION_ERROR', [
        { path: 'items.0.quantity', message: 'Debe ser mayor que cero', code: 'QUANTITY_NOT_POSITIVE' },
        { path: 'requestedByEmail', message: 'El correo no es válido', code: 'EMAIL_INVALID' },
        { path: 'notes', message: 'Mensaje no catalogado', code: 'NOT_A_REAL_CODE' },
        { path: '(root)', message: 'Se requiere al menos un campo' },
      ]),
    )

    expect(mapped.fieldMessages).toEqual({
      'items.0.quantity': 'Debe ser mayor que cero',
      requestedByEmail: 'El correo no es válido',
      notes: 'Mensaje no catalogado',
    })
    expect(mapped.fieldDetailCodes).toEqual({
      'items.0.quantity': 'QUANTITY_NOT_POSITIVE',
      requestedByEmail: 'EMAIL_INVALID',
      notes: 'NOT_A_REAL_CODE',
    })
    expect(mapped.bannerCode).toBeNull()
    expect(mapped.bannerMessage).toBe('Se requiere al menos un campo')
    expect(mapped.versionConflict).toBe(false)
  })

  it('falls back to the server message when a detail has no code', () => {
    const mapped = mapQuoteError(
      new ApiError(400, 'Request validation failed', 'VALIDATION_ERROR', [
        { path: 'requestedByEmail', message: 'Invalid email' },
      ]),
    )

    expect(mapped.fieldDetailCodes).toEqual({})
    expect(mapped.fieldMessages.requestedByEmail).toBe('Invalid email')
  })

  it('treats a row-version conflict as someone else editing the quote', () => {
    const mapped = mapQuoteError(
      new ApiError(409, 'The quote was updated by someone else', 'QUOTE_VERSION_CONFLICT', [
        { path: 'version', message: 'The quote was updated by someone else' },
      ]),
    )

    expect(mapped.versionConflict).toBe(true)
    expect(mapped.bannerCode).toBe('version_conflict')
    expect(mapped.fieldMessages).toEqual({})
  })

  it('maps quote conflicts onto fields and banners without showing the English status text', () => {
    const empty = mapQuoteError(
      new ApiError(409, 'A quote needs at least one line item before it can be sent', 'QUOTE_EMPTY', [
        { path: 'items', message: 'A quote needs at least one line item before it can be sent' },
      ]),
    )
    const expired = mapQuoteError(
      new ApiError(409, 'An expired quote cannot be accepted', 'QUOTE_EXPIRED', [
        { path: 'validUntil', message: 'An expired quote cannot be accepted' },
      ]),
    )
    const inactive = mapQuoteError(
      new ApiError(409, 'Client is inactive', 'CLIENT_INACTIVE', [
        { path: 'clientId', message: 'Client is inactive' },
      ]),
    )
    const locked = mapQuoteError(
      new ApiError(409, 'Only a draft quote can be edited', 'QUOTE_NOT_EDITABLE', [
        { path: 'status', message: 'Only a draft quote can be edited' },
      ]),
    )

    expect(empty.fieldCodes.items).toBe('QUOTE_EMPTY')
    expect(empty.fieldMessages.items).toBe(
      'A quote needs at least one line item before it can be sent',
    )
    expect(empty.bannerCode).toBe('empty')
    expect(expired.fieldCodes.validUntil).toBe('QUOTE_EXPIRED')
    expect(expired.bannerCode).toBe('expired')
    expect(inactive.fieldCodes.clientId).toBe('CLIENT_INACTIVE')
    expect(inactive.bannerCode).toBe('client_inactive')
    expect(locked.bannerCode).toBe('not_editable')
    expect(locked.fieldMessages).toEqual({})
  })

  it('maps transport failures and aborts', () => {
    expect(mapQuoteError(new ApiError(0, 'Failed to fetch', 'network')).bannerCode).toBe('network')
    expect(mapQuoteError(new DOMException('Aborted', 'AbortError')).aborted).toBe(true)
    expect(mapQuoteError(new ApiError(404, 'Quote not found', 'QUOTE_NOT_FOUND')).bannerCode).toBe(
      'not_found',
    )
    expect(mapQuoteError(new ApiError(404, 'Client not found', 'CLIENT_NOT_FOUND')).bannerCode).toBe(
      'client_not_found',
    )
  })
})
