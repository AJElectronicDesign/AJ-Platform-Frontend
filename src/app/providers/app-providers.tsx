import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

export interface AppProvidersProps {
  children: ReactNode
}

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export function AppProviders({ children }: AppProvidersProps) {
  return <BrowserRouter basename={routerBasename}>{children}</BrowserRouter>
}
