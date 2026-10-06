import { paths } from '@/shared/constants/paths'
import type { AppCatalog } from '@/shared/i18n/types'

export type WorkspaceModuleId = keyof AppCatalog['modules']

export interface WorkspaceNavItem {
  id: WorkspaceModuleId
  to: string
  end?: boolean
}

export const workspaceNav: readonly WorkspaceNavItem[] = [
  { id: 'dashboard', to: paths.app, end: true },
  { id: 'clients', to: paths.appClients },
  { id: 'quotations', to: paths.appQuotations },
  { id: 'deliveryOrders', to: paths.appDeliveryOrders },
]
