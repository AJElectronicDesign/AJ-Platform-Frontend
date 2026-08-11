import type { Service } from '@/features/landing/domain/entities/service'
import { ServiceIcon } from '@/features/landing/presentation/components/service-icon'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { Card } from '@/shared/ui/card'
import { cn } from '@/shared/utils/cn'

export interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="group h-full">
      <ServiceIcon name={service.icon ?? service.id} tone="soft" />
      <h3 className={cn(AppTextStyles.h3, 'mt-5')}>{service.title}</h3>
      <p className={cn(AppTextStyles.bodySm, 'mt-2')}>{service.description}</p>
      <p
        className={cn(
          'mt-5 border-t pt-4 text-sm font-medium text-brand-700 transition-colors',
          AppColorClasses.border.DEFAULT,
          'group-hover:text-brand-800',
        )}
      >
        {service.benefit}
      </p>
    </Card>
  )
}
