import { describe, expect, it } from 'vitest'
import { quoteEventSentence } from '@/features/quotes/presentation/format'

const templates = {
  withName: 'Enviada por {name} el {date}',
  withoutName: 'Enviada el {date}',
}

describe('quoteEventSentence', () => {
  it('names the person when the actor summary has a name', () => {
    expect(
      quoteEventSentence(templates, { id: '6b1d9a22-0c44-4e1a-9a55-1d2e3f4a5b6c', name: 'Brayan Olivares' }, '8 oct 2026, 12:30'),
    ).toBe('Enviada por Brayan Olivares el 8 oct 2026, 12:30')
  })

  it('falls back to the date when there is no user or the user row is gone', () => {
    const date = '8 oct 2026, 12:30'

    expect(quoteEventSentence(templates, null, date)).toBe('Enviada el 8 oct 2026, 12:30')
    expect(
      quoteEventSentence(templates, { id: '6b1d9a22-0c44-4e1a-9a55-1d2e3f4a5b6c', name: null }, date),
    ).toBe('Enviada el 8 oct 2026, 12:30')
    expect(
      quoteEventSentence(templates, { id: '6b1d9a22-0c44-4e1a-9a55-1d2e3f4a5b6c', name: '   ' }, date),
    ).toBe('Enviada el 8 oct 2026, 12:30')
  })
})
