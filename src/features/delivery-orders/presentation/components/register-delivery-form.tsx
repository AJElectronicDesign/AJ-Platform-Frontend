import { useEffect, useMemo, useState } from 'react'
import { canRegisterDelivery, type CreateDeliveryPayload, type DeliveryOrderDetail } from '@/features/delivery-orders/domain/delivery-order'
import { compareQuantity, mexicoCityToday } from '@/features/delivery-orders/domain/progress'
import {
  pendingQuantityInput,
  previewDeliveryTotals,
  validateDeliveryForm,
  type DeliveryFormLine,
  type DeliveryFormValues,
} from '@/features/delivery-orders/domain/validation'
import { formatDecimal, formatMoney } from '@/features/delivery-orders/presentation/format'
import { deliveryFormFieldErrors } from '@/features/delivery-orders/presentation/messages'
import { AreaField, TextField } from '@/features/clients/presentation/components/form-field'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { vatRateToPercent } from '@/features/quotes/domain/money'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/utils/cn'

function positivePending(value: string): boolean {
  try {
    return compareQuantity(value, '0') > 0
  } catch {
    return false
  }
}

function initialValues(order: DeliveryOrderDetail): DeliveryFormValues {
  return {
    deliveryDate: mexicoCityToday(),
    receivedBy: order.requestedByName ?? '',
    notes: '',
    overrideAddress: false,
    country: order.address.country,
    state: order.address.state ?? '',
    city: order.address.city ?? '',
    street: order.address.street ?? '',
    postalCode: order.address.postalCode ?? '',
    lines: order.lines
      .slice()
      .sort((left, right) => left.position - right.position)
      .filter((line) => positivePending(line.quantityPending))
      .map((line) => ({
        orderItemId: line.id,
        quantity: '',
        pending: line.quantityPending,
        unitPrice: line.unitPrice,
      })),
  }
}

export function RegisterDeliveryForm({
  order,
  pending,
  serverErrors,
  lineErrors,
  banner,
  onSubmit,
}: {
  order: DeliveryOrderDetail
  pending: boolean
  serverErrors: Record<string, string>
  lineErrors: Record<string, string>
  banner: string | null
  onSubmit: (payload: CreateDeliveryPayload) => void
}) {
  const { t } = useI18n()
  const copy = t.deliveryOrders.deliver
  const detail = t.deliveryOrders.detail
  const [values, setValues] = useState<DeliveryFormValues>(() => initialValues(order))
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})
  const [localLineErrors, setLocalLineErrors] = useState<Record<string, string>>({})
  const [dismissedLineErrors, setDismissedLineErrors] = useState<Record<string, boolean>>({})
  const enabled = canRegisterDelivery(order.status)
  const errors = { ...localErrors, ...serverErrors }
  const rowErrors = { ...localLineErrors, ...lineErrors }

  useEffect(() => {
    setDismissedLineErrors({})
  }, [lineErrors])
  const lineFacts = useMemo(() => {
    return new Map(order.lines.map((line) => [line.id, line]))
  }, [order.lines])
  const preview = previewDeliveryTotals(values.lines, order.includeVat, order.vatRate)
  const vatLabel = order.includeVat ? `${copy.vat} (${vatRateToPercent(order.vatRate)}%)` : copy.noVat

  function setLineQuantity(orderItemId: string, quantity: string) {
    setValues((current) => ({
      ...current,
      lines: current.lines.map((line) => (line.orderItemId === orderItemId ? { ...line, quantity } : line)),
    }))
    setLocalLineErrors((current) => {
      if (!current[orderItemId]) {
        return current
      }

      const next = { ...current }
      delete next[orderItemId]
      return next
    })
    setDismissedLineErrors((current) => ({ ...current, [orderItemId]: true }))
  }

  function fillPending() {
    setValues((current) => ({
      ...current,
      lines: current.lines.map((line) => ({ ...line, quantity: pendingQuantityInput(line.pending) })),
    }))
    setLocalLineErrors({})
  }

  function submit() {
    const result = validateDeliveryForm(values)

    if (!result.ok) {
      const fieldErrors = deliveryFormFieldErrors(t.deliveryOrders.validation, result.issues)
      const nextLineErrors: Record<string, string> = {}

      for (const issue of result.issues) {
        if (issue.orderItemId && fieldErrors[issue.path]) {
          nextLineErrors[issue.orderItemId] = fieldErrors[issue.path] ?? ''
        }
      }

      setLocalErrors(fieldErrors)
      setLocalLineErrors(nextLineErrors)
      return
    }

    setLocalErrors({})
    setLocalLineErrors({})
    onSubmit(result.payload)
  }

  return (
    <form
      className="mt-6 space-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        if (enabled) {
          submit()
        }
      }}
    >
      {banner ? <StatusBanner>{banner}</StatusBanner> : null}
      {!enabled ? <StatusBanner>{copy.disabled}</StatusBanner> : null}
      <fieldset disabled={!enabled || pending} className="space-y-6 disabled:opacity-70">
        <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="delivery-date"
              label={copy.deliveryDate}
              type="date"
              value={values.deliveryDate}
              error={errors.deliveryDate}
              onChange={(event) => setValues((current) => ({ ...current, deliveryDate: event.target.value }))}
            />
            <TextField
              id="delivery-receivedBy"
              label={copy.receivedBy}
              hint={copy.receivedByHint}
              value={values.receivedBy}
              maxLength={200}
              error={errors.receivedBy}
              onChange={(event) => setValues((current) => ({ ...current, receivedBy: event.target.value }))}
            />
          </div>
          <div className="mt-4">
            <AreaField
              id="delivery-notes"
              label={copy.notes}
              value={values.notes}
              maxLength={2000}
              error={errors.notes}
              onChange={(event) => setValues((current) => ({ ...current, notes: event.target.value }))}
            />
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={values.overrideAddress}
              onChange={(event) => setValues((current) => ({ ...current, overrideAddress: event.target.checked }))}
            />
            {copy.overrideAddress}
          </label>
          {values.overrideAddress ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField
                id="delivery-address-country"
                label={copy.country}
                value={values.country}
                maxLength={2}
                error={errors['address.country']}
                onChange={(event) => setValues((current) => ({ ...current, country: event.target.value.toUpperCase() }))}
              />
              <TextField
                id="delivery-address-postalCode"
                label={copy.postalCode}
                value={values.postalCode}
                maxLength={10}
                error={errors['address.postalCode']}
                onChange={(event) => setValues((current) => ({ ...current, postalCode: event.target.value }))}
              />
              <TextField
                id="delivery-address-state"
                label={copy.state}
                value={values.state}
                maxLength={120}
                error={errors['address.state']}
                onChange={(event) => setValues((current) => ({ ...current, state: event.target.value }))}
              />
              <TextField
                id="delivery-address-city"
                label={copy.city}
                value={values.city}
                maxLength={120}
                error={errors['address.city']}
                onChange={(event) => setValues((current) => ({ ...current, city: event.target.value }))}
              />
              <TextField
                id="delivery-address-street"
                className="sm:col-span-2"
                label={copy.street}
                value={values.street}
                maxLength={500}
                error={errors['address.street']}
                onChange={(event) => setValues((current) => ({ ...current, street: event.target.value }))}
              />
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className={AppTextStyles.h3}>{copy.lines}</h2>
            <Button type="button" variant="secondary" size="sm" onClick={fillPending} disabled={values.lines.length === 0}>
              {copy.fillPending}
            </Button>
          </div>
          {errors.lines ? <p className={cn(AppTextStyles.caption, 'mt-3 text-red-700')}>{errors.lines}</p> : null}
          {values.lines.length === 0 ? <p className={cn(AppTextStyles.bodySm, 'mt-4')}>{copy.noPending}</p> : null}
          <div className="mt-4 space-y-4">
            {values.lines.map((line) => (
              <DeliveryLineRow
                key={line.orderItemId}
                line={line}
                description={lineFacts.get(line.orderItemId)?.description ?? detail.none}
                ordered={lineFacts.get(line.orderItemId)?.quantityOrdered ?? line.pending}
                error={dismissedLineErrors[line.orderItemId] ? undefined : rowErrors[line.orderItemId]}
                quantityLabel={copy.quantity}
                orderedLabel={copy.ordered}
                pendingLabel={copy.pending}
                maxHint={copy.maxHint}
                onChange={setLineQuantity}
              />
            ))}
          </div>
        </section>

        <aside className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h2 className={AppTextStyles.h3}>{copy.preview}</h2>
          <p className={cn(AppTextStyles.caption, 'mt-2')}>{copy.previewHint}</p>
          <dl className="mt-4 space-y-3">
            <PreviewRow label={copy.subtotal} value={formatMoney(preview.subtotal, order.currency, detail.none)} />
            <PreviewRow label={vatLabel} value={formatMoney(preview.vatAmount, order.currency, detail.none)} />
            <div className="flex items-baseline justify-between gap-3 border-t border-border pt-3">
              <dt className={AppTextStyles.bodyMd}>{copy.total}</dt>
              <dd className="text-lg font-bold tracking-tight text-ink">
                {formatMoney(preview.total, order.currency, detail.none)}
              </dd>
            </div>
          </dl>
        </aside>

        <div className="flex justify-end">
          <Button type="submit" disabled={!enabled || pending || values.lines.length === 0}>
            {pending ? copy.submitting : copy.submit}
          </Button>
        </div>
      </fieldset>
    </form>
  )
}

