import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Currency } from '@/features/clients/domain/client'
import { mapClientError } from '@/features/clients/domain/map-client-error'
import { useClientRepository } from '@/features/clients/presentation/use-client-repository'
import { mapQuoteError } from '@/features/quotes/domain/map-quote-error'
import {
  QUOTE_PAGE_SIZE,
  isQuoteStatus,
  isQuoteType,
  type QuoteList,
  type QuoteStatus,
  type QuoteType,
} from '@/features/quotes/domain/quote'
import { useQuoteRepository } from '@/features/quotes/presentation/use-quote-repository'
import { ClientPicker, type PickedClient } from '@/features/quotes/presentation/components/client-picker'
import { QuoteStatusBadge } from '@/features/quotes/presentation/components/quote-status-badge'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { clientLabel, displayText, formatMoney, formatQuoteDate, formatQuoteDateTime } from '@/features/quotes/presentation/format'
import { quoteBannerMessage } from '@/features/quotes/presentation/messages'
import { QuotesPage } from '@/features/quotes/presentation/quotes-page'
import { useDebouncedValue } from '@/features/clients/presentation/use-debounced-value'
import { appClientPath, appQuoteNewForClient, appQuotePath, paths } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { cn } from '@/shared/utils/cn'

const newQuoteClass = cn(
  'inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold tracking-tight',
  AppColorClasses.bg.brand700,
  AppColorClasses.text.white,
  'transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
)

function readPage(value: string | null): number {
  const page = Number(value)
  return Number.isInteger(page) && page >= 1 ? page : 1
}

