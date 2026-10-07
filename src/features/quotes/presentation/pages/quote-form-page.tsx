import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { mapQuoteError } from '@/features/quotes/domain/map-quote-error'
import {
  emptyQuoteForm,
  quoteToForm,
  type QuoteDetail,
  type QuoteFormValues,
} from '@/features/quotes/domain/quote'
import { parseCreateQuote, parsePatchQuote } from '@/features/quotes/domain/validation'
import type { PickedClient } from '@/features/quotes/presentation/components/client-picker'
import { QuoteForm } from '@/features/quotes/presentation/components/quote-form'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import {
  focusFirstQuoteField,
  issuesToFieldErrors,
  mappedToFieldErrors,
  quoteBannerMessage,
} from '@/features/quotes/presentation/messages'
import { QuotesPage } from '@/features/quotes/presentation/quotes-page'
import { useQuoteRepository } from '@/features/quotes/presentation/use-quote-repository'
import { appQuotePath, paths } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

export function QuoteFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { t } = useI18n()
  const copy = t.quotes.form
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const quoteId = params.quoteId ?? ''
  const presetClientId = mode === 'create' ? (searchParams.get('clientId') ?? '') : ''
  const repository = useQuoteRepository()
  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>(mode === 'create' ? 'ready' : 'loading')
  const [loadMessage, setLoadMessage] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [formKey, setFormKey] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [banner, setBanner] = useState<string | null>(null)
  const [versionConflict, setVersionConflict] = useState(false)

  useEffect(() => {
    if (mode !== 'edit') {
      return
    }

    const controller = new AbortController()

    void repository
      .get(quoteId, { signal: controller.signal })
      .then((next) => {
        if (controller.signal.aborted) {
          return
        }

        setQuote(next)
        setLoadMessage(null)
        setLoadState('ready')
      })
      .catch((error: unknown) => {
        const mapped = mapQuoteError(error)

        if (mapped.aborted) {
          return
        }

        setLoadMessage(quoteBannerMessage(t.quotes, mapped))
        setLoadState('error')
      })

    return () => controller.abort()
  }, [attempt, mode, quoteId, repository, t.quotes])

  async function reloadQuote() {
    if (mode !== 'edit') {
      return
    }

    try {
      const fresh = await repository.get(quoteId)
      setQuote(fresh)
      setFormKey((value) => value + 1)
      setFieldErrors({})
      setBanner(null)
      setVersionConflict(false)
    } catch (error) {
      const mapped = mapQuoteError(error)
      setBanner(quoteBannerMessage(t.quotes, mapped))
      setVersionConflict(mapped.versionConflict)
    }
  }

  function fail(errors: Record<string, string>, message: string | null, conflict = false) {
    setFieldErrors(errors)
    setBanner(message)
    setVersionConflict(conflict)
    focusFirstQuoteField(errors)
  }

  async function handleSubmit(input: QuoteFormValues) {
    setFieldErrors({})
    setBanner(null)
    setVersionConflict(false)

    if (mode === 'create') {
      const parsed = parseCreateQuote(input)

      if (!parsed.ok) {
        fail(issuesToFieldErrors(t.quotes.validation, parsed.issues), null)
        return
      }

      setSubmitting(true)

      try {
        const created = await repository.create(parsed.payload)
        navigate(appQuotePath(created.id), { state: { notice: 'saved' } })
      } catch (error) {
        const mapped = mapQuoteError(error)
        fail(mappedToFieldErrors(t.quotes, mapped), quoteBannerMessage(t.quotes, mapped), mapped.versionConflict)
      } finally {
        setSubmitting(false)
      }

      return
    }

    if (!quote) {
      return
    }

    const parsed = parsePatchQuote(input, quote.version)

    if (!parsed.ok) {
      fail(issuesToFieldErrors(t.quotes.validation, parsed.issues), null)
      return
    }

    setSubmitting(true)

    try {
      const updated = await repository.update(quote.id, parsed.payload)
      navigate(appQuotePath(updated.id), { state: { notice: 'saved' } })
    } catch (error) {
      const mapped = mapQuoteError(error)
      fail(mappedToFieldErrors(t.quotes, mapped), quoteBannerMessage(t.quotes, mapped), mapped.versionConflict)
    } finally {
      setSubmitting(false)
    }
  }

  const initial = quote ? quoteToForm(quote) : emptyQuoteForm(presetClientId)
  const lockedClient: PickedClient | null = quote
    ? {
        id: quote.client.id,
        legalName: quote.client.legalName,
        tradeName: quote.client.tradeName,
        rfc: quote.client.rfc,
        currency: quote.currency,
      }
    : null
  const backTo = mode === 'edit' && quote ? appQuotePath(quote.id) : paths.appQuotations

  let body: ReactNode

  if (mode === 'edit' && loadState === 'loading') {
    body = <p className={cn(AppTextStyles.bodySm, 'mt-8')}>{copy.loading}</p>
  } else if (mode === 'edit' && loadState === 'error') {
    body = (
      <div className="mt-8">
        <StatusBanner
          action={
            <Button type="button" size="sm" variant="secondary" onClick={() => setAttempt((value) => value + 1)}>
              {t.quotes.list.retry}
            </Button>
          }
        >
          {loadMessage}
        </StatusBanner>
      </div>
    )
  } else if (mode === 'edit' && quote && quote.status !== 'draft') {
    body = (
      <div className="mt-8 max-w-xl space-y-4">
        <h2 className={AppTextStyles.h3}>{copy.notDraftTitle}</h2>
        <StatusBanner>{copy.notDraftBody}</StatusBanner>
        <Button type="button" onClick={() => navigate(appQuotePath(quote.id))}>
          {copy.openDetail}
        </Button>
      </div>
    )
  } else {
    body = (
      <div className="mt-8">
        <QuoteForm
          key={`${mode}-${quote?.id ?? presetClientId}-${quote?.version ?? 'new'}-${formKey}`}
          mode={mode}
          initial={initial}
          lockedClient={lockedClient}
          submitting={submitting}
          fieldErrors={fieldErrors}
          banner={banner}
          bannerAction={
            versionConflict ? (
              <Button type="button" size="sm" variant="secondary" onClick={() => void reloadQuote()}>
                {t.quotes.errors.reload}
              </Button>
            ) : undefined
          }
          onSubmit={(input) => {
            void handleSubmit(input)
          }}
          onCancel={() => navigate(backTo)}
        />
      </div>
    )
  }

  return (
    <QuotesPage>
      <div className="mx-auto max-w-6xl">
        <Link to={paths.appQuotations} className={cn(AppTextStyles.link, 'inline-flex')}>
          {copy.back}
        </Link>
        <h1 className={cn(AppTextStyles.h2, 'mt-3')}>{mode === 'create' ? copy.createTitle : copy.editTitle}</h1>
        <p className={cn(AppTextStyles.bodySm, 'mt-2')}>
          {mode === 'create' ? copy.createDescription : copy.editDescription}
        </p>
        {body}
      </div>
    </QuotesPage>
  )
}
