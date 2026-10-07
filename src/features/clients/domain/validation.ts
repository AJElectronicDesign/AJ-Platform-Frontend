import {
  catalogApplies,
  type Client,
  type ClientFormInput,
  type ContactFormInput,
  type CreateClientPayload,
  type CreateContactPayload,
  type Currency,
  type PatchClientPayload,
  type PatchContactPayload,
  type SatCatalog,
} from '@/features/clients/domain/client'
import { parseRfc, type SatPersonType } from '@/features/clients/domain/rfc'

export type ClientValidationMessageKey =
  | 'rfc'
  | 'rfcDate'
  | 'legalName'
  | 'taxRegime'
  | 'taxRegimePerson'
  | 'fiscalPostalCode'
  | 'cfdiUse'
  | 'cfdiUsePerson'
  | 'tradeName'
  | 'email'
  | 'phonePair'
  | 'phoneCode'
  | 'phone'
  | 'currency'
  | 'paymentTerms'
  | 'quotePrefix'
  | 'notes'
  | 'country'
  | 'street'
  | 'exteriorNumber'
  | 'interiorNumber'
  | 'colonia'
  | 'city'
  | 'state'
  | 'postalCode'
  | 'contactName'
  | 'contactPosition'
  | 'contactEmail'
  | 'contactPhone'

export interface ClientValidationIssue {
  path: string
  key: ClientValidationMessageKey
  code?: string
}

export type ClientFormParseResult =
  | { ok: true; payload: CreateClientPayload }
  | { ok: false; issues: ClientValidationIssue[] }

export type ClientPatchParseResult =
  | { ok: true; payload: PatchClientPayload | null }
  | { ok: false; issues: ClientValidationIssue[] }

export type ContactFormParseResult =
  | { ok: true; payload: CreateContactPayload }
  | { ok: false; issues: ClientValidationIssue[] }

export type ContactPatchParseResult =
  | { ok: true; payload: PatchContactPayload | null }
  | { ok: false; issues: ClientValidationIssue[] }

const CALLING_CODE = /^\+[1-9]\d{0,3}$/
const PHONE_NUMBER = /^\d{7,15}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const QUOTE_PREFIX = /^[A-Z0-9]{2,12}$/

interface NormalizedClient {
  rfc: string
  legalName: string
  taxRegime: string
  fiscalPostalCode: string
  cfdiUse: string
  tradeName: string | null
  email: string | null
  phoneCountryCode: string | null
  phone: string | null
  currency: Currency
  paymentTermsDays: number | null
  quotePrefix: string
  notes: string | null
  street: string | null
  exteriorNumber: string | null
  interiorNumber: string | null
  colonia: string | null
  city: string | null
  state: string | null
  country: string
  postalCode: string | null
  personType: SatPersonType | null
}

function issue(
  path: string,
  key: ClientValidationMessageKey,
  code?: string,
): ClientValidationIssue {
  return code ? { path, key, code } : { path, key }
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed
}

function isEmail(value: string): boolean {
  return value.length <= 320 && EMAIL.test(value)
}

function validateOptionalLength(
  issues: ClientValidationIssue[],
  path: string,
  value: string,
  max: number,
  key: ClientValidationMessageKey,
): void {
  if (value.trim().length > max) {
    issues.push(issue(path, key))
  }
}

