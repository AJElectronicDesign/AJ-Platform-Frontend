import type { AppCatalog } from '@/shared/i18n/types'

export const app: AppCatalog = {
  session: {
    loading: 'Restaurando la sesión...',
  },
  shell: {
    navigation: 'Plataforma',
    openNavigation: 'Abrir navegación',
    closeNavigation: 'Cerrar navegación',
    logout: 'Cerrar sesión',
    loggingOut: 'Cerrando sesión...',
    publicSite: 'Sitio público',
  },
  modules: {
    dashboard: 'Dashboard',
    clients: 'Clientes',
    quotations: 'Cotizaciones',
    deliveryOrders: 'Órdenes de entrega',
  },
  placeholder: {
    title: 'Próximamente',
    description: 'Este módulo estará disponible en una siguiente versión.',
  },
}
