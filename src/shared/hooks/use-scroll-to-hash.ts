import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Scrolls to `location.hash` after SPA navigations such as `/who-we-are` → `/#contact`.
 */
export function useScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
      return
    }

    const id = decodeURIComponent(hash.replace(/^#/, ''))

    function scrollToTarget() {
      const element = document.getElementById(id)

      if (!element) {
        return false
      }

      element.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      })
      return true
    }

    if (scrollToTarget()) {
      return
    }

    let attempts = 0
    const interval = window.setInterval(() => {
      attempts += 1
      if (scrollToTarget() || attempts >= 8) {
        window.clearInterval(interval)
      }
    }, 50)

    return () => {
      window.clearInterval(interval)
    }
  }, [pathname, hash])
}
