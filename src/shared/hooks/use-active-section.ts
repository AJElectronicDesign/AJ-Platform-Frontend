import { useEffect, useState } from 'react'

/**
 * Tracks which page section is currently in view while scrolling.
 */
export function useActiveSection(
  sectionIds: readonly string[],
  offset = 120,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (sectionIds.length === 0) {
      return
    }

    function updateActiveSection() {
      let current: string | null = null

      for (const id of sectionIds) {
        const element = document.getElementById(id)

        if (!element) {
          continue
        }

        if (element.getBoundingClientRect().top - offset <= 0) {
          current = id
        }
      }

      if (!current && window.scrollY < offset) {
        setActiveId(null)
        return
      }

      setActiveId(current)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [offset, sectionIds])

  return activeId
}
