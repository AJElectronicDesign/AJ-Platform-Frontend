import type { Currency } from '@/features/clients/domain/client'
import { trimTrailingZeros, vatRateToPercent } from '@/features/quotes/domain/money'

export const QUOTE_TYPES = ['assemblies', 'projects', 'services_material'] as const
export type QuoteType = (typeof QUOTE_TYPES)[number]

export const QUOTE_STATUSES = ['draft', 'sent', 'accepted', 'rejected', 'expired'] as const
export type QuoteStatus = (typeof QUOTE_STATUSES)[number]

export const QUOTE_PAGE_SIZE = 20
export const QUOTE_MAX_ITEMS = 100
export const DEFAULT_ATTENTION_TO = 'Departamento de Compras'
export const DEFAULT_VAT_PERCENT = '16'

export interface QuoteClientSummary {
  id: string
  legalName: string
  tradeName: string | null
  rfc: string
  quotePrefix: string
}

/** Live user row. The quote property is null when that user id is null. `name` is null when the user row is gone. */
export interface QuoteActor {
  id: string
  name: string | null
}

export interface QuoteItem {
  id: string
  position: number
  description: string
  quantity: string
  unitPrice: string
  lineTotal: string
}

export interface Quote {
  id: string
  clientId: string
  folio: string
  type: QuoteType
  status: QuoteStatus
  projectName: string | null
  requestedByContactId: string | null
  requestedByName: string | null
  requestedByEmail: string | null
  attentionTo: string
  currency: Currency
  exchangeRate: string | null
  deliveryTime: string | null
  validUntil: string | null
  includeVat: boolean
  vatRate: string
  subtotal: string
  vatAmount: string
  total: string
  sentAt: string | null
  sentByUserId: string | null
  sentBy: QuoteActor | null
  acceptedAt: string | null
  acceptedByUserId: string | null
  acceptedBy: QuoteActor | null
  rejectedAt: string | null
  rejectedByUserId: string | null
  rejectedBy: QuoteActor | null
  createdByUserId: string | null
  createdBy: QuoteActor | null
  updatedByUserId: string | null
  updatedBy: QuoteActor | null
  createdAt: string
  updatedAt: string
  version: string
  client: QuoteClientSummary
}

export interface QuoteDetail extends Quote {
  notes: string | null
  items: QuoteItem[]
}

export interface QuoteList {
  items: Quote[]
  page: number
  pageSize: number
  total: number
}

export interface ListQuotesQuery {
  q?: string
  status?: QuoteStatus
  clientId?: string
  type?: QuoteType
  page: number
  pageSize: number
}

export interface QuoteItemInput {
  description: string
  quantity: string
  unitPrice: string
}

export interface CreateQuotePayload {
  clientId: string
  type: QuoteType
  projectName?: string | null
  requestedByContactId?: string | null
  requestedByName?: string | null
  requestedByEmail?: string | null
  attentionTo: string
  currency: Currency
  exchangeRate?: string | null
  deliveryTime?: string | null
  validUntil?: string | null
  notes?: string | null
  includeVat: boolean
  vatRate: string
  items: QuoteItemInput[]
}

export interface PatchQuotePayload {
  type: QuoteType
  projectName: string | null
  requestedByContactId: string | null
  requestedByName?: string | null
  requestedByEmail?: string | null
  attentionTo: string
  currency: Currency
  exchangeRate: string | null
  deliveryTime: string | null
  validUntil: string | null
  notes: string | null
  includeVat: boolean
  vatRate: string
  items: QuoteItemInput[]
  version: string
}

export interface QuoteTransitionPayload {
  version?: string
}

export interface QuoteLineForm {
  key: string
  description: string
  quantity: string
  unitPrice: string
}

export interface QuoteFormValues {
  clientId: string
  type: QuoteType | ''
  projectName: string
  requestedByContactId: string
  requestedByName: string
  requestedByEmail: string
  attentionTo: string
  currency: Currency | ''
  exchangeRate: string
  deliveryTime: string
  validUntil: string
  notes: string
  includeVat: boolean
  vatPercent: string
  items: QuoteLineForm[]
}

export function emptyQuoteForm(clientId = ''): QuoteFormValues {
  return {
    clientId,
    type: '',
    projectName: '',
    requestedByContactId: '',
    requestedByName: '',
    requestedByEmail: '',
    attentionTo: DEFAULT_ATTENTION_TO,
    currency: '',
    exchangeRate: '',
    deliveryTime: '',
    validUntil: '',
    notes: '',
    includeVat: true,
    vatPercent: DEFAULT_VAT_PERCENT,
    items: [],
  }
}

export function quoteToForm(quote: QuoteDetail): QuoteFormValues {
  return {
    clientId: quote.clientId,
    type: quote.type,
    projectName: quote.projectName ?? '',
    requestedByContactId: quote.requestedByContactId ?? '',
    requestedByName: quote.requestedByName ?? '',
    requestedByEmail: quote.requestedByEmail ?? '',
    attentionTo: quote.attentionTo,
    currency: quote.currency,
    exchangeRate: quote.exchangeRate ? trimTrailingZeros(quote.exchangeRate) : '',
    deliveryTime: quote.deliveryTime ?? '',
    validUntil: quote.validUntil ?? '',
    notes: quote.notes ?? '',
    includeVat: quote.includeVat,
    vatPercent: vatRateToPercent(quote.vatRate),
    items: quote.items
      .slice()
      .sort((left, right) => left.position - right.position)
      .map((item) => ({
        key: item.id,
        description: item.description,
        quantity: trimTrailingZeros(item.quantity),
        unitPrice: trimTrailingZeros(item.unitPrice),
      })),
  }
}

export function isQuoteType(value: string): value is QuoteType {
  return (QUOTE_TYPES as readonly string[]).includes(value)
}

export function isQuoteStatus(value: string): value is QuoteStatus {
  return (QUOTE_STATUSES as readonly string[]).includes(value)
}
