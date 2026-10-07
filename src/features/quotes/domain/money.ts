/**
 * Decimal money without binary floats.
 *
 * Quantity and unit price use 4 fractional digits. Money uses 2.
 * Rounding is half away from zero, matching the quotes API:
 *
 *   line total = round(quantity * unit price, 2)
 *   subtotal   = sum of those line totals
 *   VAT        = round(subtotal * vat rate, 2) when VAT is included, else 0.00
 *   total      = subtotal + VAT
 *
 * The exchange rate is informative and is not an input to these totals.
 */

const MAX_CENTS = 10n ** 18n - 1n

export interface LineInput {
  description: string
  quantity: string
  unitPrice: string
}

export interface PricedItem {
  position: number
  description: string
  quantity: string
  unitPrice: string
  lineTotal: string
}

export interface PricedQuote {
  items: PricedItem[]
  subtotal: string
  vatAmount: string
  total: string
}

export type PriceFailureCode = 'LINE_TOTAL_OVERFLOW' | 'TOTAL_OVERFLOW'

export interface PriceFailure {
  path: string
  code: PriceFailureCode
  message: string
}

export type DecimalIssueCode = 'INVALID_DECIMAL' | 'TOO_MANY_DECIMALS' | 'TOO_MANY_DIGITS'

/** Fixed-scale canonical form. Rejects signs, exponents, and extra fraction digits. */
export function canonicalizeDecimal(
  raw: string,
  scale: number,
  maxIntegerDigits: number,
): { ok: true; value: string } | { ok: false; code: DecimalIssueCode } {
  const trimmed = raw.trim()

  if (!/^\d+(\.\d+)?$/.test(trimmed)) {
    return { ok: false, code: 'INVALID_DECIMAL' }
  }

  const [ints, frac = ''] = trimmed.split('.')

  if (ints === undefined) {
    return { ok: false, code: 'INVALID_DECIMAL' }
  }

  if (frac.length > scale) {
    return { ok: false, code: 'TOO_MANY_DECIMALS' }
  }

  const intNorm = ints.replace(/^0+(?=\d)/, '')

  if (intNorm.length > maxIntegerDigits) {
    return { ok: false, code: 'TOO_MANY_DIGITS' }
  }

  return { ok: true, value: `${intNorm}.${frac.padEnd(scale, '0')}` }
}

/** Accepts a decimal that may omit trailing zeros and rewrites it at `scale`. */
export function normalizeDecimal(value: string, scale: number): string {
  const trimmed = value.trim()
  const negative = trimmed.startsWith('-')
  const body = negative ? trimmed.slice(1) : trimmed
  const match = /^(\d+)(?:\.(\d+))?$/.exec(body)

  if (!match) {
    throw new Error(`Invalid decimal: ${value}`)
  }

  const ints = (match[1] ?? '0').replace(/^0+(?=\d)/, '')
  const frac = match[2] ?? ''

  if (frac.length > scale) {
    throw new Error(`Decimal ${value} has more than ${scale} fractional digits`)
  }

  const formatted = `${ints}.${frac.padEnd(scale, '0')}`
  return negative ? `-${formatted}` : formatted
}

export function parseScaled(value: string, scale: number): bigint {
  const trimmed = value.trim()
  const negative = trimmed.startsWith('-')
  const body = negative ? trimmed.slice(1) : trimmed
  const match = /^(\d+)\.(\d+)$/.exec(body)

  if (!match || (match[2] ?? '').length !== scale) {
    throw new Error(`Invalid scaled decimal: ${value}`)
  }

  const combined = BigInt(`${match[1] ?? '0'}${match[2] ?? ''}`)
  return negative ? -combined : combined
}

export function formatScaled(value: bigint, scale: number): string {
  const negative = value < 0n
  const digits = (negative ? -value : value).toString().padStart(scale + 1, '0')
  const cut = digits.length - scale
  const formatted = `${digits.slice(0, cut)}.${digits.slice(cut)}`
  return negative ? `-${formatted}` : formatted
}

