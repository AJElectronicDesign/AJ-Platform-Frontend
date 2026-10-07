import type { AuthUser } from '@/features/auth/domain/entities/user'
import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository'

export async function getCurrentUser(
  repository: AuthRepository,
): Promise<AuthUser | null> {
  return repository.currentUser()
}
