import { certificatePrefixLocked, isDeliveryPriority, type CreateDeliveryPayload, type DeliveryOrderDetail, type PatchDeliveryOrderPayload } from '@/features/delivery-orders/domain/delivery-order'
import { compareQuantity } from '@/features/delivery-orders/domain/progress'
import { parseQuantity, priceQuote, trimTrailingZeros } from '@/features/quotes/domain/money'

const CERTIFICATE_PREFIX = /^[A-Z0-9]{1,11}[A-Z]$/

export type OrderPatchIssueKey =
  | 'clientPoNumber'
  | 'startDate'
  | 'dueDate'
  | 'dueBeforeStart'
  | 'priority'
  | 'country'
  | 'state'
  | 'city'
  | 'street'
  | 'postalCode'
  | 'notes'
  | 'certificatePrefix'

export interface OrderPatchIssue {
  path: string
  key: OrderPatchIssueKey
}

export interface OrderHeaderFormValues {
  clientPoNumber: string
  startDate: string
  dueDate: string
  priority: string
  country: string
  state: string
  city: string
  street: string
  postalCode: string
  notes: string
  certificatePrefix: string
}

export type DeliveryFormIssueKey =
  | 'deliveryDate'
  | 'receivedBy'
  | 'notes'
  | 'country'
  | 'state'
  | 'city'
  | 'street'
  | 'postalCode'
  | 'quantity'
  | 'exceedsPending'
  | 'atLeastOneLine'
  | 'overflow'

export interface DeliveryFormIssue {
  path: string
  key: DeliveryFormIssueKey
  orderItemId?: string
}

export interface DeliveryFormLine {
  orderItemId: string
  quantity: string
  pending: string
  unitPrice: string
}

export interface DeliveryFormValues {
  deliveryDate: string
  receivedBy: string
  notes: string
  overrideAddress: boolean
  country: string
  state: string
  city: string
  street: string
  postalCode: string
  lines: DeliveryFormLine[]
}

export function orderToHeaderForm(order: DeliveryOrderDetail): OrderHeaderFormValues {
  return {
    clientPoNumber: order.clientPoNumber ?? '',
    startDate: order.startDate,
    dueDate: order.dueDate ?? '',
    priority: order.priority,
    country: order.address.country,
    state: order.address.state ?? '',
    city: order.address.city ?? '',
    street: order.address.street ?? '',
    postalCode: order.address.postalCode ?? '',
    notes: order.notes ?? '',
    certificatePrefix: order.certificatePrefix,
  }
}

