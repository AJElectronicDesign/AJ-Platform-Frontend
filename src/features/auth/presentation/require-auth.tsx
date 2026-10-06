import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { SessionLoading } from '@/features/auth/presentation/session-loading'
import { useAuth } from '@/features/auth/presentation/use-auth'
import { paths } from '@/shared/constants/paths'

export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <SessionLoading />
  }

  if (status !== 'authenticated') {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
