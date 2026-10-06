import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { UserRole } from '@/features/auth/domain/entities/user'
import { userHasRole } from '@/features/auth/domain/user-has-role'
import { SessionErrorState } from '@/features/auth/presentation/session-error'
import { SessionLoading } from '@/features/auth/presentation/session-loading'
import { useAuth } from '@/features/auth/presentation/use-auth'
import { paths } from '@/shared/constants/paths'

export function RequireRole({ roles }: { roles: readonly UserRole[] }) {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <SessionLoading />
  }

  if (status === 'error') {
    return <SessionErrorState />
  }

  if (!user) {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  if (!userHasRole(user, roles)) {
    return <Navigate to={paths.app} replace />
  }

  return <Outlet />
}
