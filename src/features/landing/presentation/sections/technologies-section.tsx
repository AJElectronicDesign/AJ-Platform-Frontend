import type { TechnologiesSectionContent } from '@/features/landing/domain/entities/landing-content'
import type { TechnologyCategory } from '@/shared/corporate-content'
import { TechnologiesGrid } from '@/shared/components/corporate/technologies-grid'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { AppColorClasses, AppGradients, AppShadows } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface TechnologiesSectionProps {
  intro: TechnologiesSectionContent
  technologies: TechnologyCategory[]
}

export function TechnologiesSection({
  intro,
  technologies,
}: TechnologiesSectionProps) {
  return (
    <section
      id="technologies"
      className={cn(
        'relative scroll-mt-24 overflow-hidden py-16 sm:py-20',
        AppGradients.surfaceAqua,
      )}
    >
      <div className="pointer-events-none absolute inset-0 circuit-tech opacity-55" />

      <Container className="relative">
        <SectionHeader
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          align="center"
        />

        <ol className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:mt-8">
          {intro.pipeline.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold tracking-wide',
                  AppColorClasses.border.brand100,
                  AppColorClasses.bg.white,
                  AppColorClasses.text.brand800,
                  AppShadows.soft,
                )}
              >
                {step}
              </span>
              {index < intro.pipeline.length - 1 ? (
                <span
                  className={cn(
                    'hidden text-sm sm:inline',
                    AppColorClasses.text.brand500,
                  )}
                  aria-hidden="true"
                >
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <TechnologiesGrid className="mt-10 sm:mt-12" technologies={technologies} />
      </Container>

      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-px',
          AppColorClasses.border.brand100,
          'bg-brand-100',
        )}
        aria-hidden="true"
      />
    </section>
  )
}
