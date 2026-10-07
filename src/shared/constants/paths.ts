export const paths = {
  home: '/',
  whoWeAre: '/who-we-are',
  whatWeDo: '/what-we-do',
  ourWork: '/our-work',
  login: '/login',
  contact: '/#contact',
  app: '/app',
  appClients: '/app/clientes',
  appClientNew: '/app/clientes/nuevo',
  appQuotations: '/app/cotizaciones',
  appQuoteNew: '/app/cotizaciones/nueva',
  appDeliveryOrders: '/app/ordenes-de-entrega',
  myAj: '/app',
} as const

export const myAjHref = paths.myAj

export function appClientPath(id: string): string {
  return `/app/clientes/${encodeURIComponent(id)}`
}

export function appClientEditPath(id: string): string {
  return `/app/clientes/${encodeURIComponent(id)}/editar`
}

export function appQuotePath(id: string): string {
  return `/app/cotizaciones/${encodeURIComponent(id)}`
}

export function appQuoteEditPath(id: string): string {
  return `/app/cotizaciones/${encodeURIComponent(id)}/editar`
}

export function appQuotesForClient(clientId: string): string {
  return `/app/cotizaciones?clientId=${encodeURIComponent(clientId)}`
}

export function appQuoteNewForClient(clientId: string): string {
  return `/app/cotizaciones/nueva?clientId=${encodeURIComponent(clientId)}`
}

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
