import { gsap, type Scene } from '../core'
import { getField } from '../gl/field'

/**
 * Idea → Launch: one scrubbed, pinned timeline in four equal segments, one per step.
 * A stroke draws (Sketch) and morphs into a frame that stays for the rest of the section,
 * a shared stage. Inside it, one thing at a time: the wireframe draws in (Structure),
 * gives way to code typing in (Code), which gives way to the finished card (Ship).
 */
export const process: Scene = (root, c) => {
  const pin = root.querySelector<HTMLElement>('[data-process-pin]')
  const stroke = root.querySelector<SVGPathElement>('[data-pc-stroke]')
  const frame = root.querySelector<SVGPathElement>('[data-pc-frame]')
  const wire = root.querySelector<SVGGElement>('[data-pc-wire]')
  const wires = gsap.utils.toArray<SVGPathElement>('[data-pc-wire] path', root)
  const code = root.querySelector<HTMLElement>('[data-pc-code]')
  const lines = gsap.utils.toArray<HTMLElement>('[data-line]', root)
  const card = root.querySelector<HTMLElement>('[data-pc-card]')
  const steps = gsap.utils.toArray<HTMLElement>('.process-steps li', root)
  if (!pin || !stroke || !frame || !wire || !code || !card) return

  // Reduced motion and no-JS get the finished card; CSS hides the drawing and code.
  if (c.reduce) return

  gsap.set(stroke, { drawSVG: '0%' })
  gsap.set(wires, { drawSVG: '0%' })
  gsap.set(code, { autoAlpha: 0, y: 24 })
  gsap.set(lines, { clipPath: 'inset(0% 100% 0% 0%)' })
  gsap.set(card, { autoAlpha: 0, scale: 0.92, y: 40 })

  const shader = { structure: getField()?.state.structure ?? 0 }
  const syncShader = () => {
    const live = getField()
    if (live) live.state.structure = shader.structure
  }

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: () => (c.desktop ? '+=250%' : '+=180%'),
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const step = Math.min(3, Math.floor(self.progress * 4))
        steps.forEach((li, i) => li.classList.toggle('is-active', i === step))
        syncShader()
      },
    },
  })

  // Each segment is 1 unit long so the active step (progress × 4) matches what's on stage.
  // 1 — Sketch: draw the stroke.
  tl.to(stroke, { drawSVG: '100%', duration: 0.8 }, 0.1)

  // 2 — Structure: the stroke morphs into the frame (it stays from here on), the wireframe
  // draws in inside it, and the shader grids up.
  tl.to(stroke, { morphSVG: frame, strokeWidth: 2, stroke: 'var(--ink-soft)', duration: 0.6, ease: 'power2.inOut' }, 1)
  tl.to(wires, { drawSVG: '100%', duration: 0.45, stagger: 0.07 }, 1.35)
  tl.to(shader, { structure: 1, duration: 0.8, ease: 'power2.inOut' }, 1.1)

  // 3 — Code: the wireframe inside the frame lifts away; the panel rises in and each line "types" with a stepped clip.
  tl.to(wire, { autoAlpha: 0, y: -24, duration: 0.3, ease: 'power1.in' }, 2)
  tl.to(code, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 2.15)
  const typeStart = 2.35
  const perLine = 0.55 / Math.max(1, lines.length)
  lines.forEach((line, i) => {
    const length = (line.textContent || '').length
    tl.to(
      line,
      { clipPath: 'inset(0% 0% 0% 0%)', duration: perLine * 1.6, ease: `steps(${Math.max(1, length)})` },
      typeStart + i * perLine,
    )
  })

  // 4 — Ship: the code lifts away, the card lands, the shader settles.
  tl.to(code, { autoAlpha: 0, y: -24, duration: 0.3, ease: 'power1.in' }, 3)
  tl.to(card, { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.6)' }, 3.15)
  tl.to(shader, { structure: 0, duration: 0.8, ease: 'power2.inOut' }, 3.1)
  // Hold the finished card for the last stretch of the pin.
  tl.to({}, { duration: 0.15 }, 3.85)

  return () => {
    const live = getField()
    if (live) live.state.structure = 0
  }
}
