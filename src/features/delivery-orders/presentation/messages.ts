import type { MappedDeliveryOrderError } from '@/features/delivery-orders/domain/map-delivery-order-error'
import type { DeliveryFormIssue, OrderPatchIssue } from '@/features/delivery-orders/domain/validation'
import type { DeliveryOrdersCatalog } from '@/shared/i18n/types'

type ValidationKey = keyof DeliveryOrdersCatalog['validation']

export function issuesToFieldErrors(
  copy: DeliveryOrdersCatalog['validation'],
  issues: readonly { path: string; key: ValidationKey }[],
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const issue of issues) {
    if (!errors[issue.path]) {
      errors[issue.path] = copy[issue.key]
    }
  }

  return errors
}

export function orderPatchFieldErrors(
  copy: DeliveryOrdersCatalog['validation'],
  issues: readonly OrderPatchIssue[],
): Record<string, string> {
  return issuesToFieldErrors(copy, issues)
}

export function deliveryFormFieldErrors(
  copy: DeliveryOrdersCatalog['validation'],
  issues: readonly DeliveryFormIssue[],
): Record<string, string> {
  return issuesToFieldErrors(copy, issues)
}

function codeMessage(copy: DeliveryOrdersCatalog, code: string): string | null {
  switch (code) {
    case 'CERTIFICATE_PREFIX_LOCKED':
      return copy.errors.prefixLocked
    case 'CERTIFICATE_PREFIX_TAKEN':
      return copy.errors.prefixTaken
    case 'CERTIFICATE_PREFIX_INVALID':
      return copy.errors.prefixInvalid
    case 'DELIVERY_QUANTITY_EXCEEDS_PENDING':
      return copy.errors.quantityExceeds
    default:
      return null
  }
}

function detailCodeMessage(copy: DeliveryOrdersCatalog, code: string): string | null {
  if (code === 'DELIVERY_QUANTITY_EXCEEDS_PENDING') {
    return null
  }

  if (Object.prototype.hasOwnProperty.call(copy.detailCodes, code)) {
    return copy.detailCodes[code as keyof DeliveryOrdersCatalog['detailCodes']]
  }

  return null
}

export function mappedToFieldErrors(
  copy: DeliveryOrdersCatalog,
  mapped: MappedDeliveryOrderError,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const [path, code] of Object.entries(mapped.fieldDetailCodes)) {
    const translated = detailCodeMessage(copy, code)

    if (translated) {
      errors[path] = translated
    }
  }

  for (const [path, code] of Object.entries(mapped.fieldCodes)) {
    const message = codeMessage(copy, code)

    if (message) {
      errors[path] = message
    }
  }

  for (const [path, message] of Object.entries(mapped.fieldMessages)) {
    if (mapped.fieldDetailCodes[path] === 'DELIVERY_QUANTITY_EXCEEDS_PENDING') {
      errors[path] = message
      continue
    }

    if (!errors[path]) {
      errors[path] = message
    }
  }

  return errors
}

const DISPLAYED_DELIVERY_PATHS = new Set([
  'deliveryDate',
  'receivedBy',
  'notes',
  'lines',
  'address.country',
  'address.state',
  'address.city',
  'address.street',
  'address.postalCode',
])

function isDisplayedDeliveryPath(path: string, submittedOrderItemIds: readonly string[]): boolean {
  if (DISPLAYED_DELIVERY_PATHS.has(path)) {
    return true
  }

  const match = /^lines\.(\d+)\.quantity$/.exec(path)

  if (!match) {
    return false
  }

  return submittedOrderItemIds[Number(match[1])] !== undefined
}

export function undisplayedDeliveryFieldBanner(
  fields: Record<string, string>,
  submittedOrderItemIds: readonly string[],
): string | null {
  const messages: string[] = []

  for (const [path, message] of Object.entries(fields)) {
    if (!message || isDisplayedDeliveryPath(path, submittedOrderItemIds) || messages.includes(message)) {
      continue
    }

    messages.push(message)
  }

  return messages.length > 0 ? messages.join(' ') : null
}

export function deliverySubmitBanner(
  copy: DeliveryOrdersCatalog,
  mapped: MappedDeliveryOrderError,
  fields: Record<string, string>,
  submittedOrderItemIds: readonly string[],
): string | null {
  const catalog = deliveryOrderBannerMessage(copy, mapped)
  const orphan = undisplayedDeliveryFieldBanner(fields, submittedOrderItemIds)

  if (catalog && orphan && catalog !== orphan) {
    return `${catalog} ${orphan}`
  }

  return catalog ?? orphan
}

export function deliveryOrderBannerMessage(
  copy: DeliveryOrdersCatalog,
  mapped: MappedDeliveryOrderError,
): string | null {
  switch (mapped.bannerCode) {
    case 'version_conflict':
      return copy.errors.versionConflict
    case 'concurrent_update':
      return copy.errors.concurrentUpdate
    case 'network':
      return copy.errors.network
    case 'forbidden':
      return copy.errors.forbidden
    case 'not_found':
      return copy.errors.notFound
    case 'delivery_not_found':
      return copy.errors.deliveryNotFound
    case 'cancelled':
      return copy.errors.cancelled
    case 'already_cancelled':
      return copy.errors.alreadyCancelled
    case 'has_deliveries':
      return copy.errors.hasDeliveries
    case 'completed':
      return copy.errors.completed
    case 'certificate_folio_exists':
      return copy.errors.certificateFolioExists
    case 'quantity_exceeds':
      return mapped.bannerMessage || copy.errors.quantityExceeds
    case 'validation':
      return mapped.bannerMessage || copy.errors.validation
    case 'unknown':
      return copy.errors.unknown
    case null:
      return mapped.bannerMessage
    default:
      return mapped.bannerMessage || copy.errors.unknown
  }
}
