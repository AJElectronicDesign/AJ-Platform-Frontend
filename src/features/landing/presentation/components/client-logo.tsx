import type { ClientLogo as ClientLogoEntity } from '@/features/landing/domain/entities/client-logo'
import { AppImages } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface ClientLogoProps {
  client: ClientLogoEntity
}

export function ClientLogo({ client }: ClientLogoProps) {
  return (
    <div
      className={cn(
        'flex h-12 w-[7.5rem] items-center justify-center sm:h-14 sm:w-40',
        'opacity-90 transition-opacity duration-200',
        'motion-safe:hover:opacity-100',
        'focus-within:opacity-100',
      )}
    >
      <img
        src={AppImages.landing.clients[client.logoKey]}
        alt={client.alt}
        width={160}
        height={56}
        loading="lazy"
        decoding="async"
        className={cn(
          'max-h-9 w-auto max-w-full object-contain sm:max-h-10',
          // Slight edge definition so bright logos (e.g. NXP) stay readable on white.
          'drop-shadow-[0_1px_1px_rgba(15,23,42,0.12)]',
        )}
      />
    </div>
  )
}
