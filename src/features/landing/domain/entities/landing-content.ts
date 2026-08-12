import type { ContactInfo } from './contact-info'
import type {
  ClientLogo,
  ProcessStep,
  Service,
  TechnologyCategory,
} from '@/shared/corporate-content'

export interface CallToAction {
  label: string
  href: string
}

export interface HeroHighlight {
  label: string
  value: string
}

export interface HeroContent {
  eyebrow: string
  title: string
  description: string
  primaryCta: CallToAction
  secondaryCta: CallToAction
  highlights: HeroHighlight[]
}

export interface SectionIntro {
  eyebrow: string
  title: string
  description: string
}

export interface TechnologiesSectionContent extends SectionIntro {
  pipeline: string[]
}

export interface TeamSectionContent {
  title: string
  description: string
  imageAlt: string
}

export interface LandingContent {
  hero: HeroContent
  clientsSection: SectionIntro
  clients: ClientLogo[]
  servicesSection: SectionIntro
  services: Service[]
  teamSection: TeamSectionContent
  processSection: SectionIntro
  process: ProcessStep[]
  technologiesSection: TechnologiesSectionContent
  technologies: TechnologyCategory[]
  video: {
    title: string
    description: string
    placeholderLabel: string
    note: string
    embedUrl: string
  }
  contactSection: SectionIntro
  contact: ContactInfo
}

export interface LandingContentRepository {
  getLandingContent(): Promise<LandingContent>
}
