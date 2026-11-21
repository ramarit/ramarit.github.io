import type { PostHog } from 'posthog-js'

/**
 * PostHog, loaded only when PUBLIC_POSTHOG_KEY is set at build time.
 * The project key is public by design; it lives in a GitHub Actions variable.
 */

let client: PostHog | null = null
let ready: Promise<void> | null = null
let pageCleanup: (() => void) | null = null

export function initAnalytics() {
  if (ready) return
  ready = (async () => {
    const key = import.meta.env.PUBLIC_POSTHOG_KEY
    if (!key) return
    try {
      const { default: posthog } = await import('posthog-js')
      posthog.init(key, {
        api_host: 'https://us.i.posthog.com',
        capture_pageview: false,
        person_profiles: 'identified_only',
      })
      client = posthog
    } catch {
      // Analytics must never break the site.
    }
  })()
}

export function track(event: string, props?: Record<string, unknown>) {
  void ready?.then(() => client?.capture(event, props))
}

export function pageview() {
  track('$pageview', { $current_url: window.location.href, page: window.location.pathname })
}

/** Per-page listeners: delegated clicks, section views and scroll depth. */
export function trackPage() {
  cleanupAnalytics()

  const cleanups: (() => void)[] = []

  const onClick = (event: MouseEvent) => {
    const el = (event.target as Element | null)?.closest<HTMLElement>('[data-track]')
    if (!el) return
    track(el.dataset.track || 'click', {
      name: el.dataset.trackName,
      href: el instanceof HTMLAnchorElement ? el.href : undefined,
    })
  }
  document.addEventListener('click', onClick)
  cleanups.push(() => document.removeEventListener('click', onClick))

  if ('IntersectionObserver' in window) {
    const seen = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue
          seen.add(entry.target)
          io.unobserve(entry.target)
          track('section_viewed', { section: (entry.target as HTMLElement).dataset.section })
        }
      },
      { threshold: 0.35 },
    )
    document.querySelectorAll('[data-section]').forEach((el) => io.observe(el))
    cleanups.push(() => io.disconnect())
  }

  const milestones = [25, 50, 75, 100]
  const hit = new Set<number>()
  let raf = 0
  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      if (max <= 0) return
      const pct = Math.round((window.scrollY / max) * 100)
      for (const milestone of milestones) {
        if (pct < milestone || hit.has(milestone)) continue
        hit.add(milestone)
        track('scroll_depth', {
          percentage: milestone,
          scroll_position: window.scrollY,
          page_height: doc.scrollHeight,
          viewport_height: window.innerHeight,
          page: window.location.pathname,
        })
      }
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  cleanups.push(() => {
    window.removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
  })

  pageCleanup = () => {
    for (const fn of cleanups) fn()
    pageCleanup = null
  }
}

export function cleanupAnalytics() {
  pageCleanup?.()
}
