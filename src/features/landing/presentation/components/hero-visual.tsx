import type { HeroHighlight } from '@/features/landing/domain/entities/landing-content'

export interface HeroVisualProps {
  highlights: HeroHighlight[]
}

export function HeroVisual({ highlights }: HeroVisualProps) {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none"
      aria-hidden="true"
    >
      <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-brand-100/70 shadow-[var(--shadow-soft)] ring-1 ring-brand-100" />
      <div className="absolute inset-10 overflow-hidden rounded-[1.6rem] bg-white grid-tech">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -bottom-10 -left-6 h-44 w-44 rounded-full bg-brand-100/80 blur-3xl" />

        <svg
          viewBox="0 0 320 320"
          className="absolute inset-0 h-full w-full text-brand-700/70"
          fill="none"
        >
          <path
            d="M40 80H120V140H180V90H280"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M40 220H100V160H170V240H280"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="120" cy="80" r="4" fill="currentColor" />
          <circle cx="180" cy="140" r="4" fill="currentColor" />
          <circle cx="100" cy="220" r="4" fill="currentColor" />
          <circle cx="170" cy="160" r="4" fill="currentColor" />
          <rect
            x="118"
            y="118"
            width="84"
            height="84"
            rx="18"
            className="fill-brand-50 stroke-brand-200"
            strokeWidth="1.5"
          />
          <rect
            x="138"
            y="138"
            width="44"
            height="44"
            rx="10"
            className="fill-brand-700"
          />
          <path
            d="M149 160h22M160 149v22"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="absolute left-0 top-8 w-[min(100%,14rem)] rounded-2xl border border-border/80 bg-white/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brand-700">
          {highlights[0]?.label}
        </p>
        <p className="mt-1 text-sm font-semibold text-ink">
          {highlights[0]?.value}
        </p>
      </div>

      <div className="absolute bottom-10 right-0 w-[min(100%,15rem)] rounded-2xl border border-border/80 bg-white/95 p-4 shadow-[var(--shadow-lift)] backdrop-blur">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-brand-700">
          {highlights[1]?.label}
        </p>
        <p className="mt-1 text-sm font-semibold text-ink">
          {highlights[1]?.value}
        </p>
      </div>

      {highlights[2] ? (
        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-brand-800 sm:block">
          {highlights[2].value}
        </div>
      ) : null}
    </div>
  )
}
