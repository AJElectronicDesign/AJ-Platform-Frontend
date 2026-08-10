import type { ValuePropositionContent } from '@/features/landing/domain/entities/landing-content'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { Card } from '@/shared/ui/card'

export interface ValuePropositionSectionProps {
  content: ValuePropositionContent
}

export function ValuePropositionSection({
  content,
}: ValuePropositionSectionProps) {
  return (
    <section className="bg-surface-muted py-20 sm:py-24">
      <Container>
        <SectionHeader
          title={content.title}
          description={content.description}
          align="center"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {content.pillars.map((pillar, index) => (
            <Card
              key={pillar.id}
              className="bg-white/90 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-brand-700">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
