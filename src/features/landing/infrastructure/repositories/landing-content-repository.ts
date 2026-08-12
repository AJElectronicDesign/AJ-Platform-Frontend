import { assembleLandingContent } from '@/features/landing/application/assemble-landing-content'
import type {
  LandingContent,
  LandingContentRepository,
} from '@/features/landing/domain/entities/landing-content'
import { en } from '@/shared/i18n/locales/en'

export class StaticLandingContentRepository
  implements LandingContentRepository
{
  async getLandingContent(): Promise<LandingContent> {
    return assembleLandingContent(en.home)
  }
}

export const landingContentRepository = new StaticLandingContentRepository()
