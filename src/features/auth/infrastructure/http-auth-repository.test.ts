import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpAuthRepository } from '@/features/auth/infrastructure/http-auth-repository'
import { accessToken } from '@/shared/infrastructure/http/access-token'

const repository = new HttpAuthRepository()

const validUser = {
  id: 'user_1',
  email: 'ada@aj-electronic-design.com',
  name: 'Ada Lovelace',
  role: 'admin',
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

describe('HttpAuthRepository', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    accessToken.clear()
  })

  it('rejects a login response that is missing the token, expiry, or a valid user', async () => {
    const cases = [
      { expiresIn: 3600, user: validUser },
      { accessToken: 'token', user: validUser },
      { accessToken: 'token', expiresIn: 0, user: validUser },
      { accessToken: 'token', expiresIn: 3600, user: { ...validUser, role: 'guest' } },
    ]

    for (const body of cases) {
      vi.stubGlobal('fetch', async () => jsonResponse(body, 200))

      await expect(
        repository.login({ email: 'ada@aj-electronic-design.com', password: 'secret' }),
      ).rejects.toMatchObject({ code: 'unknown' })
      expect(accessToken.read()).toBeNull()
    }
  })

  it('clears the token when currentUser receives a 401', async () => {
    accessToken.save('abc', 3600)
    vi.stubGlobal(
      'fetch',
      async () =>
        jsonResponse(
          { error: { code: 'UNAUTHORIZED', message: 'Authentication required', details: [] } },
          401,
        ),
    )

    await expect(repository.currentUser()).resolves.toBeNull()
    expect(accessToken.read()).toBeNull()
  })

  it('keeps the token when currentUser fails because of the network or a 500', async () => {
    accessToken.save('abc', 3600)
    vi.stubGlobal('fetch', async () => {
      throw new TypeError('Failed to fetch')
    })

    await expect(repository.currentUser()).rejects.toMatchObject({ code: 'network' })
    expect(accessToken.read()).toBe('abc')

    vi.stubGlobal(
      'fetch',
      async () =>
        jsonResponse(
          { error: { code: 'INTERNAL_ERROR', message: 'Internal error', details: [] } },
          500,
        ),
    )

    await expect(repository.currentUser()).rejects.toMatchObject({ code: 'unavailable' })
    expect(accessToken.read()).toBe('abc')
  })

  it('clears the token when logout fails', async () => {
    accessToken.save('abc', 3600)
    vi.stubGlobal('fetch', async () => {
      throw new TypeError('Failed to fetch')
    })

    await repository.logout()

    expect(accessToken.read()).toBeNull()
  })
})
