import type { Leader } from '@/shared/corporate-content'
import { AppColorClasses, AppRadius, AppShadows, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface LeaderCardProps {
  leader: Leader
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function LeaderCard({ leader }: LeaderCardProps) {
  return (
    <article
      className={cn(
        'border bg-white p-5 transition-colors duration-200 hover:border-brand-200',
        AppRadius.xl,
        AppShadows.soft,
        AppColorClasses.border.DEFAULT,
      )}
    >
      {leader.image ? (
        <img
          src={leader.image}
          alt={leader.name}
          width={480}
          height={480}
          loading="lazy"
          decoding="async"
          className={cn('aspect-square w-full object-cover', AppRadius.lg)}
        />
      ) : (
        <div
          className={cn(
            'flex aspect-square w-full items-center justify-center bg-brand-50 text-2xl font-semibold text-brand-800',
            AppRadius.lg,
          )}
          aria-hidden="true"
        >
          {initials(leader.name)}
        </div>
      )}

      <h3 className={cn(AppTextStyles.h3, 'mt-4')}>{leader.name}</h3>
      <p className={cn(AppTextStyles.bodySm, 'mt-1')}>{leader.role}</p>

      <ul className="mt-4 space-y-1.5">
        {leader.email ? (
          <li>
            <a
              href={`mailto:${leader.email}`}
              className={cn(AppTextStyles.link, 'break-all')}
            >
              {leader.email}
            </a>
          </li>
        ) : null}
        {leader.phone ? (
          <li>
            <a
              href={`tel:${leader.phone.replace(/[^\d+]/g, '')}`}
              className={AppTextStyles.link}
            >
              {leader.phone}
            </a>
          </li>
        ) : null}
        {leader.linkedin ? (
          <li>
            <a
              href={leader.linkedin}
              target="_blank"
              rel="noreferrer"
              className={AppTextStyles.link}
            >
              LinkedIn
            </a>
          </li>
        ) : null}
      </ul>
    </article>
  )
}
