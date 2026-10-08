import { deliveryProgressFraction } from '@/features/delivery-orders/domain/progress'
import { formatDecimal } from '@/features/delivery-orders/presentation/format'
import { cn } from '@/shared/utils/cn'

export function DeliveryProgress({
  ordered,
  delivered,
  label,
}: {
  ordered: string
  delivered: string
  label: string
}) {
  const fraction = deliveryProgressFraction(ordered, delivered)
  const percent = Math.round(fraction * 100)

  return (
    <div className="min-w-36">
      <div className="flex items-baseline justify-between gap-3 text-xs text-ink-muted">
        <span>
          {formatDecimal(delivered)} / {formatDecimal(ordered)}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100"
        role="progressbar"
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={cn('h-full bg-brand-700')} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
