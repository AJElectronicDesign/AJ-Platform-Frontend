import { Container } from '@/shared/components/container'
import { whoWeAreHash } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import {
  AppColorClasses,
  AppImages,
  AppRadius,
  AppShadows,
  AppTextStyles,
} from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function OurPeopleSection() {
  const { t } = useI18n()
  const copy = t.company.people

  return (
    <section
      id={whoWeAreHash.people}
      className={cn('scroll-mt-24 py-16 sm:py-20', AppColorClasses.bg.white)}
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div
            className={cn(
              'relative aspect-[16/10] w-full overflow-hidden',
              AppRadius.lg,
              AppShadows.soft,
            )}
          >
            <img
              src={AppImages.landing.teamPhoto}
              alt={copy.imageAlt}
              width={1680}
              height={1050}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[50%_35%]"
            />
          </div>

          <div>
            <p className={AppTextStyles.eyebrow}>{copy.eyebrow}</p>
            <h2 className={cn(AppTextStyles.h2, 'mt-3')}>{copy.title}</h2>
            <p className={cn(AppTextStyles.body, 'mt-4 max-w-xl')}>
              {copy.description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
