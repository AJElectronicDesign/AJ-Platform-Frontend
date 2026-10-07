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
