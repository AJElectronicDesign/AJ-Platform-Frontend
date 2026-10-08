import type {
  CancelDeliveryOrderPayload,
  CreateDeliveryPayload,
  DeliveryCertificate,
  DeliveryOrderDetail,
  DeliveryOrderList,
  ListDeliveryOrdersQuery,
  PatchDeliveryOrderPayload,
} from '@/features/delivery-orders/domain/delivery-order'
import type {
  DeliveryOrderRepository,
  DeliveryOrderRequestOptions,
} from '@/features/delivery-orders/domain/delivery-order-repository'
import {
  parseDeliveryEnvelope,
  parseDeliveryOrderEnvelope,
  parseDeliveryOrderList,
} from '@/features/delivery-orders/infrastructure/parse-delivery-order'
import { httpRequest } from '@/shared/infrastructure/http/http-client'

function orderPath(id: string, suffix = ''): string {
  return `/delivery-orders/${encodeURIComponent(id)}${suffix}`
}

export function deliveryOrderListPath(query: ListDeliveryOrdersQuery): string {
  const params = new URLSearchParams()
  const q = query.q?.trim()

  if (q) {
    params.set('q', q.slice(0, 100))
  }

  if (query.status) {
    params.set('status', query.status)
  }

  if (query.clientId) {
    params.set('clientId', query.clientId)
  }

  params.set('page', String(query.page))
  params.set('pageSize', String(query.pageSize))

  return `/delivery-orders?${params.toString()}`
}

export class HttpDeliveryOrderRepository implements DeliveryOrderRepository {
  list(query: ListDeliveryOrdersQuery, options?: DeliveryOrderRequestOptions): Promise<DeliveryOrderList> {
    return httpRequest<unknown>(deliveryOrderListPath(query), { signal: options?.signal }).then(parseDeliveryOrderList)
  }

  get(id: string, options?: DeliveryOrderRequestOptions): Promise<DeliveryOrderDetail> {
    return httpRequest<unknown>(orderPath(id), { signal: options?.signal }).then(parseDeliveryOrderEnvelope)
  }

  update(id: string, body: PatchDeliveryOrderPayload): Promise<DeliveryOrderDetail> {
    return httpRequest<unknown>(orderPath(id), { method: 'PATCH', body }).then(parseDeliveryOrderEnvelope)
  }

  cancel(id: string, body: CancelDeliveryOrderPayload): Promise<DeliveryOrderDetail> {
    return httpRequest<unknown>(orderPath(id, '/cancel'), { method: 'POST', body }).then(parseDeliveryOrderEnvelope)
  }

  createDelivery(id: string, body: CreateDeliveryPayload): Promise<DeliveryCertificate> {
    return httpRequest<unknown>(orderPath(id, '/deliveries'), { method: 'POST', body }).then(parseDeliveryEnvelope)
  }

  getDelivery(
    orderId: string,
    deliveryId: string,
    options?: DeliveryOrderRequestOptions,
  ): Promise<DeliveryCertificate> {
    return httpRequest<unknown>(orderPath(orderId, `/deliveries/${encodeURIComponent(deliveryId)}`), {
      signal: options?.signal,
    }).then(parseDeliveryEnvelope)
  }
}
