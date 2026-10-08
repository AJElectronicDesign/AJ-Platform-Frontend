import type { QuoteStatus } from '@/features/quotes/domain/quote'

export interface QuoteActionState {
  showEdit: boolean
  showSend: boolean
  sendEnabled: boolean
  showAccept: boolean
  acceptEnabled: boolean
  showReject: boolean
  showRevert: boolean
  showCopy: boolean
  showDelete: boolean
  /** Why Aceptar is visible but disabled. */
  acceptDisabledReason: 'expired' | null
  /** Why Enviar is visible but disabled. */
  sendDisabledReason: 'empty' | null
}

export function quoteActionState(
  status: QuoteStatus,
  itemCount: number,
  hasDeliveryOrder = false,
): QuoteActionState {
  const draft = status === 'draft'
  const sent = status === 'sent'
  const expired = status === 'expired'
  const sentLike = sent || expired

  return {
    showEdit: draft,
    showSend: draft,
    sendEnabled: draft && itemCount > 0,
    showAccept: sentLike,
    acceptEnabled: sent,
    showReject: sentLike,
    showRevert: sentLike && !hasDeliveryOrder,
    showCopy: true,
    showDelete: draft && !hasDeliveryOrder,
    acceptDisabledReason: expired ? 'expired' : null,
    sendDisabledReason: draft && itemCount <= 0 ? 'empty' : null,
  }
}
