import type {
  CreateQuotePayload,
  ListQuotesQuery,
  PatchQuotePayload,
  QuoteDetail,
  QuoteList,
  QuoteTransitionPayload,
  AcceptQuotePayload,
} from '@/features/quotes/domain/quote'

export interface QuoteRequestOptions {
  signal?: AbortSignal
}

export interface QuoteRepository {
  list(query: ListQuotesQuery, options?: QuoteRequestOptions): Promise<QuoteList>
  get(id: string, options?: QuoteRequestOptions): Promise<QuoteDetail>
  create(body: CreateQuotePayload): Promise<QuoteDetail>
  update(id: string, body: PatchQuotePayload): Promise<QuoteDetail>
  remove(id: string): Promise<void>
  copy(id: string): Promise<QuoteDetail>
  send(id: string, body: QuoteTransitionPayload): Promise<QuoteDetail>
  accept(id: string, body: AcceptQuotePayload): Promise<QuoteDetail>
  reject(id: string, body: QuoteTransitionPayload): Promise<QuoteDetail>
  revertToDraft(id: string, body: QuoteTransitionPayload): Promise<QuoteDetail>
}
