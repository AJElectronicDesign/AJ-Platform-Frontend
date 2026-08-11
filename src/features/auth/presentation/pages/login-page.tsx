import { Link } from 'react-router-dom'
import { LoginForm } from '@/features/auth/presentation/components/login-form'
import { Container } from '@/shared/components/container'
import {
  AppColorClasses,
  AppGradients,
  AppShadows,
  AppTextStyles,
} from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function LoginPage() {
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
            <p className={AppTextStyles.eyebrow}>Internal access</p>
            <h1 className={cn(AppTextStyles.h2, 'mt-3 text-3xl sm:text-3xl')}>
              Log in
            </h1>
            <p className={cn(AppTextStyles.bodySm, 'mt-2')}>
              Sign in to access the AJ Electronic Design Platform.
            </p>
          </div>

          <LoginForm />

          <p className={cn(AppTextStyles.caption, 'mt-6 text-center')}>
            Looking for our public site?{' '}
            <Link
              to="/"
              className={cn(
                'font-medium',
                AppColorClasses.text.brand700,
                AppColorClasses.hover.textBrand800,
              )}
            >
              Back to home
            </Link>
          </p>
        </div>
      </Container>
    </section>
  )
}
