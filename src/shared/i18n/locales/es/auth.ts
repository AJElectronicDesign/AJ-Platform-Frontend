import type { AuthCatalog } from '@/shared/i18n/types'

export const auth: AuthCatalog = {
  login: {
    eyebrow: 'Acceso interno',
    title: 'Iniciar sesión',
    description: 'Inicia sesión para entrar a la plataforma de AJ Electronic Design.',
    email: 'Correo',
    emailPlaceholder: 'tu@empresa.com',
    password: 'Contraseña',
    passwordPlaceholder: '••••••••',
    submit: 'Iniciar sesión',
    submitting: 'Iniciando sesión...',
    publicSitePrompt: '¿Buscas el sitio público?',
    backHome: 'Volver al inicio',
    validation: 'Completa el correo y la contraseña.',
    invalid_credentials: 'El correo o la contraseña no son válidos.',
    rate_limited: 'Demasiados intentos de acceso. Espera un momento e inténtalo de nuevo.',
    network: 'Error de red. Revisa tu conexión e inténtalo de nuevo.',
    unavailable: 'No se puede iniciar sesión en este momento. Inténtalo de nuevo.',
    unknown: 'No se puede iniciar sesión en este momento. Inténtalo de nuevo.',
  },
  session: {
    network: 'Error de red. Revisa tu conexión e inténtalo de nuevo.',
    unavailable: 'No se pudo restaurar la sesión. Inténtalo de nuevo.',
    retry: 'Reintentar',
  },
}
