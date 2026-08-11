/**
 * Shared border-radius tokens for consistent card / control geometry.
 */
export const AppRadius = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  full: 'rounded-full',
} as const

export type AppRadiusName = keyof typeof AppRadius
