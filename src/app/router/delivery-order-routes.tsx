import { lazy, Suspense, type ReactNode } from 'react'
import { DeliveryOrdersPage } from '@/features/delivery-orders/presentation/delivery-orders-page'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

const DeliveryOrderListPage = lazy(() =>
  import('@/features/delivery-orders/presentation/pages/delivery-order-list-page').then((module) => ({
    default: module.DeliveryOrderListPage,
  })),
)
const RegisterDeliveryPage = lazy(() =>
  import('@/features/delivery-orders/presentation/pages/register-delivery-page').then((module) => ({
    default: module.RegisterDeliveryPage,
  })),
)
const DeliveryCertificatePage = lazy(() =>
  import('@/features/delivery-orders/presentation/pages/delivery-certificate-page').then((module) => ({
    default: module.DeliveryCertificatePage,
  })),
)
const DeliveryOrderDetailPage = lazy(() =>
  import('@/features/delivery-orders/presentation/pages/delivery-order-detail-page').then((module) => ({
    default: module.DeliveryOrderDetailPage,
  })),
)

function DeliveryRoute({
  loading,
  children,
}: {
  loading: 'list' | 'detail' | 'deliver' | 'certificate'
  children: ReactNode
}) {
  const { t } = useI18n()
  const label = {
    list: t.deliveryOrders.list.loading,
    detail: t.deliveryOrders.detail.loading,
    deliver: t.deliveryOrders.deliver.loading,
    certificate: t.deliveryOrders.certificate.loading,
  }[loading]

  return (
    <Suspense
      fallback={
        <DeliveryOrdersPage>
          <p className={cn(AppTextStyles.bodySm)}>{label}</p>
        </DeliveryOrdersPage>
      }
    >
      {children}
    </Suspense>
  )
}

export function DeliveryOrderListRoute() {
  return (
    <DeliveryRoute loading="list">
      <DeliveryOrderListPage />
    </DeliveryRoute>
  )
}

export function RegisterDeliveryRoute() {
  return (
    <DeliveryRoute loading="deliver">
      <RegisterDeliveryPage />
    </DeliveryRoute>
  )
}

export function DeliveryCertificateRoute() {
  return (
    <DeliveryRoute loading="certificate">
      <DeliveryCertificatePage />
    </DeliveryRoute>
  )
}

export function DeliveryOrderDetailRoute() {
  return (
    <DeliveryRoute loading="detail">
      <DeliveryOrderDetailPage />
    </DeliveryRoute>
  )
}
