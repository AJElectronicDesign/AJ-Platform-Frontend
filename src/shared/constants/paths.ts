export const paths = {
  home: '/',
  whoWeAre: '/who-we-are',
  whatWeDo: '/what-we-do',
  ourWork: '/our-work',
  login: '/login',
  contact: '/#contact',
  myAj: '/login',
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