/** `value` is an integer at `fromScale` fractional digits. */
export function roundHalfAwayFromZero(value: bigint, fromScale: number, toScale: number): bigint {
  if (toScale > fromScale) {
    return value * 10n ** BigInt(toScale - fromScale)
  }

  if (toScale === fromScale) {
    return value
  }

  const factor = 10n ** BigInt(fromScale - toScale)
  const negative = value < 0n
  const abs = negative ? -value : value
  const quotient = abs / factor
  const remainder = abs % factor
  const rounded = remainder * 2n >= factor ? quotient + 1n : quotient
  return negative ? -rounded : rounded
}

export function priceQuote(
  lines: readonly LineInput[],
  includeVat: boolean,
  vatRate: string,
): { ok: true; priced: PricedQuote } | { ok: false; failure: PriceFailure } {
  const items: PricedItem[] = []
  let subtotalCents = 0n

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]

    if (!line) {
      continue
    }

    const quantity = parseScaled(line.quantity, 4)
    const unitPrice = parseScaled(line.unitPrice, 4)
    const lineCents = roundHalfAwayFromZero(quantity * unitPrice, 8, 2)

    if (lineCents > MAX_CENTS) {
      return {
        ok: false,
        failure: {
          path: `items.${index}.quantity`,
          code: 'LINE_TOTAL_OVERFLOW',
          message: 'El importe de la partida excede el máximo permitido',
        },
      }
    }

    subtotalCents += lineCents

    if (subtotalCents > MAX_CENTS) {
      return {
        ok: false,
        failure: {
          path: 'items',
          code: 'TOTAL_OVERFLOW',
          message: 'El subtotal excede el máximo permitido',
        },
      }
    }

    items.push({
      position: index + 1,
      description: line.description,
      quantity: formatScaled(quantity, 4),
      unitPrice: formatScaled(unitPrice, 4),
      lineTotal: formatScaled(lineCents, 2),
    })
  }

  const rate = parseScaled(vatRate, 4)
  const vatCents = includeVat ? roundHalfAwayFromZero(subtotalCents * rate, 6, 2) : 0n
  const totalCents = subtotalCents + vatCents

  if (totalCents > MAX_CENTS) {
    return {
      ok: false,
      failure: {
        path: 'total',
        code: 'TOTAL_OVERFLOW',
        message: 'El total excede el máximo permitido',
      },
    }
  }

  return {
    ok: true,
    priced: {
      items,
      subtotal: formatScaled(subtotalCents, 2),
      vatAmount: formatScaled(vatCents, 2),
      total: formatScaled(totalCents, 2),
    },
  }
}

/** Turns a single comma decimal (`1,5`) into a dot. Mixed separators stay unchanged. */
export function normalizeDecimalInput(raw: string): string {
  const trimmed = raw.trim().replace(/[\s_]/g, '')

  if (/^\d+,\d+$/.test(trimmed)) {
    return trimmed.replace(',', '.')
  }

  return trimmed
}

export function trimTrailingZeros(value: string): string {
  if (!value.includes('.')) {
    return value
  }

  return value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
}

export function groupDecimal(value: string): string {
  const negative = value.startsWith('-')
  const body = negative ? value.slice(1) : value
  const [ints = '0', frac] = body.split('.')
  const grouped = ints.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const text = frac === undefined ? grouped : `${grouped}.${frac}`
  return negative ? `-${text}` : text
}

export type DecimalFieldFailure = 'invalid' | 'not_positive' | 'range'

export function parseQuantity(
  raw: string,
): { ok: true; value: string } | { ok: false; reason: DecimalFieldFailure } {
  const parsed = canonicalizeDecimal(normalizeDecimalInput(raw), 4, 14)

  if (!parsed.ok) {
    return { ok: false, reason: 'invalid' }
  }

  if (parseScaled(parsed.value, 4) <= 0n) {
    return { ok: false, reason: 'not_positive' }
  }

  return { ok: true, value: parsed.value }
}

export function parseUnitPrice(
  raw: string,
): { ok: true; value: string } | { ok: false; reason: DecimalFieldFailure } {
  const parsed = canonicalizeDecimal(normalizeDecimalInput(raw), 4, 14)

  if (!parsed.ok) {
    return { ok: false, reason: 'invalid' }
  }

  return { ok: true, value: parsed.value }
}