function validateClientFields(
  input: ClientFormInput,
  catalog: SatCatalog,
): { issues: ClientValidationIssue[]; normalized: NormalizedClient | null } {
  const issues: ClientValidationIssue[] = []
  const parsedRfc = parseRfc(input.rfc)

  if (!parsedRfc.ok) {
    issues.push(issue('rfc', parsedRfc.message === 'date' ? 'rfcDate' : 'rfc'))
  }

  const legalName = input.legalName.trim()

  if (legalName.length < 1 || legalName.length > 300) {
    issues.push(issue('legalName', 'legalName'))
  }

  const personType = parsedRfc.ok ? parsedRfc.personType : null
  const taxRegime = input.taxRegime.trim()
  const regime = catalog.taxRegimes.find((entry) => entry.code === taxRegime)

  if (!regime) {
    issues.push(issue('taxRegime', 'taxRegime'))
  } else if (personType && !catalogApplies(regime, personType)) {
    issues.push(issue('taxRegime', 'taxRegimePerson', regime.code))
  }

  const fiscalPostalCode = input.fiscalPostalCode.trim()

  if (!/^\d{5}$/.test(fiscalPostalCode)) {
    issues.push(issue('fiscalPostalCode', 'fiscalPostalCode'))
  }

  const cfdiUse = input.cfdiUse.trim()
  const use = catalog.cfdiUses.find((entry) => entry.code === cfdiUse)

  if (!use) {
    issues.push(issue('cfdiUse', 'cfdiUse'))
  } else if (personType && !catalogApplies(use, personType)) {
    issues.push(issue('cfdiUse', 'cfdiUsePerson', use.code))
  }

  validateOptionalLength(issues, 'tradeName', input.tradeName, 200, 'tradeName')

  const email = emptyToNull(input.email)

  if (email && !isEmail(email)) {
    issues.push(issue('email', 'email'))
  }

  const phoneCountryCode = emptyToNull(input.phoneCountryCode)
  const phone = emptyToNull(input.phone)

  if (phoneCountryCode && !CALLING_CODE.test(phoneCountryCode)) {
    issues.push(issue('phoneCountryCode', 'phoneCode'))
  }

  if (phone && !PHONE_NUMBER.test(phone)) {
    issues.push(issue('phone', 'phone'))
  }

  // The stored client has both sides or neither. The path is the side that is
  // missing, matching PHONE_PAIR_REQUIRED. Create treats an empty input as null.
  // Edit validates the form, which is the pair after the change, so changing
  // only the number while the stored country code stays filled is valid.
  if ((phoneCountryCode == null) !== (phone == null)) {
    issues.push(issue(phone != null ? 'phoneCountryCode' : 'phone', 'phonePair'))
  }

  const currency = input.currency.trim()

  if (currency !== 'MXN' && currency !== 'USD') {
    issues.push(issue('currency', 'currency'))
  }

  const paymentTermsRaw = input.paymentTermsDays.trim()
  let paymentTermsDays: number | null = null

  if (paymentTermsRaw.length > 0) {
    if (!/^\d+$/.test(paymentTermsRaw)) {
      issues.push(issue('paymentTermsDays', 'paymentTerms'))
    } else {
      paymentTermsDays = Number(paymentTermsRaw)

      if (paymentTermsDays > 365) {
        issues.push(issue('paymentTermsDays', 'paymentTerms'))
      }
    }
  }

  const quotePrefix = input.quotePrefix.trim().toUpperCase()

  if (!QUOTE_PREFIX.test(quotePrefix)) {
    issues.push(issue('quotePrefix', 'quotePrefix'))
  }

  validateOptionalLength(issues, 'notes', input.notes, 2000, 'notes')
  validateOptionalLength(issues, 'address.street', input.street, 200, 'street')
  validateOptionalLength(issues, 'address.exteriorNumber', input.exteriorNumber, 30, 'exteriorNumber')
  validateOptionalLength(issues, 'address.interiorNumber', input.interiorNumber, 30, 'interiorNumber')
  validateOptionalLength(issues, 'address.colonia', input.colonia, 120, 'colonia')
  validateOptionalLength(issues, 'address.city', input.city, 120, 'city')
  validateOptionalLength(issues, 'address.state', input.state, 120, 'state')
  validateOptionalLength(issues, 'address.postalCode', input.postalCode, 10, 'postalCode')

  const country = input.country.trim().toUpperCase()

  if (!/^[A-Z]{2}$/.test(country)) {
    issues.push(issue('address.country', 'country'))
  }

  if (issues.length > 0 || !parsedRfc.ok || (currency !== 'MXN' && currency !== 'USD')) {
    return { issues, normalized: null }
  }

  return {
    issues,
    normalized: {
      rfc: parsedRfc.rfc,
      legalName,
      taxRegime,
      fiscalPostalCode,
      cfdiUse,
      tradeName: emptyToNull(input.tradeName),
      email: email ? email.toLowerCase() : null,
      phoneCountryCode,
      phone,
      currency,
      paymentTermsDays,
      quotePrefix,
      notes: emptyToNull(input.notes),
      street: emptyToNull(input.street),
      exteriorNumber: emptyToNull(input.exteriorNumber),
      interiorNumber: emptyToNull(input.interiorNumber),
      colonia: emptyToNull(input.colonia),
      city: emptyToNull(input.city),
      state: emptyToNull(input.state),
      country,
      postalCode: emptyToNull(input.postalCode),
      personType,
    },
  }
}

