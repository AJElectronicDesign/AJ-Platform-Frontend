import { QUOTE_MAX_ITEMS, type QuoteLineForm } from '@/features/quotes/domain/quote'
import { formatMoney } from '@/features/quotes/presentation/format'
import { quoteFieldId } from '@/features/quotes/presentation/messages'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/utils/cn'

function newLine(): QuoteLineForm {
  return {
    key: crypto.randomUUID(),
    description: '',
    quantity: '',
    unitPrice: '',
  }
}

export function QuoteItemsEditor({
  items,
  currency,
  lineTotals,
  errors,
  disabled,
  onChange,
}: {
  items: QuoteLineForm[]
  currency: string
  lineTotals: readonly (string | null)[]
  errors: Record<string, string>
  disabled?: boolean
  onChange: (items: QuoteLineForm[]) => void
}) {
  const { t } = useI18n()
  const copy = t.quotes.form
  const itemsError = errors.items

  function update(index: number, patch: Partial<QuoteLineForm>) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)))
  }

  function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    const current = items[index]
    const swap = items[nextIndex]

    if (!current || !swap || nextIndex < 0 || nextIndex >= items.length) {
      return
    }

    const next = items.slice()
    next[index] = swap
    next[nextIndex] = current
    onChange(next)
  }

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={AppTextStyles.h3}>{copy.items}</h2>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={disabled || items.length >= QUOTE_MAX_ITEMS}
          onClick={() => onChange([...items, newLine()])}
        >
          {copy.addItem}
        </Button>
      </div>
      {itemsError ? (
        <p id={quoteFieldId('items')} tabIndex={-1} className={cn('mt-3', AppTextStyles.caption, AppColorClasses.text.danger)}>
          {itemsError}
        </p>
      ) : null}
      {items.length === 0 ? (
        <p className={cn(AppTextStyles.bodySm, 'mt-4')}>{t.quotes.detail.itemsEmpty}</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">{copy.items}</caption>
            <thead className="border-b border-border text-ink-muted">
              <tr>
                <th scope="col" className="px-2 py-2 font-medium">{copy.description}</th>
                <th scope="col" className="w-32 px-2 py-2 font-medium">{copy.quantity}</th>
                <th scope="col" className="w-36 px-2 py-2 font-medium">{copy.unitPrice}</th>
                <th scope="col" className="w-36 px-2 py-2 font-medium">{copy.lineTotal}</th>
                <th scope="col" className="w-40 px-2 py-2 font-medium">
                  <span className="sr-only">{copy.items}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const descriptionError = errors[`items.${index}.description`]
                const quantityError = errors[`items.${index}.quantity`]
                const priceError = errors[`items.${index}.unitPrice`]

                return (
                  <tr key={item.key} className="border-b border-border align-top last:border-0">
                    <td className="px-2 py-3">
                      <Input
                        id={quoteFieldId(`items.${index}.description`)}
                        value={item.description}
                        maxLength={500}
                        disabled={disabled}
                        aria-invalid={Boolean(descriptionError)}
                        onChange={(event) => update(index, { description: event.target.value })}
                      />
                      {descriptionError ? <FieldError message={descriptionError} /> : null}
                    </td>
                    <td className="px-2 py-3">
                      <Input
                        id={quoteFieldId(`items.${index}.quantity`)}
                        inputMode="decimal"
                        value={item.quantity}
                        disabled={disabled}
                        aria-invalid={Boolean(quantityError)}
                        onChange={(event) => update(index, { quantity: event.target.value })}
                      />
                      {quantityError ? <FieldError message={quantityError} /> : null}
                    </td>
                    <td className="px-2 py-3">
                      <Input
                        id={quoteFieldId(`items.${index}.unitPrice`)}
                        inputMode="decimal"
                        value={item.unitPrice}
                        disabled={disabled}
                        aria-invalid={Boolean(priceError)}
                        onChange={(event) => update(index, { unitPrice: event.target.value })}
                      />
                      {priceError ? <FieldError message={priceError} /> : null}
                    </td>
                    <td className="px-2 py-3 pt-5 font-medium text-ink">
                      {formatMoney(lineTotals[index], currency, t.quotes.detail.none)}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex flex-wrap gap-1">
                        <Button type="button" size="sm" variant="ghost" disabled={disabled || index === 0} onClick={() => move(index, -1)}>
                          {copy.moveUp}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={disabled || index === items.length - 1}
                          onClick={() => move(index, 1)}
                        >
                          {copy.moveDown}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={disabled}
                          onClick={() => onChange(items.filter((line) => line.key !== item.key))}
                        >
                          {copy.removeItem}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function FieldError({ message }: { message: string }) {
  return <p className={cn('mt-1', AppTextStyles.caption, AppColorClasses.text.danger)}>{message}</p>
}
