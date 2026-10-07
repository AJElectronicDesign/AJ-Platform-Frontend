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
    people: Record<
      string,
      {
        role: string
        imageAlt: string
      }
    >
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

export interface AuthCatalog {
  login: {
    eyebrow: string
    title: string
    description: string
    email: string
    emailPlaceholder: string
    password: string
    passwordPlaceholder: string
    submit: string
    submitting: string
    publicSitePrompt: string
    backHome: string
    validation: string
    invalid_credentials: string
    rate_limited: string
    network: string
    unavailable: string
    unknown: string
  }
  session: {
    network: string
    unavailable: string
    retry: string
  }
}

export interface AppCatalog {
  session: {
    loading: string
  }
  shell: {
    navigation: string
    openNavigation: string
    closeNavigation: string
    logout: string
    loggingOut: string
    publicSite: string
  }
  modules: {
    dashboard: string
    clients: string
    quotations: string
    deliveryOrders: string
  }
  placeholder: {
    title: string
    description: string
  }
}

export interface ClientsCatalog {
  closeDialog: string
  list: {
    eyebrow: string
    title: string
    description: string
    newClient: string
    searchLabel: string
    searchPlaceholder: string
    activeFilter: string
    activeTrue: string
    activeFalse: string
    activeAll: string
    legalName: string
    tradeName: string
    rfc: string
    primaryContact: string
    currency: string
    status: string
    active: string
    inactive: string
    empty: string
    emptyFiltered: string
    loading: string
    retry: string
    previous: string
    next: string
    page: string
    results: string
    errorTitle: string
  }
  form: {
    createTitle: string
    editTitle: string
    createDescription: string
    editDescription: string
    back: string
    fiscal: string
    commercial: string
    address: string
    rfc: string
    rfcHint: string
    legalName: string
    taxRegime: string
    taxRegimePlaceholder: string
    fiscalPostalCode: string
    cfdiUse: string
    cfdiUsePlaceholder: string
    tradeName: string
    email: string
    phoneCountryCode: string
    phone: string
    phoneHint: string
    currency: string
    paymentTermsDays: string
    quotePrefix: string
    quotePrefixHint: string
    notes: string
    street: string
    exteriorNumber: string
    interiorNumber: string
    colonia: string
    city: string
    state: string
    country: string
    postalCode: string
    save: string
    saving: string
    cancel: string
    catalogError: string
    noChanges: string
    loading: string
  }
  validation: {
    rfc: string
    rfcDate: string
    legalName: string
    taxRegime: string
    taxRegimePerson: string
    fiscalPostalCode: string
    cfdiUse: string
    cfdiUsePerson: string
    tradeName: string
    email: string
    phonePair: string
    phoneCode: string
    phone: string
    currency: string
    paymentTerms: string
    quotePrefix: string
    notes: string
    country: string
    street: string
    exteriorNumber: string
    interiorNumber: string
    colonia: string
    city: string
    state: string
    postalCode: string
    contactName: string
    contactPosition: string
    contactEmail: string
    contactPhone: string
  }
  /**
   * Translations for `VALIDATION_ERROR` `details[].code`.
   * An unknown code falls back to the server `message`.
   */
  detailCodes: {
    REQUIRED: string
    TOO_LONG: string
    INVALID_TYPE: string
    EMAIL_INVALID: string
    PHONE_COUNTRY_CODE_INVALID: string
    PHONE_INVALID: string
    CONTACT_PHONE_INVALID: string
    QUOTE_PREFIX_INVALID: string
    COUNTRY_INVALID: string
    POSTAL_CODE_INVALID: string
    INVALID_ENUM: string
    OUT_OF_RANGE: string
    VERSION_INVALID: string
    UNRECOGNIZED_KEY: string
    PHONE_PAIR_REQUIRED: string
    INVALID_UUID: string
    AT_LEAST_ONE_FIELD: string
    RFC_INVALID_FORMAT: string
    RFC_INVALID_DATE: string
    TAX_REGIME_INVALID: string
    CFDI_USE_INVALID: string
    TAX_REGIME_NOT_APPLICABLE: string
    CFDI_USE_NOT_APPLICABLE: string
  }
  errors: {
    rfcExists: string
    quotePrefixExists: string
    versionConflict: string
    reload: string
    network: string
    forbidden: string
    notFound: string
    unknown: string
    alreadyInactive: string
    alreadyActive: string
    logoTooLarge: string
    logoUnsupported: string
    logoNotFound: string
    primaryConflict: string
    contactNotFound: string
    validation: string
    logoEmpty: string
  }
  detail: {
    edit: string
    deactivate: string
    reactivate: string
    deactivateTitle: string
    deactivateBody: string
    reactivateTitle: string
    reactivateBody: string
    confirm: string
    cancel: string
    working: string
    fiscal: string
    commercial: string
    address: string
    contacts: string
    contactsEmpty: string
    addContact: string
    editContact: string
    deleteContact: string
    deleteContactTitle: string
    deleteContactBody: string
    markPrimary: string
    primary: string
    name: string
    position: string
    email: string
    phone: string
    logo: string
    logoEmpty: string
    logoHint: string
    uploadLogo: string
    replaceLogo: string
    deleteLogo: string
    deleteLogoTitle: string
    deleteLogoBody: string
    uploading: string
    paymentTerms: string
    days: string
    notes: string
    loading: string
    backToList: string
    none: string
  }
  contactForm: {
    createTitle: string
    editTitle: string
    name: string
    position: string
    email: string
    phone: string
    phoneHint: string
    isPrimary: string
    save: string
    saving: string
    cancel: string
  }
}

export interface Catalogs {
  common: CommonCatalog
  navigation: NavigationCatalog
  home: HomeCatalog
  company: CompanyCatalog
  app: AppCatalog
  auth: AuthCatalog
  clients: ClientsCatalog
}
