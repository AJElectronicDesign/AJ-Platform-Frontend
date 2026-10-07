type UnauthorizedHandler = () => void

let handler: UnauthorizedHandler | null = null
let handling = false

/**
 * AuthProvider registers this so a 401 can clear React state and
 * return to /login without the HTTP client importing the router.
 */
export function setUnauthorizedHandler(next: UnauthorizedHandler): () => void {
  handler = next

  return () => {
    if (handler === next) {
      handler = null
    }
  }
}

export function resetUnauthorizedHandling(): void {
  handling = false
}

export function notifyUnauthorized(): void {
  if (handling) {
    return
  }

  handling = true

  if (handler) {
    handler()
    return
  }

  redirectToLogin()
}

function redirectToLogin(): void {
  if (typeof window === 'undefined') {
    return
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const loginPath = `${base}/login`

  if (window.location.pathname === loginPath) {
    return
  }

  window.location.assign(`${window.location.origin}${loginPath}`)
}
