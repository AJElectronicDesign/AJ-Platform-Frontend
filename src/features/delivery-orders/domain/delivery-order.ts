import type { Currency } from '@/features/clients/domain/client'

export const DELIVERY_ORDER_STATUSES = ['pending', 'partial', 'completed', 'cancelled'] as const
export type DeliveryOrderStatus = (typeof DELIVERY_ORDER_STATUSES)[number]

export const DELIVERY_PRIORITIES = ['high', 'medium', 'low'] as const
export type DeliveryPriority = (typeof DELIVERY_PRIORITIES)[number]

export const DELIVERY_ORDER_PAGE_SIZE = 20

export interface DeliveryActor {
  id: string
  name: string | null
}

export interface DeliveryClientSummary {
  id: string
  legalName: string
  tradeName: string | null
  rfc: string
  quotePrefix: string
}

export interface DeliveryAddress {
  country: string
  state: string | null
  city: string | null
  street: string | null
  postalCode: string | null
}

export interface DeliveryProgress {
  ordered: string
  delivered: string
}

export interface DeliveryOrder {
  id: string
  clientId: string
  sourceQuoteId: string
  folio: string
  clientPoNumber: string | null
  status: DeliveryOrderStatus
  priority: DeliveryPriority
  startDate: string
  dueDate: string | null
  currency: Currency
  certificatePrefix: string
  progress: DeliveryProgress
  deliveryCount: number
  cancelledAt: string | null
  cancelledByUserId: string | null
  cancelledBy: DeliveryActor | null
  createdByUserId: string | null
  createdBy: DeliveryActor | null
  updatedByUserId: string | null
  updatedBy: DeliveryActor | null
  createdAt: string
  updatedAt: string
  version: string
  client: DeliveryClientSummary
}

export interface DeliveryOrderLine {
  id: string
  position: number
  description: string
  quantityOrdered: string
  quantityDelivered: string
  quantityPending: string
  unitPrice: string
  lineTotal: string
  sourceQuoteItemId: string
}

export interface DeliveryCertificateSummary {
  id: string
  folio: string
  deliveryDate: string
  receivedBy: string | null
  senderUserId: string
  sender: DeliveryActor | null
  subtotal: string
  vatAmount: string
  total: string
  createdAt: string
}

export interface DeliveryOrderDetail extends DeliveryOrder {
  address: DeliveryAddress
  requestedByName: string | null
  requestedByEmail: string | null
  includeVat: boolean
  vatRate: string
  notes: string | null
  subtotal: string
  vatAmount: string
  total: string
  lines: DeliveryOrderLine[]
  certificates: DeliveryCertificateSummary[]
}

export interface DeliveryCertificateLine {
  id: string
  orderItemId: string
  position: number
  description: string
  quantity: string
  unitPrice: string
  lineTotal: string
}

export interface DeliveryCertificate {
  id: string
  deliveryOrderId: string
  clientId: string
  folio: string
  certificatePrefix: string
  deliveryDate: string
  address: DeliveryAddress
  receivedBy: string | null
  senderUserId: string
  sender: DeliveryActor | null
  notes: string | null
  currency: Currency
  includeVat: boolean
  vatRate: string
  subtotal: string
  vatAmount: string
  total: string
  createdByUserId: string | null
  createdBy: DeliveryActor | null
  updatedByUserId: string | null
  updatedBy: DeliveryActor | null
  createdAt: string
  updatedAt: string
  version: string
  lines: DeliveryCertificateLine[]
}

export interface DeliveryOrderList {
  items: DeliveryOrder[]
  page: number
  pageSize: number
  total: number
}

export interface ListDeliveryOrdersQuery {
  q?: string
  status?: DeliveryOrderStatus
  clientId?: string
  page: number
  pageSize: number
}

export interface DeliveryAddressPatch {
  country?: string
  state?: string | null
  city?: string | null
  street?: string | null
  postalCode?: string | null
}

export interface PatchDeliveryOrderPayload {
  clientPoNumber?: string | null
  startDate?: string
  dueDate?: string | null
  priority?: DeliveryPriority
  address?: DeliveryAddressPatch
  notes?: string | null
  certificatePrefix?: string
  version?: string
}

export interface CancelDeliveryOrderPayload {
  version?: string
}

export interface CreateDeliveryLinePayload {
  orderItemId: string
  quantity: string
}

export interface CreateDeliveryPayload {
  deliveryDate?: string
  address?: DeliveryAddressPatch
  receivedBy?: string | null
  notes?: string | null
  lines: CreateDeliveryLinePayload[]
}

export function isDeliveryOrderStatus(value: string): value is DeliveryOrderStatus {
  return (DELIVERY_ORDER_STATUSES as readonly string[]).includes(value)
}

export function isDeliveryPriority(value: string): value is DeliveryPriority {
  return (DELIVERY_PRIORITIES as readonly string[]).includes(value)
}

export function canRegisterDelivery(status: DeliveryOrderStatus): boolean {
  return status === 'pending' || status === 'partial'
}

export function canCancelDeliveryOrder(order: {
  status: DeliveryOrderStatus
  deliveryCount: number
}): boolean {
  return order.deliveryCount === 0 && order.status !== 'cancelled'
}

export function certificatePrefixLocked(order: {
  deliveryCount: number
  certificates: readonly unknown[]
}): boolean {
  return order.deliveryCount > 0 || order.certificates.length > 0
}
