import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { mapQuoteError } from '@/features/quotes/domain/map-quote-error'
import type { QuoteList } from '@/features/quotes/domain/quote'
import { QuoteStatusBadge } from '@/features/quotes/presentation/components/quote-status-badge'
import { displayText, formatMoney, formatQuoteDateTime } from '@/features/quotes/presentation/format'
import { quoteBannerMessage } from '@/features/quotes/presentation/messages'
import { useQuoteRepository } from '@/features/quotes/presentation/use-quote-repository'
import { appQuoteNewForClient, appQuotePath, appQuotesForClient } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

const newQuoteClass = cn(
  'inline-flex h-9 items-center justify-center rounded-full bg-brand-700 px-3.5 text-sm font-semibold tracking-tight text-white',
  'transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
)

export function ClientQuotesSection({ clientId }: { clientId: string }) {
  const { t, locale } = useI18n()
  const copy = t.quotes.clientSection
  const repository = useQuoteRepository()
  const [result, setResult] = useState<QuoteList | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    void repository
      .list({ clientId, page: 1, pageSize: 5 }, { signal: controller.signal })
      .then((next) => {
        if (controller.signal.aborted) {
          return
        }

        setResult(next)
        setMessage(null)
        setLoadState('ready')
      })
      .catch((error: unknown) => {
        const mapped = mapQuoteError(error)

        if (mapped.aborted) {
          return
        }

        setMessage(quoteBannerMessage(t.quotes, mapped) ?? copy.error)
        setLoadState('error')
      })

    return () => controller.abort()
  }, [attempt, clientId, copy.error, repository, t.quotes])

  return (
    <section className="mt-6 rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={AppTextStyles.h3}>{copy.title}</h2>
          <p className={cn(AppTextStyles.bodySm, 'mt-1')}>{copy.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {result && result.total > 0 ? (
            <Link to={appQuotesForClient(clientId)} className={cn(AppTextStyles.link, 'inline-flex items-center px-2')}>
              {copy.viewAll}
            </Link>
          ) : null}
          <Link to={appQuoteNewForClient(clientId)} className={newQuoteClass}>
            {copy.newQuote}
          </Link>
        </div>
      </div>

      {loadState === 'loading' ? <p className={cn(AppTextStyles.bodySm, 'mt-4')}>{copy.loading}</p> : null}

      {loadState === 'error' ? (
        <div className="mt-4">
          <StatusBanner
            action={
              <Button type="button" size="sm" variant="secondary" onClick={() => setAttempt((value) => value + 1)}>
                {t.quotes.list.retry}
              </Button>
            }
          >
            {message ?? copy.error}
          </StatusBanner>
        </div>
      ) : null}

      {loadState === 'ready' && result && result.total === 0 ? (
        <p className={cn(AppTextStyles.bodySm, 'mt-4')}>{copy.empty}</p>
      ) : null}

      {result && result.items.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">{copy.title}</caption>
            <thead className="border-b border-border text-ink-muted">
              <tr>
                <th scope="col" className="px-2 py-2 font-medium">{copy.folio}</th>
                <th scope="col" className="px-2 py-2 font-medium">{copy.project}</th>
                <th scope="col" className="px-2 py-2 font-medium">{copy.status}</th>
                <th scope="col" className="px-2 py-2 font-medium">{copy.total}</th>
                <th scope="col" className="px-2 py-2 font-medium">{copy.updated}</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((quote) => (
                <tr key={quote.id} className="border-b border-border last:border-0">
                  <th scope="row" className="px-2 py-3 font-mono text-xs font-semibold text-ink">
                    <Link to={appQuotePath(quote.id)} className="rounded-md hover:text-brand-700">
                      {quote.folio}
                    </Link>
                  </th>
                  <td className="px-2 py-3 text-ink-muted">{displayText(quote.projectName)}</td>
                  <td className="px-2 py-3">
                    <QuoteStatusBadge status={quote.status} />
                  </td>
                  <td className="px-2 py-3 font-medium text-ink">{formatMoney(quote.total, quote.currency)}</td>
                  <td className="px-2 py-3 text-ink-muted">{formatQuoteDateTime(quote.updatedAt, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
