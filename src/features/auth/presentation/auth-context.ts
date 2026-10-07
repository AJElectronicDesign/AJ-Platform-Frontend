import { createContext } from 'react'
import type {
  LoginCredentials,
  SignInResult,
} from '@/features/auth/domain/entities/login-credentials'
import type { SessionErrorCode } from '@/features/auth/domain/errors/auth-error'
import type { AuthUser, UserRole } from '@/features/auth/domain/entities/user'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error'

export interface AuthContextValue {
  user: AuthUser | null
  role: UserRole | null
  status: AuthStatus
  sessionError: SessionErrorCode | null
  signIn: (credentials: LoginCredentials) => Promise<SignInResult>
  signOut: () => Promise<void>
  retry: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
