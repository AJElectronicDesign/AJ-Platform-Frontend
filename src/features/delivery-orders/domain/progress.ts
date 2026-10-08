import { normalizeDecimal, parseScaled } from '@/features/quotes/domain/money'

/** Fraction of ordered quantity that has been delivered, from 0 to 1. */
export function deliveryProgressFraction(ordered: string, delivered: string): number {
  const total = parseScaled(normalizeDecimal(ordered, 4), 4)

  if (total <= 0n) {
    return 0
  }

  const done = parseScaled(normalizeDecimal(delivered, 4), 4)
  const capped = done > total ? total : done < 0n ? 0n : done
  const basisPoints = (capped * 10000n) / total

  return Number(basisPoints) / 10000
}

export function compareQuantity(left: string, right: string): number {
  const a = parseScaled(normalizeDecimal(left, 4), 4)
  const b = parseScaled(normalizeDecimal(right, 4), 4)

  if (a < b) {
    return -1
  }

  if (a > b) {
    return 1
  }

  return 0
}

/** Today in America/Mexico_City, the calendar the delivery API uses when the date is omitted. */
export function mexicoCityToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  const day = parts.find((part) => part.type === 'day')?.value

  return `${year}-${month}-${day}`
}
