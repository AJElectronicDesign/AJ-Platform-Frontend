import { LeaderCard } from '@/shared/components/corporate/leader-card'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { leaders } from '@/shared/corporate-content'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function LandingLeadersSection() {
  const { t } = useI18n()

  if (leaders.length === 0) {
    return null
  }

  return (
    <section
      id="leaders"
      className={cn(
        'scroll-mt-24 border-t py-16 sm:py-20',
        AppColorClasses.border.DEFAULT,
        AppColorClasses.bg.white,
      )}
    >
      <Container>
        <SectionHeader title={t.company.leaders.title} align="center" />
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          {leaders.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>
      </Container>
    </section>
  )
}
