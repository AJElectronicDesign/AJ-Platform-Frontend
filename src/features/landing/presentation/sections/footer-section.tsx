import { Link } from 'react-router-dom'
import { brand } from '@/shared/constants/brand'
import { publicNavigation } from '@/shared/constants/navigation'
import { Container } from '@/shared/components/container'
import { AppLogo } from '@/shared/components/app-logo'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface FooterSectionProps {
  copyright: string
  email: string
  phone: string
  location: string
}

export function FooterSection({
  copyright,
  email,
  phone,
  location,
}: FooterSectionProps) {
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
            <p className={AppTextStyles.microLabel}>Navigate</p>
            <ul className="mt-4 space-y-2.5">
              {publicNavigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={AppTextStyles.link}>
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/login" className={AppTextStyles.link}>
                  Portal Access
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className={AppTextStyles.microLabel}>Contact</p>
            <ul className={cn('mt-4 space-y-2.5', AppTextStyles.bodySm)}>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-brand-700"
                >
                  {email}
                </a>
              </li>
              <li>{phone}</li>
              <li>{location}</li>
            </ul>
          </div>

          <div>
            <p className={AppTextStyles.microLabel}>Social</p>
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
          <p className={AppTextStyles.bodySm}>{copyright}</p>
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
