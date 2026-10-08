import type { Currency } from '@/features/clients/domain/client'
import {
  isDeliveryOrderStatus,
  isDeliveryPriority,
  type DeliveryActor,
  type DeliveryAddress,
  type DeliveryCertificate,
  type DeliveryCertificateLine,
  type DeliveryCertificateSummary,
  type DeliveryClientSummary,
  type DeliveryOrder,
  type DeliveryOrderDetail,
  type DeliveryOrderLine,
  type DeliveryOrderList,
  type DeliveryProgress,
} from '@/features/delivery-orders/domain/delivery-order'

export class InvalidDeliveryOrderResponseError extends Error {
  readonly code = 'invalid_response' as const

  constructor() {
    super('The server returned an invalid delivery order response.')
    this.name = 'InvalidDeliveryOrderResponseError'
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new InvalidDeliveryOrderResponseError()
  }

  return value as Record<string, unknown>
}

function expectString(record: Record<string, unknown>, key: string): string {
  const value = record[key]

  if (typeof value !== 'string') {
    throw new InvalidDeliveryOrderResponseError()
  }

  return value
}

function expectNullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key]

  if (value === null) {
    return null
  }

  if (typeof value !== 'string') {
    throw new InvalidDeliveryOrderResponseError()
  }

  return value
}

function expectBoolean(record: Record<string, unknown>, key: string): boolean {
  const value = record[key]

  if (typeof value !== 'boolean') {
    throw new InvalidDeliveryOrderResponseError()
  }

  return value
}

function expectCurrency(value: unknown): Currency {
  if (value !== 'MXN' && value !== 'USD') {
    throw new InvalidDeliveryOrderResponseError()
  }

  return value
}

function expectInteger(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new InvalidDeliveryOrderResponseError()
  }

  return value
}

function parseActor(value: unknown): DeliveryActor | null {
  if (value === null) {
    return null
  }

  const record = asRecord(value)
  const name = record.name

  if (!('name' in record) || (name !== null && typeof name !== 'string')) {
    throw new InvalidDeliveryOrderResponseError()
  }

  return {
    id: expectString(record, 'id'),
    name,
  }
}

function expectActor(record: Record<string, unknown>, key: string): DeliveryActor | null {
  if (!(key in record)) {
    throw new InvalidDeliveryOrderResponseError()
  }

  return parseActor(record[key])
}

function parseClientSummary(value: unknown): DeliveryClientSummary {
  const record = asRecord(value)

  return {
    id: expectString(record, 'id'),
    legalName: expectString(record, 'legalName'),
    tradeName: expectNullableString(record, 'tradeName'),
    rfc: expectString(record, 'rfc'),
    quotePrefix: expectString(record, 'quotePrefix'),
  }
}

function parseAddress(value: unknown): DeliveryAddress {
  const record = asRecord(value)

  return {
    country: expectString(record, 'country'),
    state: expectNullableString(record, 'state'),
    city: expectNullableString(record, 'city'),
    street: expectNullableString(record, 'street'),
    postalCode: expectNullableString(record, 'postalCode'),
  }
}

function parseProgress(value: unknown): DeliveryProgress {
  const record = asRecord(value)

  return {
    ordered: expectString(record, 'ordered'),
    delivered: expectString(record, 'delivered'),
  }
}

function parseLine(value: unknown): DeliveryOrderLine {
  const record = asRecord(value)
  const position = expectInteger(record.position)

  if (position < 1) {
    throw new InvalidDeliveryOrderResponseError()
  }

  return {
    id: expectString(record, 'id'),
    position,
    description: expectString(record, 'description'),
    quantityOrdered: expectString(record, 'quantityOrdered'),
    quantityDelivered: expectString(record, 'quantityDelivered'),
    quantityPending: expectString(record, 'quantityPending'),
    unitPrice: expectString(record, 'unitPrice'),
    lineTotal: expectString(record, 'lineTotal'),
    sourceQuoteItemId: expectString(record, 'sourceQuoteItemId'),
  }
}

function parseCertificateSummary(value: unknown): DeliveryCertificateSummary {
  const record = asRecord(value)

  return {
    id: expectString(record, 'id'),
    folio: expectString(record, 'folio'),
    deliveryDate: expectString(record, 'deliveryDate'),
    receivedBy: expectNullableString(record, 'receivedBy'),
    senderUserId: expectString(record, 'senderUserId'),
    sender: expectActor(record, 'sender'),
    subtotal: expectString(record, 'subtotal'),
    vatAmount: expectString(record, 'vatAmount'),
    total: expectString(record, 'total'),
    createdAt: expectString(record, 'createdAt'),
  }
}

function parseCertificateLine(value: unknown): DeliveryCertificateLine {
  const record = asRecord(value)
  const position = expectInteger(record.position)

  if (position < 1) {
    throw new InvalidDeliveryOrderResponseError()
  }

  return {
    id: expectString(record, 'id'),
    orderItemId: expectString(record, 'orderItemId'),
    position,
    description: expectString(record, 'description'),
    quantity: expectString(record, 'quantity'),
    unitPrice: expectString(record, 'unitPrice'),
    lineTotal: expectString(record, 'lineTotal'),
  }
}

