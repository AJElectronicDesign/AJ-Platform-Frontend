import { isUserRole, type AuthUser } from '@/features/auth/domain/entities/user'
import { AuthError } from '@/features/auth/domain/errors/auth-error'

export function parseAuthUser(value: unknown): AuthUser {
  if (!value || typeof value !== 'object') {
    throw new AuthError('unknown', 'The server returned an invalid user.')
  }

  const record = value as Record<string, unknown>

  if (
    typeof record.id !== 'string' ||
    record.id.length === 0 ||
    typeof record.email !== 'string' ||
    typeof record.name !== 'string' ||
    !isUserRole(record.role)
  ) {
    throw new AuthError('unknown', 'The server returned an invalid user.')
  }

  return {
    id: record.id,
    email: record.email,
    name: record.name,
    role: record.role,
  }
}
