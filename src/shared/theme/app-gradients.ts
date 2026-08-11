/**
 * Named gradient utilities. Prefer these over ad-hoc gradient classes.
 */
export const AppGradients = {
  /** Hero: keep copy clean; reveal PCB toward the visual side. */
  heroScrim:
    'bg-gradient-to-r from-white via-white/88 to-white/20 lg:from-white lg:via-white/82 lg:to-transparent',
  heroTint: 'bg-gradient-to-br from-brand-700/15 via-transparent to-brand-500/10',

  /** Soft engineering wash for Technologies. */
  surfaceAqua:
    'bg-gradient-to-b from-brand-50 via-aqua-soft/70 to-surface',

  /** Technology category visual headers. */
  techHardware: 'bg-gradient-to-br from-brand-100 via-brand-50 to-white',
  techSoftware: 'bg-gradient-to-br from-aqua-soft via-brand-50 to-white',
  techCloud: 'bg-gradient-to-br from-brand-50 via-aqua-light/40 to-white',

  /** Dark section depth (subtle, not theatrical). */
  navyDepth: 'bg-gradient-to-b from-navy via-navy to-navy-soft',
  navyFooter: 'bg-gradient-to-b from-navy-soft to-navy',

  /** Case study media overlays. */
  mediaFade:
    'bg-gradient-to-t from-navy/55 via-navy/10 to-transparent',

  /** Process connector. */
  processLine:
    'bg-gradient-to-r from-transparent via-brand-300 to-transparent',
} as const

export type AppGradientName = keyof typeof AppGradients
