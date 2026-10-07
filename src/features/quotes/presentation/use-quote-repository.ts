import { useState } from 'react'
import type { QuoteRepository } from '@/features/quotes/domain/quote-repository'
import { createQuoteRepository } from '@/features/quotes/infrastructure/create-quote-repository'

export function useQuoteRepository(): QuoteRepository {
  const [repository] = useState(createQuoteRepository)
  return repository
}
