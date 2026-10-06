import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '@/features/auth/presentation/auth-context'
import { LoginPage } from '@/features/auth/presentation/pages/login-page'
import type { AuthUser } from '@/features/auth/domain/entities/user'

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
    signIn: async () => ({ success: false, code: 'unknown', message: 'Unable to sign in.' }),
    signOut: async () => undefined,
    ...overrides,
  }
}

function renderLogin(value: AuthContextValue, state?: unknown) {
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app" element={<p>App home</p>} />
          <Route path="/app/clientes" element={<p>Clients module</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
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
      from: { pathname: '/app/clientes' },
    })

    expect(screen.getByText('Clients module')).toBeTruthy()
  })
})
