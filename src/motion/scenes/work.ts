import { gsap, ScrollTrigger, finePointer, type Scene } from '../core'

/**
 * Selected work: pinned horizontal scroll on desktop, batched fades on mobile.
 * Card art gets containerAnimation parallax; the track skews with scroll velocity.
 */
export const work: Scene = (root, c) => {
  const pin = root.querySelector<HTMLElement>('[data-work-pin]')
  const track = root.querySelector<HTMLElement>('[data-work-track]')
  const cards = gsap.utils.toArray<HTMLElement>('[data-work-card]', root)
  if (!pin || !track || !cards.length) return

  if (c.mobile) {
    gsap.set(cards, { opacity: 0, y: 60 }) // opacity, not autoAlpha: keep cards in the a11y tree
    ScrollTrigger.batch(cards, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: 'paint' }),
    })
    return
  }

  if (!c.desktop) return

  const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' })

  const scrollTween = gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: () => `+=${Math.max(1, track.scrollWidth - window.innerWidth)}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        skewTo(gsap.utils.clamp(-8, 8, self.getVelocity() / -300))
      },
    },
  })

  for (const card of cards) {
    const art = card.querySelector<HTMLElement>('[data-parallax]')
    if (!art) continue
    gsap.fromTo(
      art,
      { xPercent: -7 },
      {
        xPercent: 7,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          containerAnimation: scrollTween,
          start: 'left right',
          end: 'right left',
          scrub: true,
        },
      },
    )
  }

  if (!finePointer()) return

  const cleanups: (() => void)[] = []
  for (const card of cards) {
    gsap.set(card, { transformPerspective: 1000 })
    const rotateXTo = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' })
    const rotateYTo = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      const r = card.getBoundingClientRect()
      const px = (event.clientX - r.left) / r.width - 0.5
      const py = (event.clientY - r.top) / r.height - 0.5
      rotateXTo(-py * 5)
      rotateYTo(px * 5)
    }
    const onLeave = () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' })
    }
    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerleave', onLeave)
    cleanups.push(() => {
      card.removeEventListener('pointermove', onMove)
      card.removeEventListener('pointerleave', onLeave)
    })
  }

  return () => cleanups.forEach((fn) => fn())
}
