import { useEffect, useState } from 'react'
import type { ClientRepository } from '@/features/clients/domain/client-repository'
import { createClientRepository } from '@/features/clients/infrastructure/create-client-repository'

export function useClientRepository(): ClientRepository | null {
  const [repository, setRepository] = useState<ClientRepository | null>(null)

  useEffect(() => {
    let cancelled = false

    void createClientRepository().then((next) => {
      if (!cancelled) {
        setRepository(next)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return repository
}
