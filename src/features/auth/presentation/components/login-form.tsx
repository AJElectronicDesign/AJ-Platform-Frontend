import { useState, type FormEvent } from 'react'
import { signIn } from '@/features/auth/application/use-cases/sign-in'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/utils/cn'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setFeedback(null)

    try {
      const result = await signIn({ email, password })
      setFeedback(result.message)
    } catch {
      setFeedback('Unable to start sign-in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
        />
      </label>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Log in'}
      </Button>

      {feedback ? (
        <p
          className={cn(
            AppTextStyles.caption,
            'rounded-xl border px-3 py-2',
            AppColorClasses.border.brand100,
            AppColorClasses.bg.brand50,
            AppColorClasses.text.brand800,
          )}
          role="status"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  )
}
