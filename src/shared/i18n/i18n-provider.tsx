import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  applyDocumentLocale,
  detectLocale,
  getCatalog,
  persistLocale,
} from './detect-locale'
import { I18nContext } from './i18n-context'
import type { Locale } from './types'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  useEffect(() => {
    applyDocumentLocale(locale)
    persistLocale(locale)
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: getCatalog(locale),
    }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
