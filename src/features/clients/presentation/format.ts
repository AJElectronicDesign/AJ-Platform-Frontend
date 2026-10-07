import type { ClientAddress, SatCatalog } from '@/features/clients/domain/client'

export function displayText(value: string | null | undefined, empty = '—'): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : empty
}

export function formatPhone(code: string | null, phone: string | null, empty = '—'): string {
  if (code && phone) {
    return `${code} ${phone}`
  }

  return displayText(phone ?? code, empty)
}

export function formatAddress(address: ClientAddress): string[] {
  const street = [address.street, address.exteriorNumber, address.interiorNumber]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(' ')
  const locality = [address.colonia, address.city, address.state]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(', ')
  const postal = [address.postalCode, address.country]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(' ')

  return [street, locality, postal].filter((line) => line.length > 0)
}

export function catalogLabel(
  catalog: SatCatalog | null,
  kind: 'taxRegimes' | 'cfdiUses',
  code: string,
): string {
  const entry = catalog?.[kind].find((item) => item.code === code)
  return entry ? `${entry.code} — ${entry.description}` : code
}
