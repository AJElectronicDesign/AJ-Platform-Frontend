import { useRef, useState } from 'react'
import type { SectionIntro } from '@/features/landing/domain/entities/landing-content'
import type { Service } from '@/features/landing/domain/entities/service'
import { ServiceCard } from '@/features/landing/presentation/components/service-card'
import { ServiceDetailsDialog } from '@/features/landing/presentation/components/service-details-dialog'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { AppColorClasses, AppGradients } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface ServicesSectionProps {
  intro: SectionIntro
  services: Service[]
}

export function ServicesSection({ intro, services }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [restoreFocus, setRestoreFocus] = useState(true)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  function openServiceDialog(service: Service, trigger: HTMLButtonElement) {
    returnFocusRef.current = trigger
    setRestoreFocus(true)
    setSelectedService(service)
    setIsDialogOpen(true)
  }

  function closeServiceDialog() {
    setIsDialogOpen(false)
  }

  function requestQuotation() {
    setRestoreFocus(false)
    closeServiceDialog()
    window.setTimeout(() => {
      document
        .getElementById('contact')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  return (
    <section
      id="services"
      className={cn(
        'relative scroll-mt-24 overflow-hidden py-16 sm:py-20',
        AppGradients.surfaceAqua,
      )}
    >
      <div className="pointer-events-none absolute inset-0 circuit-tech opacity-55" />

      <Container className="relative">
        <SectionHeader
          eyebrow={intro.eyebrow}
          title={intro.title}
          description={intro.description}
        />
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={
                index === 3 ? 'lg:col-span-2 lg:col-start-2' : 'lg:col-span-2'
              }
            >
              <ServiceCard
                service={service}
                onLearnMore={openServiceDialog}
              />
            </div>
          ))}
        </div>
      </Container>

      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 h-px',
          AppColorClasses.border.brand100,
          'bg-brand-100',
        )}
        aria-hidden="true"
      />

      <ServiceDetailsDialog
        service={selectedService}
        open={isDialogOpen}
        onClose={closeServiceDialog}
        onRequestQuotation={requestQuotation}
        returnFocusRef={returnFocusRef}
        restoreFocus={restoreFocus}
      />
    </section>
  )
}
