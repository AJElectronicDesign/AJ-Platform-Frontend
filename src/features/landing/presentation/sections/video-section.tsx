import type { LandingContent } from '@/features/landing/domain/entities/landing-content'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import {
  AppColorClasses,
  AppRadius,
  AppShadows,
  AppTextStyles,
} from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface VideoSectionProps {
  content: LandingContent['video']
}

export function VideoSection({ content }: VideoSectionProps) {
  return (
    <section
      id="video"
      className={cn(
        'scroll-mt-24 overflow-x-clip py-16 sm:py-24',
        AppColorClasses.bg.surfaceAlt,
      )}
    >
      <Container className="min-w-0">
        <SectionHeader
          title={content.title}
          description={content.description}
          align="center"
        />

        <div className="mx-auto mt-8 w-full min-w-0 max-w-4xl sm:mt-12">
          <div
            className={cn(
              'w-full min-w-0 overflow-hidden border',
              AppRadius.lg,
              'sm:rounded-[1.75rem]',
              AppColorClasses.border.DEFAULT,
              AppColorClasses.bg.white,
              AppShadows.soft,
            )}
          >
            <div className="relative w-full min-w-0 overflow-hidden pt-[56.25%]">
              <iframe
                src={content.embedUrl}
                title={content.title}
                className="absolute inset-0 h-full w-full max-w-full border-0"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>

        <p
          className={cn(
            AppTextStyles.bodySm,
            'mx-auto mt-4 max-w-2xl px-1 text-center',
          )}
        >
          {content.note}
        </p>
      </Container>
    </section>
  )
}
