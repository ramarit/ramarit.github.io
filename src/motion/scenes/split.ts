import { gsap, ScrollTrigger, SplitText, type Scene } from '../core'

/** Global: masked line reveals for every [data-split] heading on the page. */
export const split: Scene = (root, c) => {
  if (c.reduce) return

  const headings = gsap.utils.toArray<HTMLElement>('[data-split]', root)
  if (!headings.length) return

  const splits: SplitText[] = []
  for (const heading of headings) {
    const s = SplitText.create(heading, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      aria: 'none',
    })
    splits.push(s)

    const reveal = gsap.from(s.lines, {
      yPercent: 140,
      duration: 1.05,
      stagger: 0.08,
      ease: 'paint',
      paused: true,
    })
    const play = () => {
      if (reveal.progress() === 0 && !reveal.isActive()) reveal.play()
    }

    ScrollTrigger.create({
      trigger: heading,
      start: 'top 88%',
      once: true,
      onEnter: play,
    })

    // Headings already in view should not wait for a refresh or a scroll event.
    if (heading.getBoundingClientRect().top < window.innerHeight * 0.88) play()
  }

  return () => splits.forEach((s) => s.revert())
}
