import { useState, type FormEvent } from 'react'
import type { SignInErrorCode } from '@/features/auth/domain/errors/auth-error'
import { useAuth } from '@/features/auth/presentation/use-auth'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/utils/cn'

export function LoginForm() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<{ code: SignInErrorCode; message: string } | null>(
    null,
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await signIn({ email, password })

      if (!result.success) {
        setError({ code: result.code, message: result.message })

        if (result.code === 'invalid_credentials') {
          setPassword('')
        }
      }
    } catch {
      setError({
        code: 'unknown',
        message: 'Unable to start sign-in. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const invalidCredentials = error?.code === 'invalid_credentials'

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-busy={isSubmitting}>
      <label className="block space-y-2">
        <span className={AppTextStyles.label}>Email</span>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isSubmitting}
          aria-invalid={invalidCredentials}
        />
      </label>

      <label className="block space-y-2">
        <span className={AppTextStyles.label}>Password</span>
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={isSubmitting}
          aria-invalid={invalidCredentials}
        />
      </label>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Log in'}
      </Button>

      {error ? (
        <p
          className={cn(
            AppTextStyles.caption,
            'rounded-xl border px-3 py-2',
            'border-red-200 bg-red-50',
            AppColorClasses.text.danger,
          )}
          role="alert"
        >
          {error.message}
        </p>
      ) : null}
    </form>
  )
}
