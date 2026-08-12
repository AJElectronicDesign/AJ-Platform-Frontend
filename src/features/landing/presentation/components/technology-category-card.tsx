import type { TechnologyCategory } from '@/features/landing/domain/entities/technology'
import { IconFrame } from '@/shared/components/icon-frame'
import {
  AppColorClasses,
  AppIcons,
  AppRadius,
  AppTextStyles,
  resolveAppIcon,
} from '@/shared/theme'
import { Card } from '@/shared/ui/card'
import { cn } from '@/shared/utils/cn'

export interface TechnologyCategoryCardProps {
  category: TechnologyCategory
}

export function TechnologyCategoryCard({
  category,
}: TechnologyCategoryCardProps) {
  const CategoryIcon = AppIcons[resolveAppIcon(category.icon)]

  return (
    <Card className="group relative h-full p-0">
      <div className="overflow-hidden rounded-[inherit]">
        <div className="h-1 bg-brand-600" aria-hidden="true" />

        <div className="flex items-start gap-3 px-5 pb-4 pt-5 sm:px-6">
          <IconFrame
            tone="soft"
            size="lg"
            className="transition-colors group-hover:bg-brand-100"
          >
            <CategoryIcon className="h-5 w-5" />
          </IconFrame>

          <div className="min-w-0">
            <h3 className={AppTextStyles.h3}>{category.title}</h3>
            <p className={cn(AppTextStyles.bodySm, 'mt-1.5')}>
              {category.description}
            </p>
          </div>
        </div>

        <ul
          className={cn(
            'space-y-2 border-t px-5 py-5 sm:px-6',
            AppColorClasses.border.DEFAULT,
          )}
        >
          {category.technologies.map((technology) => {
            const Icon = AppIcons[resolveAppIcon(technology.icon)]

            return (
              <li key={technology.id}>
                <div
                  className={cn(
                    'flex items-center gap-3 border px-3 py-2.5 transition-all duration-200',
                    AppRadius.md,
                    AppColorClasses.border.DEFAULT,
                    AppColorClasses.bg.surfaceMuted,
                    'hover:border-brand-500 hover:bg-brand-50/80 hover:ring-1 hover:ring-brand-500/25',
                  )}
                >
                  <IconFrame tone="light" size="sm">
                    <Icon className="h-3.5 w-3.5" />
                  </IconFrame>
                  <span className={cn(AppTextStyles.bodyMd, 'tracking-tight')}>
                    {technology.name}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </Card>
  )
}