export function parseExchangeRate(
  raw: string,
): { ok: true; value: string } | { ok: false; reason: DecimalFieldFailure } {
  const parsed = canonicalizeDecimal(normalizeDecimalInput(raw), 6, 12)

  if (!parsed.ok) {
    return { ok: false, reason: 'invalid' }
  }

  if (parseScaled(parsed.value, 6) <= 0n) {
    return { ok: false, reason: 'not_positive' }
  }

  return { ok: true, value: parsed.value }
}

/** `16` or `16.5` percent becomes the API rate `0.1600` / `0.1650`. */
export function percentToVatRate(
  percent: string,
): { ok: true; value: string } | { ok: false; reason: DecimalFieldFailure } {
  const normalized = normalizeDecimalInput(percent)

  if (!normalized) {
    return { ok: false, reason: 'invalid' }
  }

  const parsed = canonicalizeDecimal(normalized, 2, 3)

  if (!parsed.ok) {
    return { ok: false, reason: 'invalid' }
  }

  const scaled = parseScaled(parsed.value, 2)

  if (scaled > 10000n) {
    return { ok: false, reason: 'range' }
  }

  return { ok: true, value: formatScaled(scaled, 4) }
}

export function vatRateToPercent(rate: string): string {
  const normalized = normalizeDecimal(rate, 4)
  return trimTrailingZeros(formatScaled(parseScaled(normalized, 4), 2))
}

export interface LinePreview {
  lineTotal: string | null
  invalid: boolean
}

export interface TotalsPreview {
  lines: LinePreview[]
  subtotal: string | null
  vatAmount: string | null
  total: string | null
}

function lineIsBlank(line: { description?: string; quantity: string; unitPrice: string }): boolean {
  return !line.description?.trim() && line.quantity.trim() === '' && line.unitPrice.trim() === ''
}

/**
 * Live totals for the form. Blank rows are ignored.
 * A non-blank row with an invalid decimal blocks the quote totals.
 * VAT is 0.00 when it is not included, even if the rate field is incomplete.
 */
export function previewQuoteTotals(
  lines: readonly { description?: string; quantity: string; unitPrice: string }[],
  includeVat: boolean,
  vatPercent: string,
): TotalsPreview {
  const previews: LinePreview[] = []
  const pricedLines: LineInput[] = []
  let blocked = false

  for (const line of lines) {
    if (lineIsBlank(line)) {
      previews.push({ lineTotal: null, invalid: false })
      continue
    }

    const quantity = parseQuantity(line.quantity)
    const unitPrice = parseUnitPrice(line.unitPrice)

    if (!quantity.ok || !unitPrice.ok) {
      previews.push({ lineTotal: null, invalid: true })
      blocked = true
      continue
    }

    const priced = priceQuote(
      [{ description: 'line', quantity: quantity.value, unitPrice: unitPrice.value }],
      false,
      '0.0000',
    )

    if (!priced.ok) {
      previews.push({ lineTotal: null, invalid: true })
      blocked = true
      continue
    }

    previews.push({ lineTotal: priced.priced.items[0]?.lineTotal ?? null, invalid: false })
    pricedLines.push({
      description: 'line',
      quantity: quantity.value,
      unitPrice: unitPrice.value,
    })
  }

  if (blocked) {
    return { lines: previews, subtotal: null, vatAmount: null, total: null }
  }

  const subtotalQuote = priceQuote(pricedLines, false, '0.0000')

  if (!subtotalQuote.ok) {
    return { lines: previews, subtotal: null, vatAmount: null, total: null }
  }

  if (!includeVat) {
    return {
      lines: previews,
      subtotal: subtotalQuote.priced.subtotal,
      vatAmount: subtotalQuote.priced.vatAmount,
      total: subtotalQuote.priced.total,
    }
  }

  const rate = percentToVatRate(vatPercent)

  if (!rate.ok) {
    return {
      lines: previews,
      subtotal: subtotalQuote.priced.subtotal,
      vatAmount: null,
      total: null,
    }
  }

  const withVat = priceQuote(pricedLines, true, rate.value)

  if (!withVat.ok) {
    return {
      lines: previews,
      subtotal: subtotalQuote.priced.subtotal,
      vatAmount: null,
      total: null,
    }
  }

  return {
    lines: previews,
    subtotal: withVat.priced.subtotal,
    vatAmount: withVat.priced.vatAmount,
    total: withVat.priced.total,
  }
}
