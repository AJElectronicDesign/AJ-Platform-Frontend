import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '@/features/auth/presentation/auth-context'
import { RequireRole } from '@/features/auth/presentation/require-role'
import type { AuthUser } from '@/features/auth/domain/entities/user'
import { I18nProvider } from '@/shared/i18n'

const admin: AuthUser = {
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
    signIn: async () => ({ success: false, code: 'unknown', message: 'Unable to sign in.' }),
    signOut: async () => undefined,
    ...overrides,
  }
}

function renderRole(value: AuthContextValue) {
  window.localStorage.setItem('aj-locale', 'en')

  return render(
    <I18nProvider>
      <AuthContext.Provider value={value}>
        <MemoryRouter initialEntries={['/app/admin']}>
          <Routes>
            <Route path="/login" element={<p>Login screen</p>} />
            <Route path="/app" element={<p>Dashboard home</p>} />
            <Route element={<RequireRole roles={['admin']} />}>
              <Route path="/app/admin" element={<p>Admin screen</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </I18nProvider>,
  )
}

describe('RequireRole', () => {
  it('renders the route when the user has an allowed role', () => {
    renderRole(authValue({ status: 'authenticated', user: admin, role: admin.role }))

    expect(screen.getByText('Admin screen')).toBeTruthy()
  })

  it('returns other signed-in roles to the app home', () => {
    renderRole(
      authValue({
        status: 'authenticated',
        role: 'employee',
        user: { ...admin, role: 'employee' },
      }),
    )

    expect(screen.getByText('Dashboard home')).toBeTruthy()
  })

  it('sends anonymous visitors to login', () => {
    renderRole(authValue())

    expect(screen.getByText('Login screen')).toBeTruthy()
  })
})
