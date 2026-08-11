import type { HTMLAttributes, ReactNode } from 'react'
import { AppColorClasses, AppRadius, AppShadows } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  tone?: 'light' | 'dark'
  /** Soft teal aura around the exterior only (never paints inside). */
  glow?: boolean
}

export function Card({
  className,
  children,
  tone = 'light',
  glow = tone === 'light',
  ...props
}: CardProps) {
  if (!glow) {
    return (
      <div
        className={cn(
          'border p-6 transition-all duration-300',
          AppRadius.xl,
          tone === 'light' &&
            cn(
              AppColorClasses.border.DEFAULT,
              AppColorClasses.bg.white,
              AppShadows.soft,
            ),
          tone === 'dark' &&
            cn(
              AppColorClasses.border.onDark,
              'bg-white/[0.04]',
              AppShadows.none,
            ),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'card-glow-shell group/card transition-transform duration-300 hover:-translate-y-1.5',
        AppRadius.xl,
      )}
    >
      <div className="card-glow-aura" aria-hidden="true" />
      <div
        className={cn(
          'card-glow-face relative border p-6 transition-[border-color,box-shadow] duration-300',
          AppRadius.xl,
          AppColorClasses.border.DEFAULT,
          AppColorClasses.bg.white,
          AppShadows.soft,
          'group-hover/card:border-brand-500/50',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}
