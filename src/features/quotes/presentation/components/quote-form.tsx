import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import type { ClientDetail } from '@/features/clients/domain/client'
import { mapClientError } from '@/features/clients/domain/map-client-error'
import { useClientRepository } from '@/features/clients/presentation/use-client-repository'
import { previewQuoteTotals } from '@/features/quotes/domain/money'
import { isQuoteType, type QuoteFormValues } from '@/features/quotes/domain/quote'
import { ClientPicker, type PickedClient } from '@/features/quotes/presentation/components/client-picker'
import { QuoteItemsEditor } from '@/features/quotes/presentation/components/quote-items-editor'
import { QuoteTotals } from '@/features/quotes/presentation/components/quote-totals'
import { quoteFieldId } from '@/features/quotes/presentation/messages'
import { AreaField, SelectField, TextField } from '@/features/clients/presentation/components/form-field'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

type ClientLoad = 'idle' | 'loading' | 'ready' | 'inactive' | 'error'

export function QuoteForm({
  mode,
  initial,
  lockedClient,
  submitting,
  fieldErrors,
  banner,
  bannerAction,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit'
  initial: QuoteFormValues
  lockedClient: PickedClient | null
  submitting: boolean
  fieldErrors: Record<string, string>
  banner: string | null
  bannerAction?: ReactNode
  onSubmit: (values: QuoteFormValues) => void
  onCancel: () => void
}) {
  const { t } = useI18n()
  const copy = t.quotes.form
  const repository = useClientRepository()
  const [values, setValues] = useState(initial)
  const [summary, setSummary] = useState<PickedClient | null>(lockedClient)
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [clientStatus, setClientStatus] = useState<ClientLoad>(values.clientId ? 'loading' : 'idle')

  useEffect(() => {
    if (!values.clientId || !repository) {
      if (!values.clientId) {
        setClient(null)
        setClientStatus('idle')
      }

      return
    }

    const controller = new AbortController()
    setClientStatus('loading')

    void repository
      .get(values.clientId, { signal: controller.signal })
      .then((next) => {
        if (controller.signal.aborted) {
          return
        }

        setClient(next)
        setSummary({
          id: next.id,
          legalName: next.legalName,
          tradeName: next.tradeName,
          rfc: next.rfc,
          currency: next.currency,
        })

        if (mode === 'create' && !next.isActive) {
          setClientStatus('inactive')
          return
        }

        setClientStatus('ready')
        setValues((current) => {
          if (mode === 'edit' || current.clientId !== next.id || current.currency) {
            return current
          }

          return { ...current, currency: next.currency }
        })
      })
      .catch((error: unknown) => {
        if (mapClientError(error).aborted || controller.signal.aborted) {
          return
        }

        setClient(null)
        setClientStatus('error')
      })

    return () => controller.abort()
  }, [mode, repository, values.clientId])

  useEffect(() => {
    if (!client || client.id !== values.clientId || !values.requestedByContactId) {
      return
    }

    const stillThere = client.contacts.some((contact) => contact.id === values.requestedByContactId)

    if (!stillThere) {
      setValues((current) =>
        current.requestedByContactId === values.requestedByContactId
          ? { ...current, requestedByContactId: '' }
          : current,
      )
    }
  }, [client, values.clientId, values.requestedByContactId])

  const fieldsEnabled = mode === 'edit' || clientStatus === 'ready'
  const preview = previewQuoteTotals(values.items, values.includeVat, values.vatPercent)
  const selectedContact = client?.contacts.find((contact) => contact.id === values.requestedByContactId) ?? null

  function patch(partial: Partial<QuoteFormValues>) {
    setValues((current) => ({ ...current, ...partial }))
  }

  function selectClient(next: PickedClient) {
    setSummary(next)
    setValues((current) => ({
      ...current,
      clientId: next.id,
      currency: next.currency,
      requestedByContactId: '',
      requestedByName: '',
      requestedByEmail: '',
    }))
  }

  function clearClient() {
    setSummary(null)
    setClient(null)
    setValues((current) => ({
      ...current,
      clientId: '',
      currency: '',
      requestedByContactId: '',
      requestedByName: '',
      requestedByEmail: '',
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!fieldsEnabled || submitting) {
      return
    }

    onSubmit(values)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {banner ? <StatusBanner action={bannerAction}>{banner}</StatusBanner> : null}
      {clientStatus === 'inactive' ? <StatusBanner>{copy.clientInactive}</StatusBanner> : null}
      {clientStatus === 'error' && mode === 'create' ? (
        <StatusBanner>{t.quotes.errors.clientNotFound}</StatusBanner>
      ) : null}

      <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
        <ClientPicker
          id={quoteFieldId('clientId')}
          selected={summary}
          locked={mode === 'edit'}
          error={fieldErrors.clientId}
          actionLabel={copy.changeClient}
          onSelect={selectClient}
          onClear={mode === 'edit' ? undefined : clearClient}
        />
        {mode === 'create' && !values.clientId ? (
          <p className={cn(AppTextStyles.bodySm, 'mt-4')}>{copy.clientFirst}</p>
        ) : null}
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id={quoteFieldId('type')}
                label={copy.type}
                value={values.type}
                disabled={!fieldsEnabled}
                error={fieldErrors.type}
                onChange={(event) => {
                  const value = event.target.value
                  patch({ type: isQuoteType(value) ? value : '' })
                }}
              >
                <option value="">—</option>
                <option value="assemblies">{t.quotes.type.assemblies}</option>
                <option value="projects">{t.quotes.type.projects}</option>
                <option value="services_material">{t.quotes.type.services_material}</option>
              </SelectField>
              <TextField
                id={quoteFieldId('projectName')}
                label={copy.projectName}
                value={values.projectName}
                maxLength={200}
                disabled={!fieldsEnabled}
                error={fieldErrors.projectName}
                onChange={(event) => patch({ projectName: event.target.value })}
              />
              <SelectField
                id={quoteFieldId('requestedByContactId')}
                label={copy.requestedBy}
                hint={copy.requestedByHint}
                value={values.requestedByContactId}
                disabled={!fieldsEnabled || clientStatus === 'loading'}
                error={fieldErrors.requestedByContactId}
                onChange={(event) => patch({ requestedByContactId: event.target.value })}
              >
                <option value="">{copy.requestedByManual}</option>
                {client?.contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name}
                  </option>
                ))}
              </SelectField>
              <SelectField
                id={quoteFieldId('currency')}
                label={copy.currency}
                value={values.currency}
                disabled={!fieldsEnabled}
                error={fieldErrors.currency}
                onChange={(event) => {
                  const value = event.target.value
                  patch({ currency: value === 'MXN' || value === 'USD' ? value : '' })
                }}
              >
                <option value="">—</option>
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
              </SelectField>
              {clientStatus === 'loading' ? (
                <p className={cn(AppTextStyles.caption, 'sm:col-span-2')}>{copy.contactsLoading}</p>
              ) : null}
              {clientStatus === 'error' && mode === 'edit' ? (
                <p className={cn(AppTextStyles.caption, 'sm:col-span-2')}>{copy.contactsUnavailable}</p>
              ) : null}
              {selectedContact ? (
                <p className={cn(AppTextStyles.bodySm, 'sm:col-span-2')}>
                  {selectedContact.name}
                  {selectedContact.email ? ` · ${selectedContact.email}` : ''}
                </p>
              ) : (
                <>
                  <TextField
                    id={quoteFieldId('requestedByName')}
                    label={copy.name}
                    value={values.requestedByName}
                    maxLength={200}
                    disabled={!fieldsEnabled}
                    error={fieldErrors.requestedByName}
                    onChange={(event) => patch({ requestedByName: event.target.value })}
                  />
                  <TextField
                    id={quoteFieldId('requestedByEmail')}
                    label={copy.email}
                    type="email"
                    value={values.requestedByEmail}
                    maxLength={320}
                    disabled={!fieldsEnabled}
                    error={fieldErrors.requestedByEmail}
                    onChange={(event) => patch({ requestedByEmail: event.target.value })}
                  />
                </>
              )}
              <TextField
                id={quoteFieldId('attentionTo')}
                label={copy.attentionTo}
                hint={copy.attentionHint}
                value={values.attentionTo}
                maxLength={200}
                disabled={!fieldsEnabled}
                error={fieldErrors.attentionTo}
                onChange={(event) => patch({ attentionTo: event.target.value })}
              />
              <TextField
                id={quoteFieldId('exchangeRate')}
                label={copy.exchangeRate}
                hint={copy.exchangeHint}
                inputMode="decimal"
                value={values.exchangeRate}
                disabled={!fieldsEnabled}
                error={fieldErrors.exchangeRate}
                onChange={(event) => patch({ exchangeRate: event.target.value })}
              />
              <TextField
                id={quoteFieldId('deliveryTime')}
                label={copy.deliveryTime}
                value={values.deliveryTime}
                maxLength={200}
                disabled={!fieldsEnabled}
                error={fieldErrors.deliveryTime}
                onChange={(event) => patch({ deliveryTime: event.target.value })}
              />
              <TextField
                id={quoteFieldId('validUntil')}
                label={copy.validUntil}
                type="date"
                value={values.validUntil}
                disabled={!fieldsEnabled}
                error={fieldErrors.validUntil}
                onChange={(event) => patch({ validUntil: event.target.value })}
              />
              <div className="sm:col-span-2">
                <AreaField
                  id={quoteFieldId('notes')}
                  label={copy.notes}
                  value={values.notes}
                  maxLength={2000}
                  disabled={!fieldsEnabled}
                  error={fieldErrors.notes}
                  onChange={(event) => patch({ notes: event.target.value })}
                />
              </div>
              <label className="flex items-center gap-3 sm:col-span-2">
                <input
                  id="quote-includeVat"
                  type="checkbox"
                  className="size-4 rounded border-border accent-brand-700"
                  checked={values.includeVat}
                  disabled={!fieldsEnabled}
                  onChange={(event) => patch({ includeVat: event.target.checked })}
                />
                <span className={AppTextStyles.label}>{copy.includeVat}</span>
              </label>
              <TextField
                id={quoteFieldId('vatRate')}
                label={copy.vatRate}
                hint={copy.vatHint}
                inputMode="decimal"
                value={values.vatPercent}
                disabled={!fieldsEnabled}
                error={fieldErrors.vatRate}
                onChange={(event) => patch({ vatPercent: event.target.value })}
              />
            </div>
          </section>

          <QuoteItemsEditor
            items={values.items}
            currency={values.currency || 'MXN'}
            lineTotals={preview.lines.map((line) => line.lineTotal)}
            errors={fieldErrors}
            disabled={!fieldsEnabled}
            onChange={(items) => patch({ items })}
          />
        </div>

        <QuoteTotals
          title={copy.preview}
          hint={copy.previewHint}
          currency={values.currency || 'MXN'}
          subtotal={preview.subtotal}
          vatAmount={preview.vatAmount}
          total={preview.total}
          includeVat={values.includeVat}
          vatPercent={values.vatPercent}
        />
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          {copy.cancel}
        </Button>
        <Button type="submit" disabled={!fieldsEnabled || submitting}>
          {submitting ? copy.saving : copy.save}
        </Button>
      </div>
    </form>
  )
}
