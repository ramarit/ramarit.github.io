import { useEffect, useRef } from 'react'
import { usePostHog } from 'posthog-js/react'

interface ScrollDepthOptions {
  milestones?: number[] // Array of percentages (e.g., [25, 50, 75, 100])
  throttleMs?: number // Throttle scroll events
}

export function useScrollDepth(options: ScrollDepthOptions = {}) {
  const { milestones = [25, 50, 75, 100], throttleMs = 100 } = options
  const posthog = usePostHog()
  const trackedMilestones = useRef(new Set<number>())
  const lastScrollTime = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now()
      if (now - lastScrollTime.current < throttleMs) {
        return
      }
      lastScrollTime.current = now

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100)

      // Track milestones
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !trackedMilestones.current.has(milestone)) {
          trackedMilestones.current.add(milestone)
          
          posthog?.capture('scroll_depth', {
            percentage: milestone,
            scroll_position: scrollTop,
            page_height: document.documentElement.scrollHeight,
            viewport_height: window.innerHeight,
            page: window.location.pathname,
          })
        }
      })
    }

    // Reset tracked milestones on page change
    trackedMilestones.current.clear()

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [milestones, throttleMs, posthog])
}
