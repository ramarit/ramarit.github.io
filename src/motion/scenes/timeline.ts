import { gsap, ScrollTrigger, type Scene } from '../core'

/**
 * Track record: the spine draws with scroll, each role rises in, its big number counts up,
 * and the latest title in a promotion path lights up.
 */
export const timeline: Scene = (root, c) => {
  if (c.reduce) return

  const list = root.querySelector<HTMLElement>('[data-tl]')
  const line = root.querySelector<HTMLElement>('[data-tl-draw]')
  const items = gsap.utils.toArray<HTMLElement>('[data-tl-item]', root)
  if (!list || !items.length) return

  if (line) {
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: true },
      },
    )
  }

  for (const item of items) {
    gsap.from(item, {
      y: 40,
      opacity: 0, // not autoAlpha: visibility: hidden would hide the role from screen readers
      duration: 1,
      ease: 'paint',
      scrollTrigger: { trigger: item, start: 'top 88%', once: true },
    })

    // Count numeric stats up from 0. The HTML already holds the final value, so no-JS and
    // reduced motion just show it.
    const num = item.querySelector<HTMLElement>('.tl-num[data-count]')
    if (num) {
      const target = Number(num.dataset.count)
      const prefix = num.dataset.prefix ?? ''
      const suffix = num.dataset.suffix ?? ''
      const counter = { v: 0 }
      const render = () => (num.textContent = `${prefix}${Math.round(counter.v)}${suffix}`)
      render()
      gsap.to(counter, {
        v: target,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: render,
        scrollTrigger: { trigger: item, start: 'top 80%', once: true },
      })
    }

    const latest = item.querySelector<HTMLElement>('.tl-path li:last-child')
    if (latest && item.querySelectorAll('.tl-path li').length > 1) {
      latest.classList.remove('is-reached')
      ScrollTrigger.create({
        trigger: item,
        start: 'top 65%',
        once: true,
        onEnter: () => latest.classList.add('is-reached'),
      })
    }
  }
}
