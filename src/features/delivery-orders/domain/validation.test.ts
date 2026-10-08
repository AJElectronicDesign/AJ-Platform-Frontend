import { describe, expect, it } from 'vitest'
import type { DeliveryOrderDetail } from '@/features/delivery-orders/domain/delivery-order'
import {
  mapLineQuantityErrors,
  orderToHeaderForm,
  pendingQuantityInput,
  previewDeliveryTotals,
  validateDeliveryForm,
  validateOrderPatch,
} from '@/features/delivery-orders/domain/validation'

const lineId = '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d'
const otherLineId = '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e'

function order(overrides: Partial<DeliveryOrderDetail> = {}): DeliveryOrderDetail {
  return {
    id: 'a1b2c3d4-e5f6-4789-8012-3456789abcde',
    clientId: '3f1c2a4e-7b9d-4e6a-8c1f-2d4b6a8e0c11',
    sourceQuoteId: '9c0b1a2e-3d4f-5a6b-7c8d-9e0f1a2b3c4d',
    folio: 'ACME_00001',
    clientPoNumber: null,
    status: 'pending',
    priority: 'medium',
    startDate: '2026-10-01',
    dueDate: '2026-10-20',
    currency: 'MXN',
    certificatePrefix: 'ACME',
    progress: { ordered: '2.0000', delivered: '0.0000' },
    deliveryCount: 0,
    cancelledAt: null,
    cancelledByUserId: null,
    cancelledBy: null,
    createdByUserId: null,
    createdBy: null,
    updatedByUserId: null,
    updatedBy: null,
    createdAt: '2026-10-07T15:00:00.000Z',
    updatedAt: '2026-10-07T15:00:00.000Z',
    version: 'AAAAAAAAAAE=',
    client: {
      id: '3f1c2a4e-7b9d-4e6a-8c1f-2d4b6a8e0c11',
      legalName: 'Acme Industrial SA de CV',
      tradeName: 'Acme',
      rfc: 'ABC0102031A2',
      quotePrefix: 'ACME',
    },
    address: { country: 'MX', state: 'Jalisco', city: 'Guadalajara', street: 'Av. Siempre Viva 1', postalCode: '44100' },
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
        quantityDelivered: '0.0000',
        quantityPending: '2.0000',
        unitPrice: '10.0000',
        lineTotal: '20.00',
        sourceQuoteItemId: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      },
    ],
    certificates: [],
    ...overrides,
  }
}

describe('validateOrderPatch', () => {
  it('sends version and only the fields that changed', () => {
    const current = order()
    const result = validateOrderPatch(
      { ...orderToHeaderForm(current), clientPoNumber: 'OC-100', priority: 'high' },
      current,
    )

    expect(result).toEqual({
      ok: true,
      payload: { version: 'AAAAAAAAAAE=', clientPoNumber: 'OC-100', priority: 'high' },
    })
  })

  it('rejects a due date before the start date', () => {
    const current = order()
    const result = validateOrderPatch({ ...orderToHeaderForm(current), dueDate: '2026-09-01' }, current)

    expect(result.ok).toBe(false)

    if (!result.ok) {
      expect(result.issues).toContainEqual({ path: 'dueDate', key: 'dueBeforeStart' })
    }
  })

  it('rejects an invalid certificate prefix and omits it once certificates exist', () => {
    const current = order()
    const invalid = validateOrderPatch({ ...orderToHeaderForm(current), certificatePrefix: '1' }, current)

    expect(invalid.ok).toBe(false)

    if (!invalid.ok) {
      expect(invalid.issues).toContainEqual({ path: 'certificatePrefix', key: 'certificatePrefix' })
    }

    const locked = order({
      deliveryCount: 1,
      certificates: [
        {
          id: 'c1d2e3f4-a5b6-4789-8012-3456789abcde',
          folio: 'ACME00001',
          deliveryDate: '2026-10-08',
          receivedBy: 'María López',
          senderUserId: '6b1d9a22-0c44-4e1a-9a55-1d2e3f4a5b6c',
          sender: { id: '6b1d9a22-0c44-4e1a-9a55-1d2e3f4a5b6c', name: 'Ada' },
          subtotal: '10.00',
          vatAmount: '1.60',
          total: '11.60',
          createdAt: '2026-10-08T15:00:00.000Z',
        },
      ],
    })
    const skipped = validateOrderPatch(
      { ...orderToHeaderForm(locked), certificatePrefix: 'OTRO', notes: 'Entrega parcial' },
      locked,
    )

    expect(skipped).toEqual({
      ok: true,
      payload: { version: 'AAAAAAAAAAE=', notes: 'Entrega parcial' },
    })
  })

  it('reports no field issues when nothing changed', () => {
    const current = order()
    const result = validateOrderPatch(orderToHeaderForm(current), current)

    expect(result).toEqual({ ok: false, issues: [] })
  })
})

