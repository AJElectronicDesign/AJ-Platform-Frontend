import type { ReactNode } from 'react'
import { AppColorClasses, AppRadius } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface IconFrameProps {
  children: ReactNode
  className?: string
  tone?: 'light' | 'dark' | 'soft'
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
} as const

export function IconFrame({
  children,
  className,
  tone = 'soft',
  size = 'md',
}: IconFrameProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center ring-1 transition-colors duration-200',
        AppRadius.md,
        sizeStyles[size],
        tone === 'soft' &&
          cn(
            AppColorClasses.bg.brand50,
            AppColorClasses.text.brand700,
            AppColorClasses.ring.brand100,
          ),
        tone === 'light' &&
          cn(
            AppColorClasses.bg.white,
            AppColorClasses.text.brand700,
            AppColorClasses.ring.brand100,
          ),
        tone === 'dark' &&
          'bg-white/8 text-brand-300 ring-white/15 group-hover:bg-brand-500/15 group-hover:text-brand-300',
        className,
      )}
    >
      {children}
    </span>
  )
}
