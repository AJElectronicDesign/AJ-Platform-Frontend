import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '@/features/auth/application/use-cases/get-current-user'
import { signIn as signInUseCase } from '@/features/auth/application/use-cases/sign-in'
import { signOut as signOutUseCase } from '@/features/auth/application/use-cases/sign-out'
import type {
  LoginCredentials,
  SignInResult,
} from '@/features/auth/domain/entities/login-credentials'
import { AuthError, type SessionErrorCode } from '@/features/auth/domain/errors/auth-error'
import type { AuthUser } from '@/features/auth/domain/entities/user'
import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository'
import { createAuthRepository } from '@/features/auth/infrastructure/create-auth-repository'
import { AuthContext, type AuthStatus } from '@/features/auth/presentation/auth-context'
import { paths } from '@/shared/constants/paths'
import { setUnauthorizedHandler } from '@/shared/infrastructure/http/unauthorized'

function isAppPath(pathname: string): boolean {
  return pathname === paths.app || pathname.startsWith(`${paths.app}/`)
}

function sessionErrorCode(error: unknown): SessionErrorCode {
  if (error instanceof AuthError && error.code === 'network') {
    return 'network'
  }

  return 'unavailable'
}

export function AuthProvider({
  children,
  repository: repositoryProp,
}: {
  children: ReactNode
  repository?: AuthRepository
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const locationRef = useRef(location)
  locationRef.current = location

  const [repository, setRepository] = useState<AuthRepository | null>(repositoryProp ?? null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [sessionError, setSessionError] = useState<SessionErrorCode | null>(null)
  const [attempt, setAttempt] = useState(0)

  const endSession = useCallback(() => {
    setUser(null)
    setSessionError(null)
    setStatus('unauthenticated')

    const current = locationRef.current

    if (!isAppPath(current.pathname)) {
      return
    }

    navigate(paths.login, {
      replace: true,
      state: {
        from: {
          pathname: current.pathname,
          search: current.search,
          hash: current.hash,
        },
      },
    })
  }, [navigate])

  useEffect(() => {
    if (repositoryProp) {
      setRepository(repositoryProp)
      return
    }

    let cancelled = false

    void createAuthRepository().then((next) => {
      if (!cancelled) {
        setRepository(next)
      }
    })

    return () => {
      cancelled = true
    }
  }, [repositoryProp])

  useEffect(() => {
    return setUnauthorizedHandler(() => {
      endSession()
    })
  }, [endSession])

  useEffect(() => {
    if (!repository) {
      return
    }

    return repository.subscribe(() => {
      if (!repository.hasSession()) {
        endSession()
      }
    })
  }, [endSession, repository])

  useEffect(() => {
    if (!repository || status !== 'authenticated') {
      return
    }

    const expireIfNeeded = () => {
      if (!repository.hasSession()) {
        endSession()
        return
      }

      const expiresAt = repository.sessionExpiresAt()

      if (expiresAt != null && expiresAt <= Date.now()) {
        repository.expireLocalSession()
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        expireIfNeeded()
      }
    }

    document.addEventListener('visibilitychange', onVisibility)

    const expiresAt = repository.sessionExpiresAt()
    let timeoutId: number | undefined

    if (expiresAt != null) {
      const delay = expiresAt - Date.now()

      if (delay <= 0) {
        expireIfNeeded()
      } else {
        timeoutId = window.setTimeout(expireIfNeeded, delay)
      }
    }

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)

      if (timeoutId != null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [endSession, repository, status, user])

  useEffect(() => {
    if (!repository) {
      return
    }

    let cancelled = false

    async function restore(activeRepository: AuthRepository) {
      if (!activeRepository.hasSession()) {
        if (!cancelled) {
          setUser(null)
          setSessionError(null)
          setStatus('unauthenticated')
        }
        return
      }

      try {
        const current = await getCurrentUser(activeRepository)

        if (cancelled) {
          return
        }

        if (!current) {
          setUser(null)
          setSessionError(null)
          setStatus('unauthenticated')
          return
        }

        setUser(current)
        setSessionError(null)
        setStatus('authenticated')
      } catch (error) {
        if (cancelled) {
          return
        }

        setSessionError(sessionErrorCode(error))
        setStatus('error')
      }
    }

    void restore(repository)

    return () => {
      cancelled = true
    }
  }, [attempt, repository])

  const signIn = useCallback(
    async (credentials: LoginCredentials): Promise<SignInResult> => {
      if (!repository) {
        return { success: false, code: 'unknown' }
      }

      const result = await signInUseCase(credentials, repository)

      if (result.success) {
        setUser(result.user)
        setSessionError(null)
        setStatus('authenticated')
      }

      return result
    },
    [repository],
  )

  const signOut = useCallback(async () => {
    if (!repository) {
      endSession()
      return
    }

    try {
      await signOutUseCase(repository)
    } catch (error) {
      console.error('Sign-out failed:', error)
    } finally {
      repository.clearLocalSession()
      endSession()
    }
  }, [endSession, repository])

  const retry = useCallback(() => {
    setStatus('loading')
    setSessionError(null)
    setAttempt((value) => value + 1)
  }, [])

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      status,
      sessionError,
      signIn,
      signOut,
      retry,
    }),
    [retry, sessionError, signIn, signOut, status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
