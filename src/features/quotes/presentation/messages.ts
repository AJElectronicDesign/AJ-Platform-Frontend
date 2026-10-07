import type { MappedQuoteError } from '@/features/quotes/domain/map-quote-error'
import type { QuoteValidationIssue } from '@/features/quotes/domain/validation'
import type { QuotesCatalog } from '@/shared/i18n/types'

export function validationMessage(
  copy: QuotesCatalog['validation'],
  issue: QuoteValidationIssue,
): string {
  return copy[issue.key]
}

export function issuesToFieldErrors(
  copy: QuotesCatalog['validation'],
  issues: readonly QuoteValidationIssue[],
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const issue of issues) {
    if (!errors[issue.path]) {
      errors[issue.path] = validationMessage(copy, issue)
    }
  }

  return errors
}

function codeMessage(copy: QuotesCatalog, code: string): string | null {
  switch (code) {
    case 'QUOTE_FOLIO_EXISTS':
      return copy.errors.folioExists
    case 'CLIENT_INACTIVE':
      return copy.errors.clientInactive
    case 'QUOTE_EMPTY':
      return copy.errors.empty
    case 'QUOTE_EXPIRED':
      return copy.errors.expired
    default:
      return null
  }
}

function detailCodeMessage(copy: QuotesCatalog, code: string): string | null {
  if (Object.prototype.hasOwnProperty.call(copy.detailCodes, code)) {
    return copy.detailCodes[code as keyof QuotesCatalog['detailCodes']]
  }

  return null
}

export function mappedToFieldErrors(
  copy: QuotesCatalog,
  mapped: MappedQuoteError,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const [path, code] of Object.entries(mapped.fieldDetailCodes)) {
    const translated = detailCodeMessage(copy, code)

    if (translated) {
      errors[path] = translated
    }
  }

  for (const [path, code] of Object.entries(mapped.fieldCodes)) {
    if (errors[path]) {
      continue
    }

    const message = codeMessage(copy, code)

    if (message) {
      errors[path] = message
    }
  }

  for (const [path, message] of Object.entries(mapped.fieldMessages)) {
    if (!errors[path]) {
      errors[path] = message
    }
  }

  return errors
}

export function quoteBannerMessage(copy: QuotesCatalog, mapped: MappedQuoteError): string | null {
  switch (mapped.bannerCode) {
    case 'version_conflict':
      return copy.errors.versionConflict
    case 'network':
      return copy.errors.network
    case 'forbidden':
      return copy.errors.forbidden
    case 'not_found':
      return copy.errors.notFound
    case 'client_not_found':
      return copy.errors.clientNotFound
    case 'unknown':
      return copy.errors.unknown
    case 'client_inactive':
      return copy.errors.clientInactive
    case 'not_editable':
      return copy.errors.notEditable
    case 'not_deletable':
      return copy.errors.notDeletable
    case 'empty':
      return copy.errors.empty
    case 'expired':
      return copy.errors.expired
    case 'invalid_transition':
      return copy.errors.invalidTransition
    case 'folio_exists':
      return copy.errors.folioExists
    case 'validation':
      return mapped.bannerMessage || copy.errors.validation
    case null:
      return mapped.bannerMessage
    default:
      return mapped.bannerMessage || copy.errors.unknown
  }
}

export const QUOTE_FIELD_ORDER = [
  'clientId',
  'type',
  'projectName',
  'requestedByContactId',
  'requestedByName',
  'requestedByEmail',
  'attentionTo',
  'currency',
  'exchangeRate',
  'deliveryTime',
  'validUntil',
  'notes',
  'vatRate',
  'items',
] as const

export function quoteFieldId(path: string): string {
  return `quote-${path.replaceAll('.', '-')}`
}

export function focusFirstQuoteField(errors: Record<string, string>): boolean {
  const first =
    QUOTE_FIELD_ORDER.find((path) => errors[path]) ??
    Object.keys(errors).find((path) => path !== 'version' && path !== 'status')

  if (!first) {
    return false
  }

  document.getElementById(quoteFieldId(first))?.focus()
  return true
}
