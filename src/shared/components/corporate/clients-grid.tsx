import type { ClientLogo as ClientLogoEntity } from '@/shared/corporate-content'
import { ClientLogo } from '@/shared/components/corporate/client-logo'

export interface ClientsGridProps {
  clients: ClientLogoEntity[]
}

export function ClientsGrid({ clients }: ClientsGridProps) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-10 lg:flex-nowrap lg:justify-between lg:gap-x-4">
      {clients.map((client) => (
        <li key={client.id}>
          <ClientLogo client={client} />
        </li>
      ))}
    </ul>
  )
}
