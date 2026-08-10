import type { SectionIntro } from '@/features/landing/domain/entities/landing-content'
import type { Service } from '@/features/landing/domain/entities/service'
import { ServiceCard } from '@/features/landing/presentation/components/service-card'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'

export interface ServicesSectionProps {
  intro: SectionIntro
  services: Service[]
}

export function ServicesSection({ intro, services }: ServicesSectionProps) {
  return (
    <section id="services" className="scroll-mt-24 bg-white py-20 sm:py-24">
      <Container>
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
                index === 3
                  ? 'lg:col-span-2 lg:col-start-2'
                  : 'lg:col-span-2'
              }
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
