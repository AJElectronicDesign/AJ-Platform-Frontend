import { describe, expect, it } from 'vitest'
import type { AuthUser } from '@/features/auth/domain/entities/user'
import { userHasRole } from '@/features/auth/domain/user-has-role'

const admin: AuthUser = {
  id: '1',
  email: 'ada@aj-electronic-design.com',
  name: 'Ada',
  role: 'admin',
}

describe('userHasRole', () => {
  it('accepts a user whose role is in the allowed list', () => {
    expect(userHasRole(admin, ['admin', 'employee'])).toBe(true)
  })

  it('rejects a missing user or a different role', () => {
    expect(userHasRole(null, ['admin'])).toBe(false)
    expect(userHasRole(undefined, ['admin'])).toBe(false)
    expect(userHasRole({ ...admin, role: 'employee' }, ['admin'])).toBe(false)
  })
})
