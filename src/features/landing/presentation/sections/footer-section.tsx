import { brand } from '@/shared/constants/brand'
import { publicNavigation } from '@/shared/constants/navigation'
import { Container } from '@/shared/components/container'
import { AppLogo } from '@/shared/components/app-logo'

export interface FooterSectionProps {
  copyright: string
  email: string
  phone: string
  location: string
}

export function FooterSection({
  copyright,
  email,
  phone,
  location,
}: FooterSectionProps) {
  return (
    <footer className="border-t border-border bg-white">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <AppLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {brand.tagline}
            </p>
          </div>

          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brand-700">
              Navigate
            </p>
            <ul className="mt-4 space-y-2.5">
              {publicNavigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-ink-muted transition-colors hover:text-brand-700"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brand-700">
              Contact
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-brand-700"
                >
                  {email}
                </a>
              </li>
              <li>{phone}</li>
              <li>{location}</li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brand-700">
              Social
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={brand.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-ink-muted transition-colors hover:text-brand-700"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={brand.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-ink-muted transition-colors hover:text-brand-700"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={brand.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-ink-muted transition-colors hover:text-brand-700"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-muted">{copyright}</p>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ink-subtle">
            {brand.platformName}
          </p>
        </div>
      </Container>
    </footer>
  )
}
