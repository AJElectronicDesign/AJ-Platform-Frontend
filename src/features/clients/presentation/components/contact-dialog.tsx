import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { ContactFormInput } from '@/features/clients/domain/client'
import {
  CONTACT_FIELD_ORDER,
  clientFieldId,
  focusFirstField,
} from '@/features/clients/presentation/messages'
import { TextField } from '@/features/clients/presentation/components/form-field'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { Dialog } from '@/shared/ui/dialog'

export function ContactDialog({
  open,
  mode,
  initial,
  submitting,
  fieldErrors,
  banner,
  onSubmit,
  onClose,
}: {
  open: boolean
  mode: 'create' | 'edit'
  initial: ContactFormInput
  submitting: boolean
  fieldErrors: Record<string, string>
  banner: string | null
  onSubmit: (input: ContactFormInput) => void
  onClose: () => void
}) {
  const { t } = useI18n()
  const copy = t.clients.contactForm
  const [values, setValues] = useState(initial)
  const mounted = useRef(false)

  useEffect(() => {
    if (open) {
      setValues(initial)
    }
  }, [initial, open])

  useEffect(() => {
    if (!open) {
      mounted.current = false
      return
    }

    if (!mounted.current) {
      mounted.current = true
      return
    }

    if (!focusFirstField(CONTACT_FIELD_ORDER, fieldErrors) && banner) {
      document.getElementById('contact-form-banner')?.focus()
    }
  }, [banner, fieldErrors, open])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <Dialog
      open={open}
      title={mode === 'create' ? copy.createTitle : copy.editTitle}
      onClose={onClose}
      closeLabel={t.clients.closeDialog}
    >
      <form className="space-y-4" noValidate aria-busy={submitting} onSubmit={handleSubmit}>
        {banner ? <StatusBanner id="contact-form-banner">{banner}</StatusBanner> : null}
        <TextField
          id={clientFieldId('name')}
          name="name"
          label={copy.name}
          error={fieldErrors.name}
          value={values.name}
          maxLength={200}
          readOnly={submitting}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          required
        />
        <TextField
          id={clientFieldId('position')}
          name="position"
          label={copy.position}
          error={fieldErrors.position}
          value={values.position}
          maxLength={120}
          readOnly={submitting}
          onChange={(event) => setValues((current) => ({ ...current, position: event.target.value }))}
        />
        <TextField
          id={clientFieldId('email')}
          name="email"
          type="email"
          label={copy.email}
          error={fieldErrors.email}
          value={values.email}
          autoComplete="email"
          maxLength={320}
          readOnly={submitting}
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
        />
        <TextField
          id={clientFieldId('phone')}
          name="phone"
          label={copy.phone}
          hint={copy.phoneHint}
          error={fieldErrors.phone}
          value={values.phone}
          autoComplete="tel"
          maxLength={30}
          readOnly={submitting}
          onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))}
        />
        <label className="flex items-center gap-3" htmlFor={clientFieldId('isPrimary')}>
          <input
            id={clientFieldId('isPrimary')}
            name="isPrimary"
            type="checkbox"
            className="h-4 w-4 rounded border-border text-brand-700 focus-visible:ring-2 focus-visible:ring-brand-500"
            checked={values.isPrimary}
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.isPrimary)}
            aria-describedby={fieldErrors.isPrimary ? `${clientFieldId('isPrimary')}-error` : undefined}
            onChange={(event) =>
              setValues((current) => ({ ...current, isPrimary: event.target.checked }))
            }
          />
          <span className={AppTextStyles.label}>{copy.isPrimary}</span>
        </label>
        {fieldErrors.isPrimary ? (
          <p id={`${clientFieldId('isPrimary')}-error`} className="text-xs text-red-600">
            {fieldErrors.isPrimary}
          </p>
        ) : null}
        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            {copy.cancel}
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? copy.saving : copy.save}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
