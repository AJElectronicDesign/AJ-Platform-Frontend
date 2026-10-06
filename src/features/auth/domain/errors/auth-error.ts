export type SignInErrorCode =
  | 'invalid_credentials'
  | 'rate_limited'
  | 'network'
  | 'unknown'

export class AuthError extends Error {
  readonly code: SignInErrorCode

  constructor(code: SignInErrorCode, message: string) {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}
