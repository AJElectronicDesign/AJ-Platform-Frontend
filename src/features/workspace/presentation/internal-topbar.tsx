import { useState } from 'react'
import { useAuth } from '@/features/auth/presentation/use-auth'
import { LanguageSelector } from '@/shared/components/site-header/language-selector'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  const letters = parts.map((part) => part[0]?.toUpperCase() ?? '').join('')

  return letters || 'AJ'
}

export function InternalTopbar({ onOpenNavigation }: { onOpenNavigation: () => void }) {
  const { t } = useI18n()
  const { user, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      await signOut()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:h-[4.25rem] lg:px-8">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 lg:hidden"
          aria-label={t.app.shell.openNavigation}
          onClick={onOpenNavigation}
        >
          <span className="relative block h-3.5 w-4" aria-hidden="true">
            <span className="absolute left-0 top-0 h-0.5 w-4 rounded-full bg-current" />
            <span className="absolute left-0 top-1.5 h-0.5 w-4 rounded-full bg-current" />
            <span className="absolute left-0 top-3 h-0.5 w-4 rounded-full bg-current" />
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LanguageSelector />

          {user ? (
            <div className="flex items-center gap-2.5">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-800"
                aria-hidden="true"
              >
                {initials(user.name)}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className={cn(AppTextStyles.bodyMd, 'block truncate')}>
                  {user.name}
                </span>
                <span className={cn(AppTextStyles.caption, 'block truncate capitalize')}>
                  {user.role}
                </span>
              </span>
            </div>
          ) : null}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? t.app.shell.loggingOut : t.app.shell.logout}
          </Button>
        </div>
      </div>
    </header>
  )
}
