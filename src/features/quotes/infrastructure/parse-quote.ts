import type { Currency } from '@/features/clients/domain/client'
import {
  isQuoteStatus,
  isQuoteType,
  type Quote,
  type QuoteActor,
  type QuoteClientSummary,
  type QuoteDetail,
  type QuoteItem,
  type QuoteList,
} from '@/features/quotes/domain/quote'

export class InvalidQuoteResponseError extends Error {
  readonly code = 'invalid_response' as const

  constructor() {
    super('The server returned an invalid quote response.')
    this.name = 'InvalidQuoteResponseError'
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new InvalidQuoteResponseError()
  }

  return value as Record<string, unknown>
}

function expectString(record: Record<string, unknown>, key: string): string {
  const value = record[key]

  if (typeof value !== 'string') {
    throw new InvalidQuoteResponseError()
  }

  return value
}

function expectNullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key]

  if (value === null) {
    return null
  }

  if (typeof value !== 'string') {
    throw new InvalidQuoteResponseError()
  }

  return value
}

function expectBoolean(record: Record<string, unknown>, key: string): boolean {
  const value = record[key]

  if (typeof value !== 'boolean') {
    throw new InvalidQuoteResponseError()
  }

  return value
}

function expectCurrency(value: unknown): Currency {
  if (value !== 'MXN' && value !== 'USD') {
    throw new InvalidQuoteResponseError()
  }

  return value
}

function expectInteger(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new InvalidQuoteResponseError()
  }

  return value
}

function parseActor(value: unknown): QuoteActor | null {
  if (value === null) {
    return null
  }

  const record = asRecord(value)
  const name = record.name

  if (!('name' in record) || (name !== null && typeof name !== 'string')) {
    throw new InvalidQuoteResponseError()
  }

  return {
    id: expectString(record, 'id'),
    name,
  }
}

function expectActor(record: Record<string, unknown>, key: string): QuoteActor | null {
  if (!(key in record)) {
    throw new InvalidQuoteResponseError()
  }

  return parseActor(record[key])
}

function parseClientSummary(value: unknown): QuoteClientSummary {
  const record = asRecord(value)

  return {
    id: expectString(record, 'id'),
    legalName: expectString(record, 'legalName'),
    tradeName: expectNullableString(record, 'tradeName'),
    rfc: expectString(record, 'rfc'),
    quotePrefix: expectString(record, 'quotePrefix'),
  }
}

function parseItem(value: unknown): QuoteItem {
  const record = asRecord(value)
  const position = expectInteger(record.position)

  if (position < 1) {
    throw new InvalidQuoteResponseError()
  }

  return {
    id: expectString(record, 'id'),
    position,
    description: expectString(record, 'description'),
    quantity: expectString(record, 'quantity'),
    unitPrice: expectString(record, 'unitPrice'),
    lineTotal: expectString(record, 'lineTotal'),
  }
}

export function parseQuote(value: unknown): Quote {
  const record = asRecord(value)
  const type = record.type
  const status = record.status

  if (typeof type !== 'string' || !isQuoteType(type)) {
    throw new InvalidQuoteResponseError()
  }

  if (typeof status !== 'string' || !isQuoteStatus(status)) {
    throw new InvalidQuoteResponseError()
  }

  return {
    id: expectString(record, 'id'),
    clientId: expectString(record, 'clientId'),
    folio: expectString(record, 'folio'),
    type,
    status,
    projectName: expectNullableString(record, 'projectName'),
    requestedByContactId: expectNullableString(record, 'requestedByContactId'),
    requestedByName: expectNullableString(record, 'requestedByName'),
    requestedByEmail: expectNullableString(record, 'requestedByEmail'),
    attentionTo: expectString(record, 'attentionTo'),
    currency: expectCurrency(record.currency),
    exchangeRate: expectNullableString(record, 'exchangeRate'),
    deliveryTime: expectNullableString(record, 'deliveryTime'),
    validUntil: expectNullableString(record, 'validUntil'),
    includeVat: expectBoolean(record, 'includeVat'),
    vatRate: expectString(record, 'vatRate'),
    subtotal: expectString(record, 'subtotal'),
    vatAmount: expectString(record, 'vatAmount'),
    total: expectString(record, 'total'),
    sentAt: expectNullableString(record, 'sentAt'),
    sentByUserId: expectNullableString(record, 'sentByUserId'),
    sentBy: expectActor(record, 'sentBy'),
    acceptedAt: expectNullableString(record, 'acceptedAt'),
    acceptedByUserId: expectNullableString(record, 'acceptedByUserId'),
    acceptedBy: expectActor(record, 'acceptedBy'),
    rejectedAt: expectNullableString(record, 'rejectedAt'),
    rejectedByUserId: expectNullableString(record, 'rejectedByUserId'),
    rejectedBy: expectActor(record, 'rejectedBy'),
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

export function parseQuoteDetail(value: unknown): QuoteDetail {
  const record = asRecord(value)
  const items = record.items

  if (!Array.isArray(items)) {
    throw new InvalidQuoteResponseError()
  }

  return {
    ...parseQuote(value),
    notes: expectNullableString(record, 'notes'),
    items: items.map(parseItem),
  }
}

export function parseQuoteEnvelope(value: unknown): QuoteDetail {
  const record = asRecord(value)
  return parseQuoteDetail(record.quote)
}

export function parseQuoteList(value: unknown): QuoteList {
  const record = asRecord(value)
  const items = record.items
  const page = record.page
  const pageSize = record.pageSize
  const total = record.total

  if (!Array.isArray(items) || !Number.isInteger(page) || !Number.isInteger(pageSize) || !Number.isInteger(total)) {
    throw new InvalidQuoteResponseError()
  }

  return {
    items: items.map(parseQuote),
    page: page as number,
    pageSize: pageSize as number,
    total: total as number,
  }
}
