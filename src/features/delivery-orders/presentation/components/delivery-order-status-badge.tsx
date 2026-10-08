import type { DeliveryOrderStatus } from '@/features/delivery-orders/domain/delivery-order'
import { DELIVERY_STATUS_CHIP_CLASS, deliveryStatusTone } from '@/features/delivery-orders/domain/status'
import { useI18n } from '@/shared/i18n'
import { Badge } from '@/shared/ui/badge'

export function DeliveryOrderStatusBadge({ status }: { status: DeliveryOrderStatus }) {
  const { t } = useI18n()
  const tone = deliveryStatusTone(status)

  return <Badge className={DELIVERY_STATUS_CHIP_CLASS[tone]}>{t.deliveryOrders.status[status]}</Badge>
}
