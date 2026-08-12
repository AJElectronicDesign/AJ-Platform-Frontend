import { useMemo } from 'react'
import {
  localizeClients,
  localizeProcess,
  localizeServices,
  localizeTechnologies,
  useI18n,
} from '@/shared/i18n'

export function useLocalizedCorporateContent() {
  const { t } = useI18n()

  return useMemo(
    () => ({
      services: localizeServices(t.home),
      clients: localizeClients(t.home),
      technologies: localizeTechnologies(t.home),
      process: localizeProcess(t.home),
    }),
    [t.home],
  )
}
