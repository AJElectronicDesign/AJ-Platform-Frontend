import type {
  CreateQuotePayload,
  ListQuotesQuery,
  PatchQuotePayload,
  AcceptQuotePayload,
  QuoteDetail,
  QuoteList,
  QuoteTransitionPayload,
} from '@/features/quotes/domain/quote'
import type { QuoteRepository, QuoteRequestOptions } from '@/features/quotes/domain/quote-repository'
import { parseQuoteEnvelope, parseQuoteList } from '@/features/quotes/infrastructure/parse-quote'
import { httpRequest } from '@/shared/infrastructure/http/http-client'

function quotePath(id: string, suffix = ''): string {
  return `/quotes/${encodeURIComponent(id)}${suffix}`
}

export function quoteListPath(query: ListQuotesQuery): string {
  const params = new URLSearchParams()
  const q = query.q?.trim()

  if (q) {
    params.set('q', q.slice(0, 100))
  }

  if (query.status) {
    params.set('status', query.status)
  }

  if (query.clientId) {
    params.set('clientId', query.clientId)
  }

  if (query.type) {
    params.set('type', query.type)
  }

  params.set('page', String(query.page))
  params.set('pageSize', String(query.pageSize))

  return `/quotes?${params.toString()}`
}

export class HttpQuoteRepository implements QuoteRepository {
  list(query: ListQuotesQuery, options?: QuoteRequestOptions): Promise<QuoteList> {
    return httpRequest<unknown>(quoteListPath(query), { signal: options?.signal }).then(parseQuoteList)
  }

  get(id: string, options?: QuoteRequestOptions): Promise<QuoteDetail> {
    return httpRequest<unknown>(quotePath(id), { signal: options?.signal }).then(parseQuoteEnvelope)
  }

  create(body: CreateQuotePayload): Promise<QuoteDetail> {
    return httpRequest<unknown>('/quotes', { method: 'POST', body }).then(parseQuoteEnvelope)
  }

  update(id: string, body: PatchQuotePayload): Promise<QuoteDetail> {
    return httpRequest<unknown>(quotePath(id), { method: 'PATCH', body }).then(parseQuoteEnvelope)
  }

  async remove(id: string): Promise<void> {
    await httpRequest(quotePath(id), { method: 'DELETE' })
  }

  copy(id: string): Promise<QuoteDetail> {
    return httpRequest<unknown>(quotePath(id, '/copy'), { method: 'POST' }).then(parseQuoteEnvelope)
  }

  send(id: string, body: QuoteTransitionPayload): Promise<QuoteDetail> {
    return httpRequest<unknown>(quotePath(id, '/send'), { method: 'POST', body }).then(parseQuoteEnvelope)
  }

  accept(id: string, body: AcceptQuotePayload): Promise<QuoteDetail> {
    return httpRequest<unknown>(quotePath(id, '/accept'), { method: 'POST', body }).then(parseQuoteEnvelope)
  }

  reject(id: string, body: QuoteTransitionPayload): Promise<QuoteDetail> {
    return httpRequest<unknown>(quotePath(id, '/reject'), { method: 'POST', body }).then(parseQuoteEnvelope)
  }

  revertToDraft(id: string, body: QuoteTransitionPayload): Promise<QuoteDetail> {
    return httpRequest<unknown>(quotePath(id, '/revert-to-draft'), { method: 'POST', body }).then(
      parseQuoteEnvelope,
    )
  }
}
