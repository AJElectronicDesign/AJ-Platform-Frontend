import { describe, expect, it } from 'vitest'
import {
  groupDecimal,
  percentToVatRate,
  previewQuoteTotals,
  priceQuote,
  roundHalfAwayFromZero,
  vatRateToPercent,
} from '@/features/quotes/domain/money'

describe('roundHalfAwayFromZero', () => {
  it('rounds a positive tie away from zero', () => {
    expect(roundHalfAwayFromZero(15n, 1, 0)).toBe(2n)
    expect(roundHalfAwayFromZero(25n, 1, 0)).toBe(3n)
    expect(roundHalfAwayFromZero(14n, 1, 0)).toBe(1n)
  })

  it('rounds a negative tie away from zero', () => {
    expect(roundHalfAwayFromZero(-15n, 1, 0)).toBe(-2n)
    expect(roundHalfAwayFromZero(-14n, 1, 0)).toBe(-1n)
  })
})

describe('priceQuote', () => {
  it('matches the API example', () => {
    const priced = priceQuote(
      [{ description: 'Diseño de PCB, 4 capas', quantity: '2.0000', unitPrice: '1500.5000' }],
      true,
      '0.1600',
    )

    expect(priced.ok).toBe(true)

    if (!priced.ok) {
      return
    }

    expect(priced.priced.items[0]?.lineTotal).toBe('3001.00')
    expect(priced.priced.subtotal).toBe('3001.00')
    expect(priced.priced.vatAmount).toBe('480.16')
    expect(priced.priced.total).toBe('3481.16')
  })

  it('rounds each line to cents before summing', () => {
    const priced = priceQuote(
      [
        { description: 'A', quantity: '1.0000', unitPrice: '0.3350' },
        { description: 'B', quantity: '1.0000', unitPrice: '0.3350' },
      ],
      true,
      '0.1600',
    )

    expect(priced.ok).toBe(true)

    if (!priced.ok) {
      return
    }

    expect(priced.priced.items.map((item) => item.lineTotal)).toEqual(['0.34', '0.34'])
    expect(priced.priced.subtotal).toBe('0.68')
    expect(priced.priced.vatAmount).toBe('0.11')
    expect(priced.priced.total).toBe('0.79')
  })

  it('rounds a half cent away from zero and keeps the cent below it', () => {
    const half = priceQuote(
      [{ description: 'half', quantity: '1.0000', unitPrice: '0.0050' }],
      false,
      '0.0000',
    )
    const below = priceQuote(
      [{ description: 'below', quantity: '1.0000', unitPrice: '0.0049' }],
      false,
      '0.0000',
    )
    const unit = priceQuote(
      [{ description: 'unit', quantity: '1.0000', unitPrice: '1.0050' }],
      false,
      '0.0000',
    )

    expect(half.ok && half.priced.items[0]?.lineTotal).toBe('0.01')
    expect(below.ok && below.priced.items[0]?.lineTotal).toBe('0.00')
    expect(unit.ok && unit.priced.items[0]?.lineTotal).toBe('1.01')
  })

  it('rounds VAT half away from zero and skips VAT when it is excluded', () => {
    const half = priceQuote(
      [{ description: 'vat', quantity: '1.0000', unitPrice: '1.2500' }],
      true,
      '0.0040',
    )
    const excluded = priceQuote(
      [{ description: 'vat', quantity: '1.0000', unitPrice: '10.0000' }],
      false,
      '0.1600',
    )

    expect(half.ok && half.priced.vatAmount).toBe('0.01')
    expect(half.ok && half.priced.total).toBe('1.26')
    expect(excluded.ok && excluded.priced).toMatchObject({
      subtotal: '10.00',
      vatAmount: '0.00',
      total: '10.00',
    })
  })
})

describe('previewQuoteTotals', () => {
  it('canonicalizes typed decimals and ignores a blank row', () => {
    const preview = previewQuoteTotals(
      [
        { quantity: '2', unitPrice: '1500.5' },
        { quantity: '', unitPrice: '' },
      ],
      true,
      '16',
    )

    expect(preview.lines[0]?.lineTotal).toBe('3001.00')
    expect(preview.lines[1]).toEqual({ lineTotal: null, invalid: false })
    expect(preview.subtotal).toBe('3001.00')
    expect(preview.vatAmount).toBe('480.16')
    expect(preview.total).toBe('3481.16')
  })

  it('keeps the subtotal when the VAT percent is incomplete', () => {
    const preview = previewQuoteTotals([{ quantity: '1', unitPrice: '10' }], true, '')

    expect(preview.subtotal).toBe('10.00')
    expect(preview.vatAmount).toBeNull()
    expect(preview.total).toBeNull()
  })

  it('blocks totals while a line is invalid', () => {
    const preview = previewQuoteTotals([{ quantity: '0', unitPrice: '10' }], true, '16')

    expect(preview.lines[0]?.invalid).toBe(true)
    expect(preview.subtotal).toBeNull()
  })
})

describe('percent and grouping', () => {
  it('converts a percent to the 4-digit API rate and back', () => {
    expect(percentToVatRate('16')).toEqual({ ok: true, value: '0.1600' })
    expect(percentToVatRate('16,5')).toEqual({ ok: true, value: '0.1650' })
    expect(percentToVatRate('100')).toEqual({ ok: true, value: '1.0000' })
    expect(percentToVatRate('0')).toEqual({ ok: true, value: '0.0000' })
    expect(percentToVatRate('100.01').ok).toBe(false)
    expect(percentToVatRate('16.555').ok).toBe(false)
    expect(vatRateToPercent('0.1600')).toBe('16')
    expect(vatRateToPercent('0.1650')).toBe('16.5')
  })

  it('groups the integer part without changing the fraction', () => {
    expect(groupDecimal('3001.00')).toBe('3,001.00')
    expect(groupDecimal('1500.5000')).toBe('1,500.5000')
    expect(groupDecimal('-0.01')).toBe('-0.01')
  })
})
