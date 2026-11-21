import { gsap, Draggable, Flip, Observer, type Scene } from '../core'
import { track } from '../../lib/analytics'

const shapes = [
  {
    name: 'circle',
    d: 'M100,20 C144,20 180,56 180,100 C180,144 144,180 100,180 C56,180 20,144 20,100 C20,56 56,20 100,20 Z',
  },
  {
    name: 'star',
    d: 'M100,15 L118,72 L179,72 L130,107 L149,165 L100,130 L51,165 L70,107 L21,72 L82,72 Z',
  },
  {
    name: 'blob',
    d: 'M100,18 C140,18 182,44 182,94 C182,140 156,184 108,184 C62,184 18,152 18,106 C18,60 56,18 100,18 Z',
  },
  {
    name: 'rounded square',
    d: 'M45,25 L155,25 C170,25 180,35 180,50 L180,150 C180,165 170,175 155,175 L45,175 C30,175 20,165 20,150 L20,50 C20,35 30,25 45,25 Z',
  },
  {
    name: 'triangle',
    d: 'M100,20 L180,175 L20,175 Z',
  },
]

/**
 * Motion lab: throwable skills (Draggable + Inertia), a gesture-driven deck
 * (Observer + Flip), a morphing shape, and code panels that scramble open.
 */
export const lab: Scene = (root, c) => {
  if (c.reduce) return

  const cleanups: (() => void)[] = []
  const fired = new Set<string>()
  const interacted = (name: string) => {
    if (fired.has(name)) return
    fired.add(name)
    track('motion_lab_interacted', { lab: name })
  }

  // ── Throw the stack ─────────────────────────────────────────
  const arena = root.querySelector<HTMLElement>('[data-throw-arena]')
  const list = root.querySelector<HTMLElement>('[data-throw-list]')
  const shuffle = root.querySelector<HTMLButtonElement>('[data-throw-shuffle]')
  const layout = root.querySelector<HTMLButtonElement>('[data-throw-layout]')
  const pills = gsap.utils.toArray<HTMLElement>('.skill-pills li', root)

  if (arena && list && pills.length) {
    let draggables: Draggable[] = []

    const makeDraggables = () => {
      if (list.classList.contains('is-list')) return []
      return Draggable.create(pills, {
        bounds: arena,
        inertia: true,
        edgeResistance: 0.8,
        onPress: () => interacted('throw'),
      })
    }
    draggables = makeDraggables()

    const onShuffle = () => {
      if (list.classList.contains('is-list')) return
      for (const pill of pills) {
        const maxX = Math.max(0, arena.clientWidth - pill.offsetWidth)
        const maxY = Math.max(0, arena.clientHeight - pill.offsetHeight)
        gsap.to(pill, {
          x: Math.random() * maxX - pill.offsetLeft,
          y: Math.random() * maxY - pill.offsetTop,
          duration: 0.9,
          ease: 'paint',
        })
      }
      interacted('throw')
    }
    shuffle?.addEventListener('click', onShuffle)
    cleanups.push(() => shuffle?.removeEventListener('click', onShuffle))

    const onLayout = () => {
      const state = Flip.getState(pills)
      draggables.forEach((draggable) => draggable.kill())
      gsap.set(pills, { x: 0, y: 0 })
      const isList = list.classList.toggle('is-list')
      layout?.setAttribute('aria-pressed', String(isList))
      if (layout) layout.textContent = isList ? 'Grid view (Flip)' : 'List view (Flip)'
      Flip.from(state, {
        duration: 0.8,
        ease: 'paint',
        stagger: 0.02,
        absolute: true,
        onComplete: () => {
          draggables = makeDraggables()
        },
      })
      interacted('throw')
    }
    layout?.addEventListener('click', onLayout)
    cleanups.push(() => {
      layout?.removeEventListener('click', onLayout)
      draggables.forEach((draggable) => draggable.kill())
    })
  }

  // ── Principles deck ─────────────────────────────────────────
  const deck = root.querySelector<HTMLElement>('[data-principles]')
  const cards = gsap.utils.toArray<HTMLElement>('[data-principle]', root)
  if (deck && cards.length > 1) {
    deck.classList.remove('is-static')
    let index = 0
    let animating = false

    const layoutDeck = (animate: boolean) => {
      cards.forEach((card, i) => {
        const pos = (i - index + cards.length) % cards.length
        gsap.to(card, {
          y: pos * 7,
          rotate: (pos - 1) * 1.2,
          scale: 1 - pos * 0.03,
          autoAlpha: 1,
          duration: animate ? 0.55 : 0,
          ease: 'paint',
        })
        gsap.set(card, { zIndex: cards.length - pos })
        card.inert = pos !== 0
      })
    }
    layoutDeck(false)

    const go = (dir: 1 | -1) => {
      if (animating) return
      animating = true
      const top = cards[index]
      gsap.to(top, {
        x: dir * -(deck.clientWidth + 80),
        rotate: dir * -18,
        autoAlpha: 0,
        duration: 0.45,
        ease: 'power2.in',
        onComplete: () => {
          index = (index + 1) % cards.length
          gsap.set(top, { x: 0 })
          layoutDeck(true)
          animating = false
        },
      })
      interacted('principles')
    }

    const prev = root.querySelector<HTMLButtonElement>('[data-principle-prev]')
    const next = root.querySelector<HTMLButtonElement>('[data-principle-next]')
    const onPrev = () => go(-1)
    const onNext = () => go(1)
    prev?.addEventListener('click', onPrev)
    next?.addEventListener('click', onNext)

    const observer = Observer.create({
      target: deck,
      type: 'touch,pointer',
      onLeft: () => go(1),
      onRight: () => go(-1),
      tolerance: 40,
    })

    cleanups.push(() => {
      observer.kill()
      prev?.removeEventListener('click', onPrev)
      next?.removeEventListener('click', onNext)
    })
  }

  // ── Morph ───────────────────────────────────────────────────
  const morphPath = root.querySelector<SVGPathElement>('[data-morph]')
  const morphNext = root.querySelector<HTMLButtonElement>('[data-morph-next]')
  const morphLabel = root.querySelector<HTMLElement>('[data-morph-label]')
  if (morphPath && morphNext) {
    let index = 0
    const onMorph = () => {
      index = (index + 1) % shapes.length
      gsap.to(morphPath, {
        morphSVG: shapes[index].d,
        duration: 0.9,
        ease: 'elastic.out(1, 0.5)',
      })
      if (morphLabel) morphLabel.textContent = shapes[index].name
      interacted('morph')
    }
    morphNext.addEventListener('click', onMorph)
    cleanups.push(() => morphNext.removeEventListener('click', onMorph))
  }

  // ── Code panels ─────────────────────────────────────────────
  for (const details of root.querySelectorAll<HTMLDetailsElement>('details')) {
    const pre = details.querySelector<HTMLElement>('[data-code]')
    if (!pre) continue
    const original = pre.textContent || ''
    const onToggle = () => {
      if (!details.open) return
      gsap.to(pre, {
        duration: 0.9,
        ease: 'none',
        scrambleText: { text: original, chars: 'upperCase', speed: 0.55 },
      })
      interacted('code')
    }
    details.addEventListener('toggle', onToggle)
    cleanups.push(() => details.removeEventListener('toggle', onToggle))
  }

  return () => cleanups.forEach((fn) => fn())
}
