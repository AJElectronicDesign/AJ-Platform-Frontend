import type {
  Client,
  ClientContact,
  ClientDetail,
  ClientList,
  ClientListItem,
  CreateClientPayload,
  PrimaryContactSummary,
  CreateContactPayload,
  ListClientsQuery,
  LogoUploadResult,
  PatchClientPayload,
  PatchContactPayload,
  SatCatalog,
} from '@/features/clients/domain/client'
import type {
  ClientRepository,
  ClientRequestOptions,
} from '@/features/clients/domain/client-repository'
import { isGenericRfc } from '@/features/clients/domain/rfc'
import { CFDI_USES, TAX_REGIMES } from '@/features/clients/infrastructure/sat-catalog-data'
import { ApiError } from '@/shared/infrastructure/http/api-error'

/** Referenced so the production-bundle check can see this module if it leaks. */
export const clientsMockMarker = 'aj.platform.clients.mock'

const TINY_PNG = Uint8Array.from(
  atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  ),
  (char) => char.charCodeAt(0),
)

interface StoredClient extends Client {
  contacts: ClientContact[]
  logo: Blob | null
}

const now = '2026-10-06T22:00:00.000Z'

function addressOf(input: CreateClientPayload): Client['address'] {
  return {
    street: input.address.street,
    exteriorNumber: input.address.exteriorNumber,
    interiorNumber: input.address.interiorNumber,
    colonia: input.address.colonia,
    city: input.address.city,
    state: input.address.state,
    country: input.address.country,
    postalCode: input.address.postalCode,
  }
}

function seedClient(input: CreateClientPayload, id: string, extras: Partial<StoredClient> = {}): StoredClient {
  return {
    id,
    rfc: input.rfc,
    legalName: input.legalName,
    taxRegime: input.taxRegime,
    fiscalPostalCode: input.fiscalPostalCode,
    cfdiUse: input.cfdiUse,
    tradeName: input.tradeName,
    email: input.email,
    phoneCountryCode: input.phoneCountryCode,
    phone: input.phone,
    currency: input.currency,
    paymentTermsDays: input.paymentTermsDays,
    quotePrefix: input.quotePrefix,
    notes: input.notes,
    address: addressOf(input),
    hasLogo: false,
    isActive: true,
    createdByUserId: 'user_demo',
    updatedByUserId: 'user_demo',
    createdAt: now,
    updatedAt: now,
    version: 'AAAAAAAAAAE=',
    contacts: [],
    logo: null,
    ...extras,
  }
}

const acmeContact: ClientContact = {
  id: '8a7b6c5d-4e3f-4a2b-8c1d-0e9f8a7b6c5d',
  clientId: '3f1c2a4e-7b9d-4e6a-8c1f-2d4b6a8e0c11',
  name: 'María López',
  position: 'Compras',
  email: 'maria@acme.example',
  phone: '+52 33 3333 3333',
  isPrimary: true,
  createdByUserId: 'user_demo',
  updatedByUserId: 'user_demo',
  createdAt: now,
  updatedAt: now,
}

const clients = new Map<string, StoredClient>()

