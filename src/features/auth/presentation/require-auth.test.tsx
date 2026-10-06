import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '@/features/auth/presentation/auth-context'
import { RequireAuth } from '@/features/auth/presentation/require-auth'
import { I18nProvider } from '@/shared/i18n'

function authValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    user: null,
    role: null,
    status: 'unauthenticated',
    sessionError: null,
    signIn: async () => ({ success: false, code: 'unknown' }),
    signOut: async () => undefined,
    retry: () => undefined,
    ...overrides,
  }
}

function LoginProbe() {
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname

  return <p>Login screen {from}</p>
}

function renderGuard(value: AuthContextValue, path = '/app') {
  window.localStorage.setItem('aj-locale', 'en')

  return render(
    <I18nProvider>
      <AuthContext.Provider value={value}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/login" element={<LoginProbe />} />
            <Route element={<RequireAuth />}>
              <Route path="/app" element={<p>Private screen</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </I18nProvider>,
  )
}

describe('RequireAuth', () => {
  it('renders the protected screen for an authenticated user', () => {
    renderGuard(
      authValue({
        status: 'authenticated',
        role: 'admin',
        user: {
          id: '1',
          email: 'ada@aj-electronic-design.com',
          name: 'Ada',
          role: 'admin',
        },
      }),
    )

    expect(screen.getByText('Private screen')).toBeTruthy()
  })

  it('sends anonymous visitors to login and remembers the requested path', () => {
    renderGuard(authValue())

    expect(screen.getByText('Login screen /app')).toBeTruthy()
  })

  it('shows a retry state instead of sending a failed restore to login', () => {
    renderGuard(authValue({ status: 'error', sessionError: 'unavailable' }))

    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy()
    expect(screen.queryByText(/Login screen/)).toBeNull()
  })

  it('waits while the session is restoring', () => {
    renderGuard(authValue({ status: 'loading' }))

    expect(screen.getByRole('status')).toBeTruthy()
    expect(screen.queryByText('Private screen')).toBeNull()
    expect(screen.queryByText(/Login screen/)).toBeNull()
  })
})
