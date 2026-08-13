import type { ClientLogo as ClientLogoEntity } from '@/shared/corporate-content'
import { ClientLogo } from '@/shared/components/corporate/client-logo'

export interface ClientsGridProps {
  clients: ClientLogoEntity[]
}

export function ClientsGrid({ clients }: ClientsGridProps) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-16 gap-y-12 md:gap-x-24">
      {clients.map((client) => (
        <li key={client.id} className="flex items-center justify-center">
          <ClientLogo client={client} />
        </li>
      ))}
    </ul>
  )
}
