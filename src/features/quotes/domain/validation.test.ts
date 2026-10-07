import { describe, expect, it } from 'vitest'
import { emptyQuoteForm, type QuoteFormValues } from '@/features/quotes/domain/quote'
import { parseCreateQuote, parsePatchQuote } from '@/features/quotes/domain/validation'

const clientId = '3f1c2a4e-7b9d-4e6a-8c1f-2d4b6a8e0c11'
const contactId = '8a7b6c5d-4e3f-4a2b-8c1d-0e9f8a7b6c5d'

function form(overrides: Partial<QuoteFormValues> = {}): QuoteFormValues {
  return {
    ...emptyQuoteForm(clientId),
    type: 'services_material',
    currency: 'MXN',
    projectName: 'Sensor de nivel',
    ...overrides,
  }
}

describe('parseCreateQuote', () => {
  it('copies the contact and omits manual name and email', () => {
    const parsed = parseCreateQuote(
      form({
        requestedByContactId: contactId,
        requestedByName: 'No debe enviarse',
        requestedByEmail: 'no@example.com',
        items: [
          {
            key: 'a',
            description: 'Diseño de PCB, 4 capas',
            quantity: '2',
            unitPrice: '1500,5',
          },
          { key: 'blank', description: '  ', quantity: '', unitPrice: '' },
        ],
      }),
    )

    expect(parsed.ok).toBe(true)

    if (!parsed.ok) {
      return
    }

    expect(parsed.payload.requestedByContactId).toBe(contactId)
    expect(parsed.payload).not.toHaveProperty('requestedByName')
    expect(parsed.payload).not.toHaveProperty('requestedByEmail')
    expect(parsed.payload.vatRate).toBe('0.1600')
    expect(parsed.payload.attentionTo).toBe('Departamento de Compras')
    expect(parsed.payload.items).toEqual([
      {
        description: 'Diseño de PCB, 4 capas',
        quantity: '2.0000',
        unitPrice: '1500.5000',
      },
    ])
  })

  it('sends a manual requester and drops an empty exchange rate', () => {
    const parsed = parseCreateQuote(
      form({
        requestedByName: 'María López',
        requestedByEmail: 'maria@acme.example',
        exchangeRate: '',
      }),
    )

    expect(parsed.ok).toBe(true)

    if (!parsed.ok) {
      return
    }

    expect(parsed.payload.requestedByContactId).toBeNull()
    expect(parsed.payload.requestedByName).toBe('María López')
    expect(parsed.payload.requestedByEmail).toBe('maria@acme.example')
    expect(parsed.payload.exchangeRate).toBeNull()
    expect(parsed.payload.items).toEqual([])
  })

  it('reports the client, a non-positive quantity, and a bad email', () => {
    const parsed = parseCreateQuote(
      form({
        clientId: ' ',
        requestedByEmail: 'no-es-correo',
        items: [{ key: 'a', description: 'Pieza', quantity: '0', unitPrice: '10' }],
      }),
    )

    expect(parsed.ok).toBe(false)

    if (parsed.ok) {
      return
    }

    expect(parsed.issues.map((issue) => issue.path)).toEqual([
      'clientId',
      'requestedByEmail',
      'items.0.quantity',
    ])
  })
})

describe('parsePatchQuote', () => {
  it('replaces every line and sends the row version', () => {
    const parsed = parsePatchQuote(
      form({
        items: [{ key: 'a', description: 'Cable', quantity: '1.5', unitPrice: '10' }],
        vatPercent: '16.5',
        includeVat: false,
      }),
      'AAAAAAAAAAE=',
    )

    expect(parsed.ok).toBe(true)

    if (!parsed.ok) {
      return
    }

    expect(parsed.payload.version).toBe('AAAAAAAAAAE=')
    expect(parsed.payload.includeVat).toBe(false)
    expect(parsed.payload.vatRate).toBe('0.1650')
    expect(parsed.payload.items).toEqual([
      { description: 'Cable', quantity: '1.5000', unitPrice: '10.0000' },
    ])
  })
})

describe('documented quote constraints', () => {
  it('canonicalizes an exchange rate of 6 decimals and 100 line items', () => {
    const items = Array.from({ length: 100 }, (_, index) => ({
      key: String(index),
      description: index === 0 ? 'D'.repeat(500) : `Partida ${index + 1}`,
      quantity: index === 0 ? '1.25' : '0.0001',
      unitPrice: index === 0 ? '0' : '1',
    }))
    const parsed = parseCreateQuote(
      form({
        exchangeRate: '17.250000',
        projectName: 'P'.repeat(200),
        attentionTo: 'A'.repeat(200),
        deliveryTime: 'D'.repeat(200),
        notes: 'N'.repeat(2000),
        requestedByName: 'R'.repeat(200),
        requestedByEmail: `${'a'.repeat(308)}@example.com`,
        items,
      }),
    )

    expect(parsed.ok).toBe(true)

    if (!parsed.ok) {
      return
    }

    expect(parsed.payload.exchangeRate).toBe('17.250000')
    expect(parsed.payload.items).toHaveLength(100)
    expect(parsed.payload.items[0]).toEqual({
      description: 'D'.repeat(500),
      quantity: '1.2500',
      unitPrice: '0.0000',
    })
  })

  it('rejects extra decimals, a zero exchange rate, and text past the documented max lengths', () => {
    const parsed = parseCreateQuote(
      form({
        exchangeRate: '0',
        projectName: 'P'.repeat(201),
        attentionTo: 'A'.repeat(201),
        deliveryTime: 'D'.repeat(201),
        notes: 'N'.repeat(2001),
        requestedByName: 'R'.repeat(201),
        requestedByEmail: `${'a'.repeat(309)}@example.com`,
        items: [{ key: 'a', description: 'D'.repeat(501), quantity: '1.00001', unitPrice: '1e2' }],
      }),
    )

    expect(parsed.ok).toBe(false)

    if (parsed.ok) {
      return
    }

    expect(parsed.issues.map((issue) => issue.path)).toEqual([
      'projectName',
      'attentionTo',
      'deliveryTime',
      'notes',
      'exchangeRate',
      'requestedByName',
      'requestedByEmail',
      'items.0.description',
      'items.0.quantity',
      'items.0.unitPrice',
    ])
  })

  it('rejects a seventh exchange-rate decimal and a 101st line item', () => {
    const tooFine = parseCreateQuote(form({ exchangeRate: '17.2500001' }))
    const tooMany = parseCreateQuote(
      form({
        items: Array.from({ length: 101 }, (_, index) => ({
          key: String(index),
          description: `Partida ${index + 1}`,
          quantity: '1',
          unitPrice: '1',
        })),
      }),
    )

    expect(tooFine.ok).toBe(false)
    expect(tooMany.ok).toBe(false)

    if (tooFine.ok || tooMany.ok) {
      return
    }

    expect(tooFine.issues.map((issue) => issue.path)).toEqual(['exchangeRate'])
    expect(tooMany.issues.map((issue) => issue.path)).toEqual(['items'])
  })
})
