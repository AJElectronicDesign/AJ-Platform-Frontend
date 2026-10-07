import type { LoginCredentials } from '@/features/auth/domain/entities/login-credentials'
import type { AuthUser } from '@/features/auth/domain/entities/user'
import { AuthError } from '@/features/auth/domain/errors/auth-error'
import type {
  AuthRepository,
  AuthSession,
} from '@/features/auth/domain/repositories/auth-repository'
import { authSession } from '@/features/auth/infrastructure/auth-session'
import { accessToken } from '@/shared/infrastructure/http/access-token'

/** Dev-only account used when `npm run dev` runs with `VITE_AUTH_MOCK=true`. */
export const mockAuthUser: AuthUser = {
  id: 'user_demo',
  email: 'demo@aj-electronic-design.com',
  name: 'Demo User',
  role: 'admin',
}

const MOCK_PASSWORD = 'mock-password'
const MOCK_TOKEN_PREFIX = 'mock.'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export class MockAuthRepository implements AuthRepository {
  hasSession(): boolean {
    return authSession.hasSession()
  }

  sessionExpiresAt(): number | null {
    return authSession.sessionExpiresAt()
  }

  clearLocalSession(): void {
    authSession.clearLocalSession()
  }

  expireLocalSession(): void {
    authSession.expireLocalSession()
  }

  subscribe(listener: () => void): () => void {
    return authSession.subscribe(listener)
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await delay(250)

    const email = credentials.email.trim().toLowerCase()

    if (email === 'limited@aj-electronic-design.com') {
      throw new AuthError('rate_limited', 'Too many requests')
    }

    if (email === 'offline@aj-electronic-design.com') {
      throw new AuthError('network', 'Network error')
    }

    if (email !== mockAuthUser.email || credentials.password !== MOCK_PASSWORD) {
      throw new AuthError('invalid_credentials', 'Invalid credentials')
    }

    const token = `${MOCK_TOKEN_PREFIX}${mockAuthUser.id}`
    const expiresIn = 60 * 60

    accessToken.save(token, expiresIn)

    return {
      accessToken: token,
      expiresIn,
      user: mockAuthUser,
    }
  }

  async currentUser(): Promise<AuthUser | null> {
    const token = accessToken.read()

    if (!token?.startsWith(MOCK_TOKEN_PREFIX)) {
      if (token) {
        accessToken.clear()
      }

      return null
    }

    return mockAuthUser
  }

  async logout(): Promise<void> {
    accessToken.clear()
  }
}
