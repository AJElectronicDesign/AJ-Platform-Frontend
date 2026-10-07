import type { Currency } from '@/features/clients/domain/client'
import {
  parseExchangeRate,
  parseQuantity,
  parseUnitPrice,
  percentToVatRate,
  priceQuote,
  type LineInput,
} from '@/features/quotes/domain/money'
import {
  QUOTE_MAX_ITEMS,
  isQuoteType,
  type CreateQuotePayload,
  type PatchQuotePayload,
  type QuoteFormValues,
  type QuoteItemInput,
  type QuoteType,
} from '@/features/quotes/domain/quote'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type QuoteValidationMessageKey =
  | 'client'
  | 'type'
  | 'projectName'
  | 'attentionTo'
  | 'requestedByName'
  | 'requestedByEmail'
  | 'currency'
  | 'exchangeRate'
  | 'deliveryTime'
  | 'validUntil'
  | 'notes'
  | 'vatRate'
  | 'itemDescription'
  | 'itemQuantity'
  | 'itemUnitPrice'
  | 'tooManyItems'
  | 'overflow'

export interface QuoteValidationIssue {
  path: string
  key: QuoteValidationMessageKey
}

type ParsedText = { ok: true; value: string | null } | { ok: false }

function isCurrency(value: string): value is Currency {
  return value === 'MXN' || value === 'USD'
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const year = Number(value.slice(0, 4))
  const month = Number(value.slice(5, 7))
  const day = Number(value.slice(8, 10))
  const utc = new Date(Date.UTC(year, month - 1, day))

  return utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === day
}

function readText(
  value: string,
  max: number,
  path: string,
  key: QuoteValidationMessageKey,
  issues: QuoteValidationIssue[],
  required: boolean,
): ParsedText {
  const trimmed = value.trim()

  if (!trimmed) {
    if (required) {
      issues.push({ path, key })
    }

    return required ? { ok: false } : { ok: true, value: null }
  }

  if (trimmed.length > max) {
    issues.push({ path, key })
    return { ok: false }
  }

  return { ok: true, value: trimmed }
}

interface HeaderFields {
  type: QuoteType
  projectName: string | null
  attentionTo: string
  currency: Currency
  exchangeRate: string | null
  deliveryTime: string | null
  validUntil: string | null
  notes: string | null
  includeVat: boolean
  vatRate: string
  items: QuoteItemInput[]
  contactId: string | null
  contactName: string | null
  contactEmail: string | null
}

