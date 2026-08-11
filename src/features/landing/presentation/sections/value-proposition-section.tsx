import type { ValuePropositionContent } from '@/features/landing/domain/entities/landing-content'
import { Container } from '@/shared/components/container'
import { IconFrame } from '@/shared/components/icon-frame'
import { SectionHeader } from '@/shared/components/section-header'
import { AppColorClasses, AppIcons, AppTextStyles } from '@/shared/theme'
import { Card } from '@/shared/ui/card'
import { cn } from '@/shared/utils/cn'

export interface ValuePropositionSectionProps {
  content: ValuePropositionContent
}

const pillarIcons = [
  AppIcons.hardware,
  AppIcons.software,
  AppIcons.manufacture,
] as const

export function ValuePropositionSection({
  content,
}: ValuePropositionSectionProps) {
  return (
    <section className={cn('py-20 sm:py-24', AppColorClasses.bg.surface)}>
      <Container>
        <SectionHeader
          title={content.title}
          description={content.description}
          align="center"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {content.pillars.map((pillar, index) => {
            const Icon = pillarIcons[index] ?? AppIcons.circle

            return (
              <Card key={pillar.id} className="group">
                <div className="flex items-center justify-between gap-3">
                  <IconFrame size="md">
                    <Icon className="h-4 w-4" />
                  </IconFrame>
                  <span className={AppTextStyles.microLabel}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className={cn(AppTextStyles.h3, 'mt-5')}>{pillar.title}</h3>
                <p className={cn(AppTextStyles.bodySm, 'mt-2')}>
                  {pillar.description}
                </p>
              </Card>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
