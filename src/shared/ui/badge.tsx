import type { HTMLAttributes, ReactNode } from 'react'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

export function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1',
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
