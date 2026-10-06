import { afterEach, describe, expect, it, vi } from 'vitest'
import { detectLocale } from '@/shared/i18n/detect-locale'

function setLanguages(languages: string[]) {
  vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(languages)
  vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(languages[0] ?? '')
}

describe('detectLocale', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it('prefers the stored locale', () => {
    window.localStorage.setItem('aj-locale', 'en')
    setLanguages(['es-MX'])

    expect(detectLocale()).toBe('en')
  })

  it('keeps English browsers on English', () => {
    setLanguages(['en-US'])

    expect(detectLocale()).toBe('en')
  })

  it('uses Spanish for Spanish browsers and as the fallback', () => {
    setLanguages(['es-CO'])
    expect(detectLocale()).toBe('es')

    setLanguages(['fr-FR'])
    expect(detectLocale()).toBe('es')
  })
})