function toCreatePayload(value: NormalizedClient): CreateClientPayload {
  return {
    rfc: value.rfc,
    legalName: value.legalName,
    taxRegime: value.taxRegime,
    fiscalPostalCode: value.fiscalPostalCode,
    cfdiUse: value.cfdiUse,
    tradeName: value.tradeName,
    email: value.email,
    phoneCountryCode: value.phoneCountryCode,
    phone: value.phone,
    currency: value.currency,
    paymentTermsDays: value.paymentTermsDays,
    quotePrefix: value.quotePrefix,
    notes: value.notes,
    address: {
      street: value.street,
      exteriorNumber: value.exteriorNumber,
      interiorNumber: value.interiorNumber,
      colonia: value.colonia,
      city: value.city,
      state: value.state,
      country: value.country,
      postalCode: value.postalCode,
    },
  }
}

export function parseClientForm(
  input: ClientFormInput,
  catalog: SatCatalog,
): ClientFormParseResult {
  const parsed = validateClientFields(input, catalog)

  if (!parsed.normalized) {
    return { ok: false, issues: parsed.issues }
  }

  return { ok: true, payload: toCreatePayload(parsed.normalized) }
}

export function parseClientPatch(
  input: ClientFormInput,
  catalog: SatCatalog,
  original: Client,
): ClientPatchParseResult {
  const parsed = validateClientFields(input, catalog)

  if (!parsed.normalized) {
    return { ok: false, issues: parsed.issues }
  }

  const next = parsed.normalized
  const patch: PatchClientPayload = { version: original.version }
  let changed = false

  if (next.rfc !== original.rfc) {
    patch.rfc = next.rfc
    changed = true
  }

  if (next.legalName !== original.legalName) {
    patch.legalName = next.legalName
    changed = true
  }

  if (next.taxRegime !== original.taxRegime) {
    patch.taxRegime = next.taxRegime
    changed = true
  }

  if (next.fiscalPostalCode !== original.fiscalPostalCode) {
    patch.fiscalPostalCode = next.fiscalPostalCode
    changed = true
  }

  if (next.cfdiUse !== original.cfdiUse) {
    patch.cfdiUse = next.cfdiUse
    changed = true
  }

  if (next.tradeName !== original.tradeName) {
    patch.tradeName = next.tradeName
    changed = true
  }

  if (next.email !== original.email) {
    patch.email = next.email
    changed = true
  }

  // A one-sided change is valid when the other side is already stored.
  // Clearing only one side is rejected above, on the missing field.
  if (next.phoneCountryCode !== original.phoneCountryCode) {
    patch.phoneCountryCode = next.phoneCountryCode
    changed = true
  }

  if (next.phone !== original.phone) {
    patch.phone = next.phone
    changed = true
  }

  if (next.currency !== original.currency) {
    patch.currency = next.currency
    changed = true
  }

  if (next.paymentTermsDays !== original.paymentTermsDays) {
    patch.paymentTermsDays = next.paymentTermsDays
    changed = true
  }

  if (next.quotePrefix !== original.quotePrefix) {
    patch.quotePrefix = next.quotePrefix
    changed = true
  }

  if (next.notes !== original.notes) {
    patch.notes = next.notes
    changed = true
  }

  const address: NonNullable<PatchClientPayload['address']> = {}
  const originalAddress = original.address

  if (next.street !== originalAddress.street) {
    address.street = next.street
  }

  if (next.exteriorNumber !== originalAddress.exteriorNumber) {
    address.exteriorNumber = next.exteriorNumber
  }

  if (next.interiorNumber !== originalAddress.interiorNumber) {
    address.interiorNumber = next.interiorNumber
  }

  if (next.colonia !== originalAddress.colonia) {
    address.colonia = next.colonia
  }

  if (next.city !== originalAddress.city) {
    address.city = next.city
  }

  if (next.state !== originalAddress.state) {
    address.state = next.state
  }

  if (next.country !== originalAddress.country) {
    address.country = next.country
  }

  if (next.postalCode !== originalAddress.postalCode) {
    address.postalCode = next.postalCode
  }

  if (Object.keys(address).length > 0) {
    patch.address = address
    changed = true
  }

  if (!changed) {
    return { ok: true, payload: null }
  }

  return { ok: true, payload: patch }
}

