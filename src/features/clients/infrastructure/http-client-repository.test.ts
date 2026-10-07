import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CreateClientPayload } from '@/features/clients/domain/client'
import { HttpClientRepository } from '@/features/clients/infrastructure/http-client-repository'
import { accessToken } from '@/shared/infrastructure/http/access-token'

const repository = new HttpClientRepository()

const client = {
  id: '3f1c2a4e-7b9d-4e6a-8c1f-2d4b6a8e0c11',
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
  notes: null,
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
  hasLogo: false,
  isActive: true,
  createdByUserId: null,
  updatedByUserId: null,
  createdAt: '2026-10-06T22:00:00.000Z',
  updatedAt: '2026-10-06T22:00:00.000Z',
  version: 'AAAAAAAAAAE=',
}

const contact = {
  id: '8a7b6c5d-4e3f-4a2b-8c1d-0e9f8a7b6c5d',
  clientId: client.id,
  name: 'María López',
  position: 'Compras',
  email: 'maria@acme.example',
  phone: '+52 33 3333 3333',
  isPrimary: true,
  createdByUserId: null,
  updatedByUserId: null,
  createdAt: client.createdAt,
  updatedAt: client.updatedAt,
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>

function installFetch(impl: typeof fetch): void {
  fetchMock = vi.fn(impl)
  vi.stubGlobal('fetch', fetchMock)
}

function lastCall(): { url: string; init: RequestInit } {
  const call = fetchMock.mock.calls.at(-1)

  if (!call) {
    throw new Error('fetch was not called')
  }

  return { url: String(call[0]), init: call[1] ?? {} }
}

describe('HttpClientRepository', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    accessToken.clear()
  })

  it('lists clients with the bearer token and without putting the token in the URL', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () =>
      jsonResponse({
        items: [
          {
            ...client,
            primaryContact: {
              id: contact.id,
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
            },
          },
        ],
        page: 2,
        pageSize: 20,
        total: 21,
      }),
    )

    const result = await repository.list({
      q: 'acme norte',
      active: 'all',
      page: 2,
      pageSize: 20,
    })
    const { url, init } = lastCall()

    expect(result.items[0]?.legalName).toBe('Acme Industrial SA de CV')
    expect(result.items[0]?.primaryContact).toEqual({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    })
    expect(result.total).toBe(21)
    expect(url).toBe('http://api.test/api/v1/clients?q=acme+norte&active=all&page=2&pageSize=20')
    expect(url).not.toContain('secret-token')
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer secret-token')
  })

  it('creates a client and reads the detail envelope', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ client: { ...client, contacts: [] } }, 201))

    const payload: CreateClientPayload = {
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
      notes: null,
      address: client.address,
    }

    const created = await repository.create(payload)
    const { url, init } = lastCall()

    expect(created.contacts).toEqual([])
    expect(url).toBe('http://api.test/api/v1/clients')
    expect(init.method).toBe('POST')
    expect(JSON.parse(String(init.body))).toEqual(payload)
    expect(url).not.toContain('secret-token')
  })

  it('patches with the row version and propagates a duplicate RFC', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () =>
      jsonResponse(
        {
          error: {
            code: 'CLIENT_RFC_EXISTS',
            message: 'A client with this RFC already exists',
            details: [{ path: 'rfc', message: 'A client with this RFC already exists' }],
          },
        },
        409,
      ),
    )

    await expect(
      repository.update(client.id, { rfc: 'ABC0102031A2', version: 'AAAAAAAAAAE=' }),
    ).rejects.toMatchObject({
      status: 409,
      code: 'CLIENT_RFC_EXISTS',
      details: [{ path: 'rfc', message: 'A client with this RFC already exists' }],
    })

    const { url, init } = lastCall()

    expect(url).toBe(`http://api.test/api/v1/clients/${client.id}`)
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(String(init.body))).toEqual({
      rfc: 'ABC0102031A2',
      version: 'AAAAAAAAAAE=',
    })
  })

  it('downloads the logo as a blob with the bearer token', async () => {
    accessToken.save('secret-token', 3600)
    const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47])
    installFetch(
      async () => new Response(bytes, { status: 200, headers: { 'content-type': 'image/png' } }),
    )

    const blob = await repository.getLogo(client.id)
    const { url, init } = lastCall()

    expect(blob).toBeInstanceOf(Blob)
    expect(blob.size).toBe(bytes.byteLength)
    expect(url).toBe(`http://api.test/api/v1/clients/${client.id}/logo`)
    expect(url).not.toContain('secret-token')
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer secret-token')
    expect(new Headers(init.headers).get('Accept')).toContain('image/png')
  })

  it('uploads the logo as multipart field file and does not force JSON', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () =>
      jsonResponse({ hasLogo: true, logoContentType: 'image/png', logoByteSize: 12 }),
    )

    const file = new File([Uint8Array.from([1, 2, 3])], 'logo.png', { type: 'image/png' })
    const uploaded = await repository.uploadLogo(client.id, file)
    const { url, init } = lastCall()
    const headers = new Headers(init.headers)

    expect(uploaded).toEqual({ hasLogo: true, logoContentType: 'image/png', logoByteSize: 12 })
    expect(url).toBe(`http://api.test/api/v1/clients/${client.id}/logo`)
    expect(init.method).toBe('PUT')
    expect(init.body).toBeInstanceOf(FormData)
    expect((init.body as FormData).get('file')).toBeInstanceOf(File)
    expect(headers.get('Content-Type')).toBeNull()
    expect(headers.get('Authorization')).toBe('Bearer secret-token')
  })

  it('creates, updates, and deletes contacts, and posts deactivate', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ contact }))
    fetchMock.mockReset()

    fetchMock.mockResolvedValueOnce(jsonResponse({ contact }, 201))
    await repository.createContact(client.id, {
      name: 'María López',
      position: 'Compras',
      email: 'maria@acme.example',
      phone: '+52 33 3333 3333',
      isPrimary: true,
    })
    expect(lastCall().url).toBe(`http://api.test/api/v1/clients/${client.id}/contacts`)
    expect(lastCall().init.method).toBe('POST')

    fetchMock.mockResolvedValueOnce(jsonResponse({ contact }))
    await repository.updateContact(client.id, contact.id, { isPrimary: true })
    expect(lastCall().url).toBe(
      `http://api.test/api/v1/clients/${client.id}/contacts/${contact.id}`,
    )
    expect(JSON.parse(String(lastCall().init.body))).toEqual({ isPrimary: true })

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
    await repository.deleteContact(client.id, contact.id)
    expect(lastCall().init.method).toBe('DELETE')

    fetchMock.mockResolvedValueOnce(
      jsonResponse({ client: { ...client, isActive: false, contacts: [contact] } }),
    )
    const inactive = await repository.deactivate(client.id)

    expect(inactive.isActive).toBe(false)
    expect(lastCall().url).toBe(`http://api.test/api/v1/clients/${client.id}/deactivate`)
    expect(lastCall().init.method).toBe('POST')
  })

  it('reads the SAT catalog used by the form selects', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () =>
      jsonResponse({
        taxRegimes: [{ code: '601', description: 'General de Ley Personas Morales', appliesTo: 'moral' }],
        cfdiUses: [{ code: 'G03', description: 'Gastos en general', appliesTo: 'both' }],
      }),
    )

    const catalog = await repository.getSatCatalog()
    const { url } = lastCall()

    expect(catalog.taxRegimes[0]?.code).toBe('601')
    expect(url).toBe('http://api.test/api/v1/catalogs/sat')
    expect(url).not.toContain('secret-token')
  })
})
