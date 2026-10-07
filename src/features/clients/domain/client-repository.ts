import type {
  ClientDetail,
  ClientList,
  CreateClientPayload,
  CreateContactPayload,
  ListClientsQuery,
  LogoUploadResult,
  PatchClientPayload,
  PatchContactPayload,
  SatCatalog,
  ClientContact,
} from '@/features/clients/domain/client'

export interface ClientRequestOptions {
  signal?: AbortSignal
}

export interface ClientRepository {
  list(query: ListClientsQuery, options?: ClientRequestOptions): Promise<ClientList>
  get(id: string, options?: ClientRequestOptions): Promise<ClientDetail>
  create(body: CreateClientPayload): Promise<ClientDetail>
  update(id: string, body: PatchClientPayload): Promise<ClientDetail>
  deactivate(id: string): Promise<ClientDetail>
  reactivate(id: string): Promise<ClientDetail>
  getLogo(id: string, options?: ClientRequestOptions): Promise<Blob>
  uploadLogo(id: string, file: File): Promise<LogoUploadResult>
  deleteLogo(id: string): Promise<void>
  createContact(clientId: string, body: CreateContactPayload): Promise<ClientContact>
  updateContact(
    clientId: string,
    contactId: string,
    body: PatchContactPayload,
  ): Promise<ClientContact>
  deleteContact(clientId: string, contactId: string): Promise<void>
  getSatCatalog(options?: ClientRequestOptions): Promise<SatCatalog>
}
