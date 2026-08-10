import type { HTMLAttributes, ReactNode } from 'react'
import { AppColorClasses, AppShadows } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-6 transition-all duration-300',
        AppColorClasses.border.DEFAULT,
        AppColorClasses.bg.white,
        AppShadows.soft,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
