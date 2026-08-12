import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { SectionIntro } from '@/features/landing/domain/entities/landing-content'
import type { Service } from '@/shared/corporate-content'
import { ServiceDetailsDialog } from '@/shared/components/corporate/service-details-dialog'
import { ServicesGrid } from '@/shared/components/corporate/services-grid'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { paths } from '@/shared/constants/paths'
import { AppColorClasses, AppGradients } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface ServicesSectionProps {
  intro: SectionIntro
  services: Service[]
}

export function ServicesSection({ intro, services }: ServicesSectionProps) {
  const navigate = useNavigate()
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
    navigate(paths.contact)
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
        <ServicesGrid
          className="mt-8 sm:mt-10"
          services={services}
          onLearnMore={openServiceDialog}
        />
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
