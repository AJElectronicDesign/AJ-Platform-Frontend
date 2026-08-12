import type { ContactInfo } from '@/features/landing/domain/entities/contact-info'
import type { SectionIntro } from '@/features/landing/domain/entities/landing-content'
import { ContactForm } from '@/features/landing/presentation/components/contact-form'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { useI18n } from '@/shared/i18n'
import {
  AppColorClasses,
  AppGradients,
  AppRadius,
  AppTextStyles,
} from '@/shared/theme'
import { CardGlowShell } from '@/shared/ui/card-glow-shell'
import { cn } from '@/shared/utils/cn'

export interface ContactSectionProps {
  intro: SectionIntro
  contact: ContactInfo
}

export function ContactSection({ intro, contact }: ContactSectionProps) {
  const { t } = useI18n()
  return (
    <section
      id="contact"
      className={cn(
        'relative scroll-mt-24 overflow-hidden py-16 sm:py-20',
        AppGradients.surfaceAqua,
      )}
    >
      <div className="pointer-events-none absolute inset-0 circuit-tech opacity-55" />

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeader
              eyebrow={intro.eyebrow}
              title={intro.title}
              description={intro.description}
            />

            <dl className="mt-10 space-y-4">
              {(
                [
                  {
                    label: t.common.email,
                    value: (
                      <a
                        href={`mailto:${contact.email}`}
                        className="transition-colors hover:text-brand-700"
                      >
                        {contact.email}
                      </a>
                    ),
                  },
                  {
                    label: t.common.phone,
                    value: (
                      <a
                        href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                        className="transition-colors hover:text-brand-700"
                      >
                        {contact.phone}
                      </a>
                    ),
                  },
                  {
                    label: t.common.location,
                    value: contact.location,
                  },
                ] as const
              ).map((item) => (
                <CardGlowShell key={item.label}>
                  <div
                    className={cn(
                      'card-glow-face border bg-white p-5 transition-[border-color] duration-300',
                      AppRadius.xl,
                      AppColorClasses.border.DEFAULT,
                      'group-hover:border-brand-500/50',
                    )}
                  >
                    <dt className={AppTextStyles.microLabel}>{item.label}</dt>
                    <dd className={cn(AppTextStyles.bodyMd, 'mt-2')}>
                      {item.value}
                    </dd>
                  </div>
                </CardGlowShell>
              ))}
            </dl>
          </div>

          <ContactForm />
        </div>
      </Container>
    </section>
  )
}
