import { createContext } from 'react'
import type { Catalogs, Locale } from './types'

export interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Catalogs
}

export const I18nContext = createContext<I18nContextValue | null>(null)
