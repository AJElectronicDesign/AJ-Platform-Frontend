import { ApiError } from '@/shared/infrastructure/http/api-error'

export const QuoteErrorCode = {
  folioExists: 'QUOTE_FOLIO_EXISTS',
  versionConflict: 'QUOTE_VERSION_CONFLICT',
  notFound: 'QUOTE_NOT_FOUND',
  clientNotFound: 'CLIENT_NOT_FOUND',
  clientInactive: 'CLIENT_INACTIVE',
  notEditable: 'QUOTE_NOT_EDITABLE',
  notDeletable: 'QUOTE_NOT_DELETABLE',
  empty: 'QUOTE_EMPTY',
  expired: 'QUOTE_EXPIRED',
  invalidTransition: 'QUOTE_INVALID_TRANSITION',
  validation: 'VALIDATION_ERROR',
  forbidden: 'FORBIDDEN',
  network: 'network',
} as const

export interface MappedQuoteError {
  /** Backend `error.details` messages, keyed by path. Version and status are excluded. */
  fieldMessages: Record<string, string>
  /** `details[].code` from quote validation, keyed by path. */
  fieldDetailCodes: Record<string, string>
  /**
   * Conflict codes translated in the UI. Set even when `details` also name the
   * field, so the English server message is not shown.
   */
  fieldCodes: Record<string, string>
  versionConflict: boolean
  bannerCode: string | null
  bannerMessage: string | null
  aborted: boolean
}

function emptyMapped(overrides: Partial<MappedQuoteError> = {}): MappedQuoteError {
  return {
    fieldMessages: {},
    fieldDetailCodes: {},
    fieldCodes: {},
    versionConflict: false,
    bannerCode: 'unknown',
    bannerMessage: null,
    aborted: false,
    ...overrides,
  }
}

export function mapQuoteError(error: unknown): MappedQuoteError {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return emptyMapped({ bannerCode: null, aborted: true })
  }

  if (!(error instanceof ApiError)) {
    return emptyMapped()
  }

  if (error.code === QuoteErrorCode.network || error.status === 0) {
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
  let bannerCode: string | null = null

  switch (error.code) {
    case QuoteErrorCode.folioExists:
      fieldCodes.folio = error.code
      bannerCode = 'folio_exists'
      break
    case QuoteErrorCode.versionConflict:
      versionConflict = true
      bannerCode = 'version_conflict'
      break
    case QuoteErrorCode.notFound:
      bannerCode = 'not_found'
      break
    case QuoteErrorCode.clientNotFound:
      bannerCode = 'client_not_found'
      break
    case QuoteErrorCode.clientInactive:
      fieldCodes.clientId = error.code
      bannerCode = 'client_inactive'
      break
    case QuoteErrorCode.notEditable:
      bannerCode = 'not_editable'
      break
    case QuoteErrorCode.notDeletable:
      bannerCode = 'not_deletable'
      break
    case QuoteErrorCode.empty:
      fieldCodes.items = error.code
      bannerCode = 'empty'
      break
    case QuoteErrorCode.expired:
      fieldCodes.validUntil = error.code
      bannerCode = 'expired'
      break
    case QuoteErrorCode.invalidTransition:
      bannerCode = 'invalid_transition'
      break
    case QuoteErrorCode.forbidden:
      bannerCode = 'forbidden'
      break
    case QuoteErrorCode.validation:
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

  const bannerMessage =
    bannerCode === 'validation' || bannerCode === 'unknown'
      ? rootMessage || error.message || null
      : rootMessage

  return {
    fieldMessages,
    fieldDetailCodes,
    fieldCodes,
    versionConflict,
    bannerCode,
    bannerMessage,
    aborted: false,
  }
}
