import { Dialog } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { AppTextStyles } from '@/shared/theme'

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  pendingLabel,
  cancelLabel,
  closeLabel,
  pending,
  destructive,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  pendingLabel: string
  cancelLabel: string
  closeLabel: string
  pending: boolean
  destructive?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Dialog open={open} title={title} onClose={onClose} closeLabel={closeLabel}>
      <p className={AppTextStyles.bodySm}>{body}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose} disabled={pending}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className={destructive ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-600' : undefined}
        >
          {pending ? pendingLabel : confirmLabel}
        </Button>
      </div>
    </Dialog>
  )
}
