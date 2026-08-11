import type {
  ProcessStep,
  SectionIntro,
} from '@/features/landing/domain/entities/landing-content'
import { Container } from '@/shared/components/container'
import { IconFrame } from '@/shared/components/icon-frame'
import { SectionHeader } from '@/shared/components/section-header'
import {
  AppColorClasses,
  AppIcons,
  AppRadius,
  AppShadows,
  AppTextStyles,
  type AppIconKey,
} from '@/shared/theme'
import { CardGlowShell } from '@/shared/ui/card-glow-shell'
import { cn } from '@/shared/utils/cn'

export interface ProcessSectionProps {
  intro: SectionIntro
  steps: ProcessStep[]
}

const stepIcons: Record<string, AppIconKey> = {
  discovery: 'api',
  engineering: 'hardware',
  prototype: 'pcb',
  validation: 'firmware',
  manufacture: 'manufacture',
  delivery: 'arrowRight',
}

const phases = [
  {
    id: 'define-build',
    code: '01',
    label: 'Define & build',
    description: 'Shape the product and engineer the first working units.',
    stepIds: ['discovery', 'engineering', 'prototype'],
  },
  {
    id: 'prove-deliver',
    code: '02',
    label: 'Prove & deliver',
    description: 'Validate reliability and move into production-ready delivery.',
    stepIds: ['validation', 'manufacture', 'delivery'],
  },
] as const

export function ProcessSection({ intro, steps }: ProcessSectionProps) {
  const stepsById = new Map(steps.map((step) => [step.id, step]))

  return (
    <section
      id="process"
      className={cn(
        'relative scroll-mt-24 overflow-hidden py-20 sm:py-24',
        AppColorClasses.bg.surface,
      )}
    >
      <Container className="relative">
        <SectionHeader
          eyebrow={intro.eyebrow}
          title="A clear path from"
          titleAccent="idea to delivery"
          description={intro.description}
        />

        <div className="mt-12 space-y-8 lg:mt-14 lg:space-y-10">
          {phases.map((phase, phaseIndex) => {
            const phaseSteps = phase.stepIds
              .map((id) => stepsById.get(id))
              .filter((step): step is ProcessStep => Boolean(step))

            return (
              <div key={phase.id} className="relative">
                {phaseIndex > 0 ? (
                  <div
                    className="mx-auto mb-8 hidden h-8 w-px bg-gradient-to-b from-brand-200 to-brand-100 lg:block"
                    aria-hidden="true"
                  />
                ) : null}

                <CardGlowShell>
                <div
                  className={cn(
                    'card-glow-face overflow-hidden border transition-[border-color] duration-300',
                    AppRadius.xl,
                    AppColorClasses.border.DEFAULT,
                    AppColorClasses.bg.white,
                    AppShadows.soft,
                    'group-hover:border-brand-500/50',
                  )}
                >
                  <div
                    className={cn(
                      'flex flex-col gap-3 border-b bg-white px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-6',
                      AppColorClasses.border.brand100,
                    )}
                  >
                    <div>
                      <p className={AppTextStyles.microLabel}>
                        Phase {phase.code}
                      </p>
                      <h3 className={cn(AppTextStyles.h3, 'mt-2 text-xl')}>
                        {phase.label}
                      </h3>
                    </div>
                    <p
                      className={cn(
                        AppTextStyles.bodySm,
                        'max-w-md sm:text-right',
                      )}
                    >
                      {phase.description}
                    </p>
                  </div>

                  <ol className="relative grid gap-0 md:grid-cols-3">
                    {phaseSteps.map((step, index) => {
                      const globalIndex = steps.findIndex((s) => s.id === step.id)
                      const Icon = AppIcons[stepIcons[step.id] ?? 'circle']
                      const isLast = index === phaseSteps.length - 1

                      return (
                        <li
                          key={step.id}
                          className={cn(
                            'group relative p-5 sm:p-6',
                            !isLast &&
                              'border-b md:border-b-0 md:border-r',
                            AppColorClasses.border.DEFAULT,
                          )}
                        >
                          {/* Desktop connector node */}
                          {!isLast ? (
                            <span
                              className="pointer-events-none absolute right-0 top-10 z-[1] hidden h-2.5 w-2.5 translate-x-1/2 rounded-full bg-brand-300 ring-4 ring-white md:block"
                              aria-hidden="true"
                            />
                          ) : null}

                          <div className="flex items-start gap-3">
                            <IconFrame
                              tone="soft"
                              size="md"
                              className="transition-colors group-hover:bg-brand-100"
                            >
                              <Icon className="h-4 w-4" />
                            </IconFrame>
                            <div className="min-w-0">
                              <p className={AppTextStyles.microLabel}>
                                Step {String(globalIndex + 1).padStart(2, '0')}
                              </p>
                              <h4 className={cn(AppTextStyles.h3, 'mt-1.5')}>
                                {step.label}
                              </h4>
                            </div>
                          </div>

                          <p className={cn(AppTextStyles.bodySm, 'mt-4')}>
                            {step.description}
                          </p>

                          <div
                            className={cn(
                              'mt-5 h-px w-10 transition-all duration-300',
                              'bg-brand-200 group-hover:w-16 group-hover:bg-brand-400',
                            )}
                            aria-hidden="true"
                          />
                        </li>
                      )
                    })}
                  </ol>
                </div>
                </CardGlowShell>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
