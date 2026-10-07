import type { ClientValidationIssue } from '@/features/clients/domain/validation'
import type { MappedClientError } from '@/features/clients/domain/map-client-error'
import type { ClientsCatalog } from '@/shared/i18n/types'

export function validationMessage(
  copy: ClientsCatalog['validation'],
  issue: ClientValidationIssue,
): string {
  return copy[issue.key].replaceAll('{code}', issue.code ?? '')
}

export function issuesToFieldErrors(
  copy: ClientsCatalog['validation'],
  issues: readonly ClientValidationIssue[],
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const issue of issues) {
    if (!errors[issue.path]) {
      errors[issue.path] = validationMessage(copy, issue)
    }
  }

  return errors
}

function codeMessage(copy: ClientsCatalog, code: string): string | null {
  switch (code) {
    case 'CLIENT_RFC_EXISTS':
      return copy.errors.rfcExists
    case 'CLIENT_QUOTE_PREFIX_EXISTS':
      return copy.errors.quotePrefixExists
    case 'CONTACT_PRIMARY_CONFLICT':
      return copy.errors.primaryConflict
    default:
      return null
  }
}

function detailCodeMessage(copy: ClientsCatalog, code: string): string | null {
  if (Object.prototype.hasOwnProperty.call(copy.detailCodes, code)) {
    return copy.detailCodes[code as keyof ClientsCatalog['detailCodes']]
  }

  return null
}

export function mappedToFieldErrors(
  copy: ClientsCatalog,
  mapped: MappedClientError,
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

export function clientBannerMessage(copy: ClientsCatalog, mapped: MappedClientError): string | null {
  switch (mapped.bannerCode) {
    case 'version_conflict':
      return copy.errors.versionConflict
    case 'network':
      return copy.errors.network
    case 'forbidden':
      return copy.errors.forbidden
    case 'not_found':
      return copy.errors.notFound
    case 'unknown':
      return copy.errors.unknown
    case 'already_inactive':
      return copy.errors.alreadyInactive
    case 'already_active':
      return copy.errors.alreadyActive
    case 'logo_too_large':
      return copy.errors.logoTooLarge
    case 'logo_unsupported':
      return copy.errors.logoUnsupported
    case 'logo_not_found':
      return copy.errors.logoNotFound
    case 'primary_conflict':
      return copy.errors.primaryConflict
    case 'contact_not_found':
      return copy.errors.contactNotFound
    case 'validation':
      return mapped.bannerMessage || copy.errors.validation
    case null:
      return mapped.bannerMessage
    default:
      return mapped.bannerMessage || copy.errors.unknown
  }
}

export const CLIENT_FIELD_ORDER = [
  'rfc',
  'legalName',
  'taxRegime',
  'fiscalPostalCode',
  'cfdiUse',
  'tradeName',
  'email',
  'phoneCountryCode',
  'phone',
  'currency',
  'paymentTermsDays',
  'quotePrefix',
  'notes',
  'address.street',
  'address.exteriorNumber',
  'address.interiorNumber',
  'address.colonia',
  'address.city',
  'address.state',
  'address.country',
  'address.postalCode',
] as const

export const CONTACT_FIELD_ORDER = ['name', 'position', 'email', 'phone', 'isPrimary'] as const

export function clientFieldId(path: string): string {
  return `client-${path.replaceAll('.', '-')}`
}

export function focusFirstField(order: readonly string[], errors: Record<string, string>): boolean {
  const first = order.find((path) => errors[path])

  if (!first) {
    return false
  }

  document.getElementById(clientFieldId(first))?.focus()
  return true
}
