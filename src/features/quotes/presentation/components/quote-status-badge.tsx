import type { QuoteStatus } from '@/features/quotes/domain/quote'
import { useI18n } from '@/shared/i18n'
import { Badge } from '@/shared/ui/badge'

const statusClass: Record<QuoteStatus, string> = {
  draft: 'bg-surface-muted text-ink-muted',
  sent: 'bg-brand-50 text-brand-800',
  accepted: 'bg-emerald-50 text-emerald-800',
  rejected: 'bg-red-50 text-red-800',
  expired: 'bg-amber-50 text-amber-900',
}

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const { t } = useI18n()

  return <Badge className={statusClass[status]}>{t.quotes.status[status]}</Badge>
}
