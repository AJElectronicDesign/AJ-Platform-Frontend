import type {
  Client,
  ClientAddress,
  ClientContact,
  ClientDetail,
  ClientList,
  Currency,
  LogoUploadResult,
  SatAppliesTo,
  SatCatalog,
  SatCatalogEntry,
} from '@/features/clients/domain/client'

export class InvalidClientResponseError extends Error {
  readonly code = 'invalid_response' as const

  constructor() {
    super('The server returned an invalid client response.')
    this.name = 'InvalidClientResponseError'
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new InvalidClientResponseError()
  }

  return value as Record<string, unknown>
}

function expectString(record: Record<string, unknown>, key: string): string {
  const value = record[key]

  if (typeof value !== 'string') {
    throw new InvalidClientResponseError()
  }

  return value
}

function expectNullableString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key]

  if (value === null) {
    return null
  }

  if (typeof value !== 'string') {
    throw new InvalidClientResponseError()
  }

  return value
}

function expectBoolean(record: Record<string, unknown>, key: string): boolean {
  const value = record[key]

  if (typeof value !== 'boolean') {
    throw new InvalidClientResponseError()
  }

  return value
}

function expectCurrency(value: unknown): Currency {
  if (value !== 'MXN' && value !== 'USD') {
    throw new InvalidClientResponseError()
  }

  return value
}

function expectNullableInt(value: unknown): number | null {
  if (value === null) {
    return null
  }

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new InvalidClientResponseError()
  }

  return value
}

function parseAddress(value: unknown): ClientAddress {
  const record = asRecord(value)

  return {
    street: expectNullableString(record, 'street'),
    exteriorNumber: expectNullableString(record, 'exteriorNumber'),
    interiorNumber: expectNullableString(record, 'interiorNumber'),
    colonia: expectNullableString(record, 'colonia'),
    city: expectNullableString(record, 'city'),
    state: expectNullableString(record, 'state'),
    country: expectString(record, 'country'),
    postalCode: expectNullableString(record, 'postalCode'),
  }
}

export function parseClient(value: unknown): Client {
  const record = asRecord(value)

  return {
    id: expectString(record, 'id'),
    rfc: expectString(record, 'rfc'),
    legalName: expectString(record, 'legalName'),
    taxRegime: expectString(record, 'taxRegime'),
    fiscalPostalCode: expectString(record, 'fiscalPostalCode'),
    cfdiUse: expectString(record, 'cfdiUse'),
    tradeName: expectNullableString(record, 'tradeName'),
    email: expectNullableString(record, 'email'),
    phoneCountryCode: expectNullableString(record, 'phoneCountryCode'),
    phone: expectNullableString(record, 'phone'),
    currency: expectCurrency(record.currency),
    paymentTermsDays: expectNullableInt(record.paymentTermsDays),
    quotePrefix: expectString(record, 'quotePrefix'),
    notes: expectNullableString(record, 'notes'),
    address: parseAddress(record.address),
    hasLogo: expectBoolean(record, 'hasLogo'),
    isActive: expectBoolean(record, 'isActive'),
    createdByUserId: expectNullableString(record, 'createdByUserId'),
    updatedByUserId: expectNullableString(record, 'updatedByUserId'),
    createdAt: expectString(record, 'createdAt'),
    updatedAt: expectString(record, 'updatedAt'),
    version: expectString(record, 'version'),
  }
}

export function parseContact(value: unknown): ClientContact {
  const record = asRecord(value)

  return {
    id: expectString(record, 'id'),
    clientId: expectString(record, 'clientId'),
    name: expectString(record, 'name'),
    position: expectNullableString(record, 'position'),
    email: expectNullableString(record, 'email'),
    phone: expectNullableString(record, 'phone'),
    isPrimary: expectBoolean(record, 'isPrimary'),
    createdByUserId: expectNullableString(record, 'createdByUserId'),
    updatedByUserId: expectNullableString(record, 'updatedByUserId'),
    createdAt: expectString(record, 'createdAt'),
    updatedAt: expectString(record, 'updatedAt'),
  }
}

export function parseClientDetail(value: unknown): ClientDetail {
  const record = asRecord(value)
  const client = parseClient(record)

  if (!Array.isArray(record.contacts)) {
    throw new InvalidClientResponseError()
  }

  return {
    ...client,
    contacts: record.contacts.map(parseContact),
  }
}

export function parseClientEnvelope(value: unknown): ClientDetail {
  const record = asRecord(value)
  return parseClientDetail(record.client)
}

export function parseContactEnvelope(value: unknown): ClientContact {
  const record = asRecord(value)
  return parseContact(record.contact)
}

export function parseClientList(value: unknown): ClientList {
  const record = asRecord(value)

  if (!Array.isArray(record.items)) {
    throw new InvalidClientResponseError()
  }

  const page = record.page
  const pageSize = record.pageSize
  const total = record.total

  if (
    typeof page !== 'number' ||
    typeof pageSize !== 'number' ||
    typeof total !== 'number' ||
    !Number.isInteger(page) ||
    !Number.isInteger(pageSize) ||
    !Number.isInteger(total)
  ) {
    throw new InvalidClientResponseError()
  }

  return {
    items: record.items.map(parseClient),
    page,
    pageSize,
    total,
  }
}

function parseAppliesTo(value: unknown): SatAppliesTo {
  if (value !== 'fisica' && value !== 'moral' && value !== 'both') {
    throw new InvalidClientResponseError()
  }

  return value
}

function parseCatalogEntry(value: unknown): SatCatalogEntry {
  const record = asRecord(value)

  return {
    code: expectString(record, 'code'),
    description: expectString(record, 'description'),
    appliesTo: parseAppliesTo(record.appliesTo),
  }
}

export function parseSatCatalog(value: unknown): SatCatalog {
  const record = asRecord(value)

  if (!Array.isArray(record.taxRegimes) || !Array.isArray(record.cfdiUses)) {
    throw new InvalidClientResponseError()
  }

  return {
    taxRegimes: record.taxRegimes.map(parseCatalogEntry),
    cfdiUses: record.cfdiUses.map(parseCatalogEntry),
  }
}

export function parseLogoUpload(value: unknown): LogoUploadResult {
  const record = asRecord(value)
  const contentType = record.logoContentType

  if (
    record.hasLogo !== true ||
    (contentType !== 'image/png' && contentType !== 'image/jpeg' && contentType !== 'image/webp') ||
    typeof record.logoByteSize !== 'number'
  ) {
    throw new InvalidClientResponseError()
  }

  return {
    hasLogo: true,
    logoContentType: contentType,
    logoByteSize: record.logoByteSize,
  }
}