export function QuoteListPage() {
  const { t, locale } = useI18n()
  const copy = t.quotes.list
  const repository = useQuoteRepository()
  const clientRepository = useClientRepository()
  const [searchParams, setSearchParams] = useSearchParams()
  const paramQ = searchParams.get('q') ?? ''
  const statusParam = searchParams.get('status') ?? ''
  const typeParam = searchParams.get('type') ?? ''
  const clientId = searchParams.get('clientId') ?? ''
  const statusFilter: QuoteStatus | '' = isQuoteStatus(statusParam) ? statusParam : ''
  const type: QuoteType | '' = isQuoteType(typeParam) ? typeParam : ''
  const page = readPage(searchParams.get('page'))
  const [searchInput, setSearchInput] = useState(paramQ)
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const [filterClient, setFilterClient] = useState<PickedClient | null>(null)
  const [result, setResult] = useState<QuoteList | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const trimmed = debouncedSearch.trim().slice(0, 100)

    if (trimmed === paramQ) {
      return
    }

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)

        if (trimmed) {
          next.set('q', trimmed)
        } else {
          next.delete('q')
        }

        next.delete('page')
        return next
      },
      { replace: true },
    )
  }, [debouncedSearch, paramQ, setSearchParams])

  useEffect(() => {
    if (!clientId || !clientRepository) {
      setFilterClient(null)
      return
    }

    const controller = new AbortController()

    void clientRepository
      .get(clientId, { signal: controller.signal })
      .then((client) => {
        if (controller.signal.aborted) {
          return
        }

        setFilterClient({
          id: client.id,
          legalName: client.legalName,
          tradeName: client.tradeName,
          rfc: client.rfc,
          currency: client.currency,
        })
      })
      .catch((error: unknown) => {
        if (mapClientError(error).aborted || controller.signal.aborted) {
          return
        }

        setFilterClient({
          id: clientId,
          legalName: clientId,
          tradeName: null,
          rfc: '',
          currency: 'MXN' satisfies Currency,
        })
      })

    return () => controller.abort()
  }, [clientId, clientRepository])

  useEffect(() => {
    const controller = new AbortController()

    void repository
      .list(
        {
          q: paramQ.trim() || undefined,
          status: statusFilter || undefined,
          type: type || undefined,
          clientId: clientId || undefined,
          page,
          pageSize: QUOTE_PAGE_SIZE,
        },
        { signal: controller.signal },
      )
      .then((next) => {
        if (controller.signal.aborted) {
          return
        }

        setResult(next)
        setErrorMessage(null)
        setLoadState('ready')
      })
      .catch((error: unknown) => {
        const mapped = mapQuoteError(error)

        if (mapped.aborted) {
          return
        }

        setErrorMessage(quoteBannerMessage(t.quotes, mapped) ?? copy.errorTitle)
        setLoadState('error')
      })

    return () => controller.abort()
  }, [attempt, clientId, copy.errorTitle, page, paramQ, repository, statusFilter, t.quotes, type])

  function updateParams(changes: Record<string, string | null>) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)

      for (const [key, value] of Object.entries(changes)) {
        if (value) {
          next.set(key, value)
        } else {
          next.delete(key)
        }
      }

      next.delete('page')
      return next
    })
  }

  const total = result?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / QUOTE_PAGE_SIZE))

  useEffect(() => {
    if (loadState === 'ready' && page > pageCount) {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          next.delete('page')
          return next
        },
        { replace: true },
      )
    }
  }, [loadState, page, pageCount, setSearchParams])

  const filtered = Boolean(paramQ.trim() || statusFilter || type || clientId)
  const newHref = clientId ? appQuoteNewForClient(clientId) : paths.appQuoteNew

  return (
    <QuotesPage>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={AppTextStyles.eyebrow}>{copy.eyebrow}</p>
          <h1 className={cn(AppTextStyles.h2, 'mt-2')}>{copy.title}</h1>
          <p className={cn(AppTextStyles.bodySm, 'mt-2 max-w-xl')}>{copy.description}</p>
        </div>
        <Link to={newHref} className={newQuoteClass}>
          {copy.newQuote}
        </Link>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_12rem_12rem_minmax(16rem,1fr)]">
        <label className="block space-y-2">
          <span className={AppTextStyles.label}>{copy.searchLabel}</span>
          <Input
            type="search"
            value={searchInput}
            maxLength={100}
            placeholder={copy.searchPlaceholder}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </label>
        <label className="block space-y-2">
          <span className={AppTextStyles.label}>{copy.statusFilter}</span>
          <Select
            value={statusFilter}
            onChange={(event) => {
              const value = event.target.value
              updateParams({ status: isQuoteStatus(value) ? value : null })
            }}
          >
            <option value="">{copy.allStatuses}</option>
            <option value="draft">{t.quotes.status.draft}</option>
            <option value="sent">{t.quotes.status.sent}</option>
            <option value="accepted">{t.quotes.status.accepted}</option>
            <option value="rejected">{t.quotes.status.rejected}</option>
            <option value="expired">{t.quotes.status.expired}</option>
          </Select>
        </label>
        <label className="block space-y-2">
          <span className={AppTextStyles.label}>{copy.typeFilter}</span>
          <Select
            value={type}
            onChange={(event) => {
              const value = event.target.value
              updateParams({ type: isQuoteType(value) ? value : null })
            }}
          >
            <option value="">{copy.allTypes}</option>
            <option value="assemblies">{t.quotes.type.assemblies}</option>
            <option value="projects">{t.quotes.type.projects}</option>
            <option value="services_material">{t.quotes.type.services_material}</option>
          </Select>
        </label>
        <ClientPicker
          selected={filterClient}
          actionLabel={copy.clearClient}
          hint=""
          onSelect={(client) => {
            setFilterClient(client)
            updateParams({ clientId: client.id })
          }}
          onClear={() => updateParams({ clientId: null })}
        />
      </div>

      <p className={cn(AppTextStyles.caption, 'mt-4')} aria-live="polite">
        {loadState === 'loading' && !result ? copy.loading : copy.results.replace('{total}', String(total))}
      </p>

      {errorMessage ? (
        <div className="mt-4">
          <StatusBanner
            action={
              <Button type="button" size="sm" variant="secondary" onClick={() => setAttempt((value) => value + 1)}>
                {copy.retry}
              </Button>
            }
          >
            {errorMessage}
          </StatusBanner>
        </div>
      ) : null}

      {loadState === 'ready' && total === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className={AppTextStyles.bodyMd}>{filtered ? copy.emptyFiltered : copy.empty}</p>
        </div>
      ) : null}

      {result && result.items.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-3xl border border-border bg-white shadow-sm">
          <table className="w-full min-w-[980px] text-left text-sm">
            <caption className="sr-only">{copy.title}</caption>
            <thead className="border-b border-border bg-surface-muted text-ink-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">{copy.folio}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.client}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.project}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.type}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.status}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.total}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.validUntil}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.updated}</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((quote) => (
                <tr key={quote.id} className="border-b border-border last:border-0">
                  <th scope="row" className="px-4 py-3 font-mono text-xs font-semibold tracking-wide text-ink">
                    <Link
                      to={appQuotePath(quote.id)}
                      className="rounded-md hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      {quote.folio}
                    </Link>
                  </th>
                  <td className="px-4 py-3 text-ink">
                    <Link to={appClientPath(quote.client.id)} className="rounded-md hover:text-brand-700">
                      {clientLabel(quote.client.legalName, quote.client.tradeName)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{displayText(quote.projectName)}</td>
                  <td className="px-4 py-3 text-ink">{t.quotes.type[quote.type]}</td>
                  <td className="px-4 py-3">
                    <QuoteStatusBadge status={quote.status} />
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{formatMoney(quote.total, quote.currency)}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatQuoteDate(quote.validUntil, locale)}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatQuoteDateTime(quote.updatedAt, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {result && total > QUOTE_PAGE_SIZE ? (
        <nav className="mt-4 flex items-center justify-between gap-3" aria-label={copy.title}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() =>
              setSearchParams((current) => {
                const next = new URLSearchParams(current)
                if (page - 1 <= 1) {
                  next.delete('page')
                } else {
                  next.set('page', String(page - 1))
                }
                return next
              })
            }
          >
            {copy.previous}
          </Button>
          <p className={AppTextStyles.bodySm}>
            {copy.page.replace('{page}', String(page)).replace('{pages}', String(pageCount))}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={page >= pageCount}
            onClick={() =>
              setSearchParams((current) => {
                const next = new URLSearchParams(current)
                next.set('page', String(page + 1))
                return next
              })
            }
          >
            {copy.next}
          </Button>
        </nav>
      ) : null}
    </QuotesPage>
  )
}
