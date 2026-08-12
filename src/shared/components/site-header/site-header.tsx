import { useEffect, useRef, useState } from 'react'
import { AppLogo } from '@/shared/components/app-logo'
import { Container } from '@/shared/components/container'
import { DesktopNavigation } from '@/shared/components/site-header/desktop-navigation'
import { LanguageSelector } from '@/shared/components/site-header/language-selector'
import { MobileNavigation } from '@/shared/components/site-header/mobile-navigation'
import { MyAjAccess } from '@/shared/components/site-header/my-aj-access'
import { getVisibleNavGroups } from '@/shared/constants/navigation'
import { useI18n } from '@/shared/i18n'
import { useScrollProgress } from '@/shared/hooks/use-scroll-progress'
import { AppColorClasses } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function SiteHeader() {
  const { t } = useI18n()
  const groups = getVisibleNavGroups()
  const scrollProgress = useScrollProgress()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openGroupId, setOpenGroupId] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const closeTimerRef = useRef<number | undefined>(undefined)

  function clearCloseTimer() {
    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = undefined
  }

  function closeMegaMenu() {
    clearCloseTimer()
    setOpenGroupId(null)
  }

  function openGroup(groupId: string) {
    clearCloseTimer()
    setOpenGroupId(groupId)
  }

  function scheduleClose() {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setOpenGroupId(null)
    }, 140)
  }

  function closeMobile() {
    setIsMobileOpen(false)
    closeMegaMenu()
  }

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        closeMegaMenu()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (openGroupId) {
          event.preventDefault()
          closeMegaMenu()
          return
        }

        if (isMobileOpen) {
          event.preventDefault()
          setIsMobileOpen(false)
        }
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileOpen, openGroupId])

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-border/70 bg-white/80 backdrop-blur-xl"
      onMouseLeave={scheduleClose}
      onMouseEnter={clearCloseTimer}
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
        <AppLogo />

        <DesktopNavigation
          groups={groups}
          openGroupId={openGroupId}
          onToggleGroup={(groupId) =>
            setOpenGroupId((current) => (current === groupId ? null : groupId))
          }
          onHoverGroup={(groupId) => {
            if (groupId) {
              openGroup(groupId)
              return
            }

            scheduleClose()
          }}
          onNavigate={closeMobile}
        />

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search: future capability. Do not render an inert control. */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            <LanguageSelector />
            <MyAjAccess />
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 lg:hidden"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileOpen ? t.common.closeMenu : t.common.openMenu}
            onClick={() => setIsMobileOpen((current) => !current)}
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={cn(
                  'absolute left-0 top-0 h-0.5 w-4 rounded-full bg-current transition-transform duration-200',
                  isMobileOpen && 'top-1.5 rotate-45',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-1.5 h-0.5 w-4 rounded-full bg-current transition-opacity duration-200',
                  isMobileOpen && 'opacity-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-3 h-0.5 w-4 rounded-full bg-current transition-transform duration-200',
                  isMobileOpen && 'top-1.5 -rotate-45',
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      <div className="h-0.5 w-full bg-brand-50" aria-hidden="true">
        <div
          className={cn(
            'h-full transition-[width] duration-150 ease-out',
            AppColorClasses.bg.brand700,
          )}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <MobileNavigation
        groups={groups}
        open={isMobileOpen}
        onNavigate={closeMobile}
      />
    </header>
  )
}
