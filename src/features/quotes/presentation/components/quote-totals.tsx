import { formatMoney } from '@/features/quotes/presentation/format'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export function QuoteTotals({
  title,
  hint,
  currency,
  subtotal,
  vatAmount,
  total,
  includeVat,
  vatPercent,
}: {
  title: string
  hint?: string
  currency: string
  subtotal: string | null
  vatAmount: string | null
  total: string | null
  includeVat: boolean
  vatPercent: string
}) {
  const { t } = useI18n()
  const copy = t.quotes.detail
  const empty = copy.none
  const vatLabel = includeVat && vatPercent.trim() ? `${copy.vat} (${vatPercent.trim()}%)` : copy.vat

  return (
    <aside className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
      <h2 className={AppTextStyles.h3}>{title}</h2>
      {hint ? <p className={cn(AppTextStyles.caption, 'mt-2')}>{hint}</p> : null}
      <dl className="mt-4 space-y-3">
        <Row label={copy.subtotal} value={formatMoney(subtotal, currency, empty)} />
        <Row label={includeVat ? vatLabel : copy.noVat} value={formatMoney(vatAmount, currency, empty)} />
        <div className="flex items-baseline justify-between gap-3 border-t border-border pt-3">
          <dt className={AppTextStyles.bodyMd}>{copy.total}</dt>
          <dd className="text-lg font-bold tracking-tight text-ink">{formatMoney(total, currency, empty)}</dd>
        </div>
      </dl>
    </aside>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={AppTextStyles.bodySm}>{label}</dt>
      <dd className={AppTextStyles.bodyMd}>{value}</dd>
    </div>
  )
}
