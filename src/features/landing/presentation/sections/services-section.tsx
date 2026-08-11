import type { SectionIntro } from '@/features/landing/domain/entities/landing-content'
import type { Service } from '@/features/landing/domain/entities/service'
import { ServiceCard } from '@/features/landing/presentation/components/service-card'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { AppColorClasses, AppGradients } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface ServicesSectionProps {
  intro: SectionIntro
  services: Service[]
}

export function ServicesSection({ intro, services }: ServicesSectionProps) {
  return (
    <section
      id="services"
      className={cn(
        'relative scroll-mt-24 overflow-hidden py-20 sm:py-24',
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
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={
                index === 3 ? 'lg:col-span-2 lg:col-start-2' : 'lg:col-span-2'
              }
            >
              <ServiceCard service={service} />
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
    </section>
  )
}
