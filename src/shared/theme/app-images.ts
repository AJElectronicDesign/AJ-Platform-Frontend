import heroBackground from '@/shared/assets/images/landing.png'
import teamPhoto from '@/shared/assets/images/aj-team-engineering.png'
import productDevelopment from '@/shared/assets/images/aj-product-development.png'
import videoPoster from '@/shared/assets/images/aj-company-video-cover.png'
import logoImage from '@/shared/assets/images/logo.png'
import clientBiosense from '@/shared/assets/images/clients/client-biosense.png'
import clientBosch from '@/shared/assets/images/clients/client-bosch.png'
import clientIntel from '@/shared/assets/images/clients/client-intel.png'
import clientMabe from '@/shared/assets/images/clients/client-mabe.png'
import clientNxp from '@/shared/assets/images/clients/client-nxp.png'
import leaderAngelesPena from '@/shared/assets/images/leaders/angeles-pena-monroy.png'
import leaderJuanCazares from '@/shared/assets/images/leaders/juan-cazares-blanco.png'

/**
 * Centralized image asset paths / imports.
 */
export const AppImages = {
  brand: {
    logo: logoImage,
  },
  landing: {
    heroBackground,
    teamPhoto,
    productDevelopment,
    videoPoster,
    clients: {
      intel: clientIntel,
      bosch: clientBosch,
      mabe: clientMabe,
      nxp: clientNxp,
      biosense: clientBiosense,
    },
    leaders: {
      angelesPena: leaderAngelesPena,
      juanCazares: leaderJuanCazares,
    },
  },
} as const

export type AppImageGroup = keyof typeof AppImages

export type LandingClientLogoKey = keyof typeof AppImages.landing.clients

export type LeaderImageKey = keyof typeof AppImages.landing.leaders
