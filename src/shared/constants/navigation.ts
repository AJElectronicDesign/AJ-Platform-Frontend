export interface NavItem {
  label: string
  href: string
  sectionId: string
}

const appBase = import.meta.env.BASE_URL

export const publicNavigation: NavItem[] = [
  { label: 'Services', href: `${appBase}#services`, sectionId: 'services' },
  {
    label: 'Technologies',
    href: `${appBase}#technologies`,
    sectionId: 'technologies',
  },
  { label: 'Contact', href: `${appBase}#contact`, sectionId: 'contact' },
]

export const publicSectionIds = publicNavigation.map((item) => item.sectionId)
