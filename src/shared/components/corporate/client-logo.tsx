import type {
  ClientLogo as ClientLogoEntity,
  LandingClientLogoKey,
} from '@/shared/corporate-content'
import { AppImages } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface ClientLogoProps {
  client: ClientLogoEntity
}

/** Optical compensation: Intel’s swoosh and Biosense’s lighter wordmark read smaller at the same CSS height. */
const logoHeightClass: Record<LandingClientLogoKey, string> = {
  intel: 'h-14',
  biosense: 'h-12',
  bosch: 'h-9',
  mabe: 'h-9',
  nxp: 'h-9',
}

export function ClientLogo({ client }: ClientLogoProps) {
  return (
    <img
      src={AppImages.landing.clients[client.logoKey]}
      alt={client.alt}
      loading="lazy"
      decoding="async"
      className={cn(
        'w-auto max-w-none shrink-0 object-contain object-center',
        logoHeightClass[client.logoKey],
        'opacity-90 transition-opacity duration-200',
        'motion-safe:hover:opacity-100',
      )}
    />
  )
}
