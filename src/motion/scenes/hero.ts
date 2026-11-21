import { gsap, ScrollTrigger, SplitText, finePointer, type Scene } from '../core'

/**
 * Hero: masked character intro, a craft word that scrambles between roles,
 * and variable-font letters that go thinner and wider near the cursor.
 */
export const hero: Scene = (root, c) => {
  const name = root.querySelector<HTMLElement>('[data-hero-name]')
  const foot = root.querySelector<HTMLElement>('[data-hero-foot]')
  const craft = root.querySelector<HTMLElement>('[data-craft]')
  if (!name || !foot) return

  // CSS keeps these hidden under .js-motion until we are ready to reveal them.
  gsap.set([name, foot], { visibility: 'visible' })

  if (c.reduce) return

  const split = SplitText.create(name, {
    type: 'chars',
    mask: 'chars',
    charsClass: 'char',
    aria: 'none',
  })

  const intro = gsap.timeline({ delay: 0.15 })
  intro
    .from(split.chars, { yPercent: 115, rotate: 8, duration: 1.3, stagger: 0.045, ease: 'paint' })
    .from(foot.children, { y: 26, autoAlpha: 0, duration: 1, stagger: 0.09, ease: 'paint' }, 0.55)

  gsap.to(name, {
    yPercent: -12,
    ease: 'none',
    scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
  })

  // The subtitle cycles through the crafts with ScrambleText.
  if (craft) {
    let crafts: string[] = []
    try {
      crafts = JSON.parse(craft.dataset.crafts || '[]')
    } catch {
      crafts = []
    }
    if (crafts.length > 1) {
      const words = [...crafts.slice(1), crafts[0]]
      const cycle = gsap.timeline({ repeat: -1, paused: true })
      for (const word of words) {
        cycle.to(
          craft,
          {
            duration: 0.85,
            ease: 'none',
            scrambleText: { text: word, chars: 'lowerCase', speed: 0.45 },
          },
          '+=2.2',
        )
      }
      const cycleTrigger = ScrollTrigger.create({
        trigger: root,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? cycle.play() : cycle.pause()),
      })
      cycleTrigger.refresh()
      if (cycleTrigger.isActive) cycle.play()
    }
  }

  // Variable-font proximity, desktop + fine pointer only.
  if (c.desktop && finePointer()) {
    const wghtTo = split.chars.map((char) => gsap.quickTo(char, '--wght', { duration: 0.5, ease: 'power2.out' }))
    const wdthTo = split.chars.map((char) => gsap.quickTo(char, '--wdth', { duration: 0.5, ease: 'power2.out' }))
    gsap.set(split.chars, { '--wght': 800, '--wdth': 85 })

    let queued = false
    let last: PointerEvent | null = null

    const update = () => {
      queued = false
      if (!last) return
      const { clientX, clientY } = last
      split.chars.forEach((char, i) => {
        const r = char.getBoundingClientRect()
        const dx = clientX - (r.left + r.width / 2)
        const dy = clientY - (r.top + r.height / 2)
        const t = gsap.utils.clamp(0, 1, 1 - Math.hypot(dx, dy) / 260)
        const eased = t * t * (3 - 2 * t)
        wghtTo[i](800 - 550 * eased)
        wdthTo[i](85 + 15 * eased)
      })
    }

    const onMove = (event: PointerEvent) => {
      last = event
      if (queued) return
      queued = true
      requestAnimationFrame(update)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onMove)
      split.revert()
    }
  }

  return () => split.revert()
}
