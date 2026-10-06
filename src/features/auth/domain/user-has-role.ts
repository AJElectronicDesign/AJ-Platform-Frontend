import type { AuthUser, UserRole } from '@/features/auth/domain/entities/user'

export function userHasRole(
  user: AuthUser | null | undefined,
  roles: readonly UserRole[],
): boolean {
  if (!user) {
    return false
  }

  return roles.includes(user.role)
}
