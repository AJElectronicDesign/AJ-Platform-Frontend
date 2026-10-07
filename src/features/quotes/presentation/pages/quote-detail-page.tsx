import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '@/features/clients/presentation/components/confirm-dialog'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { vatRateToPercent } from '@/features/quotes/domain/money'
import { mapQuoteError } from '@/features/quotes/domain/map-quote-error'
import type { QuoteDetail } from '@/features/quotes/domain/quote'
import { quoteActionState } from '@/features/quotes/domain/status-actions'
import { QuoteStatusBadge } from '@/features/quotes/presentation/components/quote-status-badge'
import { QuoteTotals } from '@/features/quotes/presentation/components/quote-totals'
import {
  clientLabel,
  displayText,
  formatDecimal,
  formatMoney,
  formatQuoteDate,
  formatQuoteDateTime,
  quoteEventSentence,
} from '@/features/quotes/presentation/format'
import { quoteBannerMessage } from '@/features/quotes/presentation/messages'
import { QuotesPage } from '@/features/quotes/presentation/quotes-page'
import { useQuoteRepository } from '@/features/quotes/presentation/use-quote-repository'
import { appClientPath, appQuoteEditPath, appQuotePath, paths } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

type QuoteNotice = 'saved' | 'copied' | 'accepted' | 'sent' | 'rejected' | 'reverted'
type ConfirmAction = 'accept' | 'reject' | 'delete'
type PendingAction = ConfirmAction | 'send' | 'revert' | 'copy'

function noticeFor(action: 'send' | 'accept' | 'reject' | 'revert'): QuoteNotice {
  switch (action) {
    case 'send':
      return 'sent'
    case 'accept':
      return 'accepted'
    case 'reject':
      return 'rejected'
    case 'revert':
      return 'reverted'
  }
}

function readNotice(state: unknown): QuoteNotice | null {
  if (!state || typeof state !== 'object' || !('notice' in state)) {
    return null
  }

  const notice = (state as { notice?: unknown }).notice

  if (
    notice === 'saved' ||
    notice === 'copied' ||
    notice === 'accepted' ||
    notice === 'sent' ||
    notice === 'rejected' ||
    notice === 'reverted'
  ) {
    return notice
  }

  return null
}