function seed(): void {
  if (clients.size > 0) {
    return
  }

  const acme = seedClient(
    {
      rfc: 'ABC0102031A2',
      legalName: 'Acme Industrial SA de CV',
      taxRegime: '601',
      fiscalPostalCode: '45050',
      cfdiUse: 'G03',
      tradeName: 'Acme',
      email: 'compras@acme.example',
      phoneCountryCode: '+52',
      phone: '3333333333',
      currency: 'MXN',
      paymentTermsDays: 30,
      quotePrefix: 'ACME',
      notes: 'Cliente de demostración.',
      address: {
        street: 'Av. Ejemplo',
        exteriorNumber: '100',
        interiorNumber: null,
        colonia: 'Centro',
        city: 'Zapopan',
        state: 'Jalisco',
        country: 'MX',
        postalCode: '45050',
      },
    },
    '3f1c2a4e-7b9d-4e6a-8c1f-2d4b6a8e0c11',
    {
      hasLogo: true,
      contacts: [
        acmeContact,
        {
          ...acmeContact,
          id: '11111111-2222-4333-8444-555555555555',
          name: 'Juan Pérez',
          position: 'Finanzas',
          email: 'juan@acme.example',
          phone: '+52 33 4444 4444',
          isPrimary: false,
        },
      ],
    },
  )
  const godel = seedClient(
    {
      rfc: 'GODE561231GR8',
      legalName: 'Ana Godínez Estrada',
      taxRegime: '612',
      fiscalPostalCode: '44100',
      cfdiUse: 'G03',
      tradeName: null,
      email: 'ana@godinez.example',
      phoneCountryCode: '+52',
      phone: '3311111111',
      currency: 'USD',
      paymentTermsDays: 15,
      quotePrefix: 'GODEL',
      notes: null,
      address: {
        street: 'López Mateos',
        exteriorNumber: '200',
        interiorNumber: 'B',
        colonia: 'Americana',
        city: 'Guadalajara',
        state: 'Jalisco',
        country: 'MX',
        postalCode: '44100',
      },
    },
    'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
  )
  const ede = seedClient(
    {
      rfc: 'EDE850101ABC',
      legalName: 'Electrónica del Este SA de CV',
      taxRegime: '601',
      fiscalPostalCode: '64000',
      cfdiUse: 'G01',
      tradeName: 'EDE',
      email: null,
      phoneCountryCode: null,
      phone: null,
      currency: 'MXN',
      paymentTermsDays: null,
      quotePrefix: 'EDE',
      notes: null,
      address: {
        street: null,
        exteriorNumber: null,
        interiorNumber: null,
        colonia: null,
        city: 'Monterrey',
        state: 'Nuevo León',
        country: 'MX',
        postalCode: '64000',
      },
    },
    'bbbbbbbb-cccc-4ddd-8eee-ffffffffffff',
    { isActive: false },
  )

  clients.set(acme.id, acme)
  clients.set(godel.id, godel)
  clients.set(ede.id, ede)
}

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
}

function nextVersion(): string {
  const bytes = new Uint8Array(8)
  const view = new DataView(bytes.buffer)
  view.setUint32(4, Date.now() % 0xffffffff)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

function toPrimaryContact(client: StoredClient): PrimaryContactSummary | null {
  const contact = client.contacts.find((item) => item.isPrimary)

  if (!contact) {
    return null
  }

  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
  }
}

function toListItem(client: StoredClient): ClientListItem {
  return {
    ...toClient(client),
    primaryContact: toPrimaryContact(client),
  }
}

function toClient(client: StoredClient): Client {
  return {
    id: client.id,
    rfc: client.rfc,
    legalName: client.legalName,
    taxRegime: client.taxRegime,
    fiscalPostalCode: client.fiscalPostalCode,
    cfdiUse: client.cfdiUse,
    tradeName: client.tradeName,
    email: client.email,
    phoneCountryCode: client.phoneCountryCode,
    phone: client.phone,
    currency: client.currency,
    paymentTermsDays: client.paymentTermsDays,
    quotePrefix: client.quotePrefix,
    notes: client.notes,
    address: client.address,
    hasLogo: client.hasLogo,
    isActive: client.isActive,
    createdByUserId: client.createdByUserId,
    updatedByUserId: client.updatedByUserId,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
    version: client.version,
  }
}

function toDetail(client: StoredClient): ClientDetail {
  return {
    ...toClient(client),
    contacts: [...client.contacts].sort((left, right) => {
      if (left.isPrimary !== right.isPrimary) {
        return left.isPrimary ? -1 : 1
      }

      return left.name.localeCompare(right.name, 'es')
    }),
  }
}

function requireClient(id: string): StoredClient {
  seed()
  const client = clients.get(id)

  if (!client) {
    throw new ApiError(404, 'Client not found', 'CLIENT_NOT_FOUND')
  }

  return client
}

function assertUnique(client: StoredClient | null, rfc: string, quotePrefix: string): void {
  for (const existing of clients.values()) {
    if (existing.id === client?.id) {
      continue
    }

    if (existing.rfc === rfc && !isGenericRfc(rfc)) {
      throw new ApiError(409, 'A client with this RFC already exists', 'CLIENT_RFC_EXISTS', [
        { path: 'rfc', message: 'A client with this RFC already exists' },
      ])
    }

    if (existing.quotePrefix === quotePrefix) {
      throw new ApiError(
        409,
        'A client with this quote prefix already exists',
        'CLIENT_QUOTE_PREFIX_EXISTS',
        [{ path: 'quotePrefix', message: 'A client with this quote prefix already exists' }],
      )
    }
  }
}

