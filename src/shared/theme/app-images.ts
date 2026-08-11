import caseStudyConnected from '@/shared/assets/images/case-study-connected.svg'
import caseStudyIot from '@/shared/assets/images/case-study-iot.svg'
import heroBackground from '@/shared/assets/images/background_landing.jpeg'
import logoImage from '@/shared/assets/images/logo.png'

/**
 * Centralized image asset paths / imports.
 * Replace placeholder visuals here when real AJ photography is available.
 */
export const AppImages = {
  brand: {
    logo: logoImage,
  },
  landing: {
    heroBackground,
    videoPoster: heroBackground,
    caseStudies: {
      iotGateway: caseStudyIot,
      connectedDevice: caseStudyConnected,
    },
  },
  placeholders: {
    circuit: caseStudyIot,
    product: caseStudyConnected,
  },
} as const

export type AppImageGroup = keyof typeof AppImages
