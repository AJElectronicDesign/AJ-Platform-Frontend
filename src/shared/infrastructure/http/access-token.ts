import { resetUnauthorizedHandling } from './unauthorized'

const STORAGE_KEY = 'aj.platform.accessToken'

interface StoredAccessToken {
  token: string
  expiresAt: number | null
}

/**
 * Single owner of the access token.
 *
 * The API issues an access token only (default lifetime 3600 seconds) and has
 * no refresh endpoint. When this token expires or is revoked, clear it and
 * return to /login. A future refresh call belongs in this module, using raw
 * fetch so it cannot recurse through the shared HTTP client.
 */
function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readStored(): StoredAccessToken | null {
  if (!canUseStorage()) {
    return null
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredAccessToken>

    if (typeof parsed.token !== 'string' || parsed.token.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }

    const expiresAt = typeof parsed.expiresAt === 'number' ? parsed.expiresAt : null

    if (expiresAt != null && expiresAt <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY)
      return null
    }

    return { token: parsed.token, expiresAt }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const accessToken = {
  read(): string | null {
    return readStored()?.token ?? null
  },

  expiresAt(): number | null {
    return readStored()?.expiresAt ?? null
  },

  save(token: string, expiresInSeconds?: number): void {
    if (!canUseStorage()) {
      return
    }

    const expiresAt =
      typeof expiresInSeconds === 'number' && Number.isFinite(expiresInSeconds)
        ? Date.now() + expiresInSeconds * 1000
        : null
    const stored: StoredAccessToken = { token, expiresAt }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    resetUnauthorizedHandling()
  },

  clear(): void {
    if (!canUseStorage()) {
      return
    }

    window.localStorage.removeItem(STORAGE_KEY)
  },
}
