import { Link, Navigate, useLocation } from 'react-router-dom'
import { LoginForm } from '@/features/auth/presentation/components/login-form'
import { SessionErrorState } from '@/features/auth/presentation/session-error'
import { SessionLoading } from '@/features/auth/presentation/session-loading'
import { useAuth } from '@/features/auth/presentation/use-auth'
import { Container } from '@/shared/components/container'
import { paths } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import {
  AppColorClasses,
  AppGradients,
  AppShadows,
  AppTextStyles,
} from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

interface ReturnLocation {
  pathname: string
  search: string
  hash: string
}

function returnTo(state: unknown): ReturnLocation {
  const fallback: ReturnLocation = { pathname: paths.app, search: '', hash: '' }

  if (!state || typeof state !== 'object' || !('from' in state)) {
    return fallback
  }

  const from = (
    state as { from?: { pathname?: unknown; search?: unknown; hash?: unknown } }
  ).from

  if (!from || typeof from.pathname !== 'string') {
    return fallback
  }

  if (from.pathname !== paths.app && !from.pathname.startsWith(`${paths.app}/`)) {
    return fallback
  }

  return {
    pathname: from.pathname,
    search: typeof from.search === 'string' ? from.search : '',
    hash: typeof from.hash === 'string' ? from.hash : '',
  }
}

export function LoginPage() {
  const { t } = useI18n()
  const copy = t.auth.login
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <SessionLoading fill={false} />
  }

  if (status === 'error') {
    return <SessionErrorState fill={false} />
  }

  if (status === 'authenticated') {
    return <Navigate to={returnTo(location.state)} replace />
  }

  return (
    <section
      className={cn(
        'relative flex min-h-[calc(100vh-4.25rem)] items-center overflow-hidden py-12 sm:py-16',
        AppGradients.surfaceAqua,
      )}
    >
      <div className="pointer-events-none absolute inset-0 circuit-tech opacity-55" />

      <Container className="relative w-full max-w-md">
        <div
          className={cn(
            'rounded-3xl border p-6 sm:p-8',
            AppColorClasses.border.DEFAULT,
            AppColorClasses.bg.white,
            AppShadows.soft,
          )}
        >
          <div className="mb-8">
            <p className={AppTextStyles.eyebrow}>{copy.eyebrow}</p>
            <h1 className={cn(AppTextStyles.h2, 'mt-3 text-3xl sm:text-3xl')}>{copy.title}</h1>
            <p className={cn(AppTextStyles.bodySm, 'mt-2')}>{copy.description}</p>
          </div>

          <LoginForm />

          <p className={cn(AppTextStyles.caption, 'mt-6 text-center')}>
            {copy.publicSitePrompt}{' '}
            <Link
              to="/"
              className={cn(
                'font-medium',
                AppColorClasses.text.brand700,
                AppColorClasses.hover.textBrand800,
              )}
            >
              {copy.backHome}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}
