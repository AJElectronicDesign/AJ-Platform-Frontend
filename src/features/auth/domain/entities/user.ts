export type UserRole = 'admin' | 'employee'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export function isUserRole(value: unknown): value is UserRole {
  return value === 'admin' || value === 'employee'
}
