import type { ClientLogo as ClientLogoEntity } from '@/features/landing/domain/entities/client-logo'
import type { SectionIntro } from '@/features/landing/domain/entities/landing-content'
import { ClientLogo } from '@/features/landing/presentation/components/client-logo'
import { Container } from '@/shared/components/container'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface ClientsSectionProps {
  intro: SectionIntro
  clients: ClientLogoEntity[]
}

export function ClientsSection({ intro, clients }: ClientsSectionProps) {
  return (
    <section
      className={cn(
        'border-b py-12 sm:py-14',
        AppColorClasses.border.DEFAULT,
        AppColorClasses.bg.surface,
      )}
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={cn(AppTextStyles.h3, 'text-xl sm:text-2xl')}>
            {intro.title}
          </h2>
          <p className={cn(AppTextStyles.bodySm, 'mx-auto mt-3 max-w-2xl')}>
            {intro.description}
          </p>
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:mt-10 sm:gap-x-10 lg:flex-nowrap lg:justify-between lg:gap-x-4">
          {clients.map((client) => (
            <li key={client.id}>
              <ClientLogo client={client} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
