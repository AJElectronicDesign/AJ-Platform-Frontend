import logoImage from '@/shared/assets/images/logo.png'

/**
 * Centralized image asset paths / imports.
 */
export const AppImages = {
  brand: {
    logo: logoImage,
  },
  landing: {
    heroPattern: '/images/landing/hero-pattern.svg',
    videoPoster: '/images/landing/video-poster.jpg',
    caseStudyPlaceholder: '/images/landing/case-study-placeholder.svg',
  },
  placeholders: {
    circuit: '/images/placeholders/circuit.svg',
    product: '/images/placeholders/product.svg',
  },
} as const

export type AppImageGroup = keyof typeof AppImages
