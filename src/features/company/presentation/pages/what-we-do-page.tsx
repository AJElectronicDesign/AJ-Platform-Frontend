import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalizedCorporateContent } from '@/features/company/presentation/hooks/use-localized-corporate-content'
import { ServiceDetailsDialog } from '@/shared/components/corporate/service-details-dialog'
import { ServicesGrid } from '@/shared/components/corporate/services-grid'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { paths, whatWeDoHash } from '@/shared/constants/paths'
import { industries, type Service } from '@/shared/corporate-content'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function WhatWeDoPage() {
  const { t } = useI18n()
  const { services, process } = useLocalizedCorporateContent()
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

  return (
    <>
      <section className={cn('scroll-mt-24 py-16 sm:py-20', AppColorClasses.bg.white)}>
        <Container>
          <SectionHeader
            eyebrow={t.company.whatWeDo.eyebrow}
            title={t.company.whatWeDo.title}
            description={t.company.whatWeDo.description}
          />

          {process.length > 0 ? (
            <ol
              id={whatWeDoHash.process}
              className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
            >
              {process.map((step, index) => (
                <li key={step.id} className="rounded-2xl border border-border/80 bg-surface p-4">
                  <p className={AppTextStyles.microLabel}>
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className={cn(AppTextStyles.h3, 'mt-3')}>{step.label}</h3>
                  <p className={cn(AppTextStyles.bodySm, 'mt-2')}>
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          ) : null}
        </Container>
      </section>

      <section
        id={whatWeDoHash.services}
        className={cn('scroll-mt-24 py-16 sm:py-20', AppColorClasses.bg.surface)}
      >
        <Container>
          <SectionHeader
            eyebrow={t.navigation.services}
            title={t.home.servicesSection.title}
            description={t.home.servicesSection.description}
          />
          <ServicesGrid
            className="mt-10"
            services={services}
            onLearnMore={openServiceDialog}
          />
        </Container>
      </section>

      <IndustriesSection />

      <ServiceDetailsDialog
        service={selectedService}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onRequestQuotation={() => {
          setRestoreFocus(false)
          setIsDialogOpen(false)
          navigate(paths.contact)
        }}
        returnFocusRef={returnFocusRef}
        restoreFocus={restoreFocus}
      />
    </>
  )
}

function IndustriesSection() {
  const { t } = useI18n()
  const copy = t.company.industries

  return (
    <section
      id={whatWeDoHash.industries}
      className={cn('scroll-mt-24 py-16 sm:py-20', AppColorClasses.bg.white)}
    >
      <Container>
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {industries.map((industry) => {
            const item = copy.items[industry.id]

            return (
              <li
                key={industry.id}
                className="rounded-2xl border border-border/80 bg-surface p-6"
              >
                <h3 className={AppTextStyles.h3}>{item.title}</h3>
                <p className={cn(AppTextStyles.bodySm, 'mt-2')}>{item.description}</p>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
