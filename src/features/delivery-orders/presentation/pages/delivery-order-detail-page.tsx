import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '@/features/clients/presentation/components/confirm-dialog'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import {
  canCancelDeliveryOrder,
  canRegisterDelivery,
  type DeliveryOrderDetail,
  type PatchDeliveryOrderPayload,
} from '@/features/delivery-orders/domain/delivery-order'
import { mapDeliveryOrderError } from '@/features/delivery-orders/domain/map-delivery-order-error'
import { DeliveryOrderStatusBadge } from '@/features/delivery-orders/presentation/components/delivery-order-status-badge'
import { OrderHeaderDialog } from '@/features/delivery-orders/presentation/components/order-header-dialog'
import { DeliveryOrdersPage } from '@/features/delivery-orders/presentation/delivery-orders-page'
import {
  clientLabel,
  displayText,
  formatAddress,
  formatDecimal,
  formatDeliveryDate,
  formatMoney,
  senderLabel,
} from '@/features/delivery-orders/presentation/format'
import { deliveryOrderBannerMessage, mappedToFieldErrors } from '@/features/delivery-orders/presentation/messages'
import { useDeliveryOrderRepository } from '@/features/delivery-orders/presentation/use-delivery-order-repository'
import { vatRateToPercent } from '@/features/quotes/domain/money'
import {
  appClientPath,
  appDeliveryCertificatePath,
  appQuotePath,
  appRegisterDeliveryPath,
  paths,
} from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

type OrderNotice = 'updated' | 'cancelled'

function readNotice(state: unknown): OrderNotice | null {
  if (!state || typeof state !== 'object' || !('notice' in state)) {
    return null
  }

  const notice = (state as { notice?: unknown }).notice
  return notice === 'updated' || notice === 'cancelled' ? notice : null
}

