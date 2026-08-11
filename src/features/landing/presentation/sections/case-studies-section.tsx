import type { CaseStudy } from '@/features/landing/domain/entities/case-study'
import type { SectionIntro } from '@/features/landing/domain/entities/landing-content'
import { CaseStudyCard } from '@/features/landing/presentation/components/case-study-card'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { AppColorClasses } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface CaseStudiesSectionProps {
  intro: SectionIntro
  caseStudies: CaseStudy[]
}

export function CaseStudiesSection({
  intro,
  caseStudies,
}: CaseStudiesSectionProps) {
  if (caseStudies.length === 0) {
    return null
  }

  return (
    <section
      id="case-studies"
      className={cn(
        'scroll-mt-24 py-20 sm:py-24',
        AppColorClasses.bg.surface,
      )}
    >
      <Container>
        <SectionHeader
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {caseStudies.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
          ))}
        </div>
      </Container>
    </section>
  )
}
