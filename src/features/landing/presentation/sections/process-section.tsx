import type {
  ProcessStep,
  SectionIntro,
} from '@/features/landing/domain/entities/landing-content'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'

export interface ProcessSectionProps {
  intro: SectionIntro
  steps: ProcessStep[]
}

export function ProcessSection({ intro, steps }: ProcessSectionProps) {
  return (
    <section id="process" className="scroll-mt-24 bg-surface-muted py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
        />

        <ol className="relative mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div className="pointer-events-none absolute left-[8%] right-[8%] top-8 hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent xl:block" />

          {steps.map((step, index) => (
            <li
              key={step.id}
              className="relative rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 font-mono text-xs font-semibold text-white">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-ink">
                  {step.label}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