export function pendingQuantityInput(quantityPending: string): string {
  return trimTrailingZeros(quantityPending)
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

function clearable(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed
}

export function isCertificatePrefix(value: string): boolean {
  const normalized = value.trim().toUpperCase()
  return normalized.length >= 2 && normalized.length <= 12 && CERTIFICATE_PREFIX.test(normalized)
}

export function validateOrderPatch(
  input: OrderHeaderFormValues,
  order: DeliveryOrderDetail,
): { ok: true; payload: PatchDeliveryOrderPayload } | { ok: false; issues: OrderPatchIssue[] } {
  const issues: OrderPatchIssue[] = []
  const baseline = orderToHeaderForm(order)
  const prefixLocked = certificatePrefixLocked(order)
  const payload: PatchDeliveryOrderPayload = { version: order.version }

  const clientPo = input.clientPoNumber.trim()

  if (clientPo.length > 80) {
    issues.push({ path: 'clientPoNumber', key: 'clientPoNumber' })
  } else if (clientPo !== baseline.clientPoNumber.trim()) {
    payload.clientPoNumber = clientPo.length === 0 ? null : clientPo
  }

  const startDate = input.startDate.trim()

  if (!isIsoDate(startDate)) {
    issues.push({ path: 'startDate', key: 'startDate' })
  } else if (startDate !== baseline.startDate) {
    payload.startDate = startDate
  }

  const dueDate = input.dueDate.trim()
  let dueValue: string | null = null

  if (dueDate) {
    if (!isIsoDate(dueDate)) {
      issues.push({ path: 'dueDate', key: 'dueDate' })
    } else {
      dueValue = dueDate
    }
  }

  if (!issues.some((issue) => issue.path === 'dueDate' || issue.path === 'startDate')) {
    const start = payload.startDate ?? (isIsoDate(startDate) ? startDate : baseline.startDate)

    if (dueValue && start && dueValue < start) {
      issues.push({ path: 'dueDate', key: 'dueBeforeStart' })
    } else if ((dueValue ?? '') !== baseline.dueDate.trim()) {
      payload.dueDate = dueValue
    }
  }

  if (!isDeliveryPriority(input.priority)) {
    issues.push({ path: 'priority', key: 'priority' })
  } else if (input.priority !== baseline.priority) {
    payload.priority = input.priority
  }

  const country = input.country.trim().toUpperCase()
  const state = clearable(input.state)
  const city = clearable(input.city)
  const street = clearable(input.street)
  const postalCode = clearable(input.postalCode)

  if (!/^[A-Z]{2}$/.test(country)) {
    issues.push({ path: 'address.country', key: 'country' })
  }

  if ((state?.length ?? 0) > 120) {
    issues.push({ path: 'address.state', key: 'state' })
  }

  if ((city?.length ?? 0) > 120) {
    issues.push({ path: 'address.city', key: 'city' })
  }

  if ((street?.length ?? 0) > 500) {
    issues.push({ path: 'address.street', key: 'street' })
  }

  if ((postalCode?.length ?? 0) > 10) {
    issues.push({ path: 'address.postalCode', key: 'postalCode' })
  }

  const addressChanged =
    country !== baseline.country.trim().toUpperCase() ||
    (state ?? '') !== (clearable(baseline.state) ?? '') ||
    (city ?? '') !== (clearable(baseline.city) ?? '') ||
    (street ?? '') !== (clearable(baseline.street) ?? '') ||
    (postalCode ?? '') !== (clearable(baseline.postalCode) ?? '')

  if (addressChanged && !issues.some((issue) => issue.path.startsWith('address.'))) {
    payload.address = { country, state, city, street, postalCode }
  }

  const notes = clearable(input.notes)

  if ((notes?.length ?? 0) > 2000) {
    issues.push({ path: 'notes', key: 'notes' })
  } else if ((notes ?? '') !== (clearable(baseline.notes) ?? '')) {
    payload.notes = notes
  }

  if (!prefixLocked) {
    const prefix = input.certificatePrefix.trim().toUpperCase()

    if (!isCertificatePrefix(prefix)) {
      issues.push({ path: 'certificatePrefix', key: 'certificatePrefix' })
    } else if (prefix !== baseline.certificatePrefix.trim().toUpperCase()) {
      payload.certificatePrefix = prefix
    }
  }

  if (issues.length > 0) {
    return { ok: false, issues }
  }

  const editable = Object.keys(payload).filter((key) => key !== 'version')

  if (editable.length === 0) {
    return { ok: false, issues: [] }
  }

  return { ok: true, payload }
}

function lineIsSlot(quantity: string): boolean {
  const raw = quantity.trim()

  if (!raw) {
    return false
  }

  const parsed = parseQuantity(raw)
  return parsed.ok || parsed.reason !== 'not_positive'
}

export function validateDeliveryForm(
  input: DeliveryFormValues,
): { ok: true; payload: CreateDeliveryPayload } | { ok: false; issues: DeliveryFormIssue[] } {
  const issues: DeliveryFormIssue[] = []
  const deliveryDate = input.deliveryDate.trim()

  if (!isIsoDate(deliveryDate)) {
    issues.push({ path: 'deliveryDate', key: 'deliveryDate' })
  }

  const receivedBy = clearable(input.receivedBy)

  if ((receivedBy?.length ?? 0) > 200) {
    issues.push({ path: 'receivedBy', key: 'receivedBy' })
  }

  const notes = clearable(input.notes)

  if ((notes?.length ?? 0) > 2000) {
    issues.push({ path: 'notes', key: 'notes' })
  }

  let address: CreateDeliveryPayload['address']

  if (input.overrideAddress) {
    const country = input.country.trim().toUpperCase()
    const state = clearable(input.state)
    const city = clearable(input.city)
    const street = clearable(input.street)
    const postalCode = clearable(input.postalCode)

    if (!/^[A-Z]{2}$/.test(country)) {
      issues.push({ path: 'address.country', key: 'country' })
    }

    if ((state?.length ?? 0) > 120) {
      issues.push({ path: 'address.state', key: 'state' })
    }

    if ((city?.length ?? 0) > 120) {
      issues.push({ path: 'address.city', key: 'city' })
    }

    if ((street?.length ?? 0) > 500) {
      issues.push({ path: 'address.street', key: 'street' })
    }

    if ((postalCode?.length ?? 0) > 10) {
      issues.push({ path: 'address.postalCode', key: 'postalCode' })
    }

    address = { country, state, city, street, postalCode }
  }

  const lines: CreateDeliveryPayload['lines'] = []
  let slot = 0

  for (const line of input.lines) {
    if (!lineIsSlot(line.quantity)) {
      continue
    }

    const path = `lines.${slot}.quantity`
    const parsed = parseQuantity(line.quantity)
    slot += 1

    if (!parsed.ok) {
      issues.push({ path, key: 'quantity', orderItemId: line.orderItemId })
      continue
    }

    if (compareQuantity(parsed.value, line.pending) > 0) {
      issues.push({ path, key: 'exceedsPending', orderItemId: line.orderItemId })
      continue
    }

    lines.push({ orderItemId: line.orderItemId, quantity: parsed.value })
  }

  if (lines.length === 0 && !issues.some((issue) => issue.key === 'quantity' || issue.key === 'exceedsPending')) {
    issues.push({ path: 'lines', key: 'atLeastOneLine' })
  }

  if (lines.length > 0 && !issues.some((issue) => issue.path.startsWith('lines.'))) {
    const priced = priceQuote(
      lines.map((line) => {
        const source = input.lines.find((item) => item.orderItemId === line.orderItemId)
        return {
          description: 'line',
          quantity: line.quantity,
          unitPrice: source?.unitPrice ?? '0.0000',
        }
      }),
      false,
      '0.0000',
    )

    if (!priced.ok) {
      issues.push({ path: 'lines', key: 'overflow' })
    }
  }

  if (issues.length > 0 || !isIsoDate(deliveryDate)) {
    return { ok: false, issues }
  }

  return {
    ok: true,
    payload: {
      deliveryDate,
      receivedBy,
      notes,
      ...(address ? { address } : {}),
      lines,
    },
  }
}

export interface DeliveryTotalsPreview {
  subtotal: string | null
  vatAmount: string | null
  total: string | null
}

export function previewDeliveryTotals(
  lines: readonly DeliveryFormLine[],
  includeVat: boolean,
  vatRate: string,
): DeliveryTotalsPreview {
  const pricedLines: { description: string; quantity: string; unitPrice: string }[] = []

  for (const line of lines) {
    if (!lineIsSlot(line.quantity)) {
      continue
    }

    const parsed = parseQuantity(line.quantity)

    if (!parsed.ok) {
      return { subtotal: null, vatAmount: null, total: null }
    }

    pricedLines.push({
      description: 'line',
      quantity: parsed.value,
      unitPrice: line.unitPrice,
    })
  }

  if (pricedLines.length === 0) {
    return { subtotal: '0.00', vatAmount: '0.00', total: '0.00' }
  }

  const priced = priceQuote(pricedLines, includeVat, vatRate)

  if (!priced.ok) {
    return { subtotal: null, vatAmount: null, total: null }
  }

  return {
    subtotal: priced.priced.subtotal,
    vatAmount: priced.priced.vatAmount,
    total: priced.priced.total,
  }
}

/** Server `lines.{i}.quantity` follows the payload order, which is the lines we sent. */
export function mapLineQuantityErrors(
  fieldMessages: Record<string, string>,
  submittedOrderItemIds: readonly string[],
): Record<string, string> {
  const byItem: Record<string, string> = {}

  for (const [path, message] of Object.entries(fieldMessages)) {
    const match = /^lines\.(\d+)\.quantity$/.exec(path)

    if (!match) {
      continue
    }

    const orderItemId = submittedOrderItemIds[Number(match[1])]

    if (orderItemId) {
      byItem[orderItemId] = message
    }
  }

  return byItem
}
