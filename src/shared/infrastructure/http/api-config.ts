import { ApiConfigError } from './api-error'

const API_PREFIX = '/api/v1'

/**
 * Backend origin from `VITE_API_URL`, without a trailing slash or `/api/v1`.
 * The client always calls `${origin}/api/v1/...`.
 */
export function getApiOrigin(): string {
  const raw = import.meta.env.VITE_API_URL?.trim() ?? ''

  if (!raw) {
    throw new ApiConfigError(
      'VITE_API_URL is not set. Point it at the backend origin.',
    )
  }

  return raw.replace(/\/+$/, '').replace(/\/api\/v1$/i, '')
}

export function buildApiUrl(path: string, origin = getApiOrigin()): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const suffix =
    normalized === API_PREFIX || normalized.startsWith(`${API_PREFIX}/`)
      ? normalized
      : `${API_PREFIX}${normalized}`

  return `${origin}${suffix}`
}
