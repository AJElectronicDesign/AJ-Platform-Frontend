import type { Technology } from '@/shared/corporate-content'
import {
  AppColorClasses,
  AppIcons,
  AppShadows,
  AppTextStyles,
  resolveAppIcon,
} from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface TechnologyPillProps {
  technology: Technology
  className?: string
}

export function TechnologyPill({ technology, className }: TechnologyPillProps) {
  const Icon = AppIcons[resolveAppIcon(technology.icon)]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 transition-all duration-200',
        AppColorClasses.border.DEFAULT,
        AppColorClasses.bg.white,
        AppTextStyles.bodyMd,
        AppShadows.soft,
        'hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-800 hover:shadow-[var(--shadow-lift)]',
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5 text-brand-700" />
      {technology.name}
    </span>
  )
}
