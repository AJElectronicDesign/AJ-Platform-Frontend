import { LeaderCard } from '@/features/company/presentation/components/leader-card'
import { Container } from '@/shared/components/container'
import { SectionHeader } from '@/shared/components/section-header'
import { whoWeAreHash } from '@/shared/constants/paths'
import { leaders } from '@/shared/corporate-content'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function LeadersSection() {
  const { t } = useI18n()

  if (leaders.length === 0) {
    return null
  }

  return (
    <section
      id={whoWeAreHash.leaders}
      className={cn('scroll-mt-24 py-16 sm:py-20', AppColorClasses.bg.surface)}
    >
      <Container>
        <SectionHeader
          eyebrow={t.company.leaders.eyebrow}
          title={t.company.leaders.title}
          description={t.company.leaders.description}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {leaders.map((leader) => (
            <LeaderCard key={leader.id} leader={leader} />
          ))}
        </div>
      </Container>
    </section>
  )
}
