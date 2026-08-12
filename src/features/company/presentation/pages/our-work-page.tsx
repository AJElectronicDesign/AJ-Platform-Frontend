import { useLocalizedCorporateContent } from '@/features/company/presentation/hooks/use-localized-corporate-content'
import { ClientsGrid } from '@/shared/components/corporate/clients-grid'
import { TechnologiesGrid } from '@/shared/components/corporate/technologies-grid'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { ourWorkHash } from '@/shared/constants/paths'
import { industries } from '@/shared/corporate-content'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function OurWorkPage() {
  const { t } = useI18n()
  const { clients, technologies } = useLocalizedCorporateContent()

  return (
    <>
      <section className={cn('scroll-mt-24 py-16 sm:py-20', AppColorClasses.bg.white)}>
        <Container>
          <SectionHeader
            eyebrow={t.company.ourWork.eyebrow}
            title={t.company.ourWork.title}
            description={t.company.ourWork.description}
          />
        </Container>
      </section>

      <section
        id={ourWorkHash.clients}
        className={cn('scroll-mt-24 py-16 sm:py-20', AppColorClasses.bg.surface)}
      >
        <Container>
          <SectionHeader
            eyebrow={t.navigation.clients}
            title={t.home.clientsSection.title}
            description={t.home.clientsSection.description}
          />
          <div className="mt-10">
            <ClientsGrid clients={clients} />
          </div>
        </Container>
      </section>

      <section
        id={ourWorkHash.technologies}
        className={cn('scroll-mt-24 py-16 sm:py-20', AppColorClasses.bg.white)}
      >
        <Container>
          <SectionHeader
            eyebrow={t.navigation.technologies}
            title={t.home.technologiesSection.title}
            description={t.home.technologiesSection.description}
          />
          <TechnologiesGrid className="mt-10" technologies={technologies} />
        </Container>
      </section>

      <section
        id={ourWorkHash.industries}
        className={cn('scroll-mt-24 py-16 sm:py-20', AppColorClasses.bg.surface)}
      >
        <Container>
          <SectionHeader
            eyebrow={t.company.industries.eyebrow}
            title={t.company.industries.title}
            description={t.company.industries.description}
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((industry) => {
              const item = t.company.industries.items[industry.id]

              return (
                <li
                  key={industry.id}
                  className="rounded-2xl border border-border/80 bg-white p-5"
                >
                  <h3 className={AppTextStyles.h3}>{item.title}</h3>
                  <p className={cn(AppTextStyles.bodySm, 'mt-2')}>
                    {item.description}
                  </p>
                </li>
              )
            })}
          </ul>
        </Container>
      </section>
    </>
  )
}
