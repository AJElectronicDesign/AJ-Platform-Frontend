import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import type { SignInErrorCode } from '@/features/auth/domain/errors/auth-error'
import { useAuth } from '@/features/auth/presentation/use-auth'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/utils/cn'

type FormErrorCode = SignInErrorCode | 'validation'

export function LoginForm() {
  const { t } = useI18n()
  const copy = t.auth.login
  const { signIn } = useAuth()
  const errorId = useId()
  const errorRef = useRef<HTMLParagraphElement>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<FormErrorCode | null>(null)

  useEffect(() => {
    if (!error) {
      return
    }

    errorRef.current?.focus()
  }, [error])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('validation')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signIn({ email, password })

      if (!result.success) {
        setError(result.code)

        if (result.code === 'invalid_credentials') {
          setPassword('')
        }
      }
    } catch {
      setError('unknown')
    } finally {
      setIsSubmitting(false)
    }
  }

  const invalid = error === 'invalid_credentials' || error === 'validation'
  const describedBy = error ? errorId : undefined

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-busy={isSubmitting}>
      <label className="block space-y-2">
        <span className={AppTextStyles.label}>{copy.email}</span>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder={copy.emailPlaceholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          readOnly={isSubmitting}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        />
      </label>

      <label className="block space-y-2">
        <span className={AppTextStyles.label}>{copy.password}</span>
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder={copy.passwordPlaceholder}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          readOnly={isSubmitting}
          aria-invalid={invalid}
          aria-describedby={describedBy}
        />
      </label>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? copy.submitting : copy.submit}
      </Button>

      {error ? (
        <p
          id={errorId}
          ref={errorRef}
          tabIndex={-1}
          className={cn(
            AppTextStyles.caption,
            'rounded-xl border px-3 py-2',
            'border-red-200 bg-red-50',
            AppColorClasses.text.danger,
          )}
          role="alert"
        >
          {copy[error]}
        </p>
      ) : null}
    </form>
  )
}
