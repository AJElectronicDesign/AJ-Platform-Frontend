import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { InternalBrandLink, InternalSidebar } from '@/features/workspace/presentation/internal-sidebar'
import { InternalTopbar } from '@/features/workspace/presentation/internal-topbar'
import { WorkspaceNavList } from '@/features/workspace/presentation/workspace-nav-list'
import { paths } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppIcons, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function InternalLayout() {
  const { t } = useI18n()
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)

  useEffect(() => {
    if (!isNavigationOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsNavigationOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isNavigationOpen])

  return (
    <div className={cn('flex min-h-screen bg-surface')}>
      <InternalSidebar />

      {isNavigationOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/40"
            aria-label={t.app.shell.closeNavigation}
            onClick={() => setIsNavigationOpen(false)}
          />
          <div className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-border/70 bg-white shadow-[var(--shadow-lift)]">
            <div className="flex h-16 items-center justify-between px-5">
              <InternalBrandLink />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
                aria-label={t.app.shell.closeNavigation}
                onClick={() => setIsNavigationOpen(false)}
              >
                <AppIcons.close className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-1 flex-col px-3 pb-6">
              <WorkspaceNavList onNavigate={() => setIsNavigationOpen(false)} />
              <Link
                to={paths.home}
                className={cn(AppTextStyles.link, 'mt-auto px-3 pt-6')}
                onClick={() => setIsNavigationOpen(false)}
              >
                {t.app.shell.publicSite}
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <InternalTopbar onOpenNavigation={() => setIsNavigationOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
