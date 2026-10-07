import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository'
import { HttpAuthRepository } from '@/features/auth/infrastructure/http-auth-repository'

export async function createAuthRepository(): Promise<AuthRepository> {
  // `import.meta.env.DEV` is statically false in production builds, so the
  // dynamic import (and the mock module) is left out of the prod bundle.
  if (import.meta.env.DEV && import.meta.env.VITE_AUTH_MOCK === 'true') {
    const module = await import('./mock-auth-repository')
    return new module.MockAuthRepository()
  }

  return new HttpAuthRepository()
}