async function logoBlob(): Promise<Blob> {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas')
    canvas.width = 160
    canvas.height = 160
    const context = canvas.getContext('2d')

    if (context) {
      context.fillStyle = '#0f766e'
      context.fillRect(0, 0, 160, 160)
      context.fillStyle = '#f0fdfa'
      context.font = 'bold 64px sans-serif'
      context.fillText('AC', 28, 100)

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((value) => resolve(value), 'image/png')
      })

      if (blob) {
        return blob
      }
    }
  }

  return new Blob([TINY_PNG], { type: 'image/png' })
}

export class MockClientRepository implements ClientRepository {
  readonly marker = clientsMockMarker

  async list(query: ListClientsQuery): Promise<ClientList> {
    seed()
    const needle = query.q ? fold(query.q) : ''
    const filtered = [...clients.values()]
      .filter((client) => {
        if (query.active === 'true' && !client.isActive) {
          return false
        }

        if (query.active === 'false' && client.isActive) {
          return false
        }

        if (!needle) {
          return true
        }

        return [client.rfc, client.legalName, client.tradeName ?? ''].some((value) =>
          fold(value).includes(needle),
        )
      })
      .sort((left, right) => left.legalName.localeCompare(right.legalName, 'es') || left.id.localeCompare(right.id))

    const start = (query.page - 1) * query.pageSize

    return {
      items: filtered.slice(start, start + query.pageSize).map((client) => toListItem(client)),
      page: query.page,
      pageSize: query.pageSize,
      total: filtered.length,
    }
  }

  async get(id: string): Promise<ClientDetail> {
    return toDetail(requireClient(id))
  }

