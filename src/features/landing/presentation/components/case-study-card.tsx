import type { CaseStudy } from '@/features/landing/domain/entities/case-study'
import {
  AppColorClasses,
  AppGradients,
  AppImages,
  AppRadius,
  AppShadows,
  AppTextStyles,
} from '@/shared/theme'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { cn } from '@/shared/utils/cn'

export interface CaseStudyCardProps {
  caseStudy: CaseStudy
}

function resolveCaseStudyImage(caseStudy: CaseStudy): string {
  if (caseStudy.imageKey) {
    return AppImages.landing.caseStudies[caseStudy.imageKey]
  }

  return AppImages.placeholders.product
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const imageSrc = resolveCaseStudyImage(caseStudy)

  return (
    <Card className="group p-0">
      <div className="overflow-hidden rounded-[inherit]">
        <div
          className="relative h-48 overflow-hidden sm:h-52"
          role="img"
          aria-label={caseStudy.imageAlt ?? caseStudy.title}
        >
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
          <div
            className={cn(
              'pointer-events-none absolute inset-0',
              AppGradients.mediaFade,
            )}
          />
          <div className="pointer-events-none absolute inset-0 grid-tech-dark opacity-30" />

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            {caseStudy.industry ? <Badge>{caseStudy.industry}</Badge> : null}
            <span
              className={cn(
                'px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em]',
                AppRadius.full,
                AppColorClasses.bg.white,
                AppColorClasses.text.brand800,
                'ring-1 ring-border/80',
                AppShadows.sm,
              )}
            >
              Case study
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className={AppTextStyles.h3}>{caseStudy.title}</h3>
          <p className={cn(AppTextStyles.bodySm, 'mt-2')}>{caseStudy.summary}</p>
          {caseStudy.outcome ? (
            <p className={cn(AppTextStyles.bodyMd, 'mt-4 text-brand-700')}>
              {caseStudy.outcome}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
