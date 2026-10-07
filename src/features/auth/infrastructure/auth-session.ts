import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository'
import { accessToken } from '@/shared/infrastructure/http/access-token'

export const authSession: Pick<
  AuthRepository,
  | 'hasSession'
  | 'sessionExpiresAt'
  | 'clearLocalSession'
  | 'expireLocalSession'
  | 'subscribe'
> = {
  hasSession() {
    return accessToken.read() !== null
  },

  sessionExpiresAt() {
    return accessToken.expiresAt()
  },

  clearLocalSession() {
    accessToken.clear()
  },

  expireLocalSession() {
    accessToken.expire()
  },

  subscribe(listener) {
    return accessToken.subscribe(listener)
  },
}
