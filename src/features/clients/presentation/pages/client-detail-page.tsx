import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { userHasRole } from '@/features/auth/domain/user-has-role'
import { useAuth } from '@/features/auth/presentation/use-auth'
import {
  contactToForm,
  emptyContactForm,
  type ClientContact,
  type ClientDetail,
  type ContactFormInput,
  type SatCatalog,
} from '@/features/clients/domain/client'
import { mapClientError } from '@/features/clients/domain/map-client-error'
import { parseContactForm, parseContactPatch } from '@/features/clients/domain/validation'
import { ClientsPage } from '@/features/clients/presentation/clients-page'
import { ClientQuotesSection } from '@/features/quotes/presentation/components/client-quotes-section'
import { ClientLogo } from '@/features/clients/presentation/components/client-logo'
import { ConfirmDialog } from '@/features/clients/presentation/components/confirm-dialog'
import { ContactDialog } from '@/features/clients/presentation/components/contact-dialog'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { catalogLabel, displayText, formatAddress, formatPhone } from '@/features/clients/presentation/format'
import {
  clientBannerMessage,
  issuesToFieldErrors,
  mappedToFieldErrors,
} from '@/features/clients/presentation/messages'
import { useClientRepository } from '@/features/clients/presentation/use-client-repository'
import { appClientEditPath, paths } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

interface ContactEditor {
  mode: 'create' | 'edit'
  contact: ClientContact | null
  initial: ContactFormInput
}

