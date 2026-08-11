import type { SectionIntro } from '@/features/landing/domain/entities/landing-content'
import type { TechnologyCategory } from '@/features/landing/domain/entities/technology'
import { TechnologyCategoryCard } from '@/features/landing/presentation/components/technology-category-card'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { AppColorClasses, AppGradients } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface TechnologiesSectionProps {
  intro: SectionIntro
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
        'relative scroll-mt-24 overflow-hidden py-20 sm:py-24',
        AppGradients.surfaceAqua,
      )}
    >
      <div className="pointer-events-none absolute inset-0 circuit-tech opacity-55" />

      <Container className="relative">
        <SectionHeader
          eyebrow={intro.eyebrow}
          title="Technology across the"
          titleAccent="entire product lifecycle"
          description={intro.description}
          align="center"
        />

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {technologies.map((category) => (
            <TechnologyCategoryCard key={category.id} category={category} />
          ))}
        </div>
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
