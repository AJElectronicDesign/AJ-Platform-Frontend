/**
 * Centralized typography presets (Tailwind class compositions).
 * Use these instead of repeating font/size/tracking classes in components.
 */
export const AppTextStyles = {
  display: [
    'text-balance',
    'text-4xl',
    'font-bold',
    'tracking-tight',
    'text-ink',
    'sm:text-5xl',
    'lg:text-[3.4rem]',
    'lg:leading-[1.08]',
  ].join(' '),

  h1: 'text-balance text-4xl font-bold tracking-tight text-ink sm:text-5xl',

  h2: 'text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl',

  h2OnDark:
    'text-balance text-3xl font-bold tracking-tight text-ink-on-dark sm:text-4xl',

  h3: 'text-lg font-bold tracking-tight text-ink',

  h3OnDark: 'text-lg font-bold tracking-tight text-ink-on-dark',

  body: 'text-base leading-relaxed text-ink-muted sm:text-lg',

  bodyOnDark: 'text-base leading-relaxed text-ink-on-dark-muted sm:text-lg',

  bodySm: 'text-sm leading-relaxed text-ink-muted',

  bodySmOnDark: 'text-sm leading-relaxed text-ink-on-dark-muted',

  bodyMd: 'text-sm font-medium text-ink',

  bodyMdOnDark: 'text-sm font-medium text-ink-on-dark',

  label: 'text-sm font-medium text-ink',

  labelOnDark: 'text-sm font-medium text-ink-on-dark',

  eyebrow: [
    'font-mono',
    'text-xs',
    'font-medium',
    'uppercase',
    'tracking-[0.18em]',
    'text-brand-700',
  ].join(' '),

  eyebrowOnDark: [
    'font-mono',
    'text-xs',
    'font-medium',
    'uppercase',
    'tracking-[0.18em]',
    'text-brand-300',
  ].join(' '),

  microLabel: [
    'font-mono',
    'text-[0.7rem]',
    'font-medium',
    'uppercase',
    'tracking-[0.14em]',
    'text-brand-700',
  ].join(' '),

  microLabelOnDark: [
    'font-mono',
    'text-[0.7rem]',
    'font-medium',
    'uppercase',
    'tracking-[0.14em]',
    'text-brand-300',
  ].join(' '),

  caption: 'text-xs leading-relaxed text-ink-subtle',

  captionOnDark: 'text-xs leading-relaxed text-ink-on-dark-muted',

  /** Accent line for dual-tone headings (use sparingly). */
  headingAccent: 'text-brand-700',

  headingAccentOnDark: 'text-brand-300',

  link: 'text-sm text-ink-muted transition-colors hover:text-brand-700',

  linkOnDark:
    'text-sm text-ink-on-dark-muted transition-colors hover:text-brand-300',

  navLink:
    'rounded-full px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-800',

  button: 'font-semibold tracking-tight',
} as const

export type AppTextStyleName = keyof typeof AppTextStyles