function readHeader(input: QuoteFormValues, issues: QuoteValidationIssue[]): HeaderFields | null {
  if (!isQuoteType(input.type)) {
    issues.push({ path: 'type', key: 'type' })
  }

  const projectName = readText(input.projectName, 200, 'projectName', 'projectName', issues, false)
  const attentionTo = readText(input.attentionTo, 200, 'attentionTo', 'attentionTo', issues, true)
  const deliveryTime = readText(input.deliveryTime, 200, 'deliveryTime', 'deliveryTime', issues, false)
  const notes = readText(input.notes, 2000, 'notes', 'notes', issues, false)

  if (!isCurrency(input.currency)) {
    issues.push({ path: 'currency', key: 'currency' })
  }

  let exchangeRate: string | null = null

  if (input.exchangeRate.trim()) {
    const parsed = parseExchangeRate(input.exchangeRate)

    if (!parsed.ok) {
      issues.push({ path: 'exchangeRate', key: 'exchangeRate' })
    } else {
      exchangeRate = parsed.value
    }
  }

  const validUntilText = input.validUntil.trim()
  let validUntil: string | null = null

  if (validUntilText) {
    if (!isIsoDate(validUntilText)) {
      issues.push({ path: 'validUntil', key: 'validUntil' })
    } else {
      validUntil = validUntilText
    }
  }

  const rate = percentToVatRate(input.vatPercent)

  if (!rate.ok) {
    issues.push({ path: 'vatRate', key: 'vatRate' })
  }

  const contactId = input.requestedByContactId.trim()
  let contactName: string | null = null
  let contactEmail: string | null = null

  if (!contactId) {
    const name = readText(input.requestedByName, 200, 'requestedByName', 'requestedByName', issues, false)
    const emailText = input.requestedByEmail.trim()

    if (name.ok) {
      contactName = name.value
    }

    if (emailText) {
      if (emailText.length > 320 || !EMAIL.test(emailText)) {
        issues.push({ path: 'requestedByEmail', key: 'requestedByEmail' })
      } else {
        contactEmail = emailText
      }
    }
  }

  const items: QuoteItemInput[] = []
  let itemFailed = false

  for (let index = 0; index < input.items.length; index += 1) {
    const line = input.items[index]

    if (!line) {
      continue
    }

    const description = line.description.trim()
    const quantityText = line.quantity.trim()
    const unitPriceText = line.unitPrice.trim()

    if (!description && !quantityText && !unitPriceText) {
      continue
    }

    if (!description || description.length > 500) {
      issues.push({ path: `items.${index}.description`, key: 'itemDescription' })
      itemFailed = true
    }

    const quantity = quantityText ? parseQuantity(line.quantity) : null
    const unitPrice = unitPriceText ? parseUnitPrice(line.unitPrice) : null

    if (!quantity?.ok) {
      issues.push({ path: `items.${index}.quantity`, key: 'itemQuantity' })
      itemFailed = true
    }

    if (!unitPrice?.ok) {
      issues.push({ path: `items.${index}.unitPrice`, key: 'itemUnitPrice' })
      itemFailed = true
    }

    if (description && description.length <= 500 && quantity?.ok && unitPrice?.ok) {
      items.push({
        description,
        quantity: quantity.value,
        unitPrice: unitPrice.value,
      })
    }
  }

  if (items.length > QUOTE_MAX_ITEMS) {
    issues.push({ path: 'items', key: 'tooManyItems' })
    itemFailed = true
  }

  if (
    issues.length > 0 ||
    itemFailed ||
    !isQuoteType(input.type) ||
    !attentionTo.ok ||
    !attentionTo.value ||
    !projectName.ok ||
    !deliveryTime.ok ||
    !notes.ok ||
    !isCurrency(input.currency) ||
    !rate.ok
  ) {
    return null
  }

  if (!itemFailed && items.length > 0 && items.length <= QUOTE_MAX_ITEMS) {
    const priced = priceQuote(
      items.map((item): LineInput => ({ ...item })),
      input.includeVat,
      rate.value,
    )

    if (!priced.ok) {
      issues.push({
        path: priced.failure.path === 'total' ? 'items' : priced.failure.path,
        key: 'overflow',
      })
      return null
    }
  }

  return {
    type: input.type,
    projectName: projectName.value,
    attentionTo: attentionTo.value,
    currency: input.currency,
    exchangeRate,
    deliveryTime: deliveryTime.value,
    validUntil,
    notes: notes.value,
    includeVat: input.includeVat,
    vatRate: rate.value,
    items,
    contactId: contactId || null,
    contactName,
    contactEmail,
  }
}

function requestedBy(header: HeaderFields): {
  requestedByContactId: string | null
  requestedByName?: string | null
  requestedByEmail?: string | null
} {
  if (header.contactId) {
    return { requestedByContactId: header.contactId }
  }

  return {
    requestedByContactId: null,
    requestedByName: header.contactName,
    requestedByEmail: header.contactEmail,
  }
}

export function parseCreateQuote(
  input: QuoteFormValues,
): { ok: true; payload: CreateQuotePayload } | { ok: false; issues: QuoteValidationIssue[] } {
  const issues: QuoteValidationIssue[] = []

  if (!input.clientId.trim()) {
    issues.push({ path: 'clientId', key: 'client' })
  }

  const header = readHeader(input, issues)

  if (!header || issues.length > 0 || !input.clientId.trim()) {
    return { ok: false, issues }
  }

  return {
    ok: true,
    payload: {
      clientId: input.clientId.trim(),
      type: header.type,
      projectName: header.projectName,
      ...requestedBy(header),
      attentionTo: header.attentionTo,
      currency: header.currency,
      exchangeRate: header.exchangeRate,
      deliveryTime: header.deliveryTime,
      validUntil: header.validUntil,
      notes: header.notes,
      includeVat: header.includeVat,
      vatRate: header.vatRate,
      items: header.items,
    },
  }
}

export function parsePatchQuote(
  input: QuoteFormValues,
  version: string,
): { ok: true; payload: PatchQuotePayload } | { ok: false; issues: QuoteValidationIssue[] } {
  const issues: QuoteValidationIssue[] = []
  const header = readHeader(input, issues)

  if (!header || issues.length > 0) {
    return { ok: false, issues }
  }

  return {
    ok: true,
    payload: {
      type: header.type,
      projectName: header.projectName,
      ...requestedBy(header),
      attentionTo: header.attentionTo,
      currency: header.currency,
      exchangeRate: header.exchangeRate,
      deliveryTime: header.deliveryTime,
      validUntil: header.validUntil,
      notes: header.notes,
      includeVat: header.includeVat,
      vatRate: header.vatRate,
      items: header.items,
      version,
    },
  }
}
