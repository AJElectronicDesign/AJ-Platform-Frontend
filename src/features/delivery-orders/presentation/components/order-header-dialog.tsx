import { useState } from 'react'
import {
  certificatePrefixLocked,
  isDeliveryPriority,
  type DeliveryOrderDetail,
  type PatchDeliveryOrderPayload,
} from '@/features/delivery-orders/domain/delivery-order'
import {
  orderToHeaderForm,
  validateOrderPatch,
  type OrderHeaderFormValues,
} from '@/features/delivery-orders/domain/validation'
import { orderPatchFieldErrors } from '@/features/delivery-orders/presentation/messages'
import { AreaField, SelectField, TextField } from '@/features/clients/presentation/components/form-field'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { useI18n } from '@/shared/i18n'
import { Button } from '@/shared/ui/button'
import { Dialog } from '@/shared/ui/dialog'

export function OrderHeaderDialog({
  open,
  order,
  pending,
  serverErrors,
  banner,
  onSubmit,
  onClose,
}: {
  open: boolean
  order: DeliveryOrderDetail
  pending: boolean
  serverErrors: Record<string, string>
  banner: string | null
  onSubmit: (payload: PatchDeliveryOrderPayload) => void
  onClose: () => void
}) {
  const { t } = useI18n()
  const copy = t.deliveryOrders.edit
  const [values, setValues] = useState<OrderHeaderFormValues>(() => orderToHeaderForm(order))
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})
  const [localBanner, setLocalBanner] = useState<string | null>(null)
  const prefixLocked = certificatePrefixLocked(order)
  const errors = { ...localErrors, ...serverErrors }

  function setField<Key extends keyof OrderHeaderFormValues>(key: Key, value: OrderHeaderFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }))
    setLocalBanner(null)
  }

  function submit() {
    const result = validateOrderPatch(values, order)

    if (!result.ok) {
      setLocalErrors(orderPatchFieldErrors(t.deliveryOrders.validation, result.issues))
      setLocalBanner(result.issues.length === 0 ? copy.noChanges : null)
      return
    }

    setLocalErrors({})
    setLocalBanner(null)
    onSubmit(result.payload)
  }

  return (
    <Dialog open={open} title={copy.title} onClose={onClose} closeLabel={t.deliveryOrders.closeDialog} className="max-w-3xl">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        {banner || localBanner ? <StatusBanner>{banner || localBanner}</StatusBanner> : null}
        <TextField
          id="order-clientPoNumber"
          label={copy.clientPo}
          hint={copy.clientPoHint}
          value={values.clientPoNumber}
          maxLength={80}
          error={errors.clientPoNumber}
          onChange={(event) => setField('clientPoNumber', event.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="order-startDate"
            label={copy.startDate}
            type="date"
            value={values.startDate}
            error={errors.startDate}
            onChange={(event) => setField('startDate', event.target.value)}
          />
          <TextField
            id="order-dueDate"
            label={copy.dueDate}
            hint={copy.dueHint}
            type="date"
            value={values.dueDate}
            error={errors.dueDate}
            onChange={(event) => setField('dueDate', event.target.value)}
          />
        </div>
        <SelectField
          id="order-priority"
          label={copy.priority}
          value={values.priority}
          error={errors.priority}
          onChange={(event) => setField('priority', event.target.value)}
        >
          {isDeliveryPriority(values.priority) ? null : <option value={values.priority} />}
          <option value="high">{t.deliveryOrders.priority.high}</option>
          <option value="medium">{t.deliveryOrders.priority.medium}</option>
          <option value="low">{t.deliveryOrders.priority.low}</option>
        </SelectField>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="order-address-country"
            label={copy.country}
            value={values.country}
            maxLength={2}
            error={errors['address.country']}
            onChange={(event) => setField('country', event.target.value.toUpperCase())}
          />
          <TextField
            id="order-address-postalCode"
            label={copy.postalCode}
            value={values.postalCode}
            maxLength={10}
            error={errors['address.postalCode']}
            onChange={(event) => setField('postalCode', event.target.value)}
          />
          <TextField
            id="order-address-state"
            label={copy.state}
            value={values.state}
            maxLength={120}
            error={errors['address.state']}
            onChange={(event) => setField('state', event.target.value)}
          />
          <TextField
            id="order-address-city"
            label={copy.city}
            value={values.city}
            maxLength={120}
            error={errors['address.city']}
            onChange={(event) => setField('city', event.target.value)}
          />
        </div>
        <TextField
          id="order-address-street"
          label={copy.street}
          value={values.street}
          maxLength={500}
          error={errors['address.street']}
          onChange={(event) => setField('street', event.target.value)}
        />
        <AreaField
          id="order-notes"
          label={copy.notes}
          value={values.notes}
          maxLength={2000}
          error={errors.notes}
          onChange={(event) => setField('notes', event.target.value)}
        />
        <TextField
          id="order-certificatePrefix"
          label={copy.certificatePrefix}
          hint={prefixLocked ? copy.certificatePrefixLocked : copy.certificatePrefixHint}
          value={values.certificatePrefix}
          maxLength={12}
          disabled={prefixLocked}
          error={errors.certificatePrefix}
          onChange={(event) => setField('certificatePrefix', event.target.value.toUpperCase())}
        />
        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={pending}>
            {copy.cancel}
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? copy.saving : copy.save}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
