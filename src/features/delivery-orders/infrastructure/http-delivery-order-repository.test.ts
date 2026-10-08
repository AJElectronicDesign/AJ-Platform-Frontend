import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpDeliveryOrderRepository } from '@/features/delivery-orders/infrastructure/http-delivery-order-repository'
import { accessToken } from '@/shared/infrastructure/http/access-token'

const repository = new HttpDeliveryOrderRepository()

const orderId = 'a1b2c3d4-e5f6-4789-8012-3456789abcde'
const clientId = '3f1c2a4e-7b9d-4e6a-8c1f-2d4b6a8e0c11'
const quoteId = '9c0b1a2e-3d4f-5a6b-7c8d-9e0f1a2b3c4d'
const userId = '6b1d9a22-0c44-4e1a-9a55-1d2e3f4a5b6c'
const lineId = '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d'
const deliveryId = 'c1d2e3f4-a5b6-4789-8012-3456789abcde'

const order = {
  id: orderId,
  clientId,
  sourceQuoteId: quoteId,
  folio: 'ACME_00001',
  clientPoNumber: 'OC-100',
  status: 'partial',
  priority: 'high',
  startDate: '2026-10-01',
  dueDate: '2026-10-20',
  currency: 'MXN',
  certificatePrefix: 'ACME',
  progress: { ordered: '2.0000', delivered: '1.0000' },
  deliveryCount: 1,
  cancelledAt: null,
  cancelledByUserId: null,
  cancelledBy: null,
  createdByUserId: userId,
  createdBy: { id: userId, name: 'Ada Admin' },
  updatedByUserId: userId,
  updatedBy: { id: userId, name: null },
  createdAt: '2026-10-07T15:00:00.000Z',
  updatedAt: '2026-10-08T15:00:00.000Z',
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
  ...order,
  address: {
    country: 'MX',
    state: 'Jalisco',
    city: 'Guadalajara',
    street: 'Av. Siempre Viva 1',
    postalCode: '44100',
  },
  requestedByName: 'María López',
  requestedByEmail: 'maria@acme.example',
  includeVat: true,
  vatRate: '0.1600',
  notes: null,
  subtotal: '20.00',
  vatAmount: '3.20',
  total: '23.20',
  lines: [
    {
      id: lineId,
      position: 1,
      description: 'Sensor',
      quantityOrdered: '2.0000',
      quantityDelivered: '1.0000',
      quantityPending: '1.0000',
      unitPrice: '10.0000',
      lineTotal: '20.00',
      sourceQuoteItemId: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
    },
  ],
  certificates: [
    {
      id: deliveryId,
      folio: 'ACME00001',
      deliveryDate: '2026-10-08',
      receivedBy: 'María López',
      senderUserId: userId,
      sender: { id: userId, name: 'Ada Admin' },
      subtotal: '10.00',
      vatAmount: '1.60',
      total: '11.60',
      createdAt: '2026-10-08T15:00:00.000Z',
    },
  ],
}

