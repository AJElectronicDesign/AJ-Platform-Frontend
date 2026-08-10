import type { CaseStudy } from '@/features/landing/domain/entities/case-study'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'

export interface CaseStudyCardProps {
  caseStudy: CaseStudy
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Card className="group overflow-hidden p-0 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]">
      <div
        className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100 grid-tech"
        role="img"
        aria-label={caseStudy.imageAlt ?? caseStudy.title}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgb(13_148_136/0.18),transparent_55%)]" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          {caseStudy.industry ? <Badge>{caseStudy.industry}</Badge> : null}
          <span className="rounded-full bg-white/90 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-brand-800 ring-1 ring-border">
            Case study
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold tracking-tight text-ink">
          {caseStudy.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {caseStudy.summary}
        </p>
        {caseStudy.outcome ? (
          <p className="mt-4 text-sm font-medium text-brand-700">
            {caseStudy.outcome}
          </p>
        ) : null}
      </div>
    </Card>
  )
}
