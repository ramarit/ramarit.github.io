import {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
  conditions,
  reduceMotion,
  finePointer,
  type Conditions,
  type Scene,
} from './core'
import { createField, getField } from './gl/field'
import { hero } from './scenes/hero'
import { process } from './scenes/process'
import { work } from './scenes/work'
import { stack } from './scenes/stack'
import { timeline } from './scenes/timeline'
import { contact } from './scenes/contact'
import { split } from './scenes/split'
import { magnetic } from './scenes/magnetic'
import { initAnalytics, pageview, trackPage, cleanupAnalytics, track } from '../lib/analytics'

type PageScene = { selector: string; run: Scene }

const pageScenes: PageScene[] = [
  { selector: '.hero', run: hero },
  { selector: '.process', run: process },
  { selector: '.work', run: work },
  { selector: '.stack', run: stack },
  { selector: '.timeline', run: timeline },
  { selector: '.contact', run: contact },
]

const glIntensity: Record<string, number> = {
  hero: 0.95,
  process: 0.8,
  work: 0.5,
  stack: 0.45,
  experience: 0.4,
  contact: 0.9,
  page: 0.55,
}

let booted = false
let mm: ReturnType<typeof gsap.matchMedia> | null = null
let smoother: ScrollSmoother | null = null
let pendingEnter = false

/** Runs once for the life of the document (the layout persists across page swaps). */
export function boot() {
  if (booted) return
  booted = true

  initAnalytics()
  setupThemeToggle()
  setupCursor()
  setupGlowShield()
  setupRouter()

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }

  // WebGL is the expensive part: create it after first paint, never under reduced motion.
  const startField = () => {
    if (reduceMotion()) return
    const host = document.getElementById('gl')
    if (!host) return
    const field = createField(host)
    if (!field) return
    const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
    field.setTheme(theme)
    field.state.intensity = document.querySelector('.hero') ? 0.95 : 0.55
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(startField, { timeout: 1800 })
  } else {
    setTimeout(startField, 350)
  }
}

function setupPage() {
  mm = gsap.matchMedia()

  mm.add(conditions, (ctx) => {
    const c = ctx.conditions as unknown as Conditions
    const cleanups: (() => void)[] = []

    if (c.reduce) {
      document.documentElement.classList.remove('js-motion')
    } else {
      document.documentElement.classList.add('js-motion')
      smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.1,
        effects: true,
        smoothTouch: 0.1,
      })
      cleanups.push(() => {
        smoother?.kill()
        smoother = null
      })
    }

    for (const { selector, run } of pageScenes) {
      const root = document.querySelector<HTMLElement>(selector)
      if (!root) continue
      const cleanup = run(root, c)
      if (cleanup) cleanups.push(cleanup)
    }

    const splitCleanup = split(document.body, c)
    if (splitCleanup) cleanups.push(splitCleanup)

    cleanups.push(setupHeaderHide())

    if (!c.reduce) {
      const magneticCleanup = magnetic(document.body, c)
      if (magneticCleanup) cleanups.push(magneticCleanup)

      cleanups.push(setupGlPresets())
      cleanups.push(setupVelocity())
      cleanups.push(setupHashLinks())
    }

    return () => {
      for (const fn of cleanups) fn()
    }
  })

  pageview()
  trackPage()
  ScrollTrigger.refresh()

  const hash = decodeURIComponent(window.location.hash.slice(1))
  if (hash) {
    requestAnimationFrame(() => {
      const target = document.getElementById(hash)
      if (!target) return
      ScrollTrigger.refresh()
      if (smoother) smoother.scrollTo(target, false, 'top top')
      else target.scrollIntoView()
    })
  }
}

function teardownPage() {
  mm?.revert()
  mm = null
  smoother = null
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  cleanupAnalytics()
}

/**
 * Slide the header away while scrolling down; bring it back on any scroll up or keyboard focus.
 * Away from the top it also gets a frosted backdrop (.is-scrolled).
 */
