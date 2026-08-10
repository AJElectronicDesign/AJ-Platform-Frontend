import type {
  LandingContent,
  LandingContentRepository,
} from '@/features/landing/domain/entities/landing-content'
import { landingContent } from '@/features/landing/infrastructure/data/landing-content'

export class StaticLandingContentRepository
  implements LandingContentRepository
{
  async getLandingContent(): Promise<LandingContent> {
    return landingContent
  }
}

export const landingContentRepository = new StaticLandingContentRepository()
