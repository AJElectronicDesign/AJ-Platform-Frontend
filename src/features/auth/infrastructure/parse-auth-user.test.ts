import { describe, expect, it } from 'vitest'
import { parseAuthUser } from '@/features/auth/infrastructure/parse-auth-user'

const user = {
  id: '3f1c2a4e-7b9d-4e6a-8c1f-2d4b6a8e0c11',
  email: 'admin@ajelectronicdesign.com',
  name: 'Ada Admin',
  role: 'admin',
}

describe('parseAuthUser', () => {
  it('accepts admin and employee users', () => {
    expect(parseAuthUser(user)).toEqual(user)
    expect(parseAuthUser({ ...user, role: 'employee' }).role).toBe('employee')
  })

  it('rejects a role outside the API contract', () => {
    expect(() => parseAuthUser({ ...user, role: 'guest' })).toThrow(/invalid user/i)
  })
})
