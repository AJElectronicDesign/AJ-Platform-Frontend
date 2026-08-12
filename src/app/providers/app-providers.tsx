import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from '@/shared/i18n'

export interface AppProvidersProps {
  children: ReactNode
}

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter basename={routerBasename}>
      <I18nProvider>{children}</I18nProvider>
    </BrowserRouter>
  )
}
