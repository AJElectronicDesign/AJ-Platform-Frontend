import type { LandingContent } from '@/features/landing/domain/entities/landing-content'
import { landingVideoEmbedUrl } from '@/features/landing/infrastructure/data/landing-media'
import { brand } from '@/shared/constants/brand'
import {
  localizeClients,
  localizeProcess,
  localizeServices,
  localizeTechnologies,
} from '@/shared/i18n'
import type { HomeCatalog } from '@/shared/i18n'

export function assembleLandingContent(copy: HomeCatalog): LandingContent {
  return {
    hero: {
      ...copy.hero,
      highlights: [],
    },
    clientsSection: {
      eyebrow: '',
      ...copy.clientsSection,
    },
    clients: localizeClients(copy),
    servicesSection: copy.servicesSection,
    services: localizeServices(copy),
    teamSection: copy.teamSection,
    processSection: copy.processSection,
    process: localizeProcess(copy),
    technologiesSection: copy.technologiesSection,
    technologies: localizeTechnologies(copy),
    video: {
      ...copy.video,
      embedUrl: landingVideoEmbedUrl,
    },
    contactSection: copy.contactSection,
    contact: brand.contact,
  }
}
