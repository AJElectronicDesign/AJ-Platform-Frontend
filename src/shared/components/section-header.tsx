import { AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? <p className={cn(AppTextStyles.eyebrow, 'mb-3')}>{eyebrow}</p> : null}
      <h2 className={AppTextStyles.h2}>{title}</h2>
      {description ? (
        <p
          className={cn(
            AppTextStyles.body,
            'mt-4',
            align === 'center' && 'mx-auto max-w-2xl',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