  async create(body: CreateClientPayload): Promise<ClientDetail> {
    seed()
    assertUnique(null, body.rfc, body.quotePrefix)
    const id = crypto.randomUUID()
    const client = seedClient(body, id, { version: nextVersion(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
    clients.set(id, client)
    return toDetail(client)
  }

  async update(id: string, body: PatchClientPayload): Promise<ClientDetail> {
    const client = requireClient(id)

    if (body.version !== undefined && body.version !== client.version) {
      throw new ApiError(409, 'The client was updated by someone else', 'CLIENT_VERSION_CONFLICT', [
        { path: 'version', message: 'The client was updated by someone else' },
      ])
    }

    const rfc = body.rfc ?? client.rfc
    const quotePrefix = body.quotePrefix ?? client.quotePrefix
    assertUnique(client, rfc, quotePrefix)

    const phoneCountryCode =
      body.phoneCountryCode === undefined ? client.phoneCountryCode : body.phoneCountryCode
    const phone = body.phone === undefined ? client.phone : body.phone

    if ((phoneCountryCode == null) !== (phone == null)) {
      throw new ApiError(400, 'Request validation failed', 'VALIDATION_ERROR', [
        {
          path: phone != null ? 'phoneCountryCode' : 'phone',
          message: 'El teléfono y la clave de país deben indicarse juntos o dejarse vacíos',
          code: 'PHONE_PAIR_REQUIRED',
        },
      ])
    }

    const next: StoredClient = {
      ...client,
      rfc,
      legalName: body.legalName ?? client.legalName,
      taxRegime: body.taxRegime ?? client.taxRegime,
      fiscalPostalCode: body.fiscalPostalCode ?? client.fiscalPostalCode,
      cfdiUse: body.cfdiUse ?? client.cfdiUse,
      tradeName: body.tradeName === undefined ? client.tradeName : body.tradeName,
      email: body.email === undefined ? client.email : body.email,
      phoneCountryCode,
      phone,
      currency: body.currency ?? client.currency,
      paymentTermsDays:
        body.paymentTermsDays === undefined ? client.paymentTermsDays : body.paymentTermsDays,
      quotePrefix,
      notes: body.notes === undefined ? client.notes : body.notes,
      address: {
        street: body.address?.street === undefined ? client.address.street : body.address.street,
        exteriorNumber:
          body.address?.exteriorNumber === undefined
            ? client.address.exteriorNumber
            : body.address.exteriorNumber,
        interiorNumber:
          body.address?.interiorNumber === undefined
            ? client.address.interiorNumber
            : body.address.interiorNumber,
        colonia: body.address?.colonia === undefined ? client.address.colonia : body.address.colonia,
        city: body.address?.city === undefined ? client.address.city : body.address.city,
        state: body.address?.state === undefined ? client.address.state : body.address.state,
        country: body.address?.country === undefined ? client.address.country : body.address.country,
        postalCode:
          body.address?.postalCode === undefined ? client.address.postalCode : body.address.postalCode,
      },
      updatedAt: new Date().toISOString(),
      version: nextVersion(),
    }

    clients.set(id, next)
    return toDetail(next)
  }

  async deactivate(id: string): Promise<ClientDetail> {
    const client = requireClient(id)

    if (!client.isActive) {
      throw new ApiError(409, 'Client is already inactive', 'CLIENT_ALREADY_INACTIVE')
    }

    client.isActive = false
    client.version = nextVersion()
    return toDetail(client)
  }

  async reactivate(id: string): Promise<ClientDetail> {
    const client = requireClient(id)

    if (client.isActive) {
      throw new ApiError(409, 'Client is already active', 'CLIENT_ALREADY_ACTIVE')
    }

    client.isActive = true
    client.version = nextVersion()
    return toDetail(client)
  }

  async getLogo(id: string, _options?: ClientRequestOptions): Promise<Blob> {
    const client = requireClient(id)

    if (!client.logo && client.hasLogo) {
      client.logo = await logoBlob()
    }

    if (!client.logo) {
      throw new ApiError(404, 'Client has no logo', 'LOGO_NOT_FOUND')
    }

    return client.logo
  }

  async uploadLogo(id: string, file: File): Promise<LogoUploadResult> {
    const client = requireClient(id)
    client.logo = file
    client.hasLogo = true
    client.version = nextVersion()

    return {
      hasLogo: true,
      logoContentType: 'image/png',
      logoByteSize: file.size,
    }
  }

  async deleteLogo(id: string): Promise<void> {
    const client = requireClient(id)

    if (!client.hasLogo) {
      throw new ApiError(404, 'Client has no logo', 'LOGO_NOT_FOUND')
    }

    client.logo = null
    client.hasLogo = false
    client.version = nextVersion()
  }

  async createContact(clientId: string, body: CreateContactPayload): Promise<ClientContact> {
    const client = requireClient(clientId)
    const contact: ClientContact = {
      id: crypto.randomUUID(),
      clientId,
      name: body.name,
      position: body.position,
      email: body.email,
      phone: body.phone,
      isPrimary: body.isPrimary,
      createdByUserId: 'user_demo',
      updatedByUserId: 'user_demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (body.isPrimary) {
      for (const existing of client.contacts) {
        existing.isPrimary = false
      }
    }

    client.contacts.push(contact)
    return contact
  }

  async updateContact(
    clientId: string,
    contactId: string,
    body: PatchContactPayload,
  ): Promise<ClientContact> {
    const client = requireClient(clientId)
    const contact = client.contacts.find((item) => item.id === contactId)

    if (!contact) {
      throw new ApiError(404, 'Contact not found', 'CONTACT_NOT_FOUND')
    }

    if (body.isPrimary) {
      for (const existing of client.contacts) {
        existing.isPrimary = existing.id === contactId
      }
    }

    if (body.name !== undefined) {
      contact.name = body.name
    }

    if (body.position !== undefined) {
      contact.position = body.position
    }

    if (body.email !== undefined) {
      contact.email = body.email
    }

    if (body.phone !== undefined) {
      contact.phone = body.phone
    }

    if (body.isPrimary !== undefined) {
      contact.isPrimary = body.isPrimary
    }

    contact.updatedAt = new Date().toISOString()
    return contact
  }

  async deleteContact(clientId: string, contactId: string): Promise<void> {
    const client = requireClient(clientId)
    const index = client.contacts.findIndex((item) => item.id === contactId)

    if (index < 0) {
      throw new ApiError(404, 'Contact not found', 'CONTACT_NOT_FOUND')
    }

    client.contacts.splice(index, 1)
  }

  async getSatCatalog(): Promise<SatCatalog> {
    return {
      taxRegimes: TAX_REGIMES.map((entry) => ({ ...entry })),
      cfdiUses: CFDI_USES.map((entry) => ({ ...entry })),
    }
  }
}
