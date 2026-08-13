import type { Leader } from '@/shared/corporate-content'
import { useI18n } from '@/shared/i18n'
import { AppIcons, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface LeaderCardProps {
  leader: Leader
}

export function LeaderCard({ leader }: LeaderCardProps) {
  const { t } = useI18n()
  const copy = t.company.leaders.people[leader.id]

  return (
    <article className="flex items-start gap-5">
      <div
        className="flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center rounded-full border border-border bg-white text-ink-subtle"
        aria-hidden="true"
      >
        <AppIcons.person className="h-9 w-9" />
      </div>

      <div className="min-w-0 pt-0.5">
        <h3 className={cn(AppTextStyles.h3, 'text-brand-800')}>{leader.name}</h3>
        {copy?.role ? (
          <p className={cn(AppTextStyles.bodySm, 'mt-1')}>{copy.role}</p>
        ) : null}

        <ul className="mt-3 space-y-1.5">
          {leader.email ? (
            <li>
              <a
                href={`mailto:${leader.email}`}
                className={cn(
                  'inline-flex max-w-full items-center gap-2 text-sm text-brand-800 transition-colors hover:text-brand-700',
                )}
              >
                <AppIcons.mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{leader.email}</span>
              </a>
            </li>
          ) : null}
          {leader.phone ? (
            <li>
              <a
                href={`tel:${leader.phone.replace(/[^\d+]/g, '')}`}
                className="inline-flex items-center gap-2 text-sm text-brand-800 transition-colors hover:text-brand-700"
              >
                <AppIcons.phone className="h-4 w-4 shrink-0" />
                <span>{leader.phone}</span>
              </a>
            </li>
          ) : null}
        </ul>

        {leader.linkedin ? (
          <a
            href={leader.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={`LinkedIn, ${leader.name}`}
            className="mt-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-brand-800 transition-colors hover:border-brand-200 hover:bg-brand-50"
          >
            <AppIcons.linkedin className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
    </article>
  )
}
