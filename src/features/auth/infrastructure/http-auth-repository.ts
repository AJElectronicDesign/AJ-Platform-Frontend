import type { LoginCredentials } from '@/features/auth/domain/entities/login-credentials'
import type { AuthUser } from '@/features/auth/domain/entities/user'
import { AuthError } from '@/features/auth/domain/errors/auth-error'
import type {
  AuthRepository,
  AuthSession,
} from '@/features/auth/domain/repositories/auth-repository'
import { accessToken } from '@/shared/infrastructure/http/access-token'
import { ApiError } from '@/shared/infrastructure/http/api-error'
import { httpRequest } from '@/shared/infrastructure/http/http-client'
import { toAuthError } from '@/features/auth/infrastructure/map-auth-error'
import { parseAuthUser } from '@/features/auth/infrastructure/parse-auth-user'

interface LoginResponse {
  accessToken?: unknown
  expiresIn?: unknown
  user?: unknown
}

interface CurrentUserResponse {
  user?: unknown
}

export class HttpAuthRepository implements AuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    try {
      const data = await httpRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
        },
        auth: false,
        handleUnauthorized: false,
      })

      if (typeof data?.accessToken !== 'string' || data.accessToken.length === 0) {
        throw new AuthError(
          'unknown',
          'Login response did not include an access token.',
        )
      }

      if (
        typeof data.expiresIn !== 'number' ||
        !Number.isFinite(data.expiresIn) ||
        data.expiresIn <= 0
      ) {
        throw new AuthError('unknown', 'Login response did not include expiresIn.')
      }

      const user = parseAuthUser(data.user)
      const expiresIn = data.expiresIn

      accessToken.save(data.accessToken, expiresIn)

      return {
        accessToken: data.accessToken,
        expiresIn,
        user,
      }
    } catch (error) {
      throw toAuthError(error)
    }
  }

  async currentUser(): Promise<AuthUser | null> {
    if (!accessToken.read()) {
      return null
    }

    try {
      const data = await httpRequest<CurrentUserResponse>('/auth/me', {
        handleUnauthorized: false,
      })

      return parseAuthUser(data?.user)
    } catch (error) {
      // 401: UNAUTHORIZED, TOKEN_INVALID, TOKEN_EXPIRED, TOKEN_REVOKED.
      // 403 FORBIDDEN is not a logged-out session; keep the token.
      if (error instanceof ApiError && error.status === 401) {
        accessToken.clear()
        return null
      }

      throw toAuthError(error)
    }
  }

  async logout(): Promise<void> {
    try {
      if (accessToken.read()) {
        await httpRequest('/auth/logout', {
          method: 'POST',
          handleUnauthorized: false,
        })
      }
    } catch (error) {
      if (!(error instanceof ApiError)) {
        console.error('Logout request failed:', error)
      }
    } finally {
      accessToken.clear()
    }
  }
}
