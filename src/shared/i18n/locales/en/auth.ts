import type { AuthCatalog } from '@/shared/i18n/types'

export const auth: AuthCatalog = {
  login: {
    eyebrow: 'Internal access',
    title: 'Log in',
    description: 'Sign in to access the AJ Electronic Design Platform.',
    email: 'Email',
    emailPlaceholder: 'you@company.com',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    submit: 'Log in',
    submitting: 'Signing in...',
    publicSitePrompt: 'Looking for our public site?',
    backHome: 'Back to home',
    validation: 'Enter your email and password.',
    invalid_credentials: 'Invalid email or password.',
    rate_limited: 'Too many sign-in attempts. Please wait and try again.',
    network: 'Network error. Check your connection and try again.',
    unavailable: 'Unable to sign in right now. Please try again.',
    unknown: 'Unable to sign in right now. Please try again.',
  },
  session: {
    network: 'Network error. Check your connection and try again.',
    unavailable: 'Could not restore your session. Please try again.',
    retry: 'Retry',
  },
}
