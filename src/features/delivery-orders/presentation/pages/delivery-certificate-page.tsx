import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import type { DeliveryCertificate } from '@/features/delivery-orders/domain/delivery-order'
import { mapDeliveryOrderError } from '@/features/delivery-orders/domain/map-delivery-order-error'
import { DeliveryOrdersPage } from '@/features/delivery-orders/presentation/delivery-orders-page'
import {
  displayText,
  formatAddress,
  formatDecimal,
  formatDeliveryDate,
  formatMoney,
  senderLabel,
} from '@/features/delivery-orders/presentation/format'
import { deliveryOrderBannerMessage } from '@/features/delivery-orders/presentation/messages'
import { useDeliveryOrderRepository } from '@/features/delivery-orders/presentation/use-delivery-order-repository'
import { vatRateToPercent } from '@/features/quotes/domain/money'
import { appDeliveryOrderPath } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

export function DeliveryCertificatePage() {
  const { t, locale } = useI18n()
  const copy = t.deliveryOrders.certificate
  const location = useLocation()
  const params = useParams()
  const orderId = params.orderId ?? ''
  const deliveryId = params.deliveryId ?? ''
  const repository = useDeliveryOrderRepository()
  const [delivery, setDelivery] = useState<DeliveryCertificate | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const deliveredNotice =
    location.state &&
    typeof location.state === 'object' &&
    'notice' in location.state &&
    (location.state as { notice?: unknown }).notice === 'delivered'

  useEffect(() => {
    if (!orderId || !deliveryId) {
      return
    }

    const controller = new AbortController()

    void repository
      .getDelivery(orderId, deliveryId, { signal: controller.signal })
      .then((next) => {
        if (controller.signal.aborted) {
          return
        }

        setDelivery(next)
        setMessage(null)
        setLoadState('ready')
      })
      .catch((error: unknown) => {
        const mapped = mapDeliveryOrderError(error)

        if (mapped.aborted) {
          return
        }

        setMessage(deliveryOrderBannerMessage(t.deliveryOrders, mapped))
        setLoadState('error')
      })

    return () => controller.abort()
  }, [attempt, deliveryId, orderId, repository, t.deliveryOrders])

  const lines = delivery ? delivery.lines.slice().sort((left, right) => left.position - right.position) : []
  const vatPercent = delivery ? vatRateToPercent(delivery.vatRate) : ''

  return (
    <DeliveryOrdersPage>
      <Link to={appDeliveryOrderPath(orderId)} className={cn(AppTextStyles.link, 'inline-flex')}>
        {copy.back}
      </Link>

      {loadState === 'loading' ? <p className={cn(AppTextStyles.bodySm, 'mt-8')}>{copy.loading}</p> : null}

      {loadState === 'error' ? (
        <div className="mt-8 max-w-xl">
          <StatusBanner
            action={
              <Button type="button" size="sm" variant="secondary" onClick={() => setAttempt((value) => value + 1)}>
                {t.deliveryOrders.errors.retry}
              </Button>
            }
          >
            {message ?? t.deliveryOrders.errors.deliveryNotFound}
          </StatusBanner>
        </div>
      ) : null}

      {loadState === 'ready' && delivery ? (
        <div className="mt-6">
          <p className={AppTextStyles.eyebrow}>{copy.folio}</p>
          <h1 className={cn(AppTextStyles.h2, 'mt-2 font-mono')}>{delivery.folio}</h1>
          <p className={cn(AppTextStyles.bodySm, 'mt-3 max-w-2xl')}>{copy.progressNote}</p>

          {deliveredNotice ? (
            <div role="status" className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {t.deliveryOrders.notice.delivered}
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <Fact label={copy.date} value={formatDeliveryDate(delivery.deliveryDate, locale, copy.none)} />
                  <Fact label={copy.address} value={formatAddress(delivery.address, copy.none)} />
                  <Fact label={copy.receivedBy} value={displayText(delivery.receivedBy, copy.none)} />
                  <Fact label={copy.sender} value={senderLabel(delivery.sender, copy.unknownUser)} />
                </dl>
                {delivery.notes ? (
                  <div className="mt-5">
                    <p className={AppTextStyles.caption}>{copy.notes}</p>
                    <p className={cn(AppTextStyles.bodyMd, 'mt-1 whitespace-pre-wrap')}>{delivery.notes}</p>
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
                <h2 className={AppTextStyles.h3}>{copy.lines}</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <caption className="sr-only">{copy.lines}</caption>
                    <thead className="border-b border-border text-ink-muted">
                      <tr>
                        <th scope="col" className="px-2 py-2 font-medium">{copy.description}</th>
                        <th scope="col" className="px-2 py-2 font-medium">{copy.quantity}</th>
                        <th scope="col" className="px-2 py-2 font-medium">{copy.unitPrice}</th>
                        <th scope="col" className="px-2 py-2 font-medium">{copy.lineTotal}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line) => (
                        <tr key={line.id} className="border-b border-border last:border-0">
                          <th scope="row" className="px-2 py-3 font-medium text-ink">{line.description}</th>
                          <td className="px-2 py-3 text-ink-muted">{formatDecimal(line.quantity)}</td>
                          <td className="px-2 py-3 text-ink-muted">{formatDecimal(line.unitPrice)}</td>
                          <td className="px-2 py-3 font-medium text-ink">{formatMoney(line.lineTotal, delivery.currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
              <h2 className={AppTextStyles.h3}>{copy.total}</h2>
              <dl className="mt-4 space-y-3">
                <MoneyRow label={copy.subtotal} value={formatMoney(delivery.subtotal, delivery.currency, copy.none)} />
                <MoneyRow
                  label={delivery.includeVat ? `${copy.vat} (${vatPercent}%)` : copy.noVat}
                  value={formatMoney(delivery.vatAmount, delivery.currency, copy.none)}
                />
                <div className="flex items-baseline justify-between gap-3 border-t border-border pt-3">
                  <dt className={AppTextStyles.bodyMd}>{copy.total}</dt>
                  <dd className="text-lg font-bold tracking-tight text-ink">
                    {formatMoney(delivery.total, delivery.currency, copy.none)}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      ) : null}
    </DeliveryOrdersPage>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={AppTextStyles.caption}>{label}</dt>
      <dd className={cn(AppTextStyles.bodyMd, 'mt-1')}>{value}</dd>
    </div>
  )
}

function MoneyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={AppTextStyles.bodySm}>{label}</dt>
      <dd className={AppTextStyles.bodyMd}>{value}</dd>
    </div>
  )
}
