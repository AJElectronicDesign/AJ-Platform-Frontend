import type { HeroContent } from '@/features/landing/domain/entities/landing-content'
import { Container } from '@/shared/components/container'
import {
  AppColorClasses,
  AppImages,
  AppRadius,
  AppTextStyles,
} from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

export interface HeroSectionProps {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b',
        AppColorClasses.border.DEFAULT,
      )}
    >
      <img
        src={AppImages.landing.heroBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
      />

      <Container className="relative py-20 sm:py-24 lg:py-32">
        <div className="fade-up relative max-w-2xl">
          {/* Soft panel only behind the copy — image stays clear around it */}
          <div
            className={cn(
              'pointer-events-none absolute -inset-x-5 -inset-y-6 sm:-inset-x-8 sm:-inset-y-8',
              AppRadius.xl,
              'bg-white/78 backdrop-blur-[2px] ring-1 ring-white/50',
            )}
            aria-hidden="true"
          />

          <div className="relative px-1 sm:px-2">
            <p className={AppTextStyles.eyebrow}>{content.eyebrow}</p>
            <h1 className={cn(AppTextStyles.display, 'mt-5')}>{content.title}</h1>
            <p
              className={cn(
                AppTextStyles.body,
                'mt-5 max-w-xl font-medium text-ink/90',
              )}
            >
              {content.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={content.primaryCta.href}>
                <Button size="lg">{content.primaryCta.label}</Button>
              </a>
              <a href={content.secondaryCta.href}>
                <Button size="lg" variant="secondary">
                  {content.secondaryCta.label}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
