import type { LoginCredentials } from '@/features/auth/domain/entities/login-credentials'
import type { AuthUser } from '@/features/auth/domain/entities/user'

export interface AuthSession {
  accessToken: string
  expiresIn: number
  user: AuthUser
}

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>
  currentUser(): Promise<AuthUser | null>
  logout(): Promise<void>
}
