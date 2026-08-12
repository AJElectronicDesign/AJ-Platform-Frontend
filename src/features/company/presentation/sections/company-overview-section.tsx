import { Link } from 'react-router-dom'
import { Container } from '@/shared/components/container'
import { paths } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import {
  AppColorClasses,
  AppImages,
  AppRadius,
  AppShadows,
  AppTextStyles,
} from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

export function CompanyOverviewSection() {
  const { t } = useI18n()
  const copy = t.company.overview

  return (
    <section className={cn('scroll-mt-24 py-16 sm:py-20', AppColorClasses.bg.white)}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className={AppTextStyles.eyebrow}>{copy.eyebrow}</p>
            <h1 className={cn(AppTextStyles.h1, 'mt-4')}>{copy.title}</h1>
            <p className={cn(AppTextStyles.h3, 'mt-4 text-brand-800')}>
              {copy.headline}
            </p>
            {copy.paragraphs.map((paragraph) => (
              <p key={paragraph} className={cn(AppTextStyles.body, 'mt-4 max-w-xl')}>
                {paragraph}
              </p>
            ))}
            <div className="mt-8">
              <Link to={paths.contact}>
                <Button size="lg">{copy.ctaLabel}</Button>
              </Link>
            </div>
          </div>

          <div
            className={cn(
              'relative aspect-[4/3] w-full overflow-hidden',
              AppRadius.lg,
              AppShadows.soft,
            )}
          >
            <img
              src={AppImages.landing.productDevelopment}
              alt={copy.imageAlt}
              width={1600}
              height={1200}
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
