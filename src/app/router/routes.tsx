import type { RouteObject } from 'react-router-dom'
import { AuthLayout } from '@/app/layouts/auth-layout'
import { PublicLayout } from '@/app/layouts/public-layout'
import { WhoWeArePage } from '@/features/company/presentation/pages/who-we-are-page'
import { WhatWeDoPage } from '@/features/company/presentation/pages/what-we-do-page'
import { OurWorkPage } from '@/features/company/presentation/pages/our-work-page'
import { LoginPage } from '@/features/auth/presentation/pages/login-page'
import { LandingPage } from '@/features/landing/presentation/pages/landing-page'

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
]
