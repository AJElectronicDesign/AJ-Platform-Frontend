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

  it('keeps a validation detail code and still accepts auth details without one', async () => {
    vi.stubGlobal(
      'fetch',
      async () =>
        new Response(
          JSON.stringify({
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Request validation failed',
              details: [
                {
                  path: 'phone',
                  message: 'El teléfono y la clave de país deben indicarse juntos o dejarse vacíos',
                  code: 'PHONE_PAIR_REQUIRED',
                },
                { path: 'email', message: 'Invalid email' },
              ],
            },
          }),
          { status: 400 },
        ),
    )

    await expect(httpRequest('/clients', { auth: false })).rejects.toMatchObject({
      code: 'VALIDATION_ERROR',
      details: [
        {
          path: 'phone',
          message: 'El teléfono y la clave de país deben indicarse juntos o dejarse vacíos',
          code: 'PHONE_PAIR_REQUIRED',
        },
        { path: 'email', message: 'Invalid email' },
      ],
    })
  })

  it('ends the session instead of sending a request without a valid token', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    const onUnauthorized = vi.fn()
    const stop = setUnauthorizedHandler(onUnauthorized)

    await expect(httpRequest('/clients')).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
    })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(onUnauthorized).toHaveBeenCalledOnce()
    stop()
  })

  it('does not notify when unauthorized handling is disabled and there is no token', async () => {
    const fetchMock = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetchMock)
    const onUnauthorized = vi.fn()
    const stop = setUnauthorizedHandler(onUnauthorized)

    await expect(httpRequest('/auth/me', { handleUnauthorized: false })).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
    })
    expect(fetchMock).not.toHaveBeenCalled()
    expect(onUnauthorized).not.toHaveBeenCalled()
    stop()
  })

  it('clears the session on UNAUTHORIZED, TOKEN_INVALID, TOKEN_EXPIRED, and TOKEN_REVOKED', async () => {
    for (const code of ['UNAUTHORIZED', 'TOKEN_INVALID', 'TOKEN_EXPIRED', 'TOKEN_REVOKED'] as const) {
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

  it('stores the access token in sessionStorage', () => {
    accessToken.save('abc', 60)

    expect(window.sessionStorage.getItem('aj.platform.accessToken')).toContain('abc')
    expect(window.localStorage.getItem('aj.platform.accessToken')).toBeNull()
    expect(accessToken.read()).toBe('abc')
  })

  it('logs out this tab when another tab clears the session', () => {
    accessToken.save('abc', 60)
    const onLogout = vi.fn()
    const stop = accessToken.subscribe(onLogout)

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'aj.platform.auth.logout',
        newValue: '1',
      }),
    )

    expect(accessToken.read()).toBeNull()
    expect(onLogout).toHaveBeenCalled()
    stop()
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

  it('sends multipart bodies without forcing JSON and returns blobs', async () => {
    accessToken.save('abc', 3600)
    const fetchMock = vi.fn<typeof fetch>(async (_input, init) => {
      if (init?.body instanceof FormData) {
        return new Response(
          JSON.stringify({ hasLogo: true, logoContentType: 'image/png', logoByteSize: 4 }),
          { status: 200 },
        )
      }

      return new Response(new Uint8Array([1, 2, 3, 4]), {
        status: 200,
        headers: { 'content-type': 'image/png' },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const file = new File([Uint8Array.from([1, 2, 3, 4])], 'logo.png', { type: 'image/png' })
    const form = new FormData()
    form.append('file', file)

    await httpRequest('/clients/id/logo', { method: 'PUT', body: form })
    const uploadHeaders = new Headers(fetchMock.mock.calls[0]?.[1]?.headers)

    expect(fetchMock.mock.calls[0]?.[1]?.body).toBe(form)
    expect(uploadHeaders.get('Content-Type')).toBeNull()
    expect(String(fetchMock.mock.calls[0]?.[0])).not.toContain('abc')

    const blob = await httpRequest<Blob>('/clients/id/logo', { responseType: 'blob' })

    expect(blob).toBeInstanceOf(Blob)
    expect(blob.size).toBe(4)
    expect(new Headers(fetchMock.mock.calls[1]?.[1]?.headers).get('Accept')).toContain('image/png')
  })

  it('maps transport failures to a network ApiError', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new TypeError('Failed to fetch')
    })

    await expect(
      httpRequest('/auth/login', {
        method: 'POST',
        auth: false,
        handleUnauthorized: false,
      }),
    ).rejects.toMatchObject({
      status: 0,
      code: 'network',
    })
  })
})
