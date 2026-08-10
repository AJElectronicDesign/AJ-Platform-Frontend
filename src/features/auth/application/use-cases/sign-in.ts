import type {
  LoginCredentials,
  SignInResult,
} from '@/features/auth/domain/entities/login-credentials'

/**
 * UI-ready sign-in use case.
 * Backend authentication will be connected in a later phase.
 */
export async function signIn(
  credentials: LoginCredentials,
): Promise<SignInResult> {
  void credentials

  return {
    success: false,
    message:
      'Login UI is ready. Authentication will be connected when the backend is available.',
  }
}
