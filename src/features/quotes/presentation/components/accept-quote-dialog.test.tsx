import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AcceptQuoteDialog } from '@/features/quotes/presentation/components/accept-quote-dialog'
import { I18nProvider } from '@/shared/i18n'

function renderDialog(
  props: Partial<{
    pending: boolean
    clientPoError: string | null
    banner: string | null
    successHref: string | null
    onConfirm: (clientPoNumber: string | null) => void
  }> = {},
) {
  window.localStorage.setItem('aj-locale', 'es')
  const onConfirm = props.onConfirm ?? vi.fn()

  render(
    <MemoryRouter>
      <I18nProvider>
        <AcceptQuoteDialog
          open
          pending={props.pending ?? false}
          clientPoError={props.clientPoError ?? null}
          banner={props.banner ?? null}
          successHref={props.successHref ?? null}
          onConfirm={onConfirm}
          onClose={() => undefined}
        />
      </I18nProvider>
    </MemoryRouter>,
  )

  return { onConfirm }
}

describe('AcceptQuoteDialog', () => {
  it('sends the optional client PO number and treats a blank value as null', () => {
    const { onConfirm } = renderDialog()
    const input = screen.getByRole('textbox', { name: /Número de OC del cliente/ })

    expect(input.getAttribute('maxlength')).toBe('80')
    fireEvent.change(input, { target: { value: '  OC-100  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }))

    expect(onConfirm).toHaveBeenCalledWith('OC-100')
  })

  it('omits the purchase order when the field is empty', () => {
    const { onConfirm } = renderDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Aceptar' }))

    expect(onConfirm).toHaveBeenCalledWith(null)
  })

  it('shows a field error and a retry banner without accepting', () => {
    const { onConfirm } = renderDialog({
      clientPoError: 'Debe tener como máximo 80 caracteres',
      banner: 'Otro cambio está en curso. Intenta de nuevo.',
    })

    expect(screen.getByText('Debe tener como máximo 80 caracteres')).toBeTruthy()
    expect(screen.getByText('Otro cambio está en curso. Intenta de nuevo.')).toBeTruthy()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('shows a success link to the created delivery order', () => {
    renderDialog({ successHref: '/app/ordenes-de-entrega/order-1' })

    const link = screen.getByRole('link', { name: 'Ver orden de entrega' })

    expect(screen.getByRole('status').textContent).toContain('se creó la orden de entrega')
    expect(link.getAttribute('href')).toBe('/app/ordenes-de-entrega/order-1')
    expect(screen.queryByLabelText('Número de OC del cliente')).toBeNull()
  })
})