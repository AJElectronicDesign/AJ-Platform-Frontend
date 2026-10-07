import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { SignInResult } from '@/features/auth/domain/entities/login-credentials'
import { AuthContext, type AuthContextValue } from '@/features/auth/presentation/auth-context'
import { LoginForm } from '@/features/auth/presentation/components/login-form'
import { I18nProvider } from '@/shared/i18n'

function renderForm(signIn: AuthContextValue['signIn']) {
  window.localStorage.setItem('aj-locale', 'en')

  const value: AuthContextValue = {
    user: null,
    role: null,
    status: 'unauthenticated',
    sessionError: null,
    signIn,
    signOut: async () => undefined,
    retry: () => undefined,
  }

  return render(
    <I18nProvider>
      <AuthContext.Provider value={value}>
        <LoginForm />
      </AuthContext.Provider>
    </I18nProvider>,
  )
}

describe('LoginForm', () => {
  it('validates empty email and password before calling sign-in', () => {
    const signIn = vi.fn(async () => ({ success: true }) as SignInResult)
    renderForm(signIn)

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    const alert = screen.getByRole('alert')

    expect(alert.textContent).toBe('Enter your email and password.')
    expect(document.activeElement).toBe(alert)
    expect(signIn).not.toHaveBeenCalled()

    const email = screen.getByPlaceholderText('you@company.com')
    const password = screen.getByPlaceholderText('••••••••')

    expect(email.getAttribute('aria-describedby')).toBe(alert.id)
    expect(password.getAttribute('aria-describedby')).toBe(alert.id)
    expect(email.getAttribute('aria-invalid')).toBe('true')
  })

  it('keeps the fields editable and marks the form busy while submitting', async () => {
    let resolveSignIn: (result: SignInResult) => void = () => undefined
    const signIn = vi.fn(
      () =>
        new Promise<SignInResult>((resolve) => {
          resolveSignIn = resolve
        }),
    )
    renderForm(signIn)

    fireEvent.change(screen.getByPlaceholderText('you@company.com'), {
      target: { value: 'ada@aj-electronic-design.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'secret' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

    const email = screen.getByPlaceholderText('you@company.com') as HTMLInputElement
    const password = screen.getByPlaceholderText('••••••••') as HTMLInputElement
    const form = email.closest('form')

    expect(form?.getAttribute('aria-busy')).toBe('true')
    expect(email.readOnly).toBe(true)
    expect(password.readOnly).toBe(true)
    expect(email.disabled).toBe(false)
    expect(password.disabled).toBe(false)
    expect(screen.getByRole('button', { name: 'Signing in...' }).hasAttribute('disabled')).toBe(
      true,
    )

    resolveSignIn({
      success: true,
      user: {
        id: '1',
        email: 'ada@aj-electronic-design.com',
        name: 'Ada',
        role: 'admin',
      },
    })

    await screen.findByRole('button', { name: 'Log in' })
  })
})
