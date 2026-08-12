import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type MouseEvent,
  type KeyboardEvent,
} from 'react'
import { AppColorClasses, AppTextStyles } from '@/shared/theme'
import { cn } from '@/shared/utils/cn'

export interface DialogProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  /** Optional element that should receive focus when the dialog closes. */
  returnFocusRef?: React.RefObject<HTMLElement | null>
  /** When false, focus is not restored on close (e.g. navigating elsewhere). */
  restoreFocus?: boolean
  className?: string
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function Dialog({
  open,
  title,
  onClose,
  children,
  returnFocusRef,
  restoreFocus = true,
  className,
}: DialogProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const focusReturnTarget =
      returnFocusRef?.current ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null)
    previouslyFocused.current = focusReturnTarget

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const panel = panelRef.current
    const focusables = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : []
    const initialFocus =
      focusables.find((el) => el.dataset.dialogClose === 'true') ??
      focusables[0] ??
      panel
    initialFocus?.focus()

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panel) {
        return
      }

      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1)

      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (restoreFocus) {
        focusReturnTarget?.focus()
      }
    }
  }, [open, onClose, returnFocusRef, restoreFocus])

  if (!open) {
    return null
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  function handleBackdropKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      // Backdrop is not a control; Escape handles keyboard close.
      event.preventDefault()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-navy/55 p-0 sm:items-center sm:p-6"
      onClick={handleBackdropClick}
      onKeyDown={handleBackdropKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden border bg-white outline-none',
          'rounded-t-3xl sm:rounded-3xl',
          AppColorClasses.border.DEFAULT,
          'motion-safe:transition-opacity motion-safe:duration-200',
          className,
        )}
      >
        <div
          className={cn(
            'flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-6',
            AppColorClasses.border.DEFAULT,
          )}
        >
          <h2 id={titleId} className={cn(AppTextStyles.h3, 'pr-2 text-xl')}>
            {title}
          </h2>
          <button
            type="button"
            data-dialog-close="true"
            aria-label="Close dialog"
            onClick={onClose}
            className={cn(
              'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-ink-muted transition-colors',
              AppColorClasses.border.DEFAULT,
              'hover:bg-brand-50 hover:text-brand-800',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            )}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