describe('validateDeliveryForm', () => {
  const base = {
    deliveryDate: '2026-10-08',
    receivedBy: 'María López',
    notes: '',
    overrideAddress: false,
    country: 'MX',
    state: '',
    city: '',
    street: '',
    postalCode: '',
  }

  it('sends only quantities greater than zero as canonical strings', () => {
    const result = validateDeliveryForm({
      ...base,
      lines: [
        { orderItemId: lineId, quantity: '', pending: '2.0000', unitPrice: '10.0000' },
        { orderItemId: otherLineId, quantity: '1.5', pending: '2.0000', unitPrice: '10.0000' },
        { orderItemId: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f', quantity: '0', pending: '1.0000', unitPrice: '10.0000' },
      ],
    })

    expect(result).toEqual({
      ok: true,
      payload: {
        deliveryDate: '2026-10-08',
        receivedBy: 'María López',
        notes: null,
        lines: [{ orderItemId: otherLineId, quantity: '1.5000' }],
      },
    })
  })

  it('maps a quantity above pending to lines.{i}.quantity', () => {
    const result = validateDeliveryForm({
      ...base,
      lines: [
        { orderItemId: lineId, quantity: '', pending: '2.0000', unitPrice: '10.0000' },
        { orderItemId: otherLineId, quantity: '1', pending: '4.0000', unitPrice: '10.0000' },
        { orderItemId: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f', quantity: '9', pending: '2.0000', unitPrice: '5.0000' },
      ],
    })

    expect(result.ok).toBe(false)

    if (!result.ok) {
      expect(result.issues).toContainEqual({
        path: 'lines.1.quantity',
        key: 'exceedsPending',
        orderItemId: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
      })
    }
  })

  it('requires at least one positive line', () => {
    const result = validateDeliveryForm({
      ...base,
      lines: [{ orderItemId: lineId, quantity: '', pending: '2.0000', unitPrice: '10.0000' }],
    })

    expect(result.ok).toBe(false)

    if (!result.ok) {
      expect(result.issues).toContainEqual({ path: 'lines', key: 'atLeastOneLine' })
    }
  })

  it('fills every pending quantity and previews subtotal, VAT, and total', () => {
    const lines = [
      {
        orderItemId: lineId,
        quantity: pendingQuantityInput('2.0000'),
        pending: '2.0000',
        unitPrice: '10.5000',
      },
    ]
    const result = validateDeliveryForm({ ...base, lines })

    expect(result.ok).toBe(true)
    expect(previewDeliveryTotals(lines, true, '0.1600')).toEqual({
      subtotal: '21.00',
      vatAmount: '3.36',
      total: '24.36',
    })
  })
})

describe('mapLineQuantityErrors', () => {
  it('attaches DELIVERY_QUANTITY_EXCEEDS_PENDING to the submitted line', () => {
    const byItem = mapLineQuantityErrors(
      {
        'lines.0.quantity': 'La cantidad supera lo pendiente por entregar (1.5000)',
        notes: 'Demasiado largo',
      },
      [otherLineId],
    )

    expect(byItem).toEqual({
      [otherLineId]: 'La cantidad supera lo pendiente por entregar (1.5000)',
    })
  })
})
