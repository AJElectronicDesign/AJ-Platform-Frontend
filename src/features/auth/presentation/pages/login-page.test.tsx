import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '@/features/auth/presentation/auth-context'
import { LoginPage } from '@/features/auth/presentation/pages/login-page'
import type { AuthUser } from '@/features/auth/domain/entities/user'
import { I18nProvider } from '@/shared/i18n'

const user: AuthUser = {
  id: '1',
  email: 'ada@aj-electronic-design.com',
  name: 'Ada',
  role: 'admin',
}

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

function ClientsProbe() {
  const location = useLocation()

  return <p>{`Clients module ${location.search}${location.hash}`}</p>
}

function renderLogin(value: AuthContextValue, state?: unknown) {
  window.localStorage.setItem('aj-locale', 'en')

  return render(
    <I18nProvider>
      <AuthContext.Provider value={value}>
        <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/app" element={<p>App home</p>} />
            <Route path="/app/clientes" element={<ClientsProbe />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </I18nProvider>,
  )
}

describe('LoginPage', () => {
  it('shows the sign-in form when there is no session', () => {
    renderLogin(authValue())

    expect(screen.getByRole('heading', { name: 'Log in' })).toBeTruthy()
    expect(screen.getByPlaceholderText('you@company.com')).toBeTruthy()
  })

  it('sends an authenticated user to the app', () => {
    renderLogin(authValue({ status: 'authenticated', user, role: user.role }))

    expect(screen.getByText('App home')).toBeTruthy()
  })

  it('returns an authenticated user to the protected page they asked for', () => {
    renderLogin(authValue({ status: 'authenticated', user, role: user.role }), {
      from: { pathname: '/app/clientes', search: '?tab=1', hash: '#details' },
    })

    expect(screen.getByText('Clients module ?tab=1#details')).toBeTruthy()
  })

  it('shows a retry state when the session cannot be restored', () => {
    renderLogin(authValue({ status: 'error', sessionError: 'network' }))

    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Log in' })).toBeNull()
  })
})
