import { gsap, type Scene } from '../core'
import { getField } from '../gl/field'

/**
 * Canvas → Code: one scrubbed, pinned timeline.
 * A brush stroke draws, becomes a wireframe, becomes code, then ships as a card.
 */
export const process: Scene = (root, c) => {
  const pin = root.querySelector<HTMLElement>('[data-process-pin]')
  const stroke = root.querySelector<SVGPathElement>('[data-pc-stroke]')
  const frame = root.querySelector<SVGPathElement>('[data-pc-frame]')
  const wires = gsap.utils.toArray<SVGPathElement>('[data-pc-wire] path', root)
  const code = root.querySelector<HTMLElement>('[data-pc-code]')
  const lines = gsap.utils.toArray<HTMLElement>('[data-line]', root)
  const card = root.querySelector<HTMLElement>('[data-pc-card]')
  const svg = root.querySelector<SVGSVGElement>('[data-pc-svg]')
  const steps = gsap.utils.toArray<HTMLElement>('.process-steps li', root)
  if (!pin || !stroke || !frame || !code || !card) return

  // Reduced motion and no-JS get the finished card + code; CSS hides the drawing.
  if (c.reduce) return

  gsap.set(stroke, { drawSVG: '0%' })
  gsap.set(wires, { drawSVG: '0%' })
  gsap.set(code, { autoAlpha: 0 })
  gsap.set(lines, { clipPath: 'inset(0% 100% 0% 0%)' })
  gsap.set(card, { autoAlpha: 0, scale: 0.92, y: 40 })
  if (svg) gsap.set(svg, { autoAlpha: 1 })

  const field = getField()
  const shader = { structure: field?.state.structure ?? 0 }
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
        const quarter = Math.min(3, Math.floor(self.progress * 4))
        steps.forEach((li, i) => li.classList.toggle('is-active', i === quarter))
        syncShader()
      },
    },
  })

  // 1 — Sketch: draw the brush stroke.
  tl.to(stroke, { drawSVG: '100%', duration: 1.2 })

  // 2 — Structure: the stroke becomes a frame; the wireframe draws in; the shader grids up.
  tl.to(stroke, { morphSVG: frame, strokeWidth: 2, stroke: 'var(--ink-soft)', duration: 1.2 })
  tl.to(wires, { drawSVG: '100%', duration: 0.8, stagger: 0.12 }, '<0.2')
  tl.to(shader, { structure: 1, duration: 1.2, ease: 'power2.inOut' }, '<')

  // 3 — Code: reveal the panel, then "type" each line with a stepped clip.
  tl.to(code, { autoAlpha: 1, duration: 0.01 }, '>-0.1')
  lines.forEach((line, i) => {
    const length = (line.textContent || '').length
    tl.to(
      line,
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.3, ease: `steps(${Math.max(1, length)})` },
      i === 0 ? '>' : '<0.06',
    )
  })

  // 4 — Ship: the card lands, the SVG recedes, the grid turns back into paint.
  tl.to(card, { autoAlpha: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.6)' }, '>0.25')
  if (svg) tl.to(svg, { autoAlpha: 0.3, duration: 0.6 }, '<')
  tl.to(shader, { structure: 0, duration: 1.2, ease: 'power2.inOut' }, '<')

  return () => {
    const live = getField()
    if (live) live.state.structure = 0
  }
}
