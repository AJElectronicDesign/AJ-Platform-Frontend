import type { LandingClientLogoKey } from '@/shared/theme/app-images'

export type { LandingClientLogoKey }

export interface ServiceRecord {
  id: string
  icon?: string
  relatedTechnologies?: string[]
}

export interface ServiceDetails {
  introduction: string
  capabilities: string[]
  deliverables: string[]
  technologies?: string[]
}

export interface Service extends ServiceRecord {
  title: string
  description: string
  benefit: string
  details: ServiceDetails
}

export interface ClientRecord {
  id: string
  name: string
  logoKey: LandingClientLogoKey
}

export interface ClientLogo extends ClientRecord {
  alt: string
}

export interface TechnologyRecord {
  id: string
  icon: string
}

export interface Technology extends TechnologyRecord {
  name: string
}

export interface TechnologyCategoryRecord {
  id: string
  icon: string
  technologyIds: string[]
}

export interface TechnologyCategory extends Omit<
  TechnologyCategoryRecord,
  'technologyIds'
> {
  title: string
  description: string
  technologies: Technology[]
}

export interface ProcessStepRecord {
  id: string
}

export interface ProcessStep extends ProcessStepRecord {
  label: string
  description: string
}

export interface IndustryRecord {
  id: string
}

export interface PurposeValueRecord {
  id: string
}

export interface Leader {
  id: string
  name: string
  role: string
  image?: string
  email?: string
  phone?: string
  linkedin?: string
}

export interface Alliance {
  id: string
  name: string
  logo?: string
  href?: string
}

export interface SelectedWork {
  id: string
  title: string
  summary: string
  image?: string
  href?: string
}
