import type { Service } from '@/shared/corporate-content'
import { ServiceCard } from '@/shared/components/corporate/service-card'
import { cn } from '@/shared/utils/cn'

export interface ServicesGridProps {
  services: Service[]
  onLearnMore?: (service: Service, trigger: HTMLButtonElement) => void
  className?: string
}

export function ServicesGrid({
  services,
  onLearnMore,
  className,
}: ServicesGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5',
        className,
      )}
    >
      {services.map((service, index) => (
        <div
          key={service.id}
          className={
            index === 3 ? 'lg:col-span-2 lg:col-start-2' : 'lg:col-span-2'
          }
        >
          <ServiceCard service={service} onLearnMore={onLearnMore} />
        </div>
      ))}
    </div>
  )
}
