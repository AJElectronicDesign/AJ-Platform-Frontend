import { en } from './locales/en'
import { es } from './locales/es'
import type { Catalogs, Locale } from './types'

const STORAGE_KEY = 'aj-locale'

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'es'
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)

  if (isLocale(stored)) {
    return stored
  }

  const languages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language]

  for (const language of languages) {
    if (language.toLowerCase().startsWith('es')) {
      return 'es'
    }
  }

  return 'en'
}

export function persistLocale(locale: Locale) {
  window.localStorage.setItem(STORAGE_KEY, locale)
}

export function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale
}

export function getCatalog(locale: Locale): Catalogs {
  return locale === 'es' ? es : en
}
