import type { AppCatalog } from '@/shared/i18n/types'

export const app: AppCatalog = {
  session: {
    loading: 'Restoring session...',
  },
  shell: {
    navigation: 'Platform',
    openNavigation: 'Open navigation',
    closeNavigation: 'Close navigation',
    logout: 'Log out',
    loggingOut: 'Signing out...',
    publicSite: 'Public site',
  },
  modules: {
    dashboard: 'Dashboard',
    clients: 'Clients',
    quotations: 'Quotations',
    deliveryOrders: 'Delivery orders',
  },
  placeholder: {
    title: 'Coming soon',
    description: 'This module will be available in an upcoming release.',
  },
}