interface NormalizedContact {
  name: string
  position: string | null
  email: string | null
  phone: string | null
  isPrimary: boolean
}

function validateContactFields(
  input: ContactFormInput,
): { issues: ClientValidationIssue[]; normalized: NormalizedContact | null } {
  const issues: ClientValidationIssue[] = []
  const name = input.name.trim()

  if (name.length < 1 || name.length > 200) {
    issues.push(issue('name', 'contactName'))
  }

  validateOptionalLength(issues, 'position', input.position, 120, 'contactPosition')

  const email = emptyToNull(input.email)

  if (email && !isEmail(email)) {
    issues.push(issue('email', 'contactEmail'))
  }

  const phone = emptyToNull(input.phone)

  if (phone) {
    const digits = phone.match(/\d/g)?.length ?? 0

    if (phone.length < 7 || phone.length > 30 || digits < 7) {
      issues.push(issue('phone', 'contactPhone'))
    }
  }

  if (issues.length > 0) {
    return { issues, normalized: null }
  }

  return {
    issues,
    normalized: {
      name,
      position: emptyToNull(input.position),
      email: email ? email.toLowerCase() : null,
      phone,
      isPrimary: input.isPrimary,
    },
  }
}

export function parseContactForm(input: ContactFormInput): ContactFormParseResult {
  const parsed = validateContactFields(input)

  if (!parsed.normalized) {
    return { ok: false, issues: parsed.issues }
  }

  return { ok: true, payload: parsed.normalized }
}

export function parseContactPatch(
  input: ContactFormInput,
  original: {
    name: string
    position: string | null
    email: string | null
    phone: string | null
    isPrimary: boolean
  },
): ContactPatchParseResult {
  const parsed = validateContactFields(input)

  if (!parsed.normalized) {
    return { ok: false, issues: parsed.issues }
  }

  const next = parsed.normalized
  const patch: PatchContactPayload = {}

  if (next.name !== original.name) {
    patch.name = next.name
  }

  if (next.position !== original.position) {
    patch.position = next.position
  }

  if (next.email !== original.email) {
    patch.email = next.email
  }

  if (next.phone !== original.phone) {
    patch.phone = next.phone
  }

  if (next.isPrimary !== original.isPrimary) {
    patch.isPrimary = next.isPrimary
  }

  if (Object.keys(patch).length === 0) {
    return { ok: true, payload: null }
  }

  return { ok: true, payload: patch }
}