export function parseDeliveryOrder(value: unknown): DeliveryOrder {
  const record = asRecord(value)
  const status = record.status
  const priority = record.priority
  const deliveryCount = expectInteger(record.deliveryCount)

  if (typeof status !== 'string' || !isDeliveryOrderStatus(status)) {
    throw new InvalidDeliveryOrderResponseError()
  }

  if (typeof priority !== 'string' || !isDeliveryPriority(priority)) {
    throw new InvalidDeliveryOrderResponseError()
  }

  if (deliveryCount < 0) {
    throw new InvalidDeliveryOrderResponseError()
  }

  return {
    id: expectString(record, 'id'),
    clientId: expectString(record, 'clientId'),
    sourceQuoteId: expectString(record, 'sourceQuoteId'),
    folio: expectString(record, 'folio'),
    clientPoNumber: expectNullableString(record, 'clientPoNumber'),
    status,
    priority,
    startDate: expectString(record, 'startDate'),
    dueDate: expectNullableString(record, 'dueDate'),
    currency: expectCurrency(record.currency),
    certificatePrefix: expectString(record, 'certificatePrefix'),
    progress: parseProgress(record.progress),
    deliveryCount,
    cancelledAt: expectNullableString(record, 'cancelledAt'),
    cancelledByUserId: expectNullableString(record, 'cancelledByUserId'),
    cancelledBy: expectActor(record, 'cancelledBy'),
    createdByUserId: expectNullableString(record, 'createdByUserId'),
    createdBy: expectActor(record, 'createdBy'),
    updatedByUserId: expectNullableString(record, 'updatedByUserId'),
    updatedBy: expectActor(record, 'updatedBy'),
    createdAt: expectString(record, 'createdAt'),
    updatedAt: expectString(record, 'updatedAt'),
    version: expectString(record, 'version'),
    client: parseClientSummary(record.client),
  }
}

export function parseDeliveryOrderDetail(value: unknown): DeliveryOrderDetail {
  const record = asRecord(value)
  const lines = record.lines
  const certificates = record.certificates

  if (!Array.isArray(lines) || !Array.isArray(certificates)) {
    throw new InvalidDeliveryOrderResponseError()
  }

  return {
    ...parseDeliveryOrder(value),
    address: parseAddress(record.address),
    requestedByName: expectNullableString(record, 'requestedByName'),
    requestedByEmail: expectNullableString(record, 'requestedByEmail'),
    includeVat: expectBoolean(record, 'includeVat'),
    vatRate: expectString(record, 'vatRate'),
    notes: expectNullableString(record, 'notes'),
    subtotal: expectString(record, 'subtotal'),
    vatAmount: expectString(record, 'vatAmount'),
    total: expectString(record, 'total'),
    lines: lines.map(parseLine),
    certificates: certificates.map(parseCertificateSummary),
  }
}

export function parseDeliveryOrderEnvelope(value: unknown): DeliveryOrderDetail {
  const record = asRecord(value)
  return parseDeliveryOrderDetail(record.order)
}

export function parseDeliveryOrderList(value: unknown): DeliveryOrderList {
  const record = asRecord(value)
  const items = record.items
  const page = record.page
  const pageSize = record.pageSize
  const total = record.total

  if (!Array.isArray(items) || !Number.isInteger(page) || !Number.isInteger(pageSize) || !Number.isInteger(total)) {
    throw new InvalidDeliveryOrderResponseError()
  }

  return {
    items: items.map(parseDeliveryOrder),
    page: page as number,
    pageSize: pageSize as number,
    total: total as number,
  }
}

export function parseDeliveryCertificate(value: unknown): DeliveryCertificate {
  const record = asRecord(value)
  const lines = record.lines

  if (!Array.isArray(lines)) {
    throw new InvalidDeliveryOrderResponseError()
  }

  return {
    id: expectString(record, 'id'),
    deliveryOrderId: expectString(record, 'deliveryOrderId'),
    clientId: expectString(record, 'clientId'),
    folio: expectString(record, 'folio'),
    certificatePrefix: expectString(record, 'certificatePrefix'),
    deliveryDate: expectString(record, 'deliveryDate'),
    address: parseAddress(record.address),
    receivedBy: expectNullableString(record, 'receivedBy'),
    senderUserId: expectString(record, 'senderUserId'),
    sender: expectActor(record, 'sender'),
    notes: expectNullableString(record, 'notes'),
    currency: expectCurrency(record.currency),
    includeVat: expectBoolean(record, 'includeVat'),
    vatRate: expectString(record, 'vatRate'),
    subtotal: expectString(record, 'subtotal'),
    vatAmount: expectString(record, 'vatAmount'),
    total: expectString(record, 'total'),
    createdByUserId: expectNullableString(record, 'createdByUserId'),
    createdBy: expectActor(record, 'createdBy'),
    updatedByUserId: expectNullableString(record, 'updatedByUserId'),
    updatedBy: expectActor(record, 'updatedBy'),
    createdAt: expectString(record, 'createdAt'),
    updatedAt: expectString(record, 'updatedAt'),
    version: expectString(record, 'version'),
    lines: lines.map(parseCertificateLine),
  }
}

export function parseDeliveryEnvelope(value: unknown): DeliveryCertificate {
  const record = asRecord(value)
  return parseDeliveryCertificate(record.delivery)
}
