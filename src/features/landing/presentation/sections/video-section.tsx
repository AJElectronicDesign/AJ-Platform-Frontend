import type { LandingContent } from '@/features/landing/domain/entities/landing-content'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import {
  AppColorClasses,
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
      className={cn('scroll-mt-24 py-20 sm:py-24', AppColorClasses.bg.white)}
    >
      <Container>
        <SectionHeader
          title={content.title}
          description={content.description}
          align="center"
        />

        <div
          className={cn(
            'relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-[1.75rem] border',
            AppColorClasses.border.DEFAULT,
            AppColorClasses.bg.white,
            AppShadows.soft,
          )}
        >
          <div className="relative aspect-video bg-ink/5">
            <iframe
              src={content.embedUrl}
              title={content.title}
              className="absolute inset-0 h-full w-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        <p className={cn(AppTextStyles.bodySm, 'mx-auto mt-4 max-w-2xl text-center')}>
          {content.note}
        </p>
      </Container>
    </section>
  )
}
