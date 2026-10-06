import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository'

export async function signOut(repository: AuthRepository): Promise<void> {
  await repository.logout()
}
