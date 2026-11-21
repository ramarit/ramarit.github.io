import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { Flip } from 'gsap/Flip'
import { Observer } from 'gsap/Observer'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  MorphSVGPlugin,
  DrawSVGPlugin,
  ScrambleTextPlugin,
  Flip,
  Observer,
  Draggable,
  InertiaPlugin,
  CustomEase,
)

// House eases: "paint" is a long, confident settle; "snap" is quick in, soft out.
CustomEase.create('paint', 'M0,0 C0.12,0.72 0.18,1 1,1')
CustomEase.create('snap', 'M0,0 C0.5,0 0.1,1 1,1')
gsap.defaults({ ease: 'paint', duration: 1 })

export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
export const isDesktop = () => window.matchMedia('(min-width: 1000px)').matches

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, Flip, Observer, Draggable }

/** Media conditions every scene receives through gsap.matchMedia(). */
export const conditions = {
  desktop: '(min-width: 1000px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 999px) and (prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
}
export type Conditions = { desktop: boolean; mobile: boolean; reduce: boolean }

/** A scene sets itself up inside a matchMedia context and may return a cleanup. */
export type Scene = (root: HTMLElement, c: Conditions) => void | (() => void)
