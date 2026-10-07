import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { AuthUser } from '@/features/auth/domain/entities/user'
import { AuthError } from '@/features/auth/domain/errors/auth-error'
import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository'
import { AuthProvider } from '@/features/auth/presentation/auth-provider'
import { useAuth } from '@/features/auth/presentation/use-auth'
import {
  notifyUnauthorized,
  resetUnauthorizedHandling,
} from '@/shared/infrastructure/http/unauthorized'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

const user: AuthUser = {
  id: '1',
  email: 'ada@aj-electronic-design.com',
  name: 'Ada',
  role: 'admin',
}

interface MemorySession {
  repository: AuthRepository
  hasSession: () => boolean
  token: { expiresAt: number | null } | null
}

function createMemoryRepository(options: {
  signedIn?: boolean
  initialExpiresAt?: number | null
  currentUser?: () => Promise<AuthUser | null>
  logout?: () => Promise<void>
}): MemorySession {
  let token: { expiresAt: number | null } | null = options.signedIn
    ? { expiresAt: options.initialExpiresAt === undefined ? Date.now() + 60_000 : options.initialExpiresAt }
    : null
  const listeners = new Set<() => void>()

  const notify = () => {
    for (const listener of [...listeners]) {
      listener()
    }
  }

  const repository: AuthRepository = {
    login: async () => {
      throw new Error('login is not used')
    },
    currentUser: options.currentUser ?? (async () => user),
    logout: async () => {
      if (options.logout) {
        await options.logout()
        return
      }

      token = null
      notify()
    },
    hasSession: () => {
      if (!token) {
        return false
      }

      return token.expiresAt == null || token.expiresAt > Date.now()
    },
    sessionExpiresAt: () => (token && (token.expiresAt == null || token.expiresAt > Date.now())
      ? token.expiresAt
      : null),
    clearLocalSession: () => {
      token = null
      notify()
    },
    expireLocalSession: () => {
      token = null
      notify()
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }

  return {
    repository,
    hasSession: () => repository.hasSession(),
    get token() {
      return token
    },
  }
}

function StatusProbe() {
  const { status, sessionError, retry, signOut } = useAuth()

  return (
    <div>
      <p>
        status:{status} error:{sessionError ?? 'none'}
      </p>
      <button type="button" onClick={retry}>
        Retry session
      </button>
      <button type="button" onClick={() => void signOut()}>
        Sign out
      </button>
    </div>
  )
}

function PublicProbe() {
  const { status } = useAuth()

  return <p>Public {status}</p>
}

function LoginProbe() {
  const location = useLocation()
  const from = (
    location.state as {
      from?: { pathname?: string; search?: string; hash?: string }
    } | null
  )?.from

  return <p>{`login ${from?.pathname ?? ''}${from?.search ?? ''}${from?.hash ?? ''}`}</p>
}

function renderSession(repository: AuthRepository, entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <AuthProvider repository={repository}>
        <Routes>
          <Route path="/" element={<PublicProbe />} />
          <Route path="/login" element={<LoginProbe />} />
          <Route path="/app" element={<StatusProbe />} />
          <Route path="/app/clientes" element={<StatusProbe />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

async function flushRestore() {
  await act(async () => {
    await Promise.resolve()
    await Promise.resolve()
  })
}

describe('AuthProvider', () => {
  afterEach(() => {
    resetUnauthorizedHandling()
    vi.useRealTimers()
  })

  it('restores an existing session', async () => {
    const memory = createMemoryRepository({ signedIn: true })
    renderSession(memory.repository, '/app')

    await flushRestore()

    expect(screen.getByText('status:authenticated error:none')).toBeTruthy()
  })

  it('stays signed out when there is no stored session', async () => {
    const memory = createMemoryRepository({ signedIn: false })
    renderSession(memory.repository, '/app')

    await flushRestore()

    expect(screen.getByText('status:unauthenticated error:none')).toBeTruthy()
    expect(screen.queryByText(/login/)).toBeNull()
  })

  it('keeps the session and offers a retry when restore hits a network error', async () => {
    let calls = 0
    const memory = createMemoryRepository({
      signedIn: true,
      currentUser: async () => {
        calls += 1

        if (calls === 1) {
          throw new AuthError('network', 'offline')
        }

        return user
      },
    })
    renderSession(memory.repository, '/app')

    await flushRestore()

    expect(screen.getByText('status:error error:network')).toBeTruthy()
    expect(screen.queryByText(/^login/)).toBeNull()
    expect(memory.hasSession()).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Retry session' }))
    await flushRestore()

    expect(screen.getByText('status:authenticated error:none')).toBeTruthy()
  })

  it('redirects to login from the app when the token expires and keeps the return path', async () => {
    vi.useFakeTimers()
    const memory = createMemoryRepository({
      signedIn: true,
      initialExpiresAt: Date.now() + 5_000,
    })
    renderSession(memory.repository, '/app/clientes?tab=1#details')
    await flushRestore()

    expect(screen.getByText('status:authenticated error:none')).toBeTruthy()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5_000)
    })

    expect(screen.getByText('login /app/clientes?tab=1#details')).toBeTruthy()
  })

  it('does not redirect a public page when the token expires', async () => {
    vi.useFakeTimers()
    const memory = createMemoryRepository({
      signedIn: true,
      initialExpiresAt: Date.now() + 5_000,
    })
    renderSession(memory.repository, '/')
    await flushRestore()

    expect(screen.getByText('Public authenticated')).toBeTruthy()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5_000)
    })

    expect(screen.getByText('Public unauthenticated')).toBeTruthy()
    expect(screen.queryByText(/^login/)).toBeNull()
  })

  it('rechecks expiry when the tab becomes visible again', async () => {
    vi.useFakeTimers()
    const memory = createMemoryRepository({
      signedIn: true,
      initialExpiresAt: Date.now() + 60_000,
    })
    renderSession(memory.repository, '/app/clientes?tab=1#details')
    await flushRestore()

    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')

    if (memory.token) {
      memory.token.expiresAt = Date.now() - 1
    }

    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(screen.getByText('status:authenticated error:none')).toBeTruthy()

    visibility.mockReturnValue('visible')

    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'))
    })

    expect(screen.getByText('login /app/clientes?tab=1#details')).toBeTruthy()
    visibility.mockRestore()
  })

  it('ends the session through the unauthorized handler and keeps the return path', async () => {
    const memory = createMemoryRepository({ signedIn: true })
    renderSession(memory.repository, '/app/clientes?tab=1#details')
    await flushRestore()

    act(() => {
      notifyUnauthorized()
    })

    expect(screen.getByText('login /app/clientes?tab=1#details')).toBeTruthy()
  })

  it('ends the local session when sign-out fails on the network', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const memory = createMemoryRepository({
      signedIn: true,
      logout: async () => {
        throw new Error('offline')
      },
    })
    renderSession(memory.repository, '/app')
    await flushRestore()

    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))
    await flushRestore()

    expect(screen.getByText(/^login/)).toBeTruthy()
    expect(memory.hasSession()).toBe(false)
  })
})
