import { useEffect, useId, useRef, useState } from 'react'
import type { ClientListItem, Currency } from '@/features/clients/domain/client'
import { mapClientError } from '@/features/clients/domain/map-client-error'
import { useClientRepository } from '@/features/clients/presentation/use-client-repository'
import { useDebouncedValue } from '@/features/clients/presentation/use-debounced-value'
import { clientLabel } from '@/features/quotes/presentation/format'
import { useI18n } from '@/shared/i18n'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/utils/cn'

export interface PickedClient {
  id: string
  legalName: string
  tradeName: string | null
  rfc: string
  currency: Currency
}

export function ClientPicker({
  id,
  selected,
  locked,
  error,
  actionLabel,
  hint,
  onSelect,
  onClear,
}: {
  id?: string
  selected: PickedClient | null
  locked?: boolean
  error?: string
  actionLabel?: string
  hint?: string
  onSelect: (client: PickedClient) => void
  onClear?: () => void
}) {
  const { t } = useI18n()
  const copy = t.quotes.form
  const listCopy = t.quotes.list
  const repository = useClientRepository()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debounced = useDebouncedValue(query, 300)
  const [results, setResults] = useState<ClientListItem[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')

  useEffect(() => {
    if (!open) {
      return
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (!open || !repository) {
      return
    }

    const controller = new AbortController()
    setStatus('loading')

    void repository
      .list(
        {
          q: debounced.trim() || undefined,
          active: 'true',
          page: 1,
          pageSize: 20,
        },
        { signal: controller.signal },
      )
      .then((page) => {
        if (controller.signal.aborted) {
          return
        }

        setResults(page.items)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        if (mapClientError(error).aborted || controller.signal.aborted) {
          return
        }

        setStatus('error')
      })

    return () => controller.abort()
  }, [debounced, open, repository])

  function choose(client: ClientListItem) {
    onSelect({
      id: client.id,
      legalName: client.legalName,
      tradeName: client.tradeName,
      rfc: client.rfc,
      currency: client.currency,
    })
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={rootRef} className="space-y-2">
      <span className={AppTextStyles.label} id={id ? `${id}-label` : undefined}>
        {listCopy.client}
      </span>
      {selected ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white px-4 py-3">
          <div>
            <p className={AppTextStyles.bodyMd}>{clientLabel(selected.legalName, selected.tradeName)}</p>
            {selected.rfc ? <p className={cn(AppTextStyles.caption, 'mt-1 font-mono')}>{selected.rfc}</p> : null}
          </div>
          {locked ? null : (
            <Button
              type="button"
              id={id}
              size="sm"
              variant="secondary"
              onClick={() => onClear?.()}
            >
              {actionLabel ?? copy.changeClient}
            </Button>
          )}
        </div>
      ) : (
        <Input
          id={id}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={Boolean(error)}
          aria-describedby={error && id ? `${id}-error` : undefined}
          placeholder={listCopy.clientPlaceholder}
          value={query}
          maxLength={100}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
        />
      )}
      {error ? (
        <p id={id ? `${id}-error` : undefined} className={cn(AppTextStyles.caption, AppColorClasses.text.danger)}>
          {error}
        </p>
      ) : hint === '' ? null : (
        <p className={AppTextStyles.caption}>{hint ?? copy.clientHint}</p>
      )}
      {open && !selected ? (
        <div id={listId} role="listbox" className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {status === 'loading' ? <p className="px-4 py-3 text-sm text-ink-muted">{copy.searching}</p> : null}
          {status === 'error' ? (
            <p className={cn('px-4 py-3 text-sm', AppColorClasses.text.danger)}>{t.quotes.errors.network}</p>
          ) : null}
          {status === 'ready' && results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-ink-muted">{copy.noClients}</p>
          ) : null}
          {status === 'ready'
            ? results.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  role="option"
                  className="block w-full px-4 py-3 text-left hover:bg-brand-50 focus-visible:bg-brand-50 focus-visible:outline-none"
                  onClick={() => choose(client)}
                >
                  <span className="block text-sm font-medium text-ink">
                    {clientLabel(client.legalName, client.tradeName)}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-ink-muted">
                    {client.rfc} · {client.currency}
                  </span>
                </button>
              ))
            : null}
        </div>
      ) : null}
    </div>
  )
}
