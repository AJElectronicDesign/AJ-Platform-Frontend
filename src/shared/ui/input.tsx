import type { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'h-11 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-ink placeholder:text-ink-subtle transition-colors focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/20',
        className,
      )}
      {...props}
    />
  )
}
