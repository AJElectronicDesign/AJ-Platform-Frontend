import type { TeamSectionContent } from '@/features/landing/domain/entities/landing-content'
import { Container } from '@/shared/components/container'
import {
  AppColorClasses,
  AppImages,
  AppRadius,
  AppShadows,
  AppTextStyles,
} from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface TeamSectionProps {
  content: TeamSectionContent
}

export function TeamSection({ content }: TeamSectionProps) {
  return (
    <section
      className={cn(
        'scroll-mt-24 py-16 sm:py-20',
        AppColorClasses.bg.surface,
      )}
    >
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 xl:gap-16">
          <div
            className={cn(
              'relative aspect-[16/10] w-full overflow-hidden',
              AppRadius.lg,
              AppShadows.soft,
            )}
          >
            <img
              src={AppImages.landing.teamPhoto}
              alt={content.imageAlt}
              width={1680}
              height={1050}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[50%_35%]"
            />
          </div>

          <div className="max-w-xl lg:max-w-none">
            <h2 className={AppTextStyles.h2}>{content.title}</h2>
            <p className={cn(AppTextStyles.body, 'mt-4')}>
              {content.description}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
