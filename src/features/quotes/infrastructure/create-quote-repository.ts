import type { QuoteRepository } from '@/features/quotes/domain/quote-repository'
import { HttpQuoteRepository } from '@/features/quotes/infrastructure/http-quote-repository'

export function createQuoteRepository(): QuoteRepository {
  return new HttpQuoteRepository()
}
