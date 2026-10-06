import type {
  LoginCredentials,
  SignInResult,
} from '@/features/auth/domain/entities/login-credentials'
import { AuthError, type SignInErrorCode } from '@/features/auth/domain/errors/auth-error'
import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository'

const messages: Record<SignInErrorCode, string> = {
  invalid_credentials: 'Invalid email or password.',
  rate_limited: 'Too many sign-in attempts. Please wait and try again.',
  network: 'Network error. Check your connection and try again.',
  unknown: 'Unable to sign in right now. Please try again.',
}

/**
 * Signs in against the auth repository and maps transport failures
 * to UI-ready results.
 */
export async function signIn(
  credentials: LoginCredentials,
  repository: AuthRepository,
): Promise<SignInResult> {
  try {
    const session = await repository.login({
      email: credentials.email.trim(),
      password: credentials.password,
    })

    return {
      success: true,
      user: session.user,
      message: 'Signed in.',
    }
  } catch (error) {
    const code: SignInErrorCode = error instanceof AuthError ? error.code : 'unknown'

    if (code === 'network' || code === 'unknown') {
      console.error('Sign-in failed:', error)
    }

    return {
      success: false,
      code,
      message: messages[code],
    }
  }
}
