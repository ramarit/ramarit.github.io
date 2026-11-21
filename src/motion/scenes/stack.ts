import { gsap, Draggable, finePointer, type Scene } from '../core'
import { track } from '../../lib/analytics'

/**
 * Stack: a small easter egg. The skill pills can be grabbed and flung (Draggable + Inertia,
 * kept inside the section), then spring back home. Fine pointers only; nothing to discover
 * for keyboard or reduced-motion users, and nothing is lost without it.
 */
export const stack: Scene = (root, c) => {
  if (c.reduce || !finePointer()) return

  const bounds = root.querySelector<HTMLElement>('[data-stack-bounds]')
  const pills = gsap.utils.toArray<HTMLElement>('.skill-pills li', root)
  if (!bounds || !pills.length) return

  root.classList.add('is-throwable')
  let tracked = false

  const goHome = (pill: HTMLElement) =>
    gsap.to(pill, { x: 0, y: 0, rotate: 0, delay: 0.6, duration: 1.1, ease: 'elastic.out(1, 0.55)' })

  const draggables = Draggable.create(pills, {
    bounds,
    inertia: true,
    edgeResistance: 0.75,
    zIndexBoost: true,
    onPress() {
      gsap.killTweensOf(this.target)
      if (!tracked) {
        tracked = true
        track('stack_pill_thrown')
      }
    },
    onRelease() {
      if (!this.tween) goHome(this.target)
    },
    onThrowComplete() {
      goHome(this.target)
    },
  })

  return () => {
    draggables.forEach((d) => d.kill())
    root.classList.remove('is-throwable')
  }
}
