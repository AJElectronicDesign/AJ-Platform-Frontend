import type { RouteObject } from 'react-router-dom'
import { AuthLayout } from '@/app/layouts/auth-layout'
import { PublicLayout } from '@/app/layouts/public-layout'
import { RequireAuth } from '@/features/auth/presentation/require-auth'
import { LoginPage } from '@/features/auth/presentation/pages/login-page'
import { WhoWeArePage } from '@/features/company/presentation/pages/who-we-are-page'
import { WhatWeDoPage } from '@/features/company/presentation/pages/what-we-do-page'
import { OurWorkPage } from '@/features/company/presentation/pages/our-work-page'
import { LandingPage } from '@/features/landing/presentation/pages/landing-page'
import { ClientDetailPage } from '@/features/clients/presentation/pages/client-detail-page'
import { ClientFormPage } from '@/features/clients/presentation/pages/client-form-page'
import { ClientListPage } from '@/features/clients/presentation/pages/client-list-page'
import { InternalLayout } from '@/features/workspace/presentation/internal-layout'
import { ModulePlaceholderPage } from '@/features/workspace/presentation/pages/module-placeholder-page'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'who-we-are',
        element: <WhoWeArePage />,
      },
      {
        path: 'what-we-do',
        element: <WhatWeDoPage />,
      },
      {
        path: 'our-work',
        element: <OurWorkPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/app',
        element: <InternalLayout />,
        children: [
          {
            index: true,
            element: <ModulePlaceholderPage moduleId="dashboard" />,
          },
          {
            path: 'clientes',
            element: <ClientListPage />,
          },
          {
            path: 'clientes/nuevo',
            element: <ClientFormPage mode="create" />,
          },
          {
            path: 'clientes/:clientId',
            element: <ClientDetailPage />,
          },
          {
            path: 'clientes/:clientId/editar',
            element: <ClientFormPage mode="edit" />,
          },
          {
            path: 'cotizaciones',
            element: <ModulePlaceholderPage moduleId="quotations" />,
          },
          {
            path: 'ordenes-de-entrega',
            element: <ModulePlaceholderPage moduleId="deliveryOrders" />,
          },
        ],
      },
    ],
  },
]
