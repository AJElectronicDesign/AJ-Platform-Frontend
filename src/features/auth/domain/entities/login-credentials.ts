import type { SignInErrorCode } from '@/features/auth/domain/errors/auth-error'
import type { AuthUser } from '@/features/auth/domain/entities/user'

export interface LoginCredentials {
  email: string
  password: string
}

export type SignInResult =
  | {
      success: true
      user: AuthUser
      message: string
    }
  | {
      success: false
      code: SignInErrorCode
      message: string
    }
