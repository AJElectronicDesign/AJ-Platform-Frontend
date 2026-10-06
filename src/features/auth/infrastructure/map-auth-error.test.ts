import { describe, expect, it } from 'vitest'
import { toAuthError } from '@/features/auth/infrastructure/map-auth-error'
import { ApiError } from '@/shared/infrastructure/http/api-error'

describe('toAuthError', () => {
  it('maps login failures by error.code', () => {
    expect(
      toAuthError(new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS')).code,
    ).toBe('invalid_credentials')
    expect(
      toAuthError(new ApiError(429, 'Too many login attempts. Try again later.', 'RATE_LIMITED'))
        .code,
    ).toBe('rate_limited')
  })

  it('does not treat token or role failures as a bad password', () => {
    expect(toAuthError(new ApiError(401, 'Access token has expired', 'TOKEN_EXPIRED')).code).toBe(
      'unknown',
    )
    expect(toAuthError(new ApiError(401, 'Access token was revoked', 'TOKEN_REVOKED')).code).toBe(
      'unknown',
    )
    expect(
      toAuthError(
        new ApiError(403, 'You do not have permission to perform this action', 'FORBIDDEN'),
      ).code,
    ).toBe('unknown')
  })

  it('maps server failures to an unavailable session', () => {
    expect(toAuthError(new ApiError(500, 'Internal error', 'INTERNAL_ERROR')).code).toBe(
      'unavailable',
    )
  })
})
