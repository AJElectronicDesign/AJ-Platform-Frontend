/**
 * Centralized typography presets (Tailwind class compositions).
 * Use these instead of repeating font/size/tracking classes in components.
 */
export const AppTextStyles = {
  display: [
    'text-balance',
    'text-4xl',
    'font-semibold',
    'tracking-tight',
    'text-ink',
    'sm:text-5xl',
    'lg:text-[3.4rem]',
    'lg:leading-[1.08]',
  ].join(' '),

  h1: 'text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl',

  h2: 'text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl',

  h3: 'text-lg font-semibold tracking-tight text-ink',

  body: 'text-base leading-relaxed text-ink-muted sm:text-lg',

  bodySm: 'text-sm leading-relaxed text-ink-muted',

  bodyMd: 'text-sm font-medium text-ink',

  label: 'text-sm font-medium text-ink',

  eyebrow: [
    'font-mono',
    'text-xs',
    'font-medium',
    'uppercase',
    'tracking-[0.18em]',
    'text-brand-700',
  ].join(' '),

  microLabel: [
    'font-mono',
    'text-[0.65rem]',
    'font-medium',
    'uppercase',
    'tracking-[0.16em]',
    'text-brand-700',
  ].join(' '),

  caption: 'text-xs leading-relaxed text-ink-subtle',

  link: 'text-sm text-ink-muted transition-colors hover:text-brand-700',

  navLink:
    'rounded-full px-3.5 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-brand-50 hover:text-brand-800',

  button: 'font-semibold tracking-tight',
} as const

export type AppTextStyleName = keyof typeof AppTextStyles
