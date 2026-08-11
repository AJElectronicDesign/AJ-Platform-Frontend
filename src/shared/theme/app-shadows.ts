/**
 * Normalized elevation tokens.
 */
export const AppShadows = {
  soft: 'shadow-[var(--shadow-soft)]',
  lift: 'shadow-[var(--shadow-lift)]',
  sm: 'shadow-sm',
  md: 'shadow-md',
  glowTeal: 'shadow-[var(--shadow-glow-teal)]',
  glowTealStrong: 'shadow-[var(--shadow-glow-teal-strong)]',
  none: 'shadow-none',
} as const

export type AppShadowName = keyof typeof AppShadows
