import type {
  CancelDeliveryOrderPayload,
  CreateDeliveryPayload,
  DeliveryCertificate,
  DeliveryOrderDetail,
  DeliveryOrderList,
  ListDeliveryOrdersQuery,
  PatchDeliveryOrderPayload,
} from '@/features/delivery-orders/domain/delivery-order'

export interface DeliveryOrderRequestOptions {
  signal?: AbortSignal
}

export interface DeliveryOrderRepository {
  list(query: ListDeliveryOrdersQuery, options?: DeliveryOrderRequestOptions): Promise<DeliveryOrderList>
  get(id: string, options?: DeliveryOrderRequestOptions): Promise<DeliveryOrderDetail>
  update(id: string, body: PatchDeliveryOrderPayload): Promise<DeliveryOrderDetail>
  cancel(id: string, body: CancelDeliveryOrderPayload): Promise<DeliveryOrderDetail>
  createDelivery(id: string, body: CreateDeliveryPayload): Promise<DeliveryCertificate>
  getDelivery(
    orderId: string,
    deliveryId: string,
    options?: DeliveryOrderRequestOptions,
  ): Promise<DeliveryCertificate>
}