export function ClientDetailPage() {
  const { t } = useI18n()
  const copy = t.clients.detail
  const { user } = useAuth()
  const isAdmin = userHasRole(user, ['admin'])
  const navigate = useNavigate()
  const params = useParams()
  const clientId = params.clientId ?? ''
  const repository = useClientRepository()
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [catalog, setCatalog] = useState<SatCatalog | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [logoRevision, setLogoRevision] = useState(0)
  const [editor, setEditor] = useState<ContactEditor | null>(null)
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({})
  const [contactBanner, setContactBanner] = useState<string | null>(null)
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<ClientContact | null>(null)
  const [deletingContact, setDeletingContact] = useState(false)
  const [statusAction, setStatusAction] = useState<'deactivate' | 'reactivate' | null>(null)
  const [statusPending, setStatusPending] = useState(false)

  useEffect(() => {
    if (!repository || !clientId) {
      return
    }

    const controller = new AbortController()

    void Promise.all([
      repository.get(clientId, { signal: controller.signal }),
      repository.getSatCatalog({ signal: controller.signal }).catch(() => null),
    ])
      .then(([nextClient, nextCatalog]) => {
        if (controller.signal.aborted) {
          return
        }

        setClient(nextClient)
        setCatalog(nextCatalog)
        setMessage(null)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        const mapped = mapClientError(error)

        if (mapped.aborted) {
          return
        }

        setMessage(clientBannerMessage(t.clients, mapped))
        setStatus('error')
      })

    return () => controller.abort()
  }, [attempt, clientId, repository, t.clients])

  async function refresh() {
    if (!repository) {
      return
    }

    const fresh = await repository.get(clientId)
    setClient(fresh)
  }

  function openCreateContact() {
    setContactErrors({})
    setContactBanner(null)
    setEditor({ mode: 'create', contact: null, initial: emptyContactForm() })
  }

  function openEditContact(contact: ClientContact) {
    setContactErrors({})
    setContactBanner(null)
    setEditor({ mode: 'edit', contact, initial: contactToForm(contact) })
  }

  async function saveContact(input: ContactFormInput) {
    if (!repository || !editor) {
      return
    }

    if (editor.mode === 'create') {
      const parsed = parseContactForm(input)

      if (!parsed.ok) {
        setContactErrors(issuesToFieldErrors(t.clients.validation, parsed.issues))
        return
      }

      setContactSubmitting(true)

      try {
        await repository.createContact(clientId, parsed.payload)
        await refresh()
        setEditor(null)
      } catch (error) {
        const mapped = mapClientError(error)
        setContactErrors(mappedToFieldErrors(t.clients, mapped))
        setContactBanner(clientBannerMessage(t.clients, mapped))
      } finally {
        setContactSubmitting(false)
      }

      return
    }

    if (!editor.contact) {
      return
    }

    const parsed = parseContactPatch(input, editor.contact)

    if (!parsed.ok) {
      setContactErrors(issuesToFieldErrors(t.clients.validation, parsed.issues))
      return
    }

    if (!parsed.payload) {
      setContactBanner(t.clients.form.noChanges)
      return
    }

    setContactSubmitting(true)

    try {
      await repository.updateContact(clientId, editor.contact.id, parsed.payload)
      await refresh()
      setEditor(null)
    } catch (error) {
      const mapped = mapClientError(error)
      setContactErrors(mappedToFieldErrors(t.clients, mapped))
      setContactBanner(clientBannerMessage(t.clients, mapped))
    } finally {
      setContactSubmitting(false)
    }
  }

  async function markPrimary(contact: ClientContact) {
    if (!repository) {
      return
    }

    setMessage(null)

    try {
      await repository.updateContact(clientId, contact.id, { isPrimary: true })
      await refresh()
    } catch (error) {
      const mapped = mapClientError(error)
      setMessage(clientBannerMessage(t.clients, mapped))
    }
  }

  async function deleteContact() {
    if (!repository || !pendingDelete) {
      return
    }

    setDeletingContact(true)

    try {
      await repository.deleteContact(clientId, pendingDelete.id)
      await refresh()
      setPendingDelete(null)
    } catch (error) {
      const mapped = mapClientError(error)
      setMessage(clientBannerMessage(t.clients, mapped))
      setPendingDelete(null)
    } finally {
      setDeletingContact(false)
    }
  }

  async function changeStatus() {
    if (!repository || !client || !statusAction) {
      return
    }

    setStatusPending(true)
    setMessage(null)

    try {
      const next =
        statusAction === 'deactivate'
          ? await repository.deactivate(client.id)
          : await repository.reactivate(client.id)
      setClient(next)
      setStatusAction(null)
    } catch (error) {
      const mapped = mapClientError(error)
      setMessage(clientBannerMessage(t.clients, mapped))
      setStatusAction(null)
    } finally {
      setStatusPending(false)
    }
  }

  if (!clientId) {
    return null
  }

  return (
    <ClientsPage>
      <Link to={paths.appClients} className={cn(AppTextStyles.link, 'inline-flex')}>
        {copy.backToList}
      </Link>

      {status === 'loading' ? <p className={cn(AppTextStyles.bodySm, 'mt-8')}>{copy.loading}</p> : null}

      {status === 'error' ? (
        <div className="mt-8 max-w-xl space-y-4">
          <StatusBanner
            action={
              <Button type="button" size="sm" variant="secondary" onClick={() => setAttempt((value) => value + 1)}>
                {t.clients.list.retry}
              </Button>
            }
          >
            {message ?? t.clients.errors.notFound}
          </StatusBanner>
        </div>
      ) : null}

      {status === 'ready' && client && repository ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className={AppTextStyles.eyebrow}>{client.rfc}</p>
              <h1 className={cn(AppTextStyles.h2, 'mt-2')}>{client.legalName}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge className={client.isActive ? undefined : 'bg-surface-muted text-ink-muted'}>
                  {client.isActive ? t.clients.list.active : t.clients.list.inactive}
                </Badge>
                <span className={AppTextStyles.bodySm}>{client.currency}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate(appClientEditPath(client.id))}>
                {copy.edit}
              </Button>
              {isAdmin ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStatusAction(client.isActive ? 'deactivate' : 'reactivate')}
                >
                  {client.isActive ? copy.deactivate : copy.reactivate}
                </Button>
              ) : null}
            </div>
          </div>

          {message ? (
            <div className="mt-4">
              <StatusBanner>{message}</StatusBanner>
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="space-y-6">
              <SummarySection title={copy.fiscal}>
                <Fact label={t.clients.form.rfc} value={client.rfc} />
                <Fact label={t.clients.form.legalName} value={client.legalName} />
                <Fact
                  label={t.clients.form.taxRegime}
                  value={catalogLabel(catalog, 'taxRegimes', client.taxRegime)}
                />
                <Fact label={t.clients.form.fiscalPostalCode} value={client.fiscalPostalCode} />
                <Fact label={t.clients.form.cfdiUse} value={catalogLabel(catalog, 'cfdiUses', client.cfdiUse)} />
              </SummarySection>

              <SummarySection title={copy.commercial}>
                <Fact label={t.clients.form.tradeName} value={displayText(client.tradeName, copy.none)} />
                <Fact label={t.clients.form.email} value={displayText(client.email, copy.none)} />
                <Fact
                  label={t.clients.form.phone}
                  value={formatPhone(client.phoneCountryCode, client.phone, copy.none)}
                />
                <Fact label={t.clients.form.currency} value={client.currency} />
                <Fact
                  label={copy.paymentTerms}
                  value={
                    client.paymentTermsDays == null
                      ? copy.none
                      : copy.days.replace('{days}', String(client.paymentTermsDays))
                  }
                />
                <Fact label={t.clients.form.quotePrefix} value={client.quotePrefix} />
                <Fact label={copy.notes} value={displayText(client.notes, copy.none)} />
              </SummarySection>

              <SummarySection title={copy.address}>
                {formatAddress(client.address).length > 0 ? (
                  <div className="sm:col-span-2">
                    {formatAddress(client.address).map((line) => (
                      <p key={line} className={AppTextStyles.bodyMd}>
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className={AppTextStyles.bodySm}>{copy.none}</p>
                )}
              </SummarySection>

              <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className={AppTextStyles.h3}>{copy.contacts}</h2>
                  <Button type="button" size="sm" onClick={openCreateContact}>
                    {copy.addContact}
                  </Button>
                </div>
                {client.contacts.length === 0 ? (
                  <p className={cn(AppTextStyles.bodySm, 'mt-4')}>{copy.contactsEmpty}</p>
                ) : (
                  <ul className="mt-4 divide-y divide-border">
                    {client.contacts.map((contact) => (
                      <li key={contact.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                        <div>
                          <p className={AppTextStyles.bodyMd}>
                            {contact.name}
                            {contact.isPrimary ? (
                              <Badge className="ml-2 align-middle">{copy.primary}</Badge>
                            ) : null}
                          </p>
                          <p className={cn(AppTextStyles.bodySm, 'mt-1')}>
                            {displayText(contact.position, copy.none)}
                          </p>
                          <p className={cn(AppTextStyles.caption, 'mt-1')}>
                            {displayText(contact.email, copy.none)} · {displayText(contact.phone, copy.none)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {contact.isPrimary ? null : (
                            <Button type="button" size="sm" variant="secondary" onClick={() => void markPrimary(contact)}>
                              {copy.markPrimary}
                            </Button>
                          )}
                          <Button type="button" size="sm" variant="secondary" onClick={() => openEditContact(contact)}>
                            {copy.editContact}
                          </Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setPendingDelete(contact)}>
                            {copy.deleteContact}
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <ClientLogo
              clientId={client.id}
              hasLogo={client.hasLogo}
              revision={logoRevision}
              repository={repository}
              onChanged={(hasLogo) => {
                setClient((current) => (current ? { ...current, hasLogo } : current))
                setLogoRevision((value) => value + 1)
              }}
            />
          </div>
          <ClientQuotesSection clientId={client.id} />
        </div>
      ) : null}

      <ContactDialog
        open={editor !== null}
        mode={editor?.mode ?? 'create'}
        initial={editor?.initial ?? emptyContactForm()}
        submitting={contactSubmitting}
        fieldErrors={contactErrors}
        banner={contactBanner}
        onSubmit={(input) => {
          void saveContact(input)
        }}
        onClose={() => setEditor(null)}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={copy.deleteContactTitle}
        body={copy.deleteContactBody}
        confirmLabel={copy.deleteContact}
        pendingLabel={copy.working}
        cancelLabel={copy.cancel}
        closeLabel={t.clients.closeDialog}
        pending={deletingContact}
        destructive
        onConfirm={() => {
          void deleteContact()
        }}
        onClose={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={statusAction !== null}
        title={statusAction === 'reactivate' ? copy.reactivateTitle : copy.deactivateTitle}
        body={statusAction === 'reactivate' ? copy.reactivateBody : copy.deactivateBody}
        confirmLabel={statusAction === 'reactivate' ? copy.reactivate : copy.deactivate}
        pendingLabel={copy.working}
        cancelLabel={copy.cancel}
        closeLabel={t.clients.closeDialog}
        pending={statusPending}
        destructive={statusAction !== 'reactivate'}
        onConfirm={() => {
          void changeStatus()
        }}
        onClose={() => setStatusAction(null)}
      />
    </ClientsPage>
  )
}

function SummarySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <h2 className={AppTextStyles.h3}>{title}</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={AppTextStyles.caption}>{label}</dt>
      <dd className={cn(AppTextStyles.bodyMd, 'mt-1')}>{value}</dd>
    </div>
  )
}
