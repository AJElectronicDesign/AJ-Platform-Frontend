import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository'
import { HttpAuthRepository } from '@/features/auth/infrastructure/http-auth-repository'
import { MockAuthRepository } from '@/features/auth/infrastructure/mock-auth-repository'

export function isAuthMockEnabled(): boolean {
  return import.meta.env.VITE_AUTH_MOCK === 'true'
}

export function createAuthRepository(): AuthRepository {
  if (isAuthMockEnabled()) {
    return new MockAuthRepository()
  }

  return new HttpAuthRepository()
}
