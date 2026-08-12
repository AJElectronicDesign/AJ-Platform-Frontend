import { useRef } from 'react'
import type { Service } from '@/features/landing/domain/entities/service'
import { ServiceIcon } from '@/features/landing/presentation/components/service-icon'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { Card } from '@/shared/ui/card'
import { cn } from '@/shared/utils/cn'

export interface ServiceCardProps {
  service: Service
  onLearnMore: (service: Service, trigger: HTMLButtonElement) => void
}

export function ServiceCard({ service, onLearnMore }: ServiceCardProps) {
  const learnMoreRef = useRef<HTMLButtonElement>(null)

  return (
    <Card className="group flex h-full flex-col p-5 sm:p-6">
      <ServiceIcon name={service.icon ?? service.id} tone="soft" />
      <h3 className={cn(AppTextStyles.h3, 'mt-4')}>{service.title}</h3>
      <p className={cn(AppTextStyles.bodySm, 'mt-2 flex-1')}>
        {service.description}
      </p>
      <button
        ref={learnMoreRef}
        type="button"
        onClick={() => {
          if (learnMoreRef.current) {
            onLearnMore(service, learnMoreRef.current)
          }
        }}
        className={cn(
          'mt-5 inline-flex w-fit items-center text-sm font-semibold text-brand-700 transition-colors',
          AppColorClasses.hover.textBrand800,
          'underline-offset-4 hover:underline',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          'rounded-sm',
        )}
      >
        Learn more
      </button>
    </Card>
  )
}
