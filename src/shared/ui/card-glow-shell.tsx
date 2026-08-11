import type { HTMLAttributes, ReactNode } from 'react'
import { AppRadius } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface CardGlowShellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/**
 * Wraps any card-like surface so the teal aura stays outside only.
 */
export function CardGlowShell({
  className,
  children,
  ...props
}: CardGlowShellProps) {
  return (
    <div
      className={cn(
        'card-glow-shell group transition-transform duration-300 hover:-translate-y-1.5',
        AppRadius.xl,
        className,
      )}
      {...props}
    >
      <div className="card-glow-aura" aria-hidden="true" />
      {children}
    </div>
  )
}
