import { Link, Outlet } from 'react-router-dom'
import { AppLogo } from '@/shared/components/app-logo'
import { Container } from '@/shared/components/container'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function AuthLayout() {
  return (
    <div className={cn('flex min-h-screen flex-col', AppColorClasses.bg.surface)}>
      <header className="border-b border-border/70 bg-white/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between lg:h-[4.25rem]">
          <AppLogo />
          <Link to="/" className={AppTextStyles.link}>
            Back to home
          </Link>
        </Container>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
