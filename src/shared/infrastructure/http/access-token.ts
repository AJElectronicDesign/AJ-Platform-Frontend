import { resetUnauthorizedHandling } from './unauthorized'

const STORAGE_KEY = 'aj.platform.accessToken'
const LOGOUT_PING_KEY = 'aj.platform.auth.logout'
const CHANNEL_NAME = 'aj.platform.auth'

interface StoredAccessToken {
  token: string
  expiresAt: number | null
}

type SessionListener = () => void

const listeners = new Set<SessionListener>()
let remoteBound = false
let channel: BroadcastChannel | null = null

/**
 * Single owner of the access token.
 *
 * The token lives in sessionStorage for this tab only. Logout also pings the
 * other tabs through BroadcastChannel and a localStorage key, because a
 * sessionStorage write does not fire a `storage` event across tabs.
 *
 * The API issues an access token only (default lifetime 3600 seconds) and has
 * no refresh endpoint. When this token expires or is revoked, drop it and
 * return to /login from the authenticated shell. A future refresh call belongs
 * in this module, using raw fetch so it cannot recurse through the shared
 * HTTP client.
 */
function canUseSessionStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function removeStored(): void {
  if (!canUseSessionStorage()) {
    return
  }

  window.sessionStorage.removeItem(STORAGE_KEY)
}

function notifyListeners(): void {
  for (const listener of [...listeners]) {
    listener()
  }
}

function onRemoteLogout(): void {
  removeStored()
  notifyListeners()
}

function bindRemoteLogout(): void {
  if (remoteBound || typeof window === 'undefined') {
    return
  }

  remoteBound = true

  if (typeof BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel(CHANNEL_NAME)
    channel.addEventListener('message', (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type === 'logout') {
        onRemoteLogout()
      }
    })
  }

  window.addEventListener('storage', (event) => {
    if (event.key === LOGOUT_PING_KEY) {
      onRemoteLogout()
    }
  })
}

function publishLogout(): void {
  bindRemoteLogout()

  try {
    channel?.postMessage({ type: 'logout' })
  } catch {
    // A missing BroadcastChannel should not block the local logout.
  }

  if (!canUseLocalStorage()) {
    return
  }

  try {
    window.localStorage.setItem(LOGOUT_PING_KEY, String(Date.now()))
  } catch {
    // Ignore quota and private-mode failures. This tab already dropped its token.
  }
}

function readStored(): StoredAccessToken | null {
  bindRemoteLogout()

  if (!canUseSessionStorage()) {
    return null
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredAccessToken>

    if (typeof parsed.token !== 'string' || parsed.token.length === 0) {
      removeStored()
      return null
    }

    const expiresAt = typeof parsed.expiresAt === 'number' ? parsed.expiresAt : null

    if (expiresAt != null && expiresAt <= Date.now()) {
      // Local expiry is not a logout. Other tabs keep their own sessionStorage token.
      removeStored()
      return null
    }

    return { token: parsed.token, expiresAt }
  } catch {
    removeStored()
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
    if (!canUseSessionStorage()) {
      return
    }

    const expiresAt =
      typeof expiresInSeconds === 'number' && Number.isFinite(expiresInSeconds)
        ? Date.now() + expiresInSeconds * 1000
        : null
    const stored: StoredAccessToken = { token, expiresAt }

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    resetUnauthorizedHandling()
  },

  /**
   * Drops this tab's token and tells the other tabs to log out.
   * Used for an explicit logout and for a server 401.
   */
  clear(): void {
    removeStored()
    publishLogout()
    notifyListeners()
  },

  /**
   * Drops this tab's token without logging out the other tabs.
   * Used when the local expiry clock runs out.
   */
  expire(): void {
    removeStored()
    notifyListeners()
  },

  subscribe(listener: SessionListener): () => void {
    bindRemoteLogout()
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  },
}