export function QuoteDetailPage() {
  const { t, locale } = useI18n()
  const copy = t.quotes.detail
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const quoteId = params.quoteId ?? ''
  const repository = useQuoteRepository()
  const [quote, setQuote] = useState<QuoteDetail | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState<string | null>(null)
  const [versionConflict, setVersionConflict] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [notice, setNotice] = useState<QuoteNotice | null>(() => readNotice(location.state))
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null)
  const [pending, setPending] = useState<PendingAction | null>(null)

  useEffect(() => {
    if (!quoteId) {
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
        setMessage(null)
        setVersionConflict(false)
        setLoadState('ready')
      })
      .catch((error: unknown) => {
        const mapped = mapQuoteError(error)

        if (mapped.aborted) {
          return
        }

        setMessage(quoteBannerMessage(t.quotes, mapped))
        setLoadState('error')
      })

    return () => controller.abort()
  }, [attempt, quoteId, repository, t.quotes])

  async function reload() {
    try {
      const fresh = await repository.get(quoteId)
      setQuote(fresh)
      setMessage(null)
      setVersionConflict(false)
    } catch (error) {
      const mapped = mapQuoteError(error)
      setMessage(quoteBannerMessage(t.quotes, mapped))
    }
  }

  async function run(action: PendingAction) {
    if (!quote) {
      return
    }

    setPending(action)
    setMessage(null)

    try {
      if (action === 'delete') {
        await repository.remove(quote.id)
        navigate(paths.appQuotations)
        return
      }

      if (action === 'copy') {
        const copied = await repository.copy(quote.id)
        navigate(appQuotePath(copied.id), { state: { notice: 'copied' } })
        return
      }

      const body = { version: quote.version }
      const next =
        action === 'send'
          ? await repository.send(quote.id, body)
          : action === 'accept'
            ? await repository.accept(quote.id, body)
            : action === 'reject'
              ? await repository.reject(quote.id, body)
              : await repository.revertToDraft(quote.id, body)

      setQuote(next)
      setNotice(noticeFor(action))
      setConfirm(null)
      setVersionConflict(false)
    } catch (error) {
      const mapped = mapQuoteError(error)
      setMessage(quoteBannerMessage(t.quotes, mapped))
      setVersionConflict(mapped.versionConflict)
      setConfirm(null)
    } finally {
      setPending(null)
    }
  }

  const actions = quote ? quoteActionState(quote.status, quote.items.length) : null
  const sortedItems = quote ? quote.items.slice().sort((left, right) => left.position - right.position) : []

  return (
    <QuotesPage>
      <Link to={paths.appQuotations} className={cn(AppTextStyles.link, 'inline-flex')}>
        {copy.backToList}
      </Link>

      {loadState === 'loading' ? <p className={cn(AppTextStyles.bodySm, 'mt-8')}>{copy.loading}</p> : null}

      {loadState === 'error' ? (
        <div className="mt-8 max-w-xl">
          <StatusBanner
            action={
              <Button type="button" size="sm" variant="secondary" onClick={() => setAttempt((value) => value + 1)}>
                {t.quotes.list.retry}
              </Button>
            }
          >
            {message ?? t.quotes.errors.notFound}
          </StatusBanner>
        </div>
      ) : null}

      {loadState === 'ready' && quote && actions ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className={cn(AppTextStyles.eyebrow, 'font-mono normal-case tracking-normal')}>{quote.folio}</p>
              <h1 className={cn(AppTextStyles.h2, 'mt-2')}>{displayText(quote.projectName, quote.folio)}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <QuoteStatusBadge status={quote.status} />
                <span className={AppTextStyles.bodySm}>{t.quotes.type[quote.type]}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {actions.showEdit ? (
                <Button type="button" variant="secondary" onClick={() => navigate(appQuoteEditPath(quote.id))}>
                  {copy.edit}
                </Button>
              ) : null}
              {actions.showSend ? (
                <Button type="button" disabled={!actions.sendEnabled || pending !== null} onClick={() => void run('send')}>
                  {pending === 'send' ? copy.working : copy.send}
                </Button>
              ) : null}
              {actions.showAccept ? (
                <Button
                  type="button"
                  disabled={!actions.acceptEnabled || pending !== null}
                  aria-describedby={actions.acceptDisabledReason ? 'quote-accept-reason' : undefined}
                  onClick={() => setConfirm('accept')}
                >
                  {copy.accept}
                </Button>
              ) : null}
              {actions.showReject ? (
                <Button type="button" variant="secondary" disabled={pending !== null} onClick={() => setConfirm('reject')}>
                  {copy.reject}
                </Button>
              ) : null}
              {actions.showRevert ? (
                <Button type="button" variant="secondary" disabled={pending !== null} onClick={() => void run('revert')}>
                  {pending === 'revert' ? copy.working : copy.revert}
                </Button>
              ) : null}
              {actions.showCopy ? (
                <Button type="button" variant="secondary" disabled={pending !== null} onClick={() => void run('copy')}>
                  {pending === 'copy' ? copy.working : copy.copy}
                </Button>
              ) : null}
              {actions.showDelete ? (
                <Button type="button" variant="ghost" disabled={pending !== null} onClick={() => setConfirm('delete')}>
                  {copy.delete}
                </Button>
              ) : null}
            </div>
          </div>

          {actions.acceptDisabledReason ? (
            <p id="quote-accept-reason" className={cn(AppTextStyles.bodySm, 'mt-4 max-w-2xl')}>
              {copy.expiredAccept}
            </p>
          ) : null}
          {actions.sendDisabledReason ? (
            <p className={cn(AppTextStyles.bodySm, 'mt-4')}>{copy.emptySend}</p>
          ) : null}
          {!actions.showEdit && !actions.showSend && !actions.showAccept ? (
            <p className={cn(AppTextStyles.bodySm, 'mt-4 max-w-2xl')}>{copy.readOnly}</p>
          ) : null}

          <div className="mt-4 space-y-4">
            {notice ? (
              <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                {t.quotes.notice[notice]}
              </div>
            ) : null}
            {message ? (
              <StatusBanner
                action={
                  versionConflict ? (
                    <Button type="button" size="sm" variant="secondary" onClick={() => void reload()}>
                      {t.quotes.errors.reload}
                    </Button>
                  ) : undefined
                }
              >
                {message}
              </StatusBanner>
            ) : null}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
                <h2 className={AppTextStyles.h3}>{copy.client}</h2>
                <p className={cn(AppTextStyles.bodyMd, 'mt-3')}>
                  <Link to={appClientPath(quote.client.id)} className="rounded-md hover:text-brand-700">
                    {clientLabel(quote.client.legalName, quote.client.tradeName)}
                  </Link>
                </p>
                <p className={cn(AppTextStyles.caption, 'mt-1 font-mono')}>
                  {quote.client.rfc} · {quote.client.quotePrefix}
                </p>
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Fact label={copy.project} value={displayText(quote.projectName, copy.none)} />
                  <Fact label={copy.attentionTo} value={quote.attentionTo} />
                  <Fact
                    label={copy.requestedBy}
                    value={
                      quote.requestedByName || quote.requestedByEmail
                        ? [quote.requestedByName, quote.requestedByEmail].filter(Boolean).join(' · ')
                        : copy.none
                    }
                  />
                  <Fact label={copy.currency} value={quote.currency} />
                  <Fact label={copy.exchangeRate} value={formatDecimal(quote.exchangeRate, copy.none)} />
                  <Fact label={copy.deliveryTime} value={displayText(quote.deliveryTime, copy.none)} />
                  <Fact label={copy.validUntil} value={formatQuoteDate(quote.validUntil, locale, copy.none)} />
                  <Fact label={copy.updatedAt} value={formatQuoteDateTime(quote.updatedAt, locale, copy.none)} />
                </dl>
                {quote.notes ? (
                  <div className="mt-5">
                    <p className={AppTextStyles.caption}>{copy.notes}</p>
                    <p className={cn(AppTextStyles.bodyMd, 'mt-1 whitespace-pre-wrap')}>{quote.notes}</p>
                  </div>
                ) : null}
              </section>

              <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
                <h2 className={AppTextStyles.h3}>{copy.items}</h2>
                {sortedItems.length === 0 ? (
                  <p className={cn(AppTextStyles.bodySm, 'mt-4')}>{copy.itemsEmpty}</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <caption className="sr-only">{copy.items}</caption>
                      <thead className="border-b border-border text-ink-muted">
                        <tr>
                          <th scope="col" className="px-2 py-2 font-medium">{copy.description}</th>
                          <th scope="col" className="px-2 py-2 font-medium">{copy.quantity}</th>
                          <th scope="col" className="px-2 py-2 font-medium">{copy.unitPrice}</th>
                          <th scope="col" className="px-2 py-2 font-medium">{copy.lineTotal}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedItems.map((item) => (
                          <tr key={item.id} className="border-b border-border last:border-0">
                            <th scope="row" className="px-2 py-3 font-medium text-ink">{item.description}</th>
                            <td className="px-2 py-3 text-ink-muted">{formatDecimal(item.quantity)}</td>
                            <td className="px-2 py-3 text-ink-muted">{formatDecimal(item.unitPrice)}</td>
                            <td className="px-2 py-3 font-medium text-ink">{formatMoney(item.lineTotal, quote.currency)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
                <h2 className={AppTextStyles.h3}>{copy.timeline}</h2>
                {quote.sentAt || quote.acceptedAt || quote.rejectedAt ? null : (
                  <p className={cn(AppTextStyles.bodySm, 'mt-4')}>{copy.timelineEmpty}</p>
                )}
                <ol className="mt-4 space-y-3">
                  <li className={AppTextStyles.bodyMd}>
                    {quoteEventSentence(
                      { withName: copy.createdBy, withoutName: copy.createdOn },
                      quote.createdBy,
                      formatQuoteDateTime(quote.createdAt, locale),
                    )}
                  </li>
                  {quote.updatedAt !== quote.createdAt ? (
                    <li className={AppTextStyles.bodyMd}>
                      {quoteEventSentence(
                        { withName: copy.updatedBy, withoutName: copy.updatedOn },
                        quote.updatedBy,
                        formatQuoteDateTime(quote.updatedAt, locale),
                      )}
                    </li>
                  ) : null}
                  {quote.sentAt ? (
                    <li className={AppTextStyles.bodyMd}>
                      {quoteEventSentence(
                        { withName: copy.sentBy, withoutName: copy.sentOn },
                        quote.sentBy,
                        formatQuoteDateTime(quote.sentAt, locale),
                      )}
                    </li>
                  ) : null}
                  {quote.acceptedAt ? (
                    <li className={AppTextStyles.bodyMd}>
                      {quoteEventSentence(
                        { withName: copy.acceptedBy, withoutName: copy.acceptedOn },
                        quote.acceptedBy,
                        formatQuoteDateTime(quote.acceptedAt, locale),
                      )}
                    </li>
                  ) : null}
                  {quote.rejectedAt ? (
                    <li className={AppTextStyles.bodyMd}>
                      {quoteEventSentence(
                        { withName: copy.rejectedBy, withoutName: copy.rejectedOn },
                        quote.rejectedBy,
                        formatQuoteDateTime(quote.rejectedAt, locale),
                      )}
                    </li>
                  ) : null}
                </ol>
              </section>
            </div>

            <QuoteTotals
              title={copy.total}
              currency={quote.currency}
              subtotal={quote.subtotal}
              vatAmount={quote.vatAmount}
              total={quote.total}
              includeVat={quote.includeVat}
              vatPercent={vatRateToPercent(quote.vatRate)}
            />
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirm === 'accept'}
        title={copy.acceptTitle}
        body={copy.acceptBody}
        confirmLabel={copy.accept}
        pendingLabel={copy.working}
        cancelLabel={copy.cancel}
        closeLabel={t.quotes.closeDialog}
        pending={pending === 'accept'}
        onConfirm={() => {
          void run('accept')
        }}
        onClose={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'reject'}
        title={copy.rejectTitle}
        body={copy.rejectBody}
        confirmLabel={copy.reject}
        pendingLabel={copy.working}
        cancelLabel={copy.cancel}
        closeLabel={t.quotes.closeDialog}
        pending={pending === 'reject'}
        onConfirm={() => {
          void run('reject')
        }}
        onClose={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'delete'}
        title={copy.deleteTitle}
        body={copy.deleteBody}
        confirmLabel={copy.delete}
        pendingLabel={copy.working}
        cancelLabel={copy.cancel}
        closeLabel={t.quotes.closeDialog}
        pending={pending === 'delete'}
        destructive
        onConfirm={() => {
          void run('delete')
        }}
        onClose={() => setConfirm(null)}
      />
    </QuotesPage>
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
