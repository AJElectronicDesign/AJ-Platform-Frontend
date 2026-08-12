import { Link } from 'react-router-dom'
import { AppLogo } from '@/shared/components/app-logo'
import { Container } from '@/shared/components/container'
import { brand } from '@/shared/constants/brand'
import {
  contactNavItem,
  getVisibleNavGroups,
  myAjHref,
} from '@/shared/constants/navigation'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function SiteFooter() {
  const { t } = useI18n()
  const groups = getVisibleNavGroups()

  return (
    <footer
      className={cn(
        'relative border-t',
        AppColorClasses.border.DEFAULT,
        AppColorClasses.bg.surface,
      )}
    >
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <AppLogo />
            <p className={cn(AppTextStyles.bodySm, 'mt-4 max-w-xs')}>
              {brand.tagline}
            </p>
          </div>

          <div>
            <p className={AppTextStyles.microLabel}>{t.common.navigate}</p>
            <ul className="mt-4 space-y-2.5">
              {groups.map((group) => (
                <li key={group.id}>
                  <Link to={group.to} className={AppTextStyles.link}>
                    {t.navigation[group.labelKey]}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={contactNavItem.to} className={AppTextStyles.link}>
                  {t.navigation.contact}
                </Link>
              </li>
              <li>
                <Link to={myAjHref} className={AppTextStyles.link}>
                  {t.common.myAj}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className={AppTextStyles.microLabel}>{t.common.contact}</p>
            <ul className={cn('mt-4 space-y-2.5', AppTextStyles.bodySm)}>
              <li>
                <a
                  href={`mailto:${brand.contact.email}`}
                  className="transition-colors hover:text-brand-700"
                >
                  {brand.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${brand.contact.phone.replace(/[^\d+]/g, '')}`}
                  className="transition-colors hover:text-brand-700"
                >
                  {brand.contact.phone}
                </a>
              </li>
              <li>{brand.contact.location}</li>
            </ul>
          </div>

          <div>
            <p className={AppTextStyles.microLabel}>{t.common.social}</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={brand.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className={AppTextStyles.link}
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={brand.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className={AppTextStyles.link}
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={brand.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className={AppTextStyles.link}
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={cn(
            'mt-12 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between',
            AppColorClasses.border.DEFAULT,
          )}
        >
          <p className={AppTextStyles.bodySm}>{t.common.copyright}</p>
          <p
            className={cn(
              AppTextStyles.microLabel,
              AppColorClasses.text.inkSubtle,
            )}
          >
            {brand.platformName}
          </p>
        </div>
      </Container>
    </footer>
  )
}
