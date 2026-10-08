import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { DeliveryOrderStatus } from '@/features/delivery-orders/domain/delivery-order'
import { DeliveryOrderStatusBadge } from '@/features/delivery-orders/presentation/components/delivery-order-status-badge'
import { I18nProvider } from '@/shared/i18n'

const cases: { status: DeliveryOrderStatus; label: string; className: string }[] = [
  { status: 'pending', label: 'Pendiente', className: 'bg-red-50' },
  { status: 'partial', label: 'Parcial', className: 'bg-orange-50' },
  { status: 'completed', label: 'Completada', className: 'bg-emerald-50' },
  { status: 'cancelled', label: 'Cancelada', className: 'bg-zinc-100' },
]

describe('DeliveryOrderStatusBadge', () => {
  it.each(cases)('renders $status as $label with the semaphore color', ({ status, label, className }) => {
    window.localStorage.setItem('aj-locale', 'es')
    render(
      <I18nProvider>
        <DeliveryOrderStatusBadge status={status} />
      </I18nProvider>,
    )

    const chip = screen.getByText(label)

    expect(chip.className).toContain(className)
  })
})
