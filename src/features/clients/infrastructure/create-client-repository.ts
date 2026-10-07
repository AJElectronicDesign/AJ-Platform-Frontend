import type { ClientRepository } from '@/features/clients/domain/client-repository'
import { HttpClientRepository } from '@/features/clients/infrastructure/http-client-repository'

export async function createClientRepository(): Promise<ClientRepository> {
  // `import.meta.env.DEV` is statically false in production builds, so the
  // dynamic import (and the clients mock) is left out of the prod bundle.
  if (import.meta.env.DEV && import.meta.env.VITE_AUTH_MOCK === 'true') {
    const module = await import('./mock-client-repository')
    return new module.MockClientRepository()
  }

  return new HttpClientRepository()
}
