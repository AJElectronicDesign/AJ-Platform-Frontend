/**
 * Source of truth for application colors.
 * Keep `globals.css` @theme tokens in sync with these hex values.
 */
export const AppColors = {
  brand: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },
  /** Semantic brand aliases for clearer intent in UI work. */
  primary: {
    teal: '#0f766e',
    tealDark: '#115e59',
    tealLight: '#14b8a6',
  },
  aqua: {
    DEFAULT: '#5eead4',
    light: '#99f6e4',
    soft: '#e6fffa',
  },
  navy: {
    DEFAULT: '#0b1220',
    soft: '#121a2b',
    muted: '#1a2438',
  },
  surface: {
    DEFAULT: '#ffffff',
    muted: '#f8fafc',
    soft: '#f0fdfa',
    alt: '#f1f5f9',
    teal: '#f0fdfa',
    dark: '#0b1220',
  },
  ink: {
    DEFAULT: '#0f172a',
    muted: '#64748b',
    subtle: '#94a3b8',
    onDark: '#f8fafc',
    onDarkMuted: '#94a3b8',
  },
  border: {
    DEFAULT: '#e2e8f0',
    strong: '#cbd5e1',
    teal: '#99f6e4',
    onDark: 'rgba(248, 250, 252, 0.12)',
    onDarkStrong: 'rgba(248, 250, 252, 0.2)',
  },
  glow: {
    teal: 'rgba(20, 184, 166, 0.22)',
    aqua: 'rgba(94, 234, 212, 0.18)',
  },
  divider: {
    light: '#e2e8f0',
    teal: 'rgba(13, 148, 136, 0.2)',
    onDark: 'rgba(248, 250, 252, 0.1)',
  },
  semantic: {
    primary: '#0f766e',
    primaryHover: '#115e59',
    primarySoft: '#f0fdfa',
    danger: '#dc2626',
    white: '#ffffff',
  },
} as const

/**
 * Tailwind class tokens mapped to the design system.
 * Prefer these over hardcoding color classes in components.
 */
export const AppColorClasses = {
  bg: {
    surface: 'bg-surface',
    surfaceMuted: 'bg-surface-muted',
    surfaceSoft: 'bg-surface-soft',
    surfaceAlt: 'bg-surface-alt',
    surfaceTeal: 'bg-surface-teal',
    surfaceDark: 'bg-surface-dark',
    navy: 'bg-navy',
    navySoft: 'bg-navy-soft',
    navyMuted: 'bg-navy-muted',
    brand50: 'bg-brand-50',
    brand100: 'bg-brand-100',
    brand500: 'bg-brand-500',
    brand700: 'bg-brand-700',
    brand800: 'bg-brand-800',
    aquaSoft: 'bg-aqua-soft',
    white: 'bg-white',
  },
  text: {
    ink: 'text-ink',
    inkMuted: 'text-ink-muted',
    inkSubtle: 'text-ink-subtle',
    onDark: 'text-ink-on-dark',
    onDarkMuted: 'text-ink-on-dark-muted',
    brand500: 'text-brand-500',
    brand300: 'text-brand-300',
    brand700: 'text-brand-700',
    brand800: 'text-brand-800',
    brand900: 'text-brand-900',
    aqua: 'text-aqua',
    white: 'text-white',
    danger: 'text-red-600',
  },
  border: {
    DEFAULT: 'border-border',
    strong: 'border-border-strong',
    teal: 'border-border-teal',
    onDark: 'border-border-on-dark',
    onDarkStrong: 'border-border-on-dark-strong',
    brand100: 'border-brand-100',
    brand200: 'border-brand-200',
  },
  ring: {
    brand100: 'ring-brand-100',
    brand500: 'ring-brand-500',
    brand500Soft: 'focus-visible:ring-brand-500/20',
    onDark: 'ring-white/15',
  },
  hover: {
    bgBrand50: 'hover:bg-brand-50',
    bgBrand100: 'hover:bg-brand-100',
    bgBrand800: 'hover:bg-brand-800',
    bgSurfaceMuted: 'hover:bg-surface-muted',
    bgWhite10: 'hover:bg-white/10',
    borderBrand200: 'hover:border-brand-200',
    borderBrand500: 'hover:border-brand-500',
    borderTeal: 'hover:border-border-teal',
    /** Use <Card glow> or .card-glow-shell for exterior aura. */
    cardLift: 'hover:-translate-y-1.5',
    textBrand700: 'hover:text-brand-700',
    textBrand800: 'hover:text-brand-800',
    textBrand300: 'hover:text-brand-300',
    textInk: 'hover:text-ink',
    textOnDark: 'hover:text-ink-on-dark',
  },
} as const

export type AppBrandShade = keyof typeof AppColors.brand
