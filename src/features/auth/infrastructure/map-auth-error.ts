import { AuthError } from '@/features/auth/domain/errors/auth-error'
import { ApiConfigError, ApiError, ApiErrorCode } from '@/shared/infrastructure/http/api-error'

export function toAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) {
    return error
  }

  if (error instanceof ApiConfigError) {
    return new AuthError('unknown', error.message)
  }

  if (error instanceof ApiError) {
    if (error.code === ApiErrorCode.invalidCredentials) {
      return new AuthError('invalid_credentials', error.message)
    }

    if (error.code === ApiErrorCode.rateLimited) {
      return new AuthError('rate_limited', error.message)
    }

    if (error.status === 0 || error.code === ApiErrorCode.network) {
      return new AuthError('network', error.message)
    }

    return new AuthError('unknown', error.message)
  }

  if (error instanceof TypeError) {
    return new AuthError('network', error.message)
  }

  return new AuthError('unknown', 'Unexpected authentication error.')
}
