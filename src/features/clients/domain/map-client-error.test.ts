import { describe, expect, it } from 'vitest'
import { mapClientError } from '@/features/clients/domain/map-client-error'
import { ApiError } from '@/shared/infrastructure/http/api-error'

describe('mapClientError', () => {
  it('keeps backend validation messages on each field path', () => {
    const mapped = mapClientError(
      new ApiError(400, 'Request validation failed', 'VALIDATION_ERROR', [
        { path: 'address.street', message: 'Too big: expected string to have <=200 characters' },
        { path: 'phone', message: 'phone and phoneCountryCode must both be set or both be empty' },
        { path: '(root)', message: 'At least one field is required' },
      ]),
    )

    expect(mapped.fieldMessages).toEqual({
      'address.street': 'Too big: expected string to have <=200 characters',
      phone: 'phone and phoneCountryCode must both be set or both be empty',
    })
    expect(mapped.bannerCode).toBeNull()
    expect(mapped.bannerMessage).toBe('At least one field is required')
    expect(mapped.versionConflict).toBe(false)
  })

  it('maps a duplicate RFC to the RFC field when the API sends no details', () => {
    const mapped = mapClientError(
      new ApiError(409, 'A client with this RFC already exists', 'CLIENT_RFC_EXISTS'),
    )

    expect(mapped.fieldCodes.rfc).toBe('CLIENT_RFC_EXISTS')
    expect(mapped.fieldMessages).toEqual({})
    expect(mapped.bannerCode).toBeNull()
    expect(mapped.versionConflict).toBe(false)
  })

  it('maps a quote-prefix conflict to that field', () => {
    const mapped = mapClientError(
      new ApiError(
        409,
        'A client with this quote prefix already exists',
        'CLIENT_QUOTE_PREFIX_EXISTS',
      ),
    )

    expect(mapped.fieldCodes.quotePrefix).toBe('CLIENT_QUOTE_PREFIX_EXISTS')
    expect(mapped.bannerCode).toBeNull()
  })

  it('treats a row-version conflict as someone else editing the client', () => {
    const mapped = mapClientError(
      new ApiError(409, 'The client was updated by someone else', 'CLIENT_VERSION_CONFLICT', [
        { path: 'version', message: 'The client was updated by someone else' },
      ]),
    )

    expect(mapped.versionConflict).toBe(true)
    expect(mapped.bannerCode).toBe('version_conflict')
    expect(mapped.fieldMessages).toEqual({})
  })

  it('maps logo, contact, and transport failures to banner codes', () => {
    expect(
      mapClientError(new ApiError(413, 'Logo must be at most 1 MB', 'LOGO_TOO_LARGE')).bannerCode,
    ).toBe('logo_too_large')
    expect(
      mapClientError(new ApiError(415, 'Logo must be a PNG, JPEG, or WebP image', 'LOGO_UNSUPPORTED_TYPE'))
        .bannerCode,
    ).toBe('logo_unsupported')
    expect(
      mapClientError(new ApiError(409, 'Another contact is already primary', 'CONTACT_PRIMARY_CONFLICT'))
        .fieldCodes.isPrimary,
    ).toBe('CONTACT_PRIMARY_CONFLICT')
    expect(mapClientError(new ApiError(0, 'Failed to fetch', 'network')).bannerCode).toBe('network')
    expect(mapClientError(new DOMException('Aborted', 'AbortError')).aborted).toBe(true)
  })
})
