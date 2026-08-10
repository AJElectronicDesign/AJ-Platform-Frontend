import { AppColors } from '@/shared/theme'

export const brand = {
  name: 'AJ Electronic Design',
  platformName: 'AJ Electronic Design Platform',
  tagline: 'From electronic ideas to real products',
  colors: {
    primary: AppColors.brand[600],
    primaryDark: AppColors.brand[700],
    primaryLight: AppColors.brand[500],
    surface: AppColors.surface.muted,
    ink: AppColors.ink.DEFAULT,
  },
  contact: {
    email: 'contact@aj-electronic-design.com',
    phone: '+52 (33) 2733 0962',
    location: 'Zapopan, Jalisco, Mexico',
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/aj-electronic-design',
    github: 'https://github.com/aj-electronic-design',
    youtube: 'https://www.youtube.com/@aj-electronic-design',
  },
} as const
