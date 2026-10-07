import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-ink transition-colors focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}
