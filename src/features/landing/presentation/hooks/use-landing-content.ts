import { useEffect, useState } from 'react'
import { getLandingContent } from '@/features/landing/application/use-cases/get-landing-content'
import type { LandingContent } from '@/features/landing/domain/entities/landing-content'
import { landingContentRepository } from '@/features/landing/infrastructure/repositories/landing-content-repository'

interface UseLandingContentResult {
  content: LandingContent | null
  isLoading: boolean
  error: string | null
}

export function useLandingContent(): UseLandingContentResult {
  const [content, setContent] = useState<LandingContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadContent() {
      try {
        const result = await getLandingContent(landingContentRepository)

        if (!isMounted) {
          return
        }

        setContent(result)
        setError(null)
      } catch {
        if (!isMounted) {
          return
        }

        setError('Unable to load landing content.')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadContent()

    return () => {
      isMounted = false
    }
  }, [])

  return { content, isLoading, error }
}
