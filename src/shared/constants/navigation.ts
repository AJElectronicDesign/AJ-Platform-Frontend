export interface NavItem {
  label: string
  href: string
  sectionId: string
}

export const publicNavigation: NavItem[] = [
  { label: 'Services', href: '/#services', sectionId: 'services' },
  { label: 'Process', href: '/#process', sectionId: 'process' },
  { label: 'Technologies', href: '/#technologies', sectionId: 'technologies' },
  { label: 'Case studies', href: '/#case-studies', sectionId: 'case-studies' },
  { label: 'Contact', href: '/#contact', sectionId: 'contact' },
]

export const publicSectionIds = publicNavigation.map((item) => item.sectionId)
