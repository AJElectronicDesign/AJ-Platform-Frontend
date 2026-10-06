import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '@/features/auth/application/use-cases/get-current-user'
import { signIn as signInUseCase } from '@/features/auth/application/use-cases/sign-in'
import { signOut as signOutUseCase } from '@/features/auth/application/use-cases/sign-out'
import type {
  LoginCredentials,
  SignInResult,
} from '@/features/auth/domain/entities/login-credentials'
import type { AuthUser } from '@/features/auth/domain/entities/user'
import { createAuthRepository } from '@/features/auth/infrastructure/create-auth-repository'
import { AuthContext, type AuthStatus } from '@/features/auth/presentation/auth-context'
import { paths } from '@/shared/constants/paths'
import { accessToken } from '@/shared/infrastructure/http/access-token'
import {
  notifyUnauthorized,
  setUnauthorizedHandler,
} from '@/shared/infrastructure/http/unauthorized'

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [repository] = useState(createAuthRepository)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>(() =>
    accessToken.read() ? 'loading' : 'unauthenticated',
  )

  useEffect(() => {
    return setUnauthorizedHandler(() => {
      setUser(null)
      setStatus('unauthenticated')
      navigate(paths.login, { replace: true })
    })
  }, [navigate])

  useEffect(() => {
    if (status !== 'authenticated') {
      return
    }

    const expiresAt = accessToken.expiresAt()

    if (expiresAt == null) {
      return
    }

    const delay = expiresAt - Date.now()

    const expireSession = () => {
      accessToken.clear()
      notifyUnauthorized()
    }

    if (delay <= 0) {
      expireSession()
      return
    }

    const timeoutId = window.setTimeout(expireSession, delay)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [status, user])

  useEffect(() => {
    let cancelled = false

    async function restore() {
      if (!accessToken.read()) {
        if (!cancelled) {
          setUser(null)
          setStatus('unauthenticated')
        }
        return
      }

      try {
        const current = await getCurrentUser(repository)

        if (cancelled) {
          return
        }

        if (!current) {
          setUser(null)
          setStatus('unauthenticated')
          return
        }

        setUser(current)
        setStatus('authenticated')
      } catch {
        if (cancelled) {
          return
        }

        setUser(null)
        setStatus('unauthenticated')
      }
    }

    void restore()

    return () => {
      cancelled = true
    }
  }, [repository])

  const signIn = useCallback(
    async (credentials: LoginCredentials): Promise<SignInResult> => {
      const result = await signInUseCase(credentials, repository)

      if (result.success) {
        setUser(result.user)
        setStatus('authenticated')
      }

      return result
    },
    [repository],
  )

  const signOut = useCallback(async () => {
    try {
      await signOutUseCase(repository)
    } finally {
      setUser(null)
      setStatus('unauthenticated')
      navigate(paths.login, { replace: true })
    }
  }, [navigate, repository])

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      status,
      signIn,
      signOut,
    }),
    [signIn, signOut, status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