function DeliveryLineRow({
  line,
  description,
  ordered,
  error,
  quantityLabel,
  orderedLabel,
  pendingLabel,
  maxHint,
  onChange,
}: {
  line: DeliveryFormLine
  description: string
  ordered: string
  error?: string
  quantityLabel: string
  orderedLabel: string
  pendingLabel: string
  maxHint: string
  onChange: (orderItemId: string, quantity: string) => void
}) {
  const inputId = `delivery-line-${line.orderItemId}`
  const hint = maxHint.replace('{pending}', formatDecimal(line.pending))

  return (
    <div className="grid gap-3 border-b border-border pb-4 last:border-0 sm:grid-cols-[minmax(0,1.4fr)_8rem_8rem_10rem]">
      <div>
        <p className={AppTextStyles.bodyMd}>{description}</p>
      </div>
      <p className={AppTextStyles.bodySm}>
        <span className={AppTextStyles.caption}>{orderedLabel}</span>
        <span className="mt-1 block">{formatDecimal(ordered)}</span>
      </p>
      <p className={AppTextStyles.bodySm}>
        <span className={AppTextStyles.caption}>{pendingLabel}</span>
        <span className="mt-1 block">{formatDecimal(line.pending)}</span>
      </p>
      <label className="block space-y-2" htmlFor={inputId}>
        <span className={AppTextStyles.label}>{quantityLabel}</span>
        <Input
          id={inputId}
          inputMode="decimal"
          value={line.quantity}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
          onChange={(event) => onChange(line.orderItemId, event.target.value)}
        />
        <span id={`${inputId}-hint`} className={AppTextStyles.caption}>
          {hint}
        </span>
        {error ? (
          <span id={`${inputId}-error`} className={cn(AppTextStyles.caption, 'text-red-700')}>
            {error}
          </span>
        ) : null}
      </label>
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={AppTextStyles.bodySm}>{label}</dt>
      <dd className={AppTextStyles.bodyMd}>{value}</dd>
    </div>
  )
}
