export interface NavItem {
  label: string
  href: string
  sectionId: string
}

const appBase = import.meta.env.BASE_URL

export const publicNavigation: NavItem[] = [
  { label: 'Services', href: `${appBase}#services`, sectionId: 'services' },
  { label: 'Process', href: `${appBase}#process`, sectionId: 'process' },
  {
    label: 'Technologies',
    href: `${appBase}#technologies`,
    sectionId: 'technologies',
  },
  {
    label: 'Case studies',
    href: `${appBase}#case-studies`,
    sectionId: 'case-studies',
  },
  { label: 'Contact', href: `${appBase}#contact`, sectionId: 'contact' },
]

export const publicSectionIds = publicNavigation.map((item) => item.sectionId)
