import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { NavGroupItem } from '@/shared/constants/navigation'
import { contactNavItem } from '@/shared/constants/navigation'
import { LanguageSelector } from '@/shared/components/site-header/language-selector'
import { MyAjAccess } from '@/shared/components/site-header/my-aj-access'
import { useI18n } from '@/shared/i18n'
import { AppIcons } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface MobileNavigationProps {
  groups: NavGroupItem[]
  open: boolean
  onNavigate: () => void
}

export function MobileNavigation({
  groups,
  open,
  onNavigate,
}: MobileNavigationProps) {
  const { t } = useI18n()
  const location = useLocation()
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null)

  if (!open) {
    return null
  }

  return (
    <div
      id="mobile-navigation"
      className="border-t border-border/70 bg-white lg:hidden"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-6">
        {groups.map((group) => {
          const isExpanded = openAccordionId === group.id
          const isActive = location.pathname === group.to
          const panelId = `${group.panelId}-mobile`

          return (
            <div key={group.id} className="border-b border-border/60 py-1">
              <button
                type="button"
                className={cn(
                  'flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors',
                  isActive || isExpanded
                    ? 'bg-brand-50 font-semibold text-brand-800'
                    : 'text-ink-muted hover:bg-brand-50 hover:text-brand-800',
                )}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() =>
                  setOpenAccordionId((current) =>
                    current === group.id ? null : group.id,
                  )
                }
              >
                {t.navigation[group.labelKey]}
                <AppIcons.chevronDown
                  className={cn(
                    'h-4 w-4 transition-transform duration-200',
                    isExpanded && 'rotate-180',
                  )}
                />
              </button>

              {isExpanded ? (
                <div id={panelId} className="flex flex-col gap-1 pb-3 pl-2 pt-1">
                  {group.children.map((item) => (
                    <Link
                      key={item.id}
                      to={item.to}
                      onClick={onNavigate}
                      className="min-h-11 rounded-xl px-3 py-3 text-sm text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-800"
                    >
                      {t.navigation[item.labelKey]}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}

        <Link
          to={contactNavItem.to}
          onClick={onNavigate}
          className={cn(
            'min-h-11 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
            location.hash === '#contact' && location.pathname === '/'
              ? 'bg-brand-50 font-semibold text-brand-800'
              : 'text-ink-muted hover:bg-brand-50 hover:text-brand-800',
          )}
        >
          {t.navigation.contact}
        </Link>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
          <LanguageSelector />
          <MyAjAccess onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  )
}
