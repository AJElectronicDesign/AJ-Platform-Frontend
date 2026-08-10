import type { CaseStudy } from './case-study'
import type { ContactInfo } from './contact-info'
import type { Service } from './service'
import type { Technology } from './technology'

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

export interface ValuePillar {
  id: string
  title: string
  description: string
}

export interface ValuePropositionContent {
  title: string
  description: string
  pillars: ValuePillar[]
}

export interface SectionIntro {
  eyebrow: string
  title: string
  description: string
}

export interface ProcessStep {
  id: string
  label: string
  description: string
}

export interface LandingContent {
  hero: HeroContent
  valueProposition: ValuePropositionContent
  servicesSection: SectionIntro
  services: Service[]
  processSection: SectionIntro
  process: ProcessStep[]
  technologiesSection: SectionIntro
  technologies: Technology[]
  caseStudiesSection: SectionIntro
  caseStudies: CaseStudy[]
  video: {
    title: string
    description: string
    placeholderLabel: string
    note: string
    embedUrl: string
  }
  contactSection: SectionIntro
  contact: ContactInfo
  footer: {
    copyright: string
  }
}

export interface LandingContentRepository {
  getLandingContent(): Promise<LandingContent>
}
