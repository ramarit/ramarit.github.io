import { gsap, SplitText, type Scene } from '../core'

/** Contact: the big line reveals in, then ripples character by character on hover. */
export const contact: Scene = (root, c) => {
  const big = root.querySelector<HTMLElement>('[data-contact-big]')
  if (!big || c.reduce) return

  const split = SplitText.create(big, {
    type: 'chars',
    mask: 'chars',
    charsClass: 'char',
    aria: 'none',
  })

  gsap.from(split.chars, {
    yPercent: 150,
    rotate: 6,
    duration: 1.1,
    stagger: 0.02,
    ease: 'paint',
    scrollTrigger: { trigger: big, start: 'top 88%', once: true },
  })

  const onEnter = () => {
    gsap.fromTo(
      split.chars,
      { y: 0 },
      {
        y: -10,
        duration: 0.35,
        stagger: { each: 0.018, from: 'start' },
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
        overwrite: true,
      },
    )
  }
  big.addEventListener('pointerenter', onEnter)

  return () => {
    big.removeEventListener('pointerenter', onEnter)
    split.revert()
  }
}
