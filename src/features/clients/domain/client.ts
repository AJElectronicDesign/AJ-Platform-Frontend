import type { SatPersonType } from '@/features/clients/domain/rfc'

export type Currency = 'MXN' | 'USD'
export type ActiveFilter = 'true' | 'false' | 'all'
export type SatAppliesTo = SatPersonType | 'both'

export interface SatCatalogEntry {
  code: string
  description: string
  appliesTo: SatAppliesTo
}

export interface SatCatalog {
  taxRegimes: readonly SatCatalogEntry[]
  cfdiUses: readonly SatCatalogEntry[]
}

export interface ClientAddress {
  street: string | null
  exteriorNumber: string | null
  interiorNumber: string | null
  colonia: string | null
  city: string | null
  state: string | null
  country: string
  postalCode: string | null
}

export interface Client {
  id: string
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
  address: ClientAddress
  hasLogo: boolean
  isActive: boolean
  createdByUserId: string | null
  updatedByUserId: string | null
  createdAt: string
  updatedAt: string
  version: string
}

export interface ClientContact {
  id: string
  clientId: string
  name: string
  position: string | null
  email: string | null
  phone: string | null
  isPrimary: boolean
  createdByUserId: string | null
  updatedByUserId: string | null
  createdAt: string
  updatedAt: string
}

export interface ClientDetail extends Client {
  contacts: ClientContact[]
}

export interface ClientList {
  items: Client[]
  page: number
  pageSize: number
  total: number
}

export interface ListClientsQuery {
  q?: string
  active: ActiveFilter
  page: number
  pageSize: number
}

export interface ClientAddressInput {
  street: string | null
  exteriorNumber: string | null
  interiorNumber: string | null
  colonia: string | null
  city: string | null
  state: string | null
  country: string
  postalCode: string | null
}

export interface CreateClientPayload {
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
  address: ClientAddressInput
}

export interface PatchClientPayload {
  rfc?: string
  legalName?: string
  taxRegime?: string
  fiscalPostalCode?: string
  cfdiUse?: string
  tradeName?: string | null
  email?: string | null
  phoneCountryCode?: string | null
  phone?: string | null
  currency?: Currency
  paymentTermsDays?: number | null
  quotePrefix?: string
  notes?: string | null
  address?: Partial<ClientAddressInput>
  version: string
}

export interface CreateContactPayload {
  name: string
  position: string | null
  email: string | null
  phone: string | null
  isPrimary: boolean
}

export interface PatchContactPayload {
  name?: string
  position?: string | null
  email?: string | null
  phone?: string | null
  isPrimary?: boolean
}

export interface LogoUploadResult {
  hasLogo: true
  logoContentType: 'image/png' | 'image/jpeg' | 'image/webp'
  logoByteSize: number
}

export interface ClientFormInput {
  rfc: string
  legalName: string
  taxRegime: string
  fiscalPostalCode: string
  cfdiUse: string
  tradeName: string
  email: string
  phoneCountryCode: string
  phone: string
  currency: string
  paymentTermsDays: string
  quotePrefix: string
  notes: string
  street: string
  exteriorNumber: string
  interiorNumber: string
  colonia: string
  city: string
  state: string
  country: string
  postalCode: string
}

export interface ContactFormInput {
  name: string
  position: string
  email: string
  phone: string
  isPrimary: boolean
}

export const CLIENT_PAGE_SIZE = 20

export function emptyClientForm(): ClientFormInput {
  return {
    rfc: '',
    legalName: '',
    taxRegime: '',
    fiscalPostalCode: '',
    cfdiUse: '',
    tradeName: '',
    email: '',
    phoneCountryCode: '',
    phone: '',
    currency: 'MXN',
    paymentTermsDays: '',
    quotePrefix: '',
    notes: '',
    street: '',
    exteriorNumber: '',
    interiorNumber: '',
    colonia: '',
    city: '',
    state: '',
    country: 'MX',
    postalCode: '',
  }
}

export function clientToForm(client: Client): ClientFormInput {
  return {
    rfc: client.rfc,
    legalName: client.legalName,
    taxRegime: client.taxRegime,
    fiscalPostalCode: client.fiscalPostalCode,
    cfdiUse: client.cfdiUse,
    tradeName: client.tradeName ?? '',
    email: client.email ?? '',
    phoneCountryCode: client.phoneCountryCode ?? '',
    phone: client.phone ?? '',
    currency: client.currency,
    paymentTermsDays: client.paymentTermsDays == null ? '' : String(client.paymentTermsDays),
    quotePrefix: client.quotePrefix,
    notes: client.notes ?? '',
    street: client.address.street ?? '',
    exteriorNumber: client.address.exteriorNumber ?? '',
    interiorNumber: client.address.interiorNumber ?? '',
    colonia: client.address.colonia ?? '',
    city: client.address.city ?? '',
    state: client.address.state ?? '',
    country: client.address.country || 'MX',
    postalCode: client.address.postalCode ?? '',
  }
}

export function emptyContactForm(): ContactFormInput {
  return {
    name: '',
    position: '',
    email: '',
    phone: '',
    isPrimary: false,
  }
}

export function contactToForm(contact: ClientContact): ContactFormInput {
  return {
    name: contact.name,
    position: contact.position ?? '',
    email: contact.email ?? '',
    phone: contact.phone ?? '',
    isPrimary: contact.isPrimary,
  }
}

export function primaryContact(contacts: readonly ClientContact[]): ClientContact | null {
  return contacts.find((contact) => contact.isPrimary) ?? null
}

export function catalogApplies(
  entry: SatCatalogEntry,
  personType: SatPersonType,
): boolean {
  return entry.appliesTo === 'both' || entry.appliesTo === personType
}
