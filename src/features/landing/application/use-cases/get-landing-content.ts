import type { LandingContent } from '@/features/landing/domain/entities/landing-content'
import type { LandingContentRepository } from '@/features/landing/domain/entities/landing-content'

export async function getLandingContent(
  repository: LandingContentRepository,
): Promise<LandingContent> {
  return repository.getLandingContent()
}
