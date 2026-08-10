import type { Service } from '@/features/landing/domain/entities/service'
import { ServiceIcon } from '@/features/landing/presentation/components/service-icon'
import { Card } from '@/shared/ui/card'

export interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="group h-full hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]">
      <ServiceIcon name={service.icon ?? service.id} />
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
        {service.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {service.description}
      </p>
      <p className="mt-5 border-t border-border pt-4 text-sm font-medium text-brand-700 transition-colors group-hover:text-brand-800">
        {service.benefit}
      </p>
    </Card>
  )
}
