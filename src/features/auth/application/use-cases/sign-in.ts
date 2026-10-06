import type {
  LoginCredentials,
  SignInResult,
} from '@/features/auth/domain/entities/login-credentials'
import { AuthError, type SignInErrorCode } from '@/features/auth/domain/errors/auth-error'
import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository'

/**
 * Signs in against the auth repository. User-facing copy lives in i18n;
 * this use case only returns a code the screen can translate.
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
    }
  } catch (error) {
    const code: SignInErrorCode = error instanceof AuthError ? error.code : 'unknown'

    if (code === 'network' || code === 'unavailable' || code === 'unknown') {
      console.error('Sign-in failed:', error)
    }

    return {
      success: false,
      code,
    }
  }
}
