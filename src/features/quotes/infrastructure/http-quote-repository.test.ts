import { afterEach, describe, expect, it, vi } from 'vitest'
import type { CreateQuotePayload } from '@/features/quotes/domain/quote'
import { HttpQuoteRepository } from '@/features/quotes/infrastructure/http-quote-repository'
import { accessToken } from '@/shared/infrastructure/http/access-token'

const repository = new HttpQuoteRepository()

const quoteId = '9c0b1a2e-3d4f-5a6b-7c8d-9e0f1a2b3c4d'
const clientId = '3f1c2a4e-7b9d-4e6a-8c1f-2d4b6a8e0c11'
const userId = '6b1d9a22-0c44-4e1a-9a55-1d2e3f4a5b6c'

const quote = {
  id: quoteId,
  clientId,
  folio: 'ACME_00001',
  type: 'services_material',
  status: 'draft',
  projectName: 'Sensor de nivel',
  requestedByContactId: null,
  requestedByName: 'María López',
  requestedByEmail: 'maria@acme.example',
  attentionTo: 'Departamento de Compras',
  currency: 'MXN',
  exchangeRate: '17.250000',
  deliveryTime: '4 semanas',
  validUntil: '2026-11-06',
  includeVat: true,
  vatRate: '0.1600',
  subtotal: '3001.00',
  vatAmount: '480.16',
  total: '3481.16',
  sentAt: null,
  sentByUserId: null,
  sentBy: null,
  acceptedAt: null,
  acceptedByUserId: null,
  acceptedBy: null,
  rejectedAt: null,
  rejectedByUserId: null,
  rejectedBy: null,
  createdByUserId: userId,
  createdBy: { id: userId, name: 'Ada Admin' },
  updatedByUserId: userId,
  updatedBy: { id: userId, name: 'Ada Admin' },
  createdAt: '2026-10-07T15:00:00.000Z',
  updatedAt: '2026-10-07T15:00:00.000Z',
  version: 'AAAAAAAAAAE=',
  client: {
    id: clientId,
    legalName: 'Acme Industrial SA de CV',
    tradeName: 'Acme',
    rfc: 'ABC0102031A2',
    quotePrefix: 'ACME',
  },
}

