import { describe, expect, it } from 'vitest'
import { quoteActionState } from '@/features/quotes/domain/status-actions'
import type { QuoteStatus } from '@/features/quotes/domain/quote'

describe('quoteActionState', () => {
  it('lets a draft be edited, sent, copied, and deleted', () => {
    expect(quoteActionState('draft', 2)).toEqual({
      showEdit: true,
      showSend: true,
      sendEnabled: true,
      showAccept: false,
      acceptEnabled: false,
      showReject: false,
      showRevert: false,
      showCopy: true,
      showDelete: true,
      acceptDisabledReason: null,
      sendDisabledReason: null,
    })
  })

  it('keeps send visible and explains an empty draft', () => {
    const state = quoteActionState('draft', 0)

    expect(state.showSend).toBe(true)
    expect(state.sendEnabled).toBe(false)
    expect(state.sendDisabledReason).toBe('empty')
  })

  it('offers accept, reject, revert, and copy on a sent quote', () => {
    const state = quoteActionState('sent', 1)

    expect(state.showAccept).toBe(true)
    expect(state.acceptEnabled).toBe(true)
    expect(state.showReject).toBe(true)
    expect(state.showRevert).toBe(true)
    expect(state.showCopy).toBe(true)
    expect(state.showEdit).toBe(false)
    expect(state.showDelete).toBe(false)
  })

  it('disables accept on an expired quote and still allows reject, revert, and copy', () => {
    const state = quoteActionState('expired', 1)

    expect(state.showAccept).toBe(true)
    expect(state.acceptEnabled).toBe(false)
    expect(state.acceptDisabledReason).toBe('expired')
    expect(state.showReject).toBe(true)
    expect(state.showRevert).toBe(true)
    expect(state.showCopy).toBe(true)
    expect(state.showEdit).toBe(false)
    expect(state.showDelete).toBe(false)
  })

  it.each<QuoteStatus>(['accepted', 'rejected'])(
    'keeps %s read-only except for copy',
    (status) => {
      const state = quoteActionState(status, 3)

      expect(state).toMatchObject({
        showEdit: false,
        showSend: false,
        showAccept: false,
        showReject: false,
        showRevert: false,
        showDelete: false,
        showCopy: true,
      })
    },
  )
})
