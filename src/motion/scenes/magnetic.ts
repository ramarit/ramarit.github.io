import { gsap, finePointer, type Scene } from '../core'

/** Global: [data-magnetic] elements lean toward the pointer, then snap back. */
export const magnetic: Scene = (root, c) => {
  if (c.reduce || !finePointer()) return

  const els = gsap.utils.toArray<HTMLElement>('[data-magnetic]', root)
  if (!els.length) return

  const cleanups: (() => void)[] = []

  for (const el of els) {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((event.clientX - (r.left + r.width / 2)) * 0.35)
      yTo((event.clientY - (r.top + r.height / 2)) * 0.35)
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)', overwrite: true })
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    cleanups.push(() => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    })
  }

  return () => cleanups.forEach((fn) => fn())
}
