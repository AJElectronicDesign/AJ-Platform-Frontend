export const paths = {
  home: '/',
  whoWeAre: '/who-we-are',
  whatWeDo: '/what-we-do',
  ourWork: '/our-work',
  login: '/login',
  contact: '/#contact',
  app: '/app',
  appClients: '/app/clientes',
  appQuotations: '/app/cotizaciones',
  appDeliveryOrders: '/app/ordenes-de-entrega',
  myAj: '/app',
} as const

export const myAjHref = paths.myAj

export const whoWeAreHash = {
  purposeValues: 'purpose-values',
  people: 'people',
  leaders: 'leaders',
} as const

export const whatWeDoHash = {
  services: 'services',
  industries: 'industries',
  process: 'process',
} as const

export const ourWorkHash = {
  clients: 'clients',
  technologies: 'technologies',
  industries: 'industries',
} as const
