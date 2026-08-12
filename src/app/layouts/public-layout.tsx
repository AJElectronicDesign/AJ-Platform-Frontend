import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { AppLogo } from '@/shared/components/app-logo'
import { Container } from '@/shared/components/container'
import {
  publicNavigation,
  publicSectionIds,
} from '@/shared/constants/navigation'
import { useActiveSection } from '@/shared/hooks/use-active-section'
import { useScrollProgress } from '@/shared/hooks/use-scroll-progress'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

export function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const activeSectionId = useActiveSection(publicSectionIds)
  const scrollProgress = useScrollProgress()

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-white/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
          <AppLogo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {publicNavigation.map((item) => {
              const isActive = activeSectionId === item.sectionId

              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    AppTextStyles.navLink,
                    isActive &&
                      'bg-brand-50 font-semibold text-brand-800 shadow-sm ring-1 ring-brand-100',
                  )}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className={cn(
                AppTextStyles.navLink,
                'hidden sm:inline-flex',
              )}
            >
              Portal Access
            </Link>
            <a
              href={`${import.meta.env.BASE_URL}#contact`}
              className="hidden md:inline-flex"
            >
              <Button size="sm">Request a quotation</Button>
            </a>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 lg:hidden"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span className="sr-only">Menu</span>
              <span className="relative block h-3.5 w-4">
                <span
                  className={cn(
                    'absolute left-0 top-0 h-0.5 w-4 rounded-full bg-current transition-transform duration-200',
                    isMenuOpen && 'top-1.5 rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-1.5 h-0.5 w-4 rounded-full bg-current transition-opacity duration-200',
                    isMenuOpen && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-3 h-0.5 w-4 rounded-full bg-current transition-transform duration-200',
                    isMenuOpen && 'top-1.5 -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>
        </Container>

        <div
          className="h-0.5 w-full bg-brand-50"
          aria-hidden="true"
        >
          <div
            className={cn('h-full transition-[width] duration-150 ease-out', AppColorClasses.bg.brand700)}
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div
          id="mobile-navigation"
          className={cn(
            'border-t border-border/70 bg-white lg:hidden',
            isMenuOpen ? 'block' : 'hidden',
          )}
        >
          <Container className="flex flex-col gap-1 py-4">
            {publicNavigation.map((item) => {
              const isActive = activeSectionId === item.sectionId

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 font-semibold text-brand-800'
                      : 'text-ink-muted hover:bg-brand-50 hover:text-brand-800',
                  )}
                >
                  {item.label}
                </a>
              )
            })}
            <a
              href={`${import.meta.env.BASE_URL}#contact`}
              onClick={closeMenu}
              className="mt-2 md:hidden"
            >
              <Button className="w-full">Request a quotation</Button>
            </a>
            <Link
              to="/login"
              onClick={closeMenu}
              className={cn(
                'mt-2 rounded-xl border px-3 py-3 text-center text-sm font-medium transition-colors',
                AppColorClasses.border.DEFAULT,
                'text-ink-muted hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800',
              )}
            >
              Portal Access
            </Link>
          </Container>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
