import { accessToken } from './access-token'
import {
  ApiError,
  ApiErrorCode,
  endsAuthenticatedSession,
  type ApiErrorDetail,
} from './api-error'
import { buildApiUrl } from './api-config'
import { notifyUnauthorized } from './unauthorized'

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
  /** Attach the stored Bearer token when one exists. Defaults to true. */
  auth?: boolean
  /**
   * On a session-ending 401, clear the token and redirect to /login.
   * Login and the initial `/auth/me` check pass false.
   */
  handleUnauthorized?: boolean
}

export async function httpRequest<T>(
  path: string,
  options: HttpRequestOptions = {},
): Promise<T> {
  const method = options.method ?? 'GET'
  const headers = new Headers(options.headers)

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  const token = options.auth === false ? null : accessToken.read()

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (options.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response

  try {
    response = await fetch(buildApiUrl(path), {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }

    const message = error instanceof Error ? error.message : 'Network request failed'
    throw new ApiError(0, message, ApiErrorCode.network)
  }

  if (response.ok) {
    return (await readSuccessBody(response)) as T
  }

  const apiError = await readError(response)
  const shouldEndSession =
    options.handleUnauthorized !== false &&
    endsAuthenticatedSession(apiError, Boolean(token))

  if (shouldEndSession) {
    accessToken.clear()
    notifyUnauthorized()
  }

  throw apiError
}

async function readSuccessBody(response: Response): Promise<unknown> {
  // Logout is 204 with an empty body. Never run it through JSON.parse.
  if (response.status === 204) {
    return undefined
  }

  const text = await response.text()

  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new ApiError(
      response.status,
      'The server returned an invalid response.',
      ApiErrorCode.unknown,
    )
  }
}

async function readError(response: Response): Promise<ApiError> {
  const fallback = response.statusText || 'Request failed'
  let payload: unknown

  try {
    const text = await response.text()
    payload = text ? (JSON.parse(text) as unknown) : undefined
  } catch {
    payload = undefined
  }

  return errorFromPayload(response.status, payload, fallback)
}

function errorFromPayload(status: number, payload: unknown, fallback: string): ApiError {
  const envelope = readErrorEnvelope(payload)

  if (!envelope) {
    return new ApiError(status, fallback || 'Request failed', ApiErrorCode.unknown)
  }

  return new ApiError(
    status,
    envelope.message || fallback || 'Request failed',
    envelope.code,
    envelope.details,
  )
}

function readErrorEnvelope(
  payload: unknown,
): { code: string; message: string; details: ApiErrorDetail[] } | null {
  if (!payload || typeof payload !== 'object' || !('error' in payload)) {
    return null
  }

  const error = (payload as { error?: unknown }).error

  if (!error || typeof error !== 'object') {
    return null
  }

  const record = error as Record<string, unknown>
  const code = typeof record.code === 'string' && record.code.trim() ? record.code : ApiErrorCode.unknown
  const message = typeof record.message === 'string' ? record.message.trim() : ''

  return {
    code,
    message,
    details: readDetails(record.details),
  }
}

function readDetails(value: unknown): ApiErrorDetail[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return []
    }

    const record = item as Record<string, unknown>

    if (typeof record.path !== 'string' || typeof record.message !== 'string') {
      return []
    }

    return [{ path: record.path, message: record.message }]
  })
}
