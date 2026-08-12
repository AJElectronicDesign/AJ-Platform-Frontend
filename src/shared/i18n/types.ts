export type Locale = 'en' | 'es'

export interface CallToActionCopy {
  label: string
  href: string
}

export interface SectionIntroCopy {
  eyebrow: string
  title: string
  description: string
}

export interface ServiceCopy {
  title: string
  description: string
  benefit: string
  details: {
    introduction: string
    capabilities: string[]
    deliverables: string[]
  }
}

export interface TechnologyCategoryCopy {
  title: string
  description: string
}

export interface ProcessStepCopy {
  label: string
  description: string
}

export interface PurposeValueCopy {
  title: string
  description: string
}

export interface IndustryCopy {
  title: string
  description: string
}

export interface CommonCatalog {
  contact: string
  email: string
  phone: string
  location: string
  navigate: string
  social: string
  copyright: string
  backToHome: string
  openMenu: string
  closeMenu: string
  language: string
  myAj: string
  learnMore: string
  requestQuotation: string
  whatWeDo: string
  typicalDeliverables: string
  relatedTechnologies: string
  loading: string
  contentUnavailable: string
}

export interface NavigationCatalog {
  whoWeAre: string
  whatWeDo: string
  ourWork: string
  contact: string
  overview: string
  purposeValues: string
  ourPeople: string
  ourLeaders: string
  contactUs: string
  services: string
  industriesMarkets: string
  alliances: string
  clients: string
  selectedWork: string
  technologies: string
}

export interface HomeCatalog {
  hero: {
    eyebrow: string
    title: string
    description: string
    primaryCta: CallToActionCopy
    secondaryCta: CallToActionCopy
  }
  clientsSection: {
    title: string
    description: string
  }
  servicesSection: SectionIntroCopy
  teamSection: {
    title: string
    description: string
    imageAlt: string
  }
  processSection: SectionIntroCopy
  process: Record<string, ProcessStepCopy>
  technologiesSection: SectionIntroCopy & {
    pipeline: string[]
  }
  technologies: Record<string, TechnologyCategoryCopy>
  technologyNames: Record<string, string>
  services: Record<string, ServiceCopy>
  clientLogoAlt: string
  video: {
    title: string
    description: string
    placeholderLabel: string
    note: string
  }
  contactSection: SectionIntroCopy
  contactForm: {
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    phone: string
    phonePlaceholder: string
    message: string
    messagePlaceholder: string
    sending: string
    sentTo: string
    validationError: string
    success: string
    sendError: string
  }
}

export interface CompanyCatalog {
  overview: {
    eyebrow: string
    title: string
    headline: string
    paragraphs: string[]
    ctaLabel: string
    imageAlt: string
  }
  purposeValues: {
    eyebrow: string
    title: string
    description: string
    items: Record<string, PurposeValueCopy>
  }
  people: {
    eyebrow: string
    title: string
    description: string
    imageAlt: string
  }
  leaders: {
    eyebrow: string
    title: string
    description: string
  }
  whatWeDo: {
    eyebrow: string
    title: string
    description: string
  }
  industries: {
    eyebrow: string
    title: string
    description: string
    items: Record<string, IndustryCopy>
  }
  ourWork: {
    eyebrow: string
    title: string
    description: string
  }
}

export interface Catalogs {
  common: CommonCatalog
  navigation: NavigationCatalog
  home: HomeCatalog
  company: CompanyCatalog
}
