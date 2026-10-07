import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  clientToForm,
  emptyClientForm,
  type ClientDetail,
  type ClientFormInput,
  type SatCatalog,
} from '@/features/clients/domain/client'
import { mapClientError } from '@/features/clients/domain/map-client-error'
import { parseClientForm, parseClientPatch } from '@/features/clients/domain/validation'
import { ClientsPage } from '@/features/clients/presentation/clients-page'
import { ClientForm } from '@/features/clients/presentation/components/client-form'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import {
  clientBannerMessage,
  issuesToFieldErrors,
  mappedToFieldErrors,
} from '@/features/clients/presentation/messages'
import { useClientRepository } from '@/features/clients/presentation/use-client-repository'
import { appClientPath, paths } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

export function ClientFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { t } = useI18n()
  const copy = t.clients.form
  const navigate = useNavigate()
  const params = useParams()
  const clientId = params.clientId ?? ''
  const repository = useClientRepository()
  const [catalog, setCatalog] = useState<SatCatalog | null>(null)
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [loadMessage, setLoadMessage] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [formKey, setFormKey] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [banner, setBanner] = useState<string | null>(null)
  const [versionConflict, setVersionConflict] = useState(false)

  useEffect(() => {
    if (!repository) {
      return
    }

    const controller = new AbortController()

    async function load() {
      if (!repository) {
        return
      }

      try {
        const [nextCatalog, nextClient] = await Promise.all([
          repository.getSatCatalog({ signal: controller.signal }),
          mode === 'edit' ? repository.get(clientId, { signal: controller.signal }) : Promise.resolve(null),
        ])

        if (controller.signal.aborted) {
          return
        }

        setCatalog(nextCatalog)
        setClient(nextClient)
        setLoadMessage(null)
        setStatus('ready')
      } catch (error) {
        const mapped = mapClientError(error)

        if (mapped.aborted) {
          return
        }

        setLoadMessage(clientBannerMessage(t.clients, mapped))
        setStatus('error')
      }
    }

    void load()

    return () => controller.abort()
  }, [attempt, clientId, mode, repository, t.clients])

  async function reloadClient() {
    if (!repository || mode !== 'edit') {
      return
    }

    const fresh = await repository.get(clientId)
    setClient(fresh)
    setFormKey((value) => value + 1)
    setFieldErrors({})
    setBanner(null)
    setVersionConflict(false)
  }

  async function handleSubmit(input: ClientFormInput) {
    if (!repository || !catalog) {
      return
    }

    setFieldErrors({})
    setBanner(null)
    setVersionConflict(false)

    if (mode === 'create') {
      const parsed = parseClientForm(input, catalog)

      if (!parsed.ok) {
        setFieldErrors(issuesToFieldErrors(t.clients.validation, parsed.issues))
        return
      }

      setSubmitting(true)

      try {
        const created = await repository.create(parsed.payload)
        navigate(appClientPath(created.id))
      } catch (error) {
        const mapped = mapClientError(error)
        setFieldErrors(mappedToFieldErrors(t.clients, mapped))
        setBanner(clientBannerMessage(t.clients, mapped))
        setVersionConflict(mapped.versionConflict)
      } finally {
        setSubmitting(false)
      }

      return
    }

    if (!client) {
      return
    }

    const parsed = parseClientPatch(input, catalog, client)

    if (!parsed.ok) {
      setFieldErrors(issuesToFieldErrors(t.clients.validation, parsed.issues))
      return
    }

    if (!parsed.payload) {
      setBanner(copy.noChanges)
      return
    }

    setSubmitting(true)

    try {
      const updated = await repository.update(client.id, parsed.payload)
      navigate(appClientPath(updated.id))
    } catch (error) {
      const mapped = mapClientError(error)
      setFieldErrors(mappedToFieldErrors(t.clients, mapped))
      setBanner(clientBannerMessage(t.clients, mapped))
      setVersionConflict(mapped.versionConflict)
    } finally {
      setSubmitting(false)
    }
  }

  const initial = client ? clientToForm(client) : emptyClientForm()

  return (
    <ClientsPage>
      <div className="mx-auto max-w-3xl">
        <Link to={paths.appClients} className={cn(AppTextStyles.link, 'inline-flex')}>
          {copy.back}
        </Link>
        <h1 className={cn(AppTextStyles.h2, 'mt-3')}>
          {mode === 'create' ? copy.createTitle : copy.editTitle}
        </h1>
        <p className={cn(AppTextStyles.bodySm, 'mt-2')}>
          {mode === 'create' ? copy.createDescription : copy.editDescription}
        </p>

        {status === 'loading' ? <p className={cn(AppTextStyles.bodySm, 'mt-8')}>{copy.loading}</p> : null}

        {status === 'error' ? (
          <div className="mt-8">
            <StatusBanner
              action={
                <Button type="button" size="sm" variant="secondary" onClick={() => setAttempt((value) => value + 1)}>
                  {t.clients.list.retry}
                </Button>
              }
            >
              {loadMessage}
            </StatusBanner>
          </div>
        ) : null}

        {status === 'ready' && catalog ? (
          <div className="mt-8">
            <ClientForm
              key={`${mode}-${client?.id ?? 'new'}-${client?.version ?? '0'}-${formKey}`}
              initial={initial}
              catalog={catalog}
              submitting={submitting}
              fieldErrors={fieldErrors}
              banner={banner}
              bannerAction={
                versionConflict ? (
                  <Button type="button" size="sm" variant="secondary" onClick={() => void reloadClient()}>
                    {t.clients.errors.reload}
                  </Button>
                ) : undefined
              }
              onSubmit={(input) => {
                void handleSubmit(input)
              }}
              onCancel={() => navigate(mode === 'edit' && client ? appClientPath(client.id) : paths.appClients)}
            />
          </div>
        ) : null}
      </div>
    </ClientsPage>
  )
}
