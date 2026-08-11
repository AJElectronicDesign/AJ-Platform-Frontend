import type { HTMLAttributes, ReactNode } from 'react'
import { AppColorClasses, AppRadius, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

export function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1',
        AppRadius.full,
        AppColorClasses.bg.brand50,
        AppTextStyles.microLabel,
        AppColorClasses.text.brand800,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
