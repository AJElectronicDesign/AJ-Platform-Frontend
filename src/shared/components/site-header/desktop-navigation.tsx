import { Link, useLocation } from 'react-router-dom'
import type { NavGroupItem } from '@/shared/constants/navigation'
import { contactNavItem } from '@/shared/constants/navigation'
import { MegaMenuPanel } from '@/shared/components/site-header/mega-menu-panel'
import { useI18n } from '@/shared/i18n'
import { AppIcons, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface DesktopNavigationProps {
  groups: NavGroupItem[]
  openGroupId: string | null
  onToggleGroup: (groupId: string) => void
  onHoverGroup: (groupId: string | null) => void
  onNavigate: () => void
}

export function DesktopNavigation({
  groups,
  openGroupId,
  onToggleGroup,
  onHoverGroup,
  onNavigate,
}: DesktopNavigationProps) {
  const { t } = useI18n()
  const location = useLocation()
  const openGroup = groups.find((group) => group.id === openGroupId) ?? null

  return (
    <div className="hidden lg:block">
      <nav className="flex items-center gap-1" aria-label="Primary">
        {groups.map((group) => {
          const isOpen = openGroupId === group.id
          const isActive = location.pathname === group.to

          return (
            <div
              key={group.id}
              onMouseEnter={() => onHoverGroup(group.id)}
            >
              <button
                type="button"
                className={cn(
                  AppTextStyles.navLink,
                  'inline-flex items-center gap-1',
                  (isOpen || isActive) &&
                    'bg-brand-50 font-semibold text-brand-800 shadow-sm ring-1 ring-brand-100',
                )}
                aria-expanded={isOpen}
                aria-controls={group.panelId}
                aria-haspopup="true"
                onClick={() => onToggleGroup(group.id)}
              >
                {t.navigation[group.labelKey]}
                <AppIcons.chevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
            </div>
          )
        })}

        <Link
          to={contactNavItem.to}
          onClick={onNavigate}
          onMouseEnter={() => onHoverGroup(null)}
          className={cn(
            AppTextStyles.navLink,
            location.hash === '#contact' &&
              location.pathname === '/' &&
              'bg-brand-50 font-semibold text-brand-800 shadow-sm ring-1 ring-brand-100',
          )}
        >
          {t.navigation.contact}
        </Link>
      </nav>

      {openGroup ? (
        <div
          id={openGroup.panelId}
          className="mega-menu-panel absolute inset-x-0 top-full border-b border-border/70 bg-white/95 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          onMouseEnter={() => onHoverGroup(openGroup.id)}
          onMouseLeave={() => onHoverGroup(null)}
        >
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 lg:px-8">
            <MegaMenuPanel group={openGroup} onNavigate={onNavigate} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
