import type { TechnologyCategory } from '@/shared/corporate-content'
import { TechnologyCategoryCard } from '@/shared/components/corporate/technology-category-card'
import { cn } from '@/shared/utils/cn'

export interface TechnologiesGridProps {
  technologies: TechnologyCategory[]
  className?: string
}

export function TechnologiesGrid({
  technologies,
  className,
}: TechnologiesGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5',
        className,
      )}
    >
      {technologies.map((category) => (
        <TechnologyCategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}
