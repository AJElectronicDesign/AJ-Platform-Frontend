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

export interface QuotesCatalog {
  closeDialog: string
  list: {
    eyebrow: string
    title: string
    description: string
    newQuote: string
    searchLabel: string
    searchPlaceholder: string
    statusFilter: string
    typeFilter: string
    clientFilter: string
    clientPlaceholder: string
    clearClient: string
    allStatuses: string
    allTypes: string
    folio: string
    client: string
    project: string
    type: string
    status: string
    total: string
    validUntil: string
    updated: string
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
  status: {
    draft: string
    sent: string
    accepted: string
    rejected: string
    expired: string
  }
  type: {
    assemblies: string
    projects: string
    services_material: string
  }
  form: {
    createTitle: string
    editTitle: string
    createDescription: string
    editDescription: string
    back: string
    clientHint: string
    clientInactive: string
    clientFirst: string
    changeClient: string
    searching: string
    noClients: string
    contactsLoading: string
    contactsUnavailable: string
    type: string
    projectName: string
    requestedBy: string
    requestedByManual: string
    requestedByHint: string
    name: string
    email: string
    attentionTo: string
    attentionHint: string
    currency: string
    exchangeRate: string
    exchangeHint: string
    deliveryTime: string
    validUntil: string
    notes: string
    includeVat: string
    vatRate: string
    vatHint: string
    items: string
    description: string
    quantity: string
    unitPrice: string
    lineTotal: string
    addItem: string
    removeItem: string
    moveUp: string
    moveDown: string
    preview: string
    previewHint: string
    subtotal: string
    vat: string
    total: string
    noVat: string
    save: string
    saving: string
    cancel: string
    loading: string
    notDraftTitle: string
    notDraftBody: string
    openDetail: string
  }
  validation: {
    client: string
    type: string
    projectName: string
    attentionTo: string
    requestedByName: string
    requestedByEmail: string
    currency: string
    exchangeRate: string
    deliveryTime: string
    validUntil: string
    notes: string
    vatRate: string
    itemDescription: string
    itemQuantity: string
    itemUnitPrice: string
    tooManyItems: string
    overflow: string
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
    INVALID_ENUM: string
    INVALID_UUID: string
    VERSION_INVALID: string
    UNRECOGNIZED_KEY: string
    AT_LEAST_ONE_FIELD: string
    OUT_OF_RANGE: string
    INVALID_DECIMAL: string
    TOO_MANY_DECIMALS: string
    TOO_MANY_DIGITS: string
    QUANTITY_NOT_POSITIVE: string
    EXCHANGE_RATE_NOT_POSITIVE: string
    VAT_RATE_OUT_OF_RANGE: string
    DATE_INVALID: string
    TOO_MANY_ITEMS: string
    CONTACT_NOT_ON_CLIENT: string
    CONTACT_SNAPSHOT_LOCKED: string
    LINE_TOTAL_OVERFLOW: string
    TOTAL_OVERFLOW: string
  }
  errors: {
    versionConflict: string
    reload: string
    network: string
    forbidden: string
    notFound: string
    clientNotFound: string
    unknown: string
    validation: string
    clientInactive: string
    notEditable: string
    notDeletable: string
    empty: string
    expired: string
    invalidTransition: string
    folioExists: string
  }
  detail: {
    backToList: string
    loading: string
    edit: string
    send: string
    accept: string
    reject: string
    revert: string
    copy: string
    delete: string
    confirm: string
    cancel: string
    working: string
    deleteTitle: string
    deleteBody: string
    acceptTitle: string
    acceptBody: string
    rejectTitle: string
    rejectBody: string
    expiredAccept: string
    emptySend: string
    readOnly: string
    client: string
    project: string
    type: string
    attentionTo: string
    requestedBy: string
    currency: string
    exchangeRate: string
    deliveryTime: string
    validUntil: string
    notes: string
    items: string
    itemsEmpty: string
    description: string
    quantity: string
    unitPrice: string
    lineTotal: string
    subtotal: string
    vat: string
    total: string
    noVat: string
    timeline: string
    timelineEmpty: string
    sentAt: string
    acceptedAt: string
    rejectedAt: string
    createdAt: string
    updatedAt: string
    none: string
  }
  clientSection: {
    title: string
    description: string
    newQuote: string
    viewAll: string
    empty: string
    loading: string
    error: string
    folio: string
    project: string
    status: string
    total: string
    updated: string
  }
  notice: {
    saved: string
    copied: string
    accepted: string
    sent: string
    rejected: string
    reverted: string
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
  quotes: QuotesCatalog
}
