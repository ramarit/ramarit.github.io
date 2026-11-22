import { gsap, Draggable, finePointer, type Scene } from '../core'
import { track } from '../../lib/analytics'

/**
 * 404: the sketch stroke crosses out the number, and the digits are toys. With a mouse they can
 * be thrown (Draggable + Inertia, kept in the hero) and spring home; on touch a tap makes a digit
 * jump. Reduced motion: nothing moves and the stroke is simply shown.
 */
export const notFound: Scene = (root, c) => {
  const stage = root.querySelector<HTMLElement>('[data-nf-stage]')
  const stroke = root.querySelector<SVGPathElement>('[data-nf-stroke]')
  const digits = gsap.utils.toArray<HTMLElement>('[data-nf-digit]', root)
  const hint = root.querySelector<HTMLElement>('[data-nf-hint]')
  if (!stage || !digits.length || c.reduce) return

  const cleanups: (() => void)[] = []
  let played = false
  const played1 = () => {
    if (played) return
    played = true
    track('not_found_played')
  }

  // Digits drop in, then the stroke scribbles across them.
  gsap.from(digits, { yPercent: 60, opacity: 0, rotate: () => gsap.utils.random(-14, 14), duration: 1.1, stagger: 0.09, ease: 'back.out(1.7)', delay: 0.1 })
  if (stroke) gsap.fromTo(stroke, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: 'power2.inOut', delay: 0.85 })

  const goHome = (el: HTMLElement) =>
    gsap.to(el, { x: 0, y: 0, rotate: 0, delay: 0.5, duration: 1.2, ease: 'elastic.out(1, 0.5)' })

  if (finePointer()) {
    root.classList.add('is-throwable')
    const draggables = Draggable.create(digits, {
      bounds: root,
      inertia: true,
      edgeResistance: 0.7,
      zIndexBoost: true,
      onPress() {
        gsap.killTweensOf(this.target)
        played1()
      },
      onDrag() {
        gsap.set(this.target, { rotate: gsap.utils.clamp(-25, 25, this.deltaX * 1.5) })
      },
      onRelease() {
        if (!this.tween) goHome(this.target)
      },
      onThrowComplete() {
        goHome(this.target)
      },
    })
    cleanups.push(() => draggables.forEach((d) => d.kill()))
  } else {
    if (hint) hint.textContent = 'Go on, tap the numbers.'
    for (const el of digits) {
      const onTap = () => {
        played1()
        gsap
          .timeline()
          .to(el, { y: '-=40', rotate: gsap.utils.random(-20, 20), duration: 0.25, ease: 'power2.out' })
          .to(el, { y: 0, rotate: 0, duration: 0.9, ease: 'bounce.out' })
      }
      el.addEventListener('pointerdown', onTap)
      cleanups.push(() => el.removeEventListener('pointerdown', onTap))
    }
  }

  return () => {
    cleanups.forEach((fn) => fn())
    root.classList.remove('is-throwable')
  }
}
