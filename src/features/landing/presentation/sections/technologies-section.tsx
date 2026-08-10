import type { SectionIntro } from '@/features/landing/domain/entities/landing-content'
import type { Technology } from '@/features/landing/domain/entities/technology'
import { TechnologyPill } from '@/features/landing/presentation/components/technology-pill'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'

export interface TechnologiesSectionProps {
  intro: SectionIntro
  technologies: Technology[]
}

export function TechnologiesSection({
  intro,
  technologies,
}: TechnologiesSectionProps) {
  return (
    <section
      id="technologies"
      className="scroll-mt-24 border-y border-border/70 bg-white py-20 sm:py-24"
    >
      <Container>
        <SectionHeader
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
          align="center"
        />
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {technologies.map((technology) => (
            <TechnologyPill key={technology.id} technology={technology} />
          ))}
        </div>
      </Container>
    </section>
  )
}
