import type { ContactInfo } from '@/features/landing/domain/entities/contact-info'
import type { SectionIntro } from '@/features/landing/domain/entities/landing-content'
import { ContactForm } from '@/features/landing/presentation/components/contact-form'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'

export interface ContactSectionProps {
  intro: SectionIntro
  contact: ContactInfo
}

export function ContactSection({ intro, contact }: ContactSectionProps) {
  return (
    <section id="contact" className="scroll-mt-24 bg-surface-muted py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
          <div>
            <SectionHeader
              eyebrow={intro.eyebrow}
              title={intro.title}
              description={intro.description}
            />

            <dl className="mt-10 space-y-5">
              <div className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-soft)]">
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brand-700">
                  Email
                </dt>
                <dd className="mt-2 text-sm font-medium text-ink">
                  <a
                    href={`mailto:${contact.email}`}
                    className="transition-colors hover:text-brand-700"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-soft)]">
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brand-700">
                  Phone
                </dt>
                <dd className="mt-2 text-sm font-medium text-ink">
                  <a
                    href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                    className="transition-colors hover:text-brand-700"
                  >
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-soft)]">
                <dt className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brand-700">
                  Location
                </dt>
                <dd className="mt-2 text-sm font-medium text-ink">
                  {contact.location}
                </dd>
              </div>
            </dl>
          </div>

          <ContactForm />
        </div>
      </Container>
    </section>
  )
}
