import { beforeEach, describe, expect, it, vi } from 'vitest'
import { signIn } from '@/features/auth/application/use-cases/sign-in'
import type { LoginCredentials } from '@/features/auth/domain/entities/login-credentials'
import { AuthError } from '@/features/auth/domain/errors/auth-error'
import type {
  AuthRepository,
  AuthSession,
} from '@/features/auth/domain/repositories/auth-repository'

const session: AuthSession = {
  accessToken: 'token',
  expiresIn: 3600,
  user: {
    id: '1',
    email: 'ada@aj-electronic-design.com',
    name: 'Ada Lovelace',
    role: 'admin',
  },
}

function repository(
  login: (credentials: LoginCredentials) => Promise<AuthSession>,
): AuthRepository {
  return {
    login,
    currentUser: async () => null,
    logout: async () => undefined,
  }
}

describe('signIn', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the signed-in user', async () => {
    const result = await signIn(
      { email: 'ada@aj-electronic-design.com', password: 'secret' },
      repository(async () => session),
    )

    expect(result).toEqual({
      success: true,
      user: session.user,
      message: 'Signed in.',
    })
  })

  it('trims the email before calling the repository', async () => {
    let received = ''

    await signIn(
      { email: '  ada@aj-electronic-design.com  ', password: 'secret' },
      repository(async (credentials) => {
        received = credentials.email
        return session
      }),
    )

    expect(received).toBe('ada@aj-electronic-design.com')
  })

  it('maps invalid credentials', async () => {
    const result = await signIn(
      { email: 'ada@aj-electronic-design.com', password: 'nope' },
      repository(async () => {
        throw new AuthError('invalid_credentials', 'Invalid credentials')
      }),
    )

    expect(result).toMatchObject({
      success: false,
      code: 'invalid_credentials',
      message: 'Invalid email or password.',
    })
  })

  it('maps rate limiting', async () => {
    const result = await signIn(
      { email: 'ada@aj-electronic-design.com', password: 'secret' },
      repository(async () => {
        throw new AuthError('rate_limited', 'Too many requests')
      }),
    )

    expect(result).toMatchObject({
      success: false,
      code: 'rate_limited',
      message: 'Too many sign-in attempts. Please wait and try again.',
    })
  })

  it('maps network and unexpected failures', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const network = await signIn(
      { email: 'ada@aj-electronic-design.com', password: 'secret' },
      repository(async () => {
        throw new AuthError('network', 'Failed to fetch')
      }),
    )
    const unknown = await signIn(
      { email: 'ada@aj-electronic-design.com', password: 'secret' },
      repository(async () => {
        throw new Error('boom')
      }),
    )

    expect(network).toMatchObject({
      success: false,
      code: 'network',
      message: 'Network error. Check your connection and try again.',
    })
    expect(unknown).toMatchObject({
      success: false,
      code: 'unknown',
      message: 'Unable to sign in right now. Please try again.',
    })
  })
})