export function DeliveryOrderDetailPage() {
  const { t, locale } = useI18n()
  const copy = t.deliveryOrders.detail
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const orderId = params.orderId ?? ''
  const repository = useDeliveryOrderRepository()
  const [order, setOrder] = useState<DeliveryOrderDetail | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState<string | null>(null)
  const [retryable, setRetryable] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [notice, setNotice] = useState<OrderNotice | null>(() => readNotice(location.state))
  const [editing, setEditing] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [pending, setPending] = useState<'save' | 'cancel' | null>(null)
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  const [editBanner, setEditBanner] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      return
    }

    const controller = new AbortController()

    void repository
      .get(orderId, { signal: controller.signal })
      .then((next) => {
        if (controller.signal.aborted) {
          return
        }

        setOrder(next)
        setMessage(null)
        setRetryable(false)
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
  }, [attempt, orderId, repository, t.deliveryOrders])

  async function reload() {
    try {
      const fresh = await repository.get(orderId)
      setOrder(fresh)
      setMessage(null)
      setRetryable(false)
      return fresh
    } catch (error) {
      const mapped = mapDeliveryOrderError(error)
      setMessage(deliveryOrderBannerMessage(t.deliveryOrders, mapped))
      return null
    }
  }

  async function save(payload: PatchDeliveryOrderPayload) {
    if (!order) {
      return
    }

    setPending('save')
    setEditBanner(null)
    setEditErrors({})

    try {
      const next = await repository.update(order.id, payload)
      setOrder(next)
      setNotice('updated')
      setEditing(false)
      setMessage(null)
      setRetryable(false)
    } catch (error) {
      const mapped = mapDeliveryOrderError(error)
      setEditErrors(mappedToFieldErrors(t.deliveryOrders, mapped))
      setEditBanner(deliveryOrderBannerMessage(t.deliveryOrders, mapped))
      setRetryable(mapped.retryable)

      if (mapped.retryable) {
        const fresh = await reload()

        if (fresh) {
          setEditing(true)
        }
      }
    } finally {
      setPending(null)
    }
  }

  async function cancelOrder() {
    if (!order) {
      return
    }

    setPending('cancel')
    setMessage(null)

    try {
      const next = await repository.cancel(order.id, { version: order.version })
      setOrder(next)
      setNotice('cancelled')
      setConfirmCancel(false)
      setRetryable(false)
    } catch (error) {
      const mapped = mapDeliveryOrderError(error)
      setMessage(deliveryOrderBannerMessage(t.deliveryOrders, mapped))
      setRetryable(mapped.retryable)
      setConfirmCancel(false)

      if (mapped.retryable) {
        await reload()
      }
    } finally {
      setPending(null)
    }
  }

  const lines = order ? order.lines.slice().sort((left, right) => left.position - right.position) : []
  const deliverEnabled = order ? canRegisterDelivery(order.status) : false
  const cancelEnabled = order ? canCancelDeliveryOrder(order) : false
  const vatPercent = order ? vatRateToPercent(order.vatRate) : ''

  return (
    <DeliveryOrdersPage>
      <Link to={paths.appDeliveryOrders} className={cn(AppTextStyles.link, 'inline-flex')}>
        {copy.backToList}
      </Link>

      {loadState === 'loading' ? <p className={cn(AppTextStyles.bodySm, 'mt-8')}>{copy.loading}</p> : null}

      {loadState === 'error' ? (
        <div className="mt-8 max-w-xl">
          <StatusBanner
            action={
              <Button type="button" size="sm" variant="secondary" onClick={() => setAttempt((value) => value + 1)}>
                {t.deliveryOrders.list.retry}
              </Button>
            }
          >
            {message ?? copy.loading}
          </StatusBanner>
        </div>
      ) : null}

      {loadState === 'ready' && order ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className={cn(AppTextStyles.eyebrow, 'font-mono normal-case tracking-normal')}>{order.folio}</p>
              <h1 className={cn(AppTextStyles.h2, 'mt-2')}>{clientLabel(order.client.legalName, order.client.tradeName)}</h1>
              <div className="mt-3">
                <DeliveryOrderStatusBadge status={order.status} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={order.status === 'cancelled' || pending !== null}
                onClick={() => {
                  setEditErrors({})
                  setEditBanner(null)
                  setEditing(true)
                }}
              >
                {copy.edit}
              </Button>
              <Button
                type="button"
                disabled={!deliverEnabled || pending !== null}
                aria-describedby={deliverEnabled ? undefined : 'delivery-disabled-reason'}
                onClick={() => navigate(appRegisterDeliveryPath(order.id))}
              >
                {copy.deliver}
              </Button>
              {cancelEnabled ? (
                <Button type="button" variant="ghost" disabled={pending !== null} onClick={() => setConfirmCancel(true)}>
                  {copy.cancelOrder}
                </Button>
              ) : null}
            </div>
          </div>

          {!deliverEnabled ? (
            <p id="delivery-disabled-reason" className={cn(AppTextStyles.bodySm, 'mt-4 max-w-2xl')}>
              {copy.deliverDisabled}
            </p>
          ) : null}

          <div className="mt-4 space-y-4">
            {notice ? (
              <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                {t.deliveryOrders.notice[notice]}
              </div>
            ) : null}
            {message ? (
              <StatusBanner
                action={
                  retryable ? (
                    <Button type="button" size="sm" variant="secondary" onClick={() => void reload()}>
                      {t.deliveryOrders.errors.reload}
                    </Button>
                  ) : undefined
                }
              >
                {message}
              </StatusBanner>
            ) : null}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
                <h2 className={AppTextStyles.h3}>{copy.client}</h2>
                <p className={cn(AppTextStyles.bodyMd, 'mt-3')}>
                  <Link to={appClientPath(order.client.id)} className="rounded-md hover:text-brand-700">
                    {clientLabel(order.client.legalName, order.client.tradeName)}
                  </Link>
                </p>
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Fact label={copy.sourceQuote} value={order.folio}>
                    <Link to={appQuotePath(order.sourceQuoteId)} className={cn(AppTextStyles.link, 'mt-1 inline-flex')}>
                      {copy.viewQuote}
                    </Link>
                  </Fact>
                  <Fact label={copy.clientPo} value={displayText(order.clientPoNumber, copy.none)} />
                  <Fact label={copy.startDate} value={formatDeliveryDate(order.startDate, locale, copy.none)} />
                  <Fact label={copy.dueDate} value={formatDeliveryDate(order.dueDate, locale, copy.none)} />
                  <Fact label={copy.priority} value={t.deliveryOrders.priority[order.priority]} />
                  <Fact label={copy.address} value={formatAddress(order.address, copy.none)} />
                  <Fact
                    label={copy.requestedBy}
                    value={
                      order.requestedByName || order.requestedByEmail
                        ? [order.requestedByName, order.requestedByEmail].filter(Boolean).join(' · ')
                        : copy.none
                    }
                  />
                  <Fact label={copy.currency} value={order.currency} />
                  <Fact label={copy.certificatePrefix} value={order.certificatePrefix} />
                </dl>
                {order.notes ? (
                  <div className="mt-5">
                    <p className={AppTextStyles.caption}>{copy.notes}</p>
                    <p className={cn(AppTextStyles.bodyMd, 'mt-1 whitespace-pre-wrap')}>{order.notes}</p>
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
                <h2 className={AppTextStyles.h3}>{copy.lines}</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <caption className="sr-only">{copy.lines}</caption>
                    <thead className="border-b border-border text-ink-muted">
                      <tr>
                        <th scope="col" className="px-2 py-2 font-medium">{copy.description}</th>
                        <th scope="col" className="px-2 py-2 font-medium">{copy.ordered}</th>
                        <th scope="col" className="px-2 py-2 font-medium">{copy.delivered}</th>
                        <th scope="col" className="px-2 py-2 font-medium">{copy.pending}</th>
                        <th scope="col" className="px-2 py-2 font-medium">{copy.unitPrice}</th>
                        <th scope="col" className="px-2 py-2 font-medium">{copy.lineTotal}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line) => (
                        <tr key={line.id} className="border-b border-border last:border-0">
                          <th scope="row" className="px-2 py-3 font-medium text-ink">{line.description}</th>
                          <td className="px-2 py-3 text-ink-muted">{formatDecimal(line.quantityOrdered)}</td>
                          <td className="px-2 py-3 text-ink-muted">{formatDecimal(line.quantityDelivered)}</td>
                          <td className="px-2 py-3 text-ink-muted">{formatDecimal(line.quantityPending)}</td>
                          <td className="px-2 py-3 text-ink-muted">{formatDecimal(line.unitPrice)}</td>
                          <td className="px-2 py-3 font-medium text-ink">{formatMoney(line.lineTotal, order.currency)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
                <h2 className={AppTextStyles.h3}>{copy.certificates}</h2>
                {order.certificates.length === 0 ? (
                  <p className={cn(AppTextStyles.bodySm, 'mt-4')}>{copy.certificatesEmpty}</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <caption className="sr-only">{copy.certificates}</caption>
                      <thead className="border-b border-border text-ink-muted">
                        <tr>
                          <th scope="col" className="px-2 py-2 font-medium">{copy.certificateFolio}</th>
                          <th scope="col" className="px-2 py-2 font-medium">{copy.certificateDate}</th>
                          <th scope="col" className="px-2 py-2 font-medium">{copy.receivedBy}</th>
                          <th scope="col" className="px-2 py-2 font-medium">{copy.sender}</th>
                          <th scope="col" className="px-2 py-2 font-medium">{copy.total}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.certificates.map((certificate) => (
                          <tr key={certificate.id} className="border-b border-border last:border-0">
                            <th scope="row" className="px-2 py-3 font-mono text-xs font-semibold text-ink">
                              <Link
                                to={appDeliveryCertificatePath(order.id, certificate.id)}
                                className="rounded-md hover:text-brand-700"
                              >
                                {certificate.folio}
                              </Link>
                            </th>
                            <td className="px-2 py-3 text-ink-muted">
                              {formatDeliveryDate(certificate.deliveryDate, locale)}
                            </td>
                            <td className="px-2 py-3 text-ink-muted">{displayText(certificate.receivedBy, copy.none)}</td>
                            <td className="px-2 py-3 text-ink-muted">{senderLabel(certificate.sender, copy.unknownUser)}</td>
                            <td className="px-2 py-3 font-medium text-ink">{formatMoney(certificate.total, order.currency)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
              <h2 className={AppTextStyles.h3}>{copy.total}</h2>
              <dl className="mt-4 space-y-3">
                <MoneyRow label={copy.subtotal} value={formatMoney(order.subtotal, order.currency, copy.none)} />
                <MoneyRow
                  label={order.includeVat ? `${copy.vat} (${vatPercent}%)` : copy.noVat}
                  value={formatMoney(order.vatAmount, order.currency, copy.none)}
                />
                <div className="flex items-baseline justify-between gap-3 border-t border-border pt-3">
                  <dt className={AppTextStyles.bodyMd}>{copy.total}</dt>
                  <dd className="text-lg font-bold tracking-tight text-ink">{formatMoney(order.total, order.currency, copy.none)}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      ) : null}

      {order && editing ? (
        <OrderHeaderDialog
          key={order.version}
          open={editing}
          order={order}
          pending={pending === 'save'}
          serverErrors={editErrors}
          banner={editBanner}
          onSubmit={(payload) => {
            void save(payload)
          }}
          onClose={() => setEditing(false)}
        />
      ) : null}

      <ConfirmDialog
        open={confirmCancel}
        title={copy.cancelTitle}
        body={copy.cancelBody}
        confirmLabel={copy.confirm}
        pendingLabel={copy.working}
        cancelLabel={copy.cancel}
        closeLabel={t.deliveryOrders.closeDialog}
        pending={pending === 'cancel'}
        destructive
        onConfirm={() => {
          void cancelOrder()
        }}
        onClose={() => setConfirmCancel(false)}
      />
    </DeliveryOrdersPage>
  )
}

function Fact({ label, value, children }: { label: string; value: string; children?: ReactNode }) {
  return (
    <div>
      <dt className={AppTextStyles.caption}>{label}</dt>
      <dd className={cn(AppTextStyles.bodyMd, 'mt-1')}>{value}</dd>
      {children}
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
