export interface ApiErrorDetail {
  path: string
  message: string
  /**
   * Stable code on client `VALIDATION_ERROR` details.
   * Auth details stay `{ path, message }` and omit this.
   */
  code?: string
}

/**
 * Codes returned in `error.code`. The client branches on these, not on message text.
 * Transport failures that never reached the API use `network`.
 */
export const ApiErrorCode = {
  invalidCredentials: 'INVALID_CREDENTIALS',
  unauthorized: 'UNAUTHORIZED',
  tokenInvalid: 'TOKEN_INVALID',
  tokenExpired: 'TOKEN_EXPIRED',
  tokenRevoked: 'TOKEN_REVOKED',
  forbidden: 'FORBIDDEN',
  rateLimited: 'RATE_LIMITED',
  validationError: 'VALIDATION_ERROR',
  notFound: 'NOT_FOUND',
  payloadTooLarge: 'PAYLOAD_TOO_LARGE',
  internalError: 'INTERNAL_ERROR',
  network: 'network',
  unknown: 'UNKNOWN',
} as const

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode]

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details: readonly ApiErrorDetail[]

  constructor(
    status: number,
    message: string,
    code: string = ApiErrorCode.unknown,
    details: readonly ApiErrorDetail[] = [],
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export class ApiConfigError extends Error {
  readonly code = 'config' as const

  constructor(message: string) {
    super(message)
    this.name = 'ApiConfigError'
  }
}

/**
 * A 401 after a Bearer token was sent means the session is over
 * (`UNAUTHORIZED`, `TOKEN_INVALID`, `TOKEN_EXPIRED`, `TOKEN_REVOKED`).
 * `FORBIDDEN` (403) means the user is still signed in and the role is wrong.
 * Login's `INVALID_CREDENTIALS` does not end a session.
 */
export function endsAuthenticatedSession(
  error: ApiError,
  sentToken: boolean,
): boolean {
  if (!sentToken || error.status === 403 || error.code === ApiErrorCode.forbidden) {
    return false
  }

  return error.status === 401 && error.code !== ApiErrorCode.invalidCredentials
}