const delivery = {
  id: deliveryId,
  deliveryOrderId: orderId,
  clientId,
  folio: 'ACME00001',
  certificatePrefix: 'ACME',
  deliveryDate: '2026-10-08',
  address: detail.address,
  receivedBy: 'María López',
  senderUserId: userId,
  sender: { id: userId, name: 'Ada Admin' },
  notes: 'Entrega parcial',
  currency: 'MXN',
  includeVat: true,
  vatRate: '0.1600',
  subtotal: '10.00',
  vatAmount: '1.60',
  total: '11.60',
  createdByUserId: userId,
  createdBy: { id: userId, name: 'Ada Admin' },
  updatedByUserId: userId,
  updatedBy: { id: userId, name: 'Ada Admin' },
  createdAt: '2026-10-08T15:00:00.000Z',
  updatedAt: '2026-10-08T15:00:00.000Z',
  version: 'AAAAAAAAAAI=',
  lines: [
    {
      id: 'd1e2f3a4-b5c6-4789-8012-3456789abcde',
      orderItemId: lineId,
      position: 1,
      description: 'Sensor',
      quantity: '1.0000',
      unitPrice: '10.0000',
      lineTotal: '10.00',
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

describe('HttpDeliveryOrderRepository', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    accessToken.clear()
  })

  it('lists orders with search, status, client, and pagination', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ items: [order], page: 2, pageSize: 20, total: 21 }))

    const result = await repository.list({
      q: 'acme norte',
      status: 'partial',
      clientId,
      page: 2,
      pageSize: 20,
    })
    const { url, init } = lastCall()

    expect(result.items[0]?.folio).toBe('ACME_00001')
    expect(result.items[0]?.progress).toEqual({ ordered: '2.0000', delivered: '1.0000' })
    expect(result.items[0]?.updatedBy).toEqual({ id: userId, name: null })
    expect(result.total).toBe(21)
    expect(url).toBe(
      `http://api.test/api/v1/delivery-orders?q=acme+norte&status=partial&clientId=${clientId}&page=2&pageSize=20`,
    )
    expect(init.method ?? 'GET').toBe('GET')
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer secret-token')
    expect(url).not.toContain('secret-token')
  })

  it('loads an order detail envelope', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ order: detail }))

    const loaded = await repository.get(orderId)

    expect(lastCall().url).toBe(`http://api.test/api/v1/delivery-orders/${orderId}`)
    expect(loaded.lines[0]?.quantityPending).toBe('1.0000')
    expect(loaded.certificates[0]?.sender).toEqual({ id: userId, name: 'Ada Admin' })
    expect(loaded.address.country).toBe('MX')
  })

  it('patches the header with version and cancels with the documented path', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ order: detail }))

    await repository.update(orderId, {
      clientPoNumber: 'OC-200',
      dueDate: null,
      certificatePrefix: 'ACME',
      version: 'AAAAAAAAAAE=',
    })

    expect(lastCall().url).toBe(`http://api.test/api/v1/delivery-orders/${orderId}`)
    expect(lastCall().init.method).toBe('PATCH')
    expect(JSON.parse(String(lastCall().init.body))).toEqual({
      clientPoNumber: 'OC-200',
      dueDate: null,
      certificatePrefix: 'ACME',
      version: 'AAAAAAAAAAE=',
    })

    await repository.cancel(orderId, { version: 'AAAAAAAAAAE=' })

    expect(lastCall().url).toBe(`http://api.test/api/v1/delivery-orders/${orderId}/cancel`)
    expect(lastCall().init.method).toBe('POST')
    expect(JSON.parse(String(lastCall().init.body))).toEqual({ version: 'AAAAAAAAAAE=' })
  })

  it('creates a delivery with decimal quantity strings and reads the certificate', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ delivery }, 201))

    const created = await repository.createDelivery(orderId, {
      deliveryDate: '2026-10-08',
      receivedBy: 'María López',
      notes: null,
      lines: [{ orderItemId: lineId, quantity: '1.0000' }],
    })

    expect(lastCall().url).toBe(`http://api.test/api/v1/delivery-orders/${orderId}/deliveries`)
    expect(lastCall().init.method).toBe('POST')
    expect(JSON.parse(String(lastCall().init.body))).toEqual({
      deliveryDate: '2026-10-08',
      receivedBy: 'María López',
      notes: null,
      lines: [{ orderItemId: lineId, quantity: '1.0000' }],
    })
    expect(created.folio).toBe('ACME00001')
    expect(created.lines[0]?.quantity).toBe('1.0000')

    installFetch(async () => jsonResponse({ delivery }))
    const loaded = await repository.getDelivery(orderId, deliveryId)

    expect(lastCall().url).toBe(
      `http://api.test/api/v1/delivery-orders/${orderId}/deliveries/${deliveryId}`,
    )
    expect(loaded.sender).toEqual({ id: userId, name: 'Ada Admin' })
    expect(loaded.notes).toBe('Entrega parcial')
  })

  it('rejects a detail that drops the lines', async () => {
    accessToken.save('secret-token', 3600)
    installFetch(async () => jsonResponse({ order }))

    await expect(repository.get(orderId)).rejects.toMatchObject({ code: 'invalid_response' })
  })
})
