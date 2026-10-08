import { app } from './app'
import { auth } from './auth'
import { clients } from './clients'
import { common } from './common'
import { deliveryOrders } from './delivery-orders'
import { company } from './company'
import { home } from './home'
import { navigation } from './navigation'
import { quotes } from './quotes'
import type { Catalogs } from '@/shared/i18n/types'

export const en: Catalogs = {
  common,
  navigation,
  home,
  company,
  app,
  auth,
  clients,
  quotes,
  deliveryOrders,
}
