/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID: string
  readonly VITE_EMAILJS_TEMPLATE_ID: string
  readonly VITE_EMAILJS_PUBLIC_KEY: string
  /** Backend origin, without a path. Example: http://localhost:3000 */
  readonly VITE_API_URL: string
  /** Set to "true" to sign in against the in-memory dev mock. */
  readonly VITE_AUTH_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
