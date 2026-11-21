import { gsap, ScrollTrigger, type Scene } from '../core'

/** Experience: the line draws with scroll, items rise in, promotions light up. */
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
      autoAlpha: 0,
      duration: 1,
      ease: 'paint',
      scrollTrigger: { trigger: item, start: 'top 88%', once: true },
    })

    const promotion = item.querySelector<HTMLElement>('.tl-titles li:first-child')
    if (promotion) {
      promotion.classList.remove('is-reached')
      ScrollTrigger.create({
        trigger: item,
        start: 'top 65%',
        once: true,
        onEnter: () => promotion.classList.add('is-reached'),
      })
    }
  }
}
