import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { canRegisterDelivery, type CreateDeliveryPayload, type DeliveryOrderDetail } from '@/features/delivery-orders/domain/delivery-order'
import { mapDeliveryOrderError } from '@/features/delivery-orders/domain/map-delivery-order-error'
import { mapLineQuantityErrors } from '@/features/delivery-orders/domain/validation'
import { RegisterDeliveryForm } from '@/features/delivery-orders/presentation/components/register-delivery-form'
import { DeliveryOrdersPage } from '@/features/delivery-orders/presentation/delivery-orders-page'
import { deliveryOrderBannerMessage, mappedToFieldErrors } from '@/features/delivery-orders/presentation/messages'
import { useDeliveryOrderRepository } from '@/features/delivery-orders/presentation/use-delivery-order-repository'
import { appDeliveryCertificatePath, appDeliveryOrderPath } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

export function RegisterDeliveryPage() {
  const { t } = useI18n()
  const copy = t.deliveryOrders.deliver
  const navigate = useNavigate()
  const params = useParams()
  const orderId = params.orderId ?? ''
  const repository = useDeliveryOrderRepository()
  const [order, setOrder] = useState<DeliveryOrderDetail | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState<string | null>(null)
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [lineErrors, setLineErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)
  const [attempt, setAttempt] = useState(0)

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

  async function submit(payload: CreateDeliveryPayload) {
    if (!order || !canRegisterDelivery(order.status)) {
      return
    }

    setPending(true)
    setMessage(null)
    setServerErrors({})
    setLineErrors({})

    try {
      const delivery = await repository.createDelivery(order.id, payload)
      navigate(appDeliveryCertificatePath(order.id, delivery.id), { state: { notice: 'delivered' } })
    } catch (error) {
      const mapped = mapDeliveryOrderError(error)
      const fields = mappedToFieldErrors(t.deliveryOrders, mapped)
      setServerErrors(fields)
      setLineErrors(
        mapLineQuantityErrors(
          fields,
          payload.lines.map((line) => line.orderItemId),
        ),
      )
      setMessage(deliveryOrderBannerMessage(t.deliveryOrders, mapped))

      if (mapped.retryable || mapped.bannerCode === 'completed' || mapped.bannerCode === 'cancelled') {
        try {
          const fresh = await repository.get(order.id)
          setOrder(fresh)
        } catch {
          // The banner already explains the failure.
        }
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <DeliveryOrdersPage>
      <Link to={appDeliveryOrderPath(orderId)} className={cn(AppTextStyles.link, 'inline-flex')}>
        {copy.back}
      </Link>
      <div className="mt-6">
        <p className={cn(AppTextStyles.eyebrow, 'font-mono normal-case tracking-normal')}>{order?.folio}</p>
        <h1 className={cn(AppTextStyles.h2, 'mt-2')}>{copy.title}</h1>
        <p className={cn(AppTextStyles.bodySm, 'mt-2 max-w-xl')}>{copy.description}</p>
      </div>

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
            {message ?? t.deliveryOrders.errors.notFound}
          </StatusBanner>
        </div>
      ) : null}

      {loadState === 'ready' && order ? (
        <RegisterDeliveryForm
          key={order.version}
          order={order}
          pending={pending}
          serverErrors={serverErrors}
          lineErrors={lineErrors}
          banner={message}
          onSubmit={(payload) => {
            void submit(payload)
          }}
        />
      ) : null}
    </DeliveryOrdersPage>
  )
}
