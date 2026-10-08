import { ApiError } from '@/shared/infrastructure/http/api-error'

export const DeliveryOrderErrorCode = {
  notFound: 'DELIVERY_ORDER_NOT_FOUND',
  deliveryNotFound: 'DELIVERY_NOT_FOUND',
  versionConflict: 'DELIVERY_ORDER_VERSION_CONFLICT',
  cancelled: 'DELIVERY_ORDER_CANCELLED',
  alreadyCancelled: 'DELIVERY_ORDER_ALREADY_CANCELLED',
  hasDeliveries: 'DELIVERY_ORDER_HAS_DELIVERIES',
  completed: 'DELIVERY_ORDER_COMPLETED',
  prefixLocked: 'CERTIFICATE_PREFIX_LOCKED',
  prefixTaken: 'CERTIFICATE_PREFIX_TAKEN',
  prefixInvalid: 'CERTIFICATE_PREFIX_INVALID',
  quantityExceeds: 'DELIVERY_QUANTITY_EXCEEDS_PENDING',
  certificateFolioExists: 'CERTIFICATE_FOLIO_EXISTS',
  concurrentUpdate: 'CONCURRENT_UPDATE',
  validation: 'VALIDATION_ERROR',
  forbidden: 'FORBIDDEN',
  network: 'network',
} as const

export interface MappedDeliveryOrderError {
  fieldMessages: Record<string, string>
  fieldDetailCodes: Record<string, string>
  fieldCodes: Record<string, string>
  versionConflict: boolean
  retryable: boolean
  bannerCode: string | null
  bannerMessage: string | null
  aborted: boolean
}

function emptyMapped(overrides: Partial<MappedDeliveryOrderError> = {}): MappedDeliveryOrderError {
  return {
    fieldMessages: {},
    fieldDetailCodes: {},
    fieldCodes: {},
    versionConflict: false,
    retryable: false,
    bannerCode: 'unknown',
    bannerMessage: null,
    aborted: false,
    ...overrides,
  }
}

const PREFIX_CODES = new Set<string>([
  DeliveryOrderErrorCode.prefixLocked,
  DeliveryOrderErrorCode.prefixTaken,
  DeliveryOrderErrorCode.prefixInvalid,
])

export function mapDeliveryOrderError(error: unknown): MappedDeliveryOrderError {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return emptyMapped({ bannerCode: null, aborted: true })
  }

  if (!(error instanceof ApiError)) {
    return emptyMapped()
  }

  if (error.code === DeliveryOrderErrorCode.network || error.status === 0) {
    return emptyMapped({ bannerCode: 'network' })
  }

  const fieldMessages: Record<string, string> = {}
  const fieldDetailCodes: Record<string, string> = {}
  let rootMessage: string | null = null

  for (const detail of error.details) {
    if (!detail.path || detail.path === '(root)') {
      rootMessage = detail.message
      continue
    }

    if (detail.path === 'version' || detail.path === 'status') {
      continue
    }

    fieldMessages[detail.path] = detail.message

    if (detail.code) {
      fieldDetailCodes[detail.path] = detail.code
    }
  }

  const fieldCodes: Record<string, string> = {}
  let versionConflict = false
  let retryable = false
  let bannerCode: string | null = null

  switch (error.code) {
    case DeliveryOrderErrorCode.versionConflict:
      versionConflict = true
      retryable = true
      bannerCode = 'version_conflict'
      break
    case DeliveryOrderErrorCode.concurrentUpdate:
      retryable = true
      bannerCode = 'concurrent_update'
      break
    case DeliveryOrderErrorCode.notFound:
      bannerCode = 'not_found'
      break
    case DeliveryOrderErrorCode.deliveryNotFound:
      bannerCode = 'delivery_not_found'
      break
    case DeliveryOrderErrorCode.cancelled:
      bannerCode = 'cancelled'
      break
    case DeliveryOrderErrorCode.alreadyCancelled:
      bannerCode = 'already_cancelled'
      break
    case DeliveryOrderErrorCode.hasDeliveries:
      bannerCode = 'has_deliveries'
      break
    case DeliveryOrderErrorCode.completed:
      bannerCode = 'completed'
      break
    case DeliveryOrderErrorCode.certificateFolioExists:
      bannerCode = 'certificate_folio_exists'
      break
    case DeliveryOrderErrorCode.prefixLocked:
    case DeliveryOrderErrorCode.prefixTaken:
    case DeliveryOrderErrorCode.prefixInvalid:
      fieldCodes.certificatePrefix = error.code
      bannerCode = null
      break
    case DeliveryOrderErrorCode.quantityExceeds:
      bannerCode = Object.keys(fieldMessages).length === 0 ? 'quantity_exceeds' : null
      break
    case DeliveryOrderErrorCode.forbidden:
      bannerCode = 'forbidden'
      break
    case DeliveryOrderErrorCode.validation:
      bannerCode = Object.keys(fieldMessages).length === 0 ? 'validation' : null
      break
    default:
      if (error.status === 404) {
        bannerCode = 'not_found'
      } else if (Object.keys(fieldMessages).length === 0) {
        bannerCode = 'unknown'
      }
      break
  }

  for (const [path, code] of Object.entries(fieldDetailCodes)) {
    if (PREFIX_CODES.has(code) && path === 'certificatePrefix') {
      fieldCodes.certificatePrefix = code
    }
  }

  const bannerMessage =
    bannerCode === 'validation' || bannerCode === 'unknown' || bannerCode === 'quantity_exceeds'
      ? rootMessage || error.message || null
      : rootMessage

  return {
    fieldMessages,
    fieldDetailCodes,
    fieldCodes,
    versionConflict,
    retryable,
    bannerCode,
    bannerMessage,
    aborted: false,
  }
}

export function shouldRefreshPendingQuantities(mapped: MappedDeliveryOrderError): boolean {
  if (mapped.bannerCode === 'quantity_exceeds') {
    return true
  }

  return Object.values(mapped.fieldDetailCodes).includes(DeliveryOrderErrorCode.quantityExceeds)
}
