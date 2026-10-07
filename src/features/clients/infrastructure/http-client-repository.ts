import type {
  ClientContact,
  ClientDetail,
  ClientList,
  CreateClientPayload,
  CreateContactPayload,
  ListClientsQuery,
  LogoUploadResult,
  PatchClientPayload,
  PatchContactPayload,
  SatCatalog,
} from '@/features/clients/domain/client'
import type {
  ClientRepository,
  ClientRequestOptions,
} from '@/features/clients/domain/client-repository'
import { httpRequest } from '@/shared/infrastructure/http/http-client'
import {
  parseClientEnvelope,
  parseClientList,
  parseContactEnvelope,
  parseLogoUpload,
  parseSatCatalog,
} from '@/features/clients/infrastructure/parse-client'

function clientPath(id: string, suffix = ''): string {
  return `/clients/${encodeURIComponent(id)}${suffix}`
}

export function clientListPath(query: ListClientsQuery): string {
  const params = new URLSearchParams()
  const q = query.q?.trim()

  if (q) {
    params.set('q', q.slice(0, 100))
  }

  params.set('active', query.active)
  params.set('page', String(query.page))
  params.set('pageSize', String(query.pageSize))

  return `/clients?${params.toString()}`
}

export class HttpClientRepository implements ClientRepository {
  list(query: ListClientsQuery, options?: ClientRequestOptions): Promise<ClientList> {
    return httpRequest<unknown>(clientListPath(query), { signal: options?.signal }).then(parseClientList)
  }

  get(id: string, options?: ClientRequestOptions): Promise<ClientDetail> {
    return httpRequest<unknown>(clientPath(id), { signal: options?.signal }).then(parseClientEnvelope)
  }

  create(body: CreateClientPayload): Promise<ClientDetail> {
    return httpRequest<unknown>('/clients', { method: 'POST', body }).then(parseClientEnvelope)
  }

  update(id: string, body: PatchClientPayload): Promise<ClientDetail> {
    return httpRequest<unknown>(clientPath(id), { method: 'PATCH', body }).then(parseClientEnvelope)
  }

  deactivate(id: string): Promise<ClientDetail> {
    return httpRequest<unknown>(clientPath(id, '/deactivate'), { method: 'POST' }).then(
      parseClientEnvelope,
    )
  }

  reactivate(id: string): Promise<ClientDetail> {
    return httpRequest<unknown>(clientPath(id, '/reactivate'), { method: 'POST' }).then(
      parseClientEnvelope,
    )
  }

  getLogo(id: string, options?: ClientRequestOptions): Promise<Blob> {
    return httpRequest<Blob>(clientPath(id, '/logo'), {
      responseType: 'blob',
      signal: options?.signal,
    })
  }

  uploadLogo(id: string, file: File): Promise<LogoUploadResult> {
    const body = new FormData()
    body.append('file', file)

    return httpRequest<unknown>(clientPath(id, '/logo'), { method: 'PUT', body }).then(parseLogoUpload)
  }

  async deleteLogo(id: string): Promise<void> {
    await httpRequest(clientPath(id, '/logo'), { method: 'DELETE' })
  }

  createContact(clientId: string, body: CreateContactPayload): Promise<ClientContact> {
    return httpRequest<unknown>(clientPath(clientId, '/contacts'), { method: 'POST', body }).then(
      parseContactEnvelope,
    )
  }

  updateContact(
    clientId: string,
    contactId: string,
    body: PatchContactPayload,
  ): Promise<ClientContact> {
    return httpRequest<unknown>(clientPath(clientId, `/contacts/${encodeURIComponent(contactId)}`), {
      method: 'PATCH',
      body,
    }).then(parseContactEnvelope)
  }

  async deleteContact(clientId: string, contactId: string): Promise<void> {
    await httpRequest(clientPath(clientId, `/contacts/${encodeURIComponent(contactId)}`), {
      method: 'DELETE',
    })
  }

  getSatCatalog(options?: ClientRequestOptions): Promise<SatCatalog> {
    return httpRequest<unknown>('/catalogs/sat', { signal: options?.signal }).then(parseSatCatalog)
  }
}
