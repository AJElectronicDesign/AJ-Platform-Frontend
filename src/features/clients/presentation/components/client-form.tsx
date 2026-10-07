import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  catalogApplies,
  type ClientFormInput,
  type SatCatalog,
  type SatCatalogEntry,
} from '@/features/clients/domain/client'
import { normalizeRfc, parseRfc, type SatPersonType } from '@/features/clients/domain/rfc'
import {
  CLIENT_FIELD_ORDER,
  clientFieldId,
  focusFirstField,
} from '@/features/clients/presentation/messages'
import { AreaField, SelectField, TextField } from '@/features/clients/presentation/components/form-field'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'

function optionsFor(
  entries: readonly SatCatalogEntry[],
  personType: SatPersonType | null,
  selected: string,
): SatCatalogEntry[] {
  return entries.filter(
    (entry) => !personType || catalogApplies(entry, personType) || entry.code === selected,
  )
}

export function ClientForm({
  initial,
  catalog,
  submitting,
  fieldErrors,
  banner,
  bannerAction,
  onSubmit,
  onCancel,
}: {
  initial: ClientFormInput
  catalog: SatCatalog
  submitting: boolean
  fieldErrors: Record<string, string>
  banner: string | null
  bannerAction?: ReactNode
  onSubmit: (input: ClientFormInput) => void
  onCancel: () => void
}) {
  const { t } = useI18n()
  const copy = t.clients.form
  const [values, setValues] = useState(initial)
  const mounted = useRef(false)
  const parsedRfc = parseRfc(values.rfc)
  const personType = parsedRfc.ok ? parsedRfc.personType : null
  const regimes = optionsFor(catalog.taxRegimes, personType, values.taxRegime)
  const uses = optionsFor(catalog.cfdiUses, personType, values.cfdiUse)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }

    if (!focusFirstField(CLIENT_FIELD_ORDER, fieldErrors) && banner) {
      document.getElementById('client-form-banner')?.focus()
    }
  }, [banner, fieldErrors])

  function set<K extends keyof ClientFormInput>(key: K, value: ClientFormInput[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <form className="space-y-6" noValidate aria-busy={submitting} onSubmit={handleSubmit}>
      {banner ? (
        <StatusBanner id="client-form-banner" action={bannerAction}>
          {banner}
        </StatusBanner>
      ) : null}

      <FormSection title={copy.fiscal}>
        <TextField
          id={clientFieldId('rfc')}
          name="rfc"
          label={copy.rfc}
          hint={copy.rfcHint}
          error={fieldErrors.rfc}
          value={values.rfc}
          autoComplete="off"
          maxLength={20}
          readOnly={submitting}
          onChange={(event) => set('rfc', event.target.value)}
          onBlur={(event) => set('rfc', normalizeRfc(event.target.value))}
          required
        />
        <TextField
          id={clientFieldId('legalName')}
          name="legalName"
          label={copy.legalName}
          error={fieldErrors.legalName}
          value={values.legalName}
          maxLength={300}
          className="sm:col-span-2"
          readOnly={submitting}
          onChange={(event) => set('legalName', event.target.value)}
          required
        />
        <SelectField
          id={clientFieldId('taxRegime')}
          name="taxRegime"
          label={copy.taxRegime}
          error={fieldErrors.taxRegime}
          value={values.taxRegime}
          disabled={submitting}
          onChange={(event) => set('taxRegime', event.target.value)}
          required
        >
          <option value="">{copy.taxRegimePlaceholder}</option>
          {regimes.map((entry) => (
            <option key={entry.code} value={entry.code}>
              {entry.code} — {entry.description}
            </option>
          ))}
        </SelectField>
        <TextField
          id={clientFieldId('fiscalPostalCode')}
          name="fiscalPostalCode"
          label={copy.fiscalPostalCode}
          error={fieldErrors.fiscalPostalCode}
          value={values.fiscalPostalCode}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          readOnly={submitting}
          onChange={(event) => set('fiscalPostalCode', event.target.value)}
          required
        />
        <SelectField
          id={clientFieldId('cfdiUse')}
          name="cfdiUse"
          label={copy.cfdiUse}
          error={fieldErrors.cfdiUse}
          value={values.cfdiUse}
          disabled={submitting}
          onChange={(event) => set('cfdiUse', event.target.value)}
          required
        >
          <option value="">{copy.cfdiUsePlaceholder}</option>
          {uses.map((entry) => (
            <option key={entry.code} value={entry.code}>
              {entry.code} — {entry.description}
            </option>
          ))}
        </SelectField>
      </FormSection>

      <FormSection title={copy.commercial}>
        <TextField
          id={clientFieldId('tradeName')}
          name="tradeName"
          label={copy.tradeName}
          error={fieldErrors.tradeName}
          value={values.tradeName}
          maxLength={200}
          readOnly={submitting}
          onChange={(event) => set('tradeName', event.target.value)}
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
          onChange={(event) => set('email', event.target.value)}
          onBlur={(event) => set('email', event.target.value.trim().toLowerCase())}
        />
        <TextField
          id={clientFieldId('phoneCountryCode')}
          name="phoneCountryCode"
          label={copy.phoneCountryCode}
          hint={copy.phoneHint}
          error={fieldErrors.phoneCountryCode}
          value={values.phoneCountryCode}
          autoComplete="tel-country-code"
          placeholder="+52"
          maxLength={5}
          readOnly={submitting}
          onChange={(event) => set('phoneCountryCode', event.target.value.trim())}
        />
        <TextField
          id={clientFieldId('phone')}
          name="phone"
          label={copy.phone}
          error={fieldErrors.phone}
          value={values.phone}
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={15}
          readOnly={submitting}
          onChange={(event) => set('phone', event.target.value.replace(/\s+/g, ''))}
        />
        <SelectField
          id={clientFieldId('currency')}
          name="currency"
          label={copy.currency}
          error={fieldErrors.currency}
          value={values.currency}
          disabled={submitting}
          onChange={(event) => set('currency', event.target.value)}
        >
          <option value="MXN">MXN</option>
          <option value="USD">USD</option>
        </SelectField>
        <TextField
          id={clientFieldId('paymentTermsDays')}
          name="paymentTermsDays"
          label={copy.paymentTermsDays}
          error={fieldErrors.paymentTermsDays}
          value={values.paymentTermsDays}
          inputMode="numeric"
          maxLength={3}
          readOnly={submitting}
          onChange={(event) => set('paymentTermsDays', event.target.value)}
        />
        <TextField
          id={clientFieldId('quotePrefix')}
          name="quotePrefix"
          label={copy.quotePrefix}
          hint={copy.quotePrefixHint}
          error={fieldErrors.quotePrefix}
          value={values.quotePrefix}
          maxLength={12}
          autoCapitalize="characters"
          className="sm:col-span-2"
          readOnly={submitting}
          onChange={(event) => set('quotePrefix', event.target.value)}
          onBlur={(event) => set('quotePrefix', event.target.value.trim().toUpperCase())}
          required
        />
        <AreaField
          id={clientFieldId('notes')}
          name="notes"
          label={copy.notes}
          error={fieldErrors.notes}
          value={values.notes}
          maxLength={2000}
          className="sm:col-span-2"
          readOnly={submitting}
          onChange={(event) => set('notes', event.target.value)}
        />
      </FormSection>

      <FormSection title={copy.address}>
        <TextField
          id={clientFieldId('address.street')}
          name="street"
          label={copy.street}
          error={fieldErrors['address.street']}
          value={values.street}
          autoComplete="address-line1"
          maxLength={200}
          className="sm:col-span-2"
          readOnly={submitting}
          onChange={(event) => set('street', event.target.value)}
        />
        <TextField
          id={clientFieldId('address.exteriorNumber')}
          name="exteriorNumber"
          label={copy.exteriorNumber}
          error={fieldErrors['address.exteriorNumber']}
          value={values.exteriorNumber}
          maxLength={30}
          readOnly={submitting}
          onChange={(event) => set('exteriorNumber', event.target.value)}
        />
        <TextField
          id={clientFieldId('address.interiorNumber')}
          name="interiorNumber"
          label={copy.interiorNumber}
          error={fieldErrors['address.interiorNumber']}
          value={values.interiorNumber}
          maxLength={30}
          readOnly={submitting}
          onChange={(event) => set('interiorNumber', event.target.value)}
        />
        <TextField
          id={clientFieldId('address.colonia')}
          name="colonia"
          label={copy.colonia}
          error={fieldErrors['address.colonia']}
          value={values.colonia}
          maxLength={120}
          readOnly={submitting}
          onChange={(event) => set('colonia', event.target.value)}
        />
        <TextField
          id={clientFieldId('address.city')}
          name="city"
          label={copy.city}
          error={fieldErrors['address.city']}
          value={values.city}
          autoComplete="address-level2"
          maxLength={120}
          readOnly={submitting}
          onChange={(event) => set('city', event.target.value)}
        />
        <TextField
          id={clientFieldId('address.state')}
          name="state"
          label={copy.state}
          error={fieldErrors['address.state']}
          value={values.state}
          autoComplete="address-level1"
          maxLength={120}
          readOnly={submitting}
          onChange={(event) => set('state', event.target.value)}
        />
        <TextField
          id={clientFieldId('address.country')}
          name="country"
          label={copy.country}
          error={fieldErrors['address.country']}
          value={values.country}
          autoComplete="country"
          maxLength={2}
          readOnly={submitting}
          onChange={(event) => set('country', event.target.value)}
          onBlur={(event) => set('country', event.target.value.trim().toUpperCase())}
          required
        />
        <TextField
          id={clientFieldId('address.postalCode')}
          name="postalCode"
          label={copy.postalCode}
          error={fieldErrors['address.postalCode']}
          value={values.postalCode}
          autoComplete="postal-code"
          maxLength={10}
          readOnly={submitting}
          onChange={(event) => set('postalCode', event.target.value)}
        />
      </FormSection>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? copy.saving : copy.save}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          {copy.cancel}
        </Button>
      </div>
    </form>
  )
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <h2 className={AppTextStyles.h3}>{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}
