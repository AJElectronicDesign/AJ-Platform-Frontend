import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'min-h-32 w-full resize-y rounded-xl border border-border bg-white px-3.5 py-3 text-sm text-ink placeholder:text-ink-subtle transition-colors focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/20',
        className,
      )}
      {...props}
    />
  )
}
