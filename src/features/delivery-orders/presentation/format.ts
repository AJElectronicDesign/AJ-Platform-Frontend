import type { DeliveryActor, DeliveryAddress } from '@/features/delivery-orders/domain/delivery-order'
import { actorName } from '@/features/quotes/presentation/format'

export {
  clientLabel,
  displayText,
  formatDecimal,
  formatMoney,
  formatQuoteDate as formatDeliveryDate,
  formatQuoteDateTime as formatDeliveryDateTime,
} from '@/features/quotes/presentation/format'

export function formatAddress(address: DeliveryAddress, empty = '—'): string {
  const parts = [address.street, address.city, address.state, address.postalCode, address.country].filter(
    (part): part is string => Boolean(part?.trim()),
  )

  return parts.length > 0 ? parts.join(', ') : empty
}

export function senderLabel(actor: DeliveryActor | null, empty: string): string {
  return actorName(actor) ?? empty
}
