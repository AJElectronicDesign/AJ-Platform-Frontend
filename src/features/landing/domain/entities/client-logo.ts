import type { LandingClientLogoKey } from '@/shared/theme/app-images'

export type { LandingClientLogoKey }

export interface ClientLogo {
  id: string
  name: string
  logoKey: LandingClientLogoKey
  alt: string
}
