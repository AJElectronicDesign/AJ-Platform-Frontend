import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CLIENT_PAGE_SIZE,
  type ActiveFilter,
  type ClientList,
} from '@/features/clients/domain/client'
import { mapClientError } from '@/features/clients/domain/map-client-error'
import { ClientsPage } from '@/features/clients/presentation/clients-page'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { displayText } from '@/features/clients/presentation/format'
import { clientBannerMessage } from '@/features/clients/presentation/messages'
import { useClientRepository } from '@/features/clients/presentation/use-client-repository'
import { useDebouncedValue } from '@/features/clients/presentation/use-debounced-value'
import { paths, appClientPath } from '@/shared/constants/paths'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { cn } from '@/shared/utils/cn'

function isActiveFilter(value: string): value is ActiveFilter {
  return value === 'true' || value === 'false' || value === 'all'
}

const newClientClass = cn(
  'inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-semibold tracking-tight',
  AppColorClasses.bg.brand700,
  AppColorClasses.text.white,
  'transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
)

export function ClientListPage() {
  const { t } = useI18n()
  const copy = t.clients.list
  const repository = useClientRepository()
  const [searchInput, setSearchInput] = useState('')
  const [active, setActive] = useState<ActiveFilter>('true')
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const filterKey = `${debouncedSearch}\0${active}`
  const [appliedFilter, setAppliedFilter] = useState(filterKey)
  const [result, setResult] = useState<ClientList | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  if (filterKey !== appliedFilter) {
    setAppliedFilter(filterKey)
    setPage(1)
  }

  useEffect(() => {
    if (!repository) {
      return
    }

    const controller = new AbortController()

    void repository
      .list(
        {
          q: debouncedSearch.trim() || undefined,
          active,
          page,
          pageSize: CLIENT_PAGE_SIZE,
        },
        { signal: controller.signal },
      )
      .then((next) => {
        if (controller.signal.aborted) {
          return
        }

        setResult(next)
        setErrorMessage(null)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        const mapped = mapClientError(error)

        if (mapped.aborted) {
          return
        }

        setErrorMessage(clientBannerMessage(t.clients, mapped) ?? copy.errorTitle)
        setStatus('error')
      })

    return () => controller.abort()
  }, [active, attempt, copy.errorTitle, debouncedSearch, page, repository, t.clients])

  const total = result?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / CLIENT_PAGE_SIZE))

  if (status === 'ready' && page > pageCount) {
    setPage(pageCount)
  }

  const filtered = debouncedSearch.trim().length > 0 || active !== 'true'

  return (
    <ClientsPage>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={AppTextStyles.eyebrow}>{copy.eyebrow}</p>
          <h1 className={cn(AppTextStyles.h2, 'mt-2')}>{copy.title}</h1>
          <p className={cn(AppTextStyles.bodySm, 'mt-2 max-w-xl')}>{copy.description}</p>
        </div>
        <Link to={paths.appClientNew} className={newClientClass}>
          {copy.newClient}
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]">
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
          <span className={AppTextStyles.label}>{copy.activeFilter}</span>
          <Select
            value={active}
            onChange={(event) => {
              const value = event.target.value
              if (isActiveFilter(value)) {
                setActive(value)
              }
            }}
          >
            <option value="true">{copy.activeTrue}</option>
            <option value="false">{copy.activeFalse}</option>
            <option value="all">{copy.activeAll}</option>
          </Select>
        </label>
      </div>

      <p className={cn(AppTextStyles.caption, 'mt-4')} aria-live="polite">
        {status === 'loading' && !result ? copy.loading : copy.results.replace('{total}', String(total))}
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

      {status === 'ready' && total === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-white px-6 py-16 text-center">
          <p className={AppTextStyles.bodyMd}>{filtered ? copy.emptyFiltered : copy.empty}</p>
        </div>
      ) : null}

      {result && result.items.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-3xl border border-border bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">{copy.title}</caption>
            <thead className="border-b border-border bg-surface-muted text-ink-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">{copy.legalName}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.tradeName}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.rfc}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.primaryContact}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.currency}</th>
                <th scope="col" className="px-4 py-3 font-medium">{copy.status}</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((client) => (
                <tr key={client.id} className="border-b border-border last:border-0">
                  <th scope="row" className="px-4 py-3 font-semibold text-ink">
                    <Link
                      to={appClientPath(client.id)}
                      className="rounded-md hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      {client.legalName}
                    </Link>
                  </th>
                  <td className="px-4 py-3 text-ink-muted">{displayText(client.tradeName)}</td>
                  <td className="px-4 py-3 font-mono text-xs tracking-wide text-ink">{client.rfc}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {displayText(client.primaryContact?.name)}
                  </td>
                  <td className="px-4 py-3 text-ink">{client.currency}</td>
                  <td className="px-4 py-3">
                    <Badge className={client.isActive ? undefined : 'bg-surface-muted text-ink-muted'}>
                      {client.isActive ? copy.active : copy.inactive}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {result && total > CLIENT_PAGE_SIZE ? (
        <nav className="mt-4 flex items-center justify-between gap-3" aria-label={copy.title}>
          <Button type="button" variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
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
            onClick={() => setPage(page + 1)}
          >
            {copy.next}
          </Button>
        </nav>
      ) : null}
    </ClientsPage>
  )
}
