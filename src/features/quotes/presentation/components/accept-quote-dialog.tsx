import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TextField } from '@/features/clients/presentation/components/form-field'
import { StatusBanner } from '@/features/clients/presentation/components/status-banner'
import { useI18n } from '@/shared/i18n'
import { AppTextStyles } from '@/shared/theme'
import { Button } from '@/shared/ui/button'
import { Dialog } from '@/shared/ui/dialog'
import { cn } from '@/shared/utils/cn'

function normalizeClientPoNumber(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length === 0 ? null : trimmed.slice(0, 80)
}

export function AcceptQuoteDialog({
  open,
  pending,
  clientPoError,
  banner,
  successHref,
  onConfirm,
  onClose,
}: {
  open: boolean
  pending: boolean
  clientPoError: string | null
  banner: string | null
  successHref: string | null
  onConfirm: (clientPoNumber: string | null) => void
  onClose: () => void
}) {
  const { t } = useI18n()
  const copy = t.quotes.detail
  const [clientPoNumber, setClientPoNumber] = useState('')

  useEffect(() => {
    if (!open) {
      setClientPoNumber('')
    }
  }, [open])

  return (
    <Dialog open={open} title={copy.acceptTitle} onClose={onClose} closeLabel={t.quotes.closeDialog}>
      {successHref ? (
        <div className="space-y-4">
          <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {t.quotes.notice.accepted}
          </p>
          <Link
            to={successHref}
            className={cn(
              'inline-flex h-10 items-center justify-center rounded-full bg-brand-700 px-4 text-sm font-semibold text-white',
              'hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            )}
          >
            {copy.viewDeliveryOrder}
          </Link>
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              {copy.cancel}
            </Button>
          </div>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            onConfirm(normalizeClientPoNumber(clientPoNumber))
          }}
        >
          <p className={AppTextStyles.bodySm}>{copy.acceptBody}</p>
          {banner ? <StatusBanner>{banner}</StatusBanner> : null}
          <TextField
            id="accept-client-po"
            label={copy.clientPoNumber}
            hint={copy.clientPoNumberHint}
            value={clientPoNumber}
            maxLength={80}
            error={clientPoError ?? undefined}
            onChange={(event) => setClientPoNumber(event.target.value)}
          />
          <div className="flex flex-wrap justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose} disabled={pending}>
              {copy.cancel}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? copy.working : copy.accept}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}