function setupHeaderHide() {
  const header = document.querySelector<HTMLElement>('.site-header')
  if (!header) return () => {}
  const setHidden = (hidden: boolean) => header.classList.toggle('is-hidden', hidden)
  // Past the top, the header gets a frosted backdrop so it reads over any content.
  const setScrolled = (scrolled: boolean) => header.classList.toggle('is-scrolled', scrolled)

  const trigger = ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      setScrolled(self.scroll() > 40)
      if (header.contains(document.activeElement)) return setHidden(false)
      if (self.scroll() < 120) return setHidden(false)
      setHidden(self.direction === 1)
    },
  })
  const onFocus = () => setHidden(false)
  header.addEventListener('focusin', onFocus)

  return () => {
    trigger.kill()
    header.removeEventListener('focusin', onFocus)
    setHidden(false)
    setScrolled(false)
  }
}

function setupGlPresets() {
  const triggers: ScrollTrigger[] = []
  for (const el of document.querySelectorAll<HTMLElement>('[data-gl]')) {
    triggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (!self.isActive) return
          const field = getField()
          if (!field) return
          gsap.to(field.state, {
            intensity: glIntensity[el.dataset.gl || ''] ?? 0.55,
            duration: 0.9,
            ease: 'power2.out',
            overwrite: true,
          })
        },
      }),
    )
  }
  return () => triggers.forEach((trigger) => trigger.kill())
}

function setupVelocity() {
  const trigger = ScrollTrigger.create({
    onUpdate: (self) => {
      const field = getField()
      if (!field) return
      field.state.vel = gsap.utils.clamp(-1.5, 1.5, self.getVelocity() / 2500)
    },
  })
  const decay = () => {
    const field = getField()
    if (field) field.state.vel *= 0.92
  }
  gsap.ticker.add(decay)
  return () => {
    trigger.kill()
    gsap.ticker.remove(decay)
  }
}

function setupHashLinks() {
  const onClick = (event: MouseEvent) => {
    const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]')
    if (!anchor || anchor.classList.contains('skip-link')) return
    const url = new URL(anchor.href, window.location.href)
    if (url.pathname !== window.location.pathname || url.search !== window.location.search) return
    if (!url.hash || url.hash === '#') return
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)))
    if (!target) return
    event.preventDefault()
    if (smoother) smoother.scrollTo(target, true, 'top top')
    else target.scrollIntoView()
    history.pushState(null, '', url.hash)
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}

function setupThemeToggle() {
  document.addEventListener('click', (event) => {
    const button = (event.target as Element | null)?.closest('[data-theme-toggle]')
    if (!button) return
    const root = document.documentElement
    const next = root.dataset.theme === 'light' ? 'dark' : 'light'
    root.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Storage can be blocked; the theme still changes for this page.
    }
    getField()?.setTheme(next)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', next === 'light' ? '#f1eee6' : '#0a0a0b')
    track('theme_toggled', { theme: next })
  })
}

/** Body copy that sits directly on the WebGL field. Keep in sync with the CSS shield rules. */
const SHIELDED = '.lede, .prose-lg, .cs-section, .tl-body, .tl-note, .stack-group'

/**
 * Show the frosted panel behind body copy whenever the cursor's glow trail is near it, not just
 * when the pointer is on the text. The field's trail glows visibly to ~20% of the viewport
 * height around the pointer and fades over ~1.2s, so blocks inside that radius get .is-shielded
 * and keep it until the trail behind them has faded.
 */
