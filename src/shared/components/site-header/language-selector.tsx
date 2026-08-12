import { useEffect, useId, useRef, useState } from 'react'
import { AppIcons, AppTextStyles } from '@/shared/theme'
import { useI18n } from '@/shared/i18n'
import type { Locale } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'

const localeLabels: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
}

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          AppTextStyles.navLink,
          'inline-flex h-10 min-w-10 items-center gap-1.5 px-2.5',
          open && 'bg-brand-50 font-semibold text-brand-800',
        )}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        aria-label={t.common.language}
        onClick={() => setOpen((current) => !current)}
      >
        <AppIcons.globe className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {locale}
        </span>
        <AppIcons.chevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute right-0 z-50 mt-2 min-w-[10.5rem] rounded-2xl border border-border/70 bg-white p-1.5 shadow-[var(--shadow-soft)]"
        >
          {(['en', 'es'] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={cn(
                'flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                option === locale
                  ? 'bg-brand-50 font-semibold text-brand-800'
                  : 'text-ink-muted hover:bg-brand-50 hover:text-brand-800',
              )}
              aria-current={option === locale ? 'true' : undefined}
              onClick={() => {
                setLocale(option)
                setOpen(false)
              }}
            >
              {localeLabels[option]}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
