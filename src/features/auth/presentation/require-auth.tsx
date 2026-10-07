import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { SessionErrorState } from '@/features/auth/presentation/session-error'
import { SessionLoading } from '@/features/auth/presentation/session-loading'
import { useAuth } from '@/features/auth/presentation/use-auth'
import { paths } from '@/shared/constants/paths'

export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <SessionLoading />
  }

  if (status === 'error') {
    return <SessionErrorState />
  }

  if (status !== 'authenticated') {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
