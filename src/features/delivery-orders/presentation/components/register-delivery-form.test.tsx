import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { DeliveryOrderDetail } from '@/features/delivery-orders/domain/delivery-order'
import { RegisterDeliveryForm } from '@/features/delivery-orders/presentation/components/register-delivery-form'
import { I18nProvider } from '@/shared/i18n'

const lineId = '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d'

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

function renderForm(current: DeliveryOrderDetail) {
  window.localStorage.setItem('aj-locale', 'es')

  return render(
    <I18nProvider>
      <RegisterDeliveryForm
        order={current}
        pending={false}
        serverErrors={{}}
        lineErrors={{}}
        banner={null}
        onSubmit={() => undefined}
      />
    </I18nProvider>,
  )
}

describe('RegisterDeliveryForm', () => {
  it('refreshes pending quantities without clearing typed values', () => {
    const current = order()
    const view = renderForm(current)
    const quantity = screen.getByRole('textbox', { name: /Cantidad a entregar/ })
    const receivedBy = screen.getByRole('textbox', { name: /Recibió/ })

    fireEvent.change(quantity, { target: { value: '3' } })
    fireEvent.change(receivedBy, { target: { value: 'Ana Ruiz' } })

    const fresh = order({
      version: 'AAAAAAAAAAI=',
      lines: [{ ...current.lines[0]!, quantityPending: '1.5000', quantityDelivered: '0.5000' }],
    })

    view.rerender(
      <I18nProvider>
        <RegisterDeliveryForm
          order={fresh}
          pending={false}
          serverErrors={{}}
          lineErrors={{}}
          banner={null}
          onSubmit={() => undefined}
        />
      </I18nProvider>,
    )

    expect(screen.getByRole('textbox', { name: /Cantidad a entregar/ })).toHaveProperty('value', '3')
    expect(screen.getByRole('textbox', { name: /Recibió/ })).toHaveProperty('value', 'Ana Ruiz')
    expect(screen.getByText('Máximo 1.5000').textContent).toBe('Máximo 1.5000')
  })
})
