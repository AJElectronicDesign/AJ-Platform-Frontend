import { afterEach, describe, expect, it, vi } from 'vitest'
import { accessToken } from '@/shared/infrastructure/http/access-token'
import { buildApiUrl, getApiOrigin } from '@/shared/infrastructure/http/api-config'
import { httpRequest } from '@/shared/infrastructure/http/http-client'
import {
  resetUnauthorizedHandling,
  setUnauthorizedHandler,
} from '@/shared/infrastructure/http/unauthorized'

describe('api config', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('builds versioned URLs from the configured origin', () => {
    expect(getApiOrigin()).toBe('http://api.test')
    expect(buildApiUrl('/auth/login')).toBe('http://api.test/api/v1/auth/login')
    expect(buildApiUrl('/api/v1/auth/me')).toBe('http://api.test/api/v1/auth/me')
  })

  it('accepts an origin that already includes /api/v1', () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000/api/v1/')

    expect(getApiOrigin()).toBe('http://localhost:3000')
    expect(buildApiUrl('/auth/me')).toBe('http://localhost:3000/api/v1/auth/me')
  })
})

describe('httpRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    resetUnauthorizedHandling()
    accessToken.clear()
  })

  it('sends the bearer token', async () => {
    accessToken.save('abc', 60)
    const fetchMock = vi.fn<typeof fetch>(async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await httpRequest<{ ok: boolean }>('/clients')
    const [url, init] = fetchMock.mock.calls[0]

    expect(result.ok).toBe(true)
    expect(String(url)).toBe('http://api.test/api/v1/clients')
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer abc')
  })

  it('reads the error envelope and branches on error.code', async () => {
    vi.stubGlobal(
      'fetch',
      async () =>
        new Response(
          JSON.stringify({
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many login attempts. Try again later.',
              details: [],
            },
          }),
          { status: 429 },
        ),
    )

    await expect(
      httpRequest('/auth/login', {
        method: 'POST',
        body: { email: 'a@b.c', password: 'nope' },
        auth: false,
        handleUnauthorized: false,
      }),
    ).rejects.toMatchObject({
      status: 429,
      code: 'RATE_LIMITED',
      message: 'Too many login attempts. Try again later.',
      details: [],
    })
  })

  it('clears the session on TOKEN_EXPIRED and TOKEN_REVOKED', async () => {
    for (const code of ['TOKEN_EXPIRED', 'TOKEN_REVOKED'] as const) {
      accessToken.save('expired', 3600)
      resetUnauthorizedHandling()
      const onUnauthorized = vi.fn()
      const stop = setUnauthorizedHandler(onUnauthorized)
      vi.stubGlobal(
        'fetch',
        async () =>
          new Response(
            JSON.stringify({
              error: { code, message: 'Access token is no longer valid', details: [] },
            }),
            { status: 401 },
          ),
      )

      await expect(httpRequest('/clients')).rejects.toMatchObject({ status: 401, code })
      expect(accessToken.read()).toBeNull()
      expect(onUnauthorized).toHaveBeenCalledOnce()
      stop()
    }
  })

  it('keeps the session on FORBIDDEN', async () => {
    accessToken.save('keep-me', 3600)
    const onUnauthorized = vi.fn()
    const stop = setUnauthorizedHandler(onUnauthorized)
    vi.stubGlobal(
      'fetch',
      async () =>
        new Response(
          JSON.stringify({
            error: {
              code: 'FORBIDDEN',
              message: 'You do not have permission to perform this action',
              details: [],
            },
          }),
          { status: 403 },
        ),
    )

    await expect(httpRequest('/customers')).rejects.toMatchObject({
      status: 403,
      code: 'FORBIDDEN',
    })
    expect(accessToken.read()).toBe('keep-me')
    expect(onUnauthorized).not.toHaveBeenCalled()
    stop()
  })

  it('does not parse a 204 logout body', async () => {
    accessToken.save('abc', 3600)
    vi.stubGlobal('fetch', async () => new Response(null, { status: 204 }))

    await expect(httpRequest('/auth/logout', { method: 'POST' })).resolves.toBeUndefined()
    expect(accessToken.read()).toBe('abc')
  })

  it('drops a locally expired access token', () => {
    accessToken.save('stale', -1)

    expect(accessToken.read()).toBeNull()
    expect(accessToken.expiresAt()).toBeNull()
  })

  it('leaves session handling to the caller when unauthorized handling is disabled', async () => {
    accessToken.save('keep-me', 3600)
    const onUnauthorized = vi.fn()
    const stop = setUnauthorizedHandler(onUnauthorized)
    vi.stubGlobal(
      'fetch',
      async () =>
        new Response(
          JSON.stringify({
            error: {
              code: 'INVALID_CREDENTIALS',
              message: 'Invalid email or password',
              details: [],
            },
          }),
          { status: 401 },
        ),
    )

    await expect(
      httpRequest('/auth/login', {
        method: 'POST',
        body: { email: 'a@b.c', password: 'nope' },
        auth: false,
        handleUnauthorized: false,
      }),
    ).rejects.toMatchObject({ status: 401, code: 'INVALID_CREDENTIALS' })

    expect(accessToken.read()).toBe('keep-me')
    expect(onUnauthorized).not.toHaveBeenCalled()
    stop()
  })

  it('maps transport failures to a network ApiError', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new TypeError('Failed to fetch')
    })

    await expect(httpRequest('/auth/me', { handleUnauthorized: false })).rejects.toMatchObject({
      status: 0,
      code: 'network',
    })
  })
})
