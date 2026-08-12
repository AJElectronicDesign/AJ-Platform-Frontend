import { useMemo } from 'react'
import { assembleLandingContent } from '@/features/landing/application/assemble-landing-content'
import type { LandingContent } from '@/features/landing/domain/entities/landing-content'
import { useI18n } from '@/shared/i18n'

interface UseLandingContentResult {
  content: LandingContent
}

export function useLandingContent(): UseLandingContentResult {
  const { t } = useI18n()

  const content = useMemo(() => assembleLandingContent(t.home), [t.home])

  return { content }
}
