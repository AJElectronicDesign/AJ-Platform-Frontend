import { ApiError } from '@/shared/infrastructure/http/api-error'

export const ClientErrorCode = {
  rfcExists: 'CLIENT_RFC_EXISTS',
  quotePrefixExists: 'CLIENT_QUOTE_PREFIX_EXISTS',
  versionConflict: 'CLIENT_VERSION_CONFLICT',
  alreadyInactive: 'CLIENT_ALREADY_INACTIVE',
  alreadyActive: 'CLIENT_ALREADY_ACTIVE',
  notFound: 'CLIENT_NOT_FOUND',
  contactNotFound: 'CONTACT_NOT_FOUND',
  primaryConflict: 'CONTACT_PRIMARY_CONFLICT',
  logoTooLarge: 'LOGO_TOO_LARGE',
  logoUnsupported: 'LOGO_UNSUPPORTED_TYPE',
  logoNotFound: 'LOGO_NOT_FOUND',
  validation: 'VALIDATION_ERROR',
  forbidden: 'FORBIDDEN',
  payloadTooLarge: 'PAYLOAD_TOO_LARGE',
  network: 'network',
} as const

export interface MappedClientError {
  /** Backend `error.details` messages, keyed by path. Version is excluded. */
  fieldMessages: Record<string, string>
  /** `details[].code` from client validation, keyed by path. */
  fieldDetailCodes: Record<string, string>
  /**
   * Conflict codes translated in the UI. Set for `CLIENT_RFC_EXISTS` and
   * `CLIENT_QUOTE_PREFIX_EXISTS` even when `details` also name the field, so
   * the English server message is not shown. Also the fallback when a 409
   * omits `details[].path`.
   */
  fieldCodes: Record<string, string>
  versionConflict: boolean
  bannerCode: string | null
  bannerMessage: string | null
  aborted: boolean
}

function emptyMapped(overrides: Partial<MappedClientError> = {}): MappedClientError {
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

export function mapClientError(error: unknown): MappedClientError {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return emptyMapped({ bannerCode: null, aborted: true })
  }

  if (!(error instanceof ApiError)) {
    return emptyMapped()
  }

  if (error.code === ClientErrorCode.network || error.status === 0) {
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

    if (detail.path === 'version') {
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
    case ClientErrorCode.rfcExists:
      fieldCodes.rfc = error.code
      break
    case ClientErrorCode.quotePrefixExists:
      fieldCodes.quotePrefix = error.code
      break
    case ClientErrorCode.versionConflict:
      versionConflict = true
      bannerCode = 'version_conflict'
      break
    case ClientErrorCode.alreadyInactive:
      bannerCode = 'already_inactive'
      break
    case ClientErrorCode.alreadyActive:
      bannerCode = 'already_active'
      break
    case ClientErrorCode.notFound:
      bannerCode = 'not_found'
      break
    case ClientErrorCode.contactNotFound:
      bannerCode = 'contact_not_found'
      break
    case ClientErrorCode.primaryConflict:
      fieldCodes.isPrimary = error.code
      bannerCode = 'primary_conflict'
      break
    case ClientErrorCode.logoTooLarge:
    case ClientErrorCode.payloadTooLarge:
      bannerCode = 'logo_too_large'
      break
    case ClientErrorCode.logoUnsupported:
      bannerCode = 'logo_unsupported'
      break
    case ClientErrorCode.logoNotFound:
      bannerCode = 'logo_not_found'
      break
    case ClientErrorCode.forbidden:
      bannerCode = 'forbidden'
      break
    case ClientErrorCode.validation:
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
