import { groupDecimal } from '@/features/quotes/domain/money'

export function displayText(value: string | null | undefined, empty = '—'): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : empty
}

export function formatDecimal(value: string | null | undefined, empty = '—'): string {
  if (!value) {
    return empty
  }

  return groupDecimal(value)
}

export function formatMoney(
  amount: string | null | undefined,
  currency: string,
  empty = '—',
): string {
  if (!amount) {
    return empty
  }

  return `${groupDecimal(amount)} ${currency}`
}

export function formatQuoteDate(value: string | null | undefined, locale: string, empty = '—'): string {
  if (!value) {
    return empty
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return value
  }

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(date)
}

export function formatQuoteDateTime(
  value: string | null | undefined,
  locale: string,
  empty = '—',
): string {
  if (!value) {
    return empty
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Mexico_City',
  }).format(date)
}

export function clientLabel(legalName: string, tradeName: string | null): string {
  return tradeName?.trim() ? `${legalName} · ${tradeName}` : legalName
}
