import { createContext } from 'react'
import type {
  LoginCredentials,
  SignInResult,
} from '@/features/auth/domain/entities/login-credentials'
import type { AuthUser, UserRole } from '@/features/auth/domain/entities/user'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthContextValue {
  user: AuthUser | null
  role: UserRole | null
  status: AuthStatus
  signIn: (credentials: LoginCredentials) => Promise<SignInResult>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
