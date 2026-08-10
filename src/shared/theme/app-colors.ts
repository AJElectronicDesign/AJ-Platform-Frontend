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
  surface: {
    DEFAULT: '#ffffff',
    muted: '#f8fafc',
    soft: '#f0fdfa',
  },
  ink: {
    DEFAULT: '#0f172a',
    muted: '#64748b',
    subtle: '#94a3b8',
  },
  border: {
    DEFAULT: '#e2e8f0',
    strong: '#cbd5e1',
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
    brand50: 'bg-brand-50',
    brand100: 'bg-brand-100',
    brand500: 'bg-brand-500',
    brand700: 'bg-brand-700',
    brand800: 'bg-brand-800',
    white: 'bg-white',
  },
  text: {
    ink: 'text-ink',
    inkMuted: 'text-ink-muted',
    inkSubtle: 'text-ink-subtle',
    brand500: 'text-brand-500',
    brand700: 'text-brand-700',
    brand800: 'text-brand-800',
    brand900: 'text-brand-900',
    white: 'text-white',
    danger: 'text-red-600',
  },
  border: {
    DEFAULT: 'border-border',
    strong: 'border-border-strong',
    brand100: 'border-brand-100',
    brand200: 'border-brand-200',
  },
  ring: {
    brand100: 'ring-brand-100',
    brand500: 'ring-brand-500',
    brand500Soft: 'focus-visible:ring-brand-500/20',
  },
  hover: {
    bgBrand50: 'hover:bg-brand-50',
    bgBrand100: 'hover:bg-brand-100',
    bgBrand800: 'hover:bg-brand-800',
    bgSurfaceMuted: 'hover:bg-surface-muted',
    borderBrand200: 'hover:border-brand-200',
    textBrand700: 'hover:text-brand-700',
    textBrand800: 'hover:text-brand-800',
    textInk: 'hover:text-ink',
  },
} as const

export const AppShadows = {
  soft: 'shadow-[var(--shadow-soft)]',
  lift: 'shadow-[var(--shadow-lift)]',
  sm: 'shadow-sm',
  md: 'shadow-md',
} as const

export type AppBrandShade = keyof typeof AppColors.brand
