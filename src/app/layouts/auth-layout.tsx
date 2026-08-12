import { Link, Outlet } from 'react-router-dom'
import { AppLogo } from '@/shared/components/app-logo'
import { Container } from '@/shared/components/container'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function AuthLayout() {
  const { t } = useI18n()

  return (
    <div className={cn('flex min-h-screen flex-col', AppColorClasses.bg.surface)}>
      <header className="border-b border-border/70 bg-white/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between lg:h-[4.25rem]">
          <AppLogo />
          <Link to="/" className={AppTextStyles.link}>
            {t.common.backToHome}
          </Link>
        </Container>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
