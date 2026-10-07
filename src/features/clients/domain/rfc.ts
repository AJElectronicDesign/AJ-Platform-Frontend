export const GENERIC_PUBLIC_RFC = 'XAXX010101000'
export const GENERIC_FOREIGN_RFC = 'XEXX010101000'

const GENERIC_RFCS = new Set<string>([GENERIC_PUBLIC_RFC, GENERIC_FOREIGN_RFC])

export type SatPersonType = 'fisica' | 'moral'

export type ParsedRfc =
  | { ok: true; rfc: string; personType: SatPersonType }
  | { ok: false; message: 'format' | 'date' }

const MONTH_LENGTHS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/** Trim, uppercase, and drop spaces or hyphens. Mirrors the API normalizer. */
export function normalizeRfc(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '')
}

export function isGenericRfc(rfc: string): boolean {
  return GENERIC_RFCS.has(rfc)
}

export function personTypeFromRfc(rfc: string): SatPersonType {
  return rfc.length === 12 ? 'moral' : 'fisica'
}

function isGregorianLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * SAT prints a two-digit year. Feb 29 is accepted when either 19YY or 20YY
 * is a leap year, so year 00 (2000) is valid and year 01 is not.
 */
function isLeapRfcYear(yy: number): boolean {
  return isGregorianLeap(1900 + yy) || isGregorianLeap(2000 + yy)
}

function isValidRfcDate(yy: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1) {
    return false
  }

  const max = month === 2 && isLeapRfcYear(yy) ? 29 : MONTH_LENGTHS[month]

  if (max === undefined) {
    return false
  }

  return day <= max
}

export function parseRfc(input: string): ParsedRfc {
  const rfc = normalizeRfc(input)
  const match = /^([A-ZÑ&]{3,4})(\d{2})(\d{2})(\d{2})([A-Z0-9]{3})$/.exec(rfc)

  if (!match) {
    return { ok: false, message: 'format' }
  }

  const name = match[1]
  const year = match[2]
  const month = match[3]
  const day = match[4]

  if (!name || !year || !month || !day) {
    return { ok: false, message: 'format' }
  }

  if (name.length === 3 && rfc.length !== 12) {
    return { ok: false, message: 'format' }
  }

  if (name.length === 4 && rfc.length !== 13) {
    return { ok: false, message: 'format' }
  }

  if (!isValidRfcDate(Number(year), Number(month), Number(day))) {
    return { ok: false, message: 'date' }
  }

  return { ok: true, rfc, personType: name.length === 3 ? 'moral' : 'fisica' }
}