function setupGlowShield() {
  if (!finePointer() || reduceMotion()) return
  const LINGER = 1200
  const until = new WeakMap<Element, number>()
  let frame = 0
  let px = -1
  let py = -1

  const update = () => {
    frame = 0
    if (!document.documentElement.classList.contains('has-gl')) return
    const now = performance.now()
    const reach = window.innerHeight * 0.2
    for (const el of document.querySelectorAll(SHIELDED)) {
      const r = el.getBoundingClientRect()
      if (r.bottom < -reach || r.top > window.innerHeight + reach) {
        el.classList.remove('is-shielded')
        continue
      }
      const dx = Math.max(r.left - px, 0, px - r.right)
      const dy = Math.max(r.top - py, 0, py - r.bottom)
      if (dx * dx + dy * dy < reach * reach) until.set(el, now + LINGER)
      const on = (until.get(el) ?? 0) > now
      el.classList.toggle('is-shielded', on)
    }
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  window.addEventListener(
    'pointermove',
    (event) => {
      px = event.clientX
      py = event.clientY
      schedule()
    },
    { passive: true },
  )
  // Scrolling moves text under a still pointer; and panels must switch off once the trail fades.
  window.addEventListener('scroll', schedule, { passive: true })
  setInterval(schedule, 300)
}

function setupCursor() {
  const cursor = document.querySelector<HTMLElement>('.cursor')
  if (!cursor || !finePointer() || reduceMotion()) return

  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' })
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' })
  let shown = false

  const onMove = (event: PointerEvent) => {
    if (!shown) {
      shown = true
      gsap.to(cursor, { opacity: 1, duration: 0.3 })
    }
    xTo(event.clientX)
    yTo(event.clientY)
  }
  const onOver = (event: PointerEvent) => {
    const target = event.target as Element | null
    const active = !!target?.closest('a, button, [data-magnetic], [data-throw-list] li')
    gsap.to(cursor, { scale: active ? 2.8 : 1, duration: 0.35, ease: 'power3.out' })
  }
  const onLeave = () => {
    shown = false
    gsap.to(cursor, { opacity: 0, duration: 0.3 })
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerover', onOver, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
}

function setupRouter() {
  document.addEventListener('astro:before-preparation', (event) => {
    if (reduceMotion()) return
    const withLoader = event as Event & { loader?: () => Promise<void> }
    if (!withLoader.loader) return
    pendingEnter = true
    const original = withLoader.loader
    withLoader.loader = async () => {
      await exitTransition()
      await original()
    }
  })

  document.addEventListener('astro:before-swap', (event) => {
    teardownPage()
    // The router replaces <html>'s attributes with the incoming page's, which never has the
    // runtime state: the chosen theme (set by the inline head script on first load only),
    // .has-gl (the persisted WebGL field) and .js-motion. Carry them over before the swap
    // so light mode keeps its text colours and nothing flashes.
    const { newDocument } = event as Event & { newDocument: Document }
    const current = document.documentElement
    const next = newDocument.documentElement
    if (current.dataset.theme) next.dataset.theme = current.dataset.theme
    else delete next.dataset.theme
    for (const cls of ['has-gl', 'js-motion']) {
      next.classList.toggle(cls, current.classList.contains(cls))
    }
    const meta = newDocument.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', current.dataset.theme === 'light' ? '#f1eee6' : '#0a0a0b')
  })

  document.addEventListener('astro:page-load', () => {
    setupPage()
    if (pendingEnter) {
      pendingEnter = false
      enterTransition()
    }
  })
}

function transitionSpans() {
  return gsap.utils.toArray<HTMLElement>('#transition span')
}

async function exitTransition() {
  const spans = transitionSpans()
  if (!spans.length) return
  gsap.killTweensOf(spans)
  gsap.set(spans, { transformOrigin: 'bottom' })
  await gsap.to(spans, { scaleY: 1, duration: 0.55, stagger: 0.05, ease: 'snap' })
}

function enterTransition() {
  const spans = transitionSpans()
  if (!spans.length) return
  gsap.killTweensOf(spans)
  gsap.set(spans, { transformOrigin: 'top', scaleY: 1 })
  gsap.to(spans, { scaleY: 0, duration: 0.7, stagger: 0.05, ease: 'snap', delay: 0.05 })
}
