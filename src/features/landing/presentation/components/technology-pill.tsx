import type { Technology } from '@/features/landing/domain/entities/technology'
import { cn } from '@/shared/utils/cn'

export interface TechnologyPillProps {
  technology: Technology
  className?: string
}

export function TechnologyPill({ technology, className }: TechnologyPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-ink shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-800 hover:shadow-[var(--shadow-lift)]',
        className,
      )}
    >
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
      {technology.name}
    </span>
  )
}
