import type { HeroContent } from '@/features/landing/domain/entities/landing-content'
import { HeroVisual } from '@/features/landing/presentation/components/hero-visual'
import { Container } from '@/shared/components/container'
import { Button } from '@/shared/ui/button'

export interface HeroSectionProps {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-white">
      <div className="pointer-events-none absolute inset-0 grid-tech opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgb(204_251_241/0.7),_transparent_60%)]" />

      <Container className="relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-28">
        <div className="fade-up">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand-700">
            {content.eyebrow}
          </p>
          <h1 className="mt-5 max-w-xl text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
            {content.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            {content.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={content.primaryCta.href}>
              <Button size="lg">{content.primaryCta.label}</Button>
            </a>
            <a href={content.secondaryCta.href}>
              <Button size="lg" variant="secondary">
                {content.secondaryCta.label}
              </Button>
            </a>
          </div>
        </div>

        <div className="fade-up fade-up-delay-2">
          <HeroVisual highlights={content.highlights} />
        </div>
      </Container>
    </section>
  )
}