const detail = {
  ...quote,
  notes: 'Precios en moneda de la cotización.',
  items: [
    {
      id: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
      position: 1,
      description: 'Diseño de PCB, 4 capas',
      quantity: '2.0000',
      unitPrice: '1500.5000',
      lineTotal: '3001.00',
    },
  ],
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

describe('HttpQuoteRepository', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    accessToken.clear()
  })

  it('lists quotes with filters and the bearer token, without putting the token in the URL', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ items: [quote], page: 2, pageSize: 20, total: 21 }))

    const result = await repository.list({
      q: 'acme norte',
      status: 'expired',
      clientId,
      type: 'projects',
      page: 2,
      pageSize: 20,
    })
    const { url, init } = lastCall()

    expect(result.items[0]?.folio).toBe('ACME_00001')
    expect(result.items[0]?.status).toBe('draft')
    expect(result.total).toBe(21)
    expect(url).toBe(
      `http://api.test/api/v1/quotes?q=acme+norte&status=expired&clientId=${clientId}&type=projects&page=2&pageSize=20`,
    )
    expect(url).not.toContain('secret-token')
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer secret-token')
  })

  it('omits empty filters from the list query', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ items: [], page: 1, pageSize: 20, total: 0 }))

    await repository.list({ q: '   ', page: 1, pageSize: 20 })

    expect(lastCall().url).toBe('http://api.test/api/v1/quotes?page=1&pageSize=20')
  })

  it('creates a draft and reads the detail envelope', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ quote: detail }, 201))

    const payload: CreateQuotePayload = {
      clientId,
      type: 'services_material',
      projectName: 'Sensor de nivel',
      requestedByName: 'María López',
      requestedByEmail: 'maria@acme.example',
      attentionTo: 'Departamento de Compras',
      currency: 'MXN',
      includeVat: true,
      vatRate: '0.1600',
      items: [{ description: 'Diseño de PCB, 4 capas', quantity: '2.0000', unitPrice: '1500.5000' }],
    }

    const created = await repository.create(payload)
    const { url, init } = lastCall()

    expect(created.folio).toBe('ACME_00001')
    expect(created.items[0]?.lineTotal).toBe('3001.00')
    expect(created.notes).toBe('Precios en moneda de la cotización.')
    expect(created.createdBy).toEqual({ id: userId, name: 'Ada Admin' })
    expect(created.sentBy).toBeNull()
    expect(url).toBe('http://api.test/api/v1/quotes')
    expect(init.method).toBe('POST')
    expect(JSON.parse(String(init.body))).toEqual(payload)
    expect(url).not.toContain('secret-token')
  })

  it('patches a draft with the row version and propagates a version conflict', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () =>
      jsonResponse(
        {
          error: {
            code: 'QUOTE_VERSION_CONFLICT',
            message: 'The quote was updated by someone else',
            details: [{ path: 'version', message: 'The quote was updated by someone else' }],
          },
        },
        409,
      ),
    )

    await expect(
      repository.update(quoteId, {
        type: 'projects',
        projectName: 'Sensor de nivel rev 2',
        requestedByContactId: null,
        attentionTo: 'Departamento de Compras',
        currency: 'MXN',
        exchangeRate: null,
        deliveryTime: null,
        validUntil: null,
        notes: null,
        includeVat: true,
        vatRate: '0.1600',
        items: [],
        version: 'AAAAAAAAAAE=',
      }),
    ).rejects.toMatchObject({
      status: 409,
      code: 'QUOTE_VERSION_CONFLICT',
      details: [{ path: 'version', message: 'The quote was updated by someone else' }],
    })

    const { url, init } = lastCall()

    expect(url).toBe(`http://api.test/api/v1/quotes/${quoteId}`)
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(String(init.body)).version).toBe('AAAAAAAAAAE=')
  })

  it('deletes a draft with an empty 204 body', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => new Response(null, { status: 204 }))

    await expect(repository.remove(quoteId)).resolves.toBeUndefined()

    const { url, init } = lastCall()

    expect(url).toBe(`http://api.test/api/v1/quotes/${quoteId}`)
    expect(init.method).toBe('DELETE')
  })

  it('copies, sends, accepts, rejects, and reverts with the documented paths', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ quote: detail }))

    await repository.copy(quoteId)
    expect(lastCall().url).toBe(`http://api.test/api/v1/quotes/${quoteId}/copy`)
    expect(lastCall().init.method).toBe('POST')
    expect(lastCall().init.body).toBeUndefined()

    await repository.send(quoteId, { version: 'AAAAAAAAAAE=' })
    expect(lastCall().url).toBe(`http://api.test/api/v1/quotes/${quoteId}/send`)
    expect(JSON.parse(String(lastCall().init.body))).toEqual({ version: 'AAAAAAAAAAE=' })

    await repository.accept(quoteId, { version: 'AAAAAAAAAAI=' })
    expect(lastCall().url).toBe(`http://api.test/api/v1/quotes/${quoteId}/accept`)

    await repository.reject(quoteId, {})
    expect(lastCall().url).toBe(`http://api.test/api/v1/quotes/${quoteId}/reject`)
    expect(JSON.parse(String(lastCall().init.body))).toEqual({})

    await repository.revertToDraft(quoteId, { version: 'AAAAAAAAAAE=' })
    expect(lastCall().url).toBe(`http://api.test/api/v1/quotes/${quoteId}/revert-to-draft`)
  })

  it('rejects a detail envelope that drops the line items', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ quote }))

    await expect(repository.get(quoteId)).rejects.toMatchObject({ code: 'invalid_response' })
  })

  it('reads a live actor name and a missing user as name null', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () =>
      jsonResponse({
        quote: {
          ...detail,
          status: 'sent',
          sentAt: '2026-10-08T18:30:00.000Z',
          sentByUserId: userId,
          sentBy: { id: userId, name: 'Brayan Olivares' },
          updatedBy: { id: userId, name: null },
        },
      }),
    )

    const loaded = await repository.get(quoteId)

    expect(loaded.sentBy).toEqual({ id: userId, name: 'Brayan Olivares' })
    expect(loaded.updatedBy).toEqual({ id: userId, name: null })
    expect(loaded.acceptedBy).toBeNull()
  })

  it('rejects a quote that omits an actor or returns a name that is not text', async () => {
    accessToken.save('secret-token', 3600)
    const { sentBy: _sentBy, ...withoutSentBy } = quote
    installFetch(async () => jsonResponse({ items: [withoutSentBy], page: 1, pageSize: 20, total: 1 }))

    await expect(repository.list({ page: 1, pageSize: 20 })).rejects.toMatchObject({ code: 'invalid_response' })

    installFetch(async () =>
      jsonResponse({
        items: [{ ...quote, createdBy: { id: userId } }],
        page: 1,
        pageSize: 20,
        total: 1,
      }),
    )

    await expect(repository.list({ page: 1, pageSize: 20 })).rejects.toMatchObject({ code: 'invalid_response' })
  })
})
