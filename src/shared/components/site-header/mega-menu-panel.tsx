import { Link } from 'react-router-dom'
import {
  type NavGroupItem,
  type NavLinkItem,
} from '@/shared/constants/navigation'
import { paths } from '@/shared/constants/paths'
import { industries } from '@/shared/corporate-content'
import { localizeServices, useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface MegaMenuPanelProps {
  group: NavGroupItem
  onNavigate: () => void
}

export function MegaMenuPanel({ group, onNavigate }: MegaMenuPanelProps) {
  if (group.id === 'what-we-do') {
    return <WhatWeDoPanel group={group} onNavigate={onNavigate} />
  }

  return <LinkListPanel group={group} onNavigate={onNavigate} />
}

function LinkListPanel({ group, onNavigate }: MegaMenuPanelProps) {
  const { t } = useI18n()

  return (
    <div>
      <p className={AppTextStyles.microLabel}>{t.navigation[group.labelKey]}</p>
      <ul className="mt-4 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {group.children.map((item) => (
          <li key={item.id}>
            <Link
              to={item.to}
              onClick={onNavigate}
              className={cn(
                'block rounded-xl px-3 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brand-50 hover:text-brand-800',
                'focus-visible:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500',
              )}
            >
              {t.navigation[item.labelKey]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function WhatWeDoPanel({ group, onNavigate }: MegaMenuPanelProps) {
  const { t } = useI18n()
  const services = localizeServices(t.home)
  const overview = findChild(group, 'what-overview')
  const servicesLink = findChild(group, 'services')
  const industriesLink = findChild(group, 'industries')

  return (
    <div className="grid gap-10 lg:grid-cols-[0.85fr_1.25fr_0.9fr]">
      <div>
        <p className={AppTextStyles.microLabel}>{t.navigation.overview}</p>
        <Link
          to={overview?.to ?? paths.whatWeDo}
          onClick={onNavigate}
          className={cn(
            'mt-4 block rounded-xl px-3 py-2.5 transition-colors hover:bg-brand-50',
            'focus-visible:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500',
          )}
        >
          <span className="block text-sm font-semibold text-ink">
            {t.company.whatWeDo.title}
          </span>
          <span className={cn(AppTextStyles.bodySm, 'mt-1 block')}>
            {t.company.whatWeDo.description}
          </span>
        </Link>
      </div>

      <div>
        <p className={AppTextStyles.microLabel}>{t.navigation.services}</p>
        <ul className="mt-4 grid gap-1 sm:grid-cols-2">
          {services.map((service) => (
            <li key={service.id}>
              <Link
                to={servicesLink?.to ?? paths.whatWeDo}
                onClick={onNavigate}
                className={cn(
                  'block rounded-xl px-3 py-2.5 transition-colors hover:bg-brand-50',
                  'focus-visible:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500',
                )}
              >
                <span className="block text-sm font-semibold text-ink">
                  {service.title}
                </span>
                <span className={cn(AppTextStyles.caption, 'mt-0.5 block')}>
                  {service.benefit}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className={AppTextStyles.microLabel}>
          {t.navigation.industriesMarkets}
        </p>
        <ul className="mt-4 space-y-1">
          {industries.map((industry) => (
            <li key={industry.id}>
              <Link
                to={industriesLink?.to ?? paths.whatWeDo}
                onClick={onNavigate}
                className={cn(
                  'block rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-brand-50 hover:text-brand-800',
                  'focus-visible:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500',
                )}
              >
                {t.company.industries.items[industry.id]?.title ?? industry.id}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function findChild(group: NavGroupItem, id: string): NavLinkItem | undefined {
  return group.children.find((item) => item.id === id)
}
