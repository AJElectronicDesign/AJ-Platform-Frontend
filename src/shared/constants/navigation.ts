import {
  alliances,
  leaders,
  selectedWork,
} from '@/shared/corporate-content'
import { paths, whoWeAreHash, whatWeDoHash, ourWorkHash } from './paths'
import type { NavigationCatalog } from '@/shared/i18n/types'

export type NavigationLabelKey = keyof NavigationCatalog

export interface NavLinkItem {
  id: string
  labelKey: NavigationLabelKey
  to: string
  requires?: 'leaders' | 'alliances' | 'selectedWork'
}

export interface NavGroupItem {
  id: string
  labelKey: NavigationLabelKey
  to: string
  panelId: string
  children: NavLinkItem[]
}

export const myAjHref = paths.myAj

export const contactNavItem: NavLinkItem = {
  id: 'contact',
  labelKey: 'contact',
  to: paths.contact,
}

export const primaryNavGroups: NavGroupItem[] = [
  {
    id: 'who-we-are',
    labelKey: 'whoWeAre',
    to: paths.whoWeAre,
    panelId: 'mega-menu-who-we-are',
    children: [
      { id: 'who-overview', labelKey: 'overview', to: paths.whoWeAre },
      {
        id: 'purpose-values',
        labelKey: 'purposeValues',
        to: `${paths.whoWeAre}#${whoWeAreHash.purposeValues}`,
      },
      {
        id: 'people',
        labelKey: 'ourPeople',
        to: `${paths.whoWeAre}#${whoWeAreHash.people}`,
      },
      {
        id: 'leaders',
        labelKey: 'ourLeaders',
        to: `${paths.whoWeAre}#${whoWeAreHash.leaders}`,
        requires: 'leaders',
      },
      { id: 'contact-us', labelKey: 'contactUs', to: paths.contact },
    ],
  },
  {
    id: 'what-we-do',
    labelKey: 'whatWeDo',
    to: paths.whatWeDo,
    panelId: 'mega-menu-what-we-do',
    children: [
      { id: 'what-overview', labelKey: 'overview', to: paths.whatWeDo },
      {
        id: 'services',
        labelKey: 'services',
        to: `${paths.whatWeDo}#${whatWeDoHash.services}`,
      },
      {
        id: 'industries',
        labelKey: 'industriesMarkets',
        to: `${paths.whatWeDo}#${whatWeDoHash.industries}`,
      },
      {
        id: 'alliances',
        labelKey: 'alliances',
        to: `${paths.whatWeDo}#alliances`,
        requires: 'alliances',
      },
    ],
  },
  {
    id: 'our-work',
    labelKey: 'ourWork',
    to: paths.ourWork,
    panelId: 'mega-menu-our-work',
    children: [
      {
        id: 'clients',
        labelKey: 'clients',
        to: `${paths.ourWork}#${ourWorkHash.clients}`,
      },
      {
        id: 'selected-work',
        labelKey: 'selectedWork',
        to: `${paths.ourWork}#selected-work`,
        requires: 'selectedWork',
      },
      {
        id: 'technologies',
        labelKey: 'technologies',
        to: `${paths.ourWork}#${ourWorkHash.technologies}`,
      },
      {
        id: 'work-industries',
        labelKey: 'industriesMarkets',
        to: `${paths.ourWork}#${ourWorkHash.industries}`,
      },
    ],
  },
]

function isItemVisible(item: NavLinkItem): boolean {
  if (item.requires === 'leaders') {
    return leaders.length > 0
  }

  if (item.requires === 'alliances') {
    return alliances.length > 0
  }

  if (item.requires === 'selectedWork') {
    return selectedWork.length > 0
  }

  return true
}

export function getVisibleNavGroups(): NavGroupItem[] {
  return primaryNavGroups.map((group) => ({
    ...group,
    children: group.children.filter(isItemVisible),
  }))
}

export const landingSectionIds = ['services', 'technologies', 'contact'] as const

/** @deprecated Use getVisibleNavGroups. Kept during migration. */
export const publicSectionIds = landingSectionIds
