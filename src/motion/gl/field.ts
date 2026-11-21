import { Renderer, Program, Mesh, Triangle, Vec3 } from 'ogl'
import { gsap } from '../core'

/**
 * The paint field: a fixed, full-screen shader behind every page.
 * Domain-warped noise reads as wet paint; the cursor drags a brush trail through it;
 * `structure` (0→1) quantizes it into a dot grid, which is the "code" half of canvas → code.
 */

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`

const TRAIL = 14

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec3 uTrail[${TRAIL}];
uniform float uStructure;
uniform float uVel;
uniform float uIntensity;
uniform vec3 uBg;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec2 uLum; // contrast guard: [min, max] relative luminance the field may reach
varying vec2 vUv;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
             mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash(i + vec2(1.0)), f - vec2(1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);

  // Structure: snap sample points to a grid of cells.
  float cells = mix(260.0, 46.0, uStructure);
  vec2 q = mix(p, (floor(p * cells) + 0.5) / cells, step(0.01, uStructure));

  // Brush trail: each point pushes and inks the paint around it.
  vec2 warp = vec2(0.0);
  float ink = 0.0;
  for (int i = 0; i < ${TRAIL}; i++) {
    vec2 tp = (uTrail[i].xy - 0.5) * vec2(aspect, 1.0);
    float s = uTrail[i].z;
    vec2 d = q - tp;
    float f = s * exp(-dot(d, d) * 26.0);
    ink += f;
    warp += d * f * 0.9;
  }

  float t = uTime * 0.045;
  vec2 w = q * 1.35 + warp;
  float n1 = fbm(w + vec2(t, -t));
  float n2 = fbm(w + n1 * 1.9 + vec2(-t * 0.7, t * 0.45) + uVel * 0.15);
  float n = fbm(w + n2 * 2.3);

  vec3 col = mix(uBg, uC1, smoothstep(-0.15, 0.55, n));
  col = mix(col, uC2, smoothstep(0.25, 0.85, n2 + ink * 0.5) * 0.75);
  col = mix(col, uC3, smoothstep(0.35, 1.1, ink + n * 0.4) * 0.9);

  // Dots: inside each cell, a disc whose size follows the paint's brightness.
  if (uStructure > 0.01) {
    vec2 cell = fract(p * cells) - 0.5;
    float lum = dot(col - uBg, vec3(0.299, 0.587, 0.114));
    float r = 0.08 + clamp(lum * 1.6, 0.0, 0.42);
    float m = smoothstep(r, r - 0.06, length(cell));
    col = mix(col, mix(uBg, col * 1.15, m), uStructure);
  }

  float vig = smoothstep(1.25, 0.15, length(p));
  col = mix(uBg, col, uIntensity * vig);

  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uTime) * 43758.5453);
  col += (g - 0.5) * 0.04;

  // Contrast guard: text sits on top of this field everywhere, and the cursor trail can push
  // any pixel bright (dark theme) or dark (light theme). Keep luminance inside uLum so body
  // copy always holds 4.5:1, by pulling out-of-range pixels back toward the page colour.
  vec3 lin = pow(max(col, 0.0), vec3(2.2));
  vec3 bgLin = pow(uBg, vec3(2.2));
  vec3 Yw = vec3(0.2126, 0.7152, 0.0722);
  float Y = dot(lin, Yw);
  float Yb = dot(bgLin, Yw);
  if (Y > uLum.y && Y > Yb) lin = mix(lin, bgLin, clamp((Y - uLum.y) / (Y - Yb), 0.0, 1.0));
  if (Y < uLum.x && Y < Yb) lin = mix(lin, bgLin, clamp((uLum.x - Y) / (Yb - Y), 0.0, 1.0));
  col = pow(lin, vec3(1.0 / 2.2));

  gl_FragColor = vec4(col, 1.0);
}
`

type Palette = { bg: string; c1: string; c2: string; c3: string; lum: [number, number] }
// `lum` is the contrast guard: the [min, max] relative luminance the field may reach, chosen so
// --ink-soft body copy keeps 4.5:1 on any pixel. Dark: #a9a59c (Y≈0.37) needs Y ≤ 0.043.
// Light: #55524c (Y≈0.085) needs Y ≥ 0.56. Revisit these if --ink-soft changes.
const palettes: Record<'dark' | 'light', Palette> = {
  dark: { bg: '#0a0a0b', c1: '#1c1f2b', c2: '#3b4a1a', c3: '#d4ff3a', lum: [0, 0.043] },
  light: { bg: '#f1eee6', c1: '#d9d3c4', c2: '#b9b1ff', c3: '#4a3cff', lum: [0.56, 1] },
}

function hex(h: string) {
  const n = parseInt(h.slice(1), 16)
  return new Vec3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255)
}

export type Field = {
  /** Live uniforms other modules tween with GSAP. */
  state: { structure: number; intensity: number; vel: number }
  setTheme: (theme: 'dark' | 'light') => void
  destroy: () => void
}

let instance: Field | null = null

export function getField() {
  return instance
}

export function createField(host: HTMLElement): Field | null {
  if (instance) return instance
  let renderer: Renderer
  try {
    renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 1.5) * 0.55, // half-res reads as soft paint and saves fill rate
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    })
  } catch {
    return null
  }
  const gl = renderer.gl
  if (!gl) return null
  host.appendChild(gl.canvas)
  document.documentElement.classList.add('has-gl')

  const trail = Array.from({ length: TRAIL }, () => new Vec3(0.5, 0.5, 0))
  const theme = (document.documentElement.dataset.theme as 'light' | 'dark') || 'dark'
  const p = palettes[theme]
  const uniforms = {
    uTime: { value: 0 },
    uRes: { value: [1, 1] },
    uTrail: { value: trail },
    uStructure: { value: 0 },
    uVel: { value: 0 },
    uIntensity: { value: 0.9 },
    uBg: { value: hex(p.bg) },
    uC1: { value: hex(p.c1) },
    uC2: { value: hex(p.c2) },
    uC3: { value: hex(p.c3) },
    uLum: { value: [...p.lum] },
  }
  const program = new Program(gl, { vertex, fragment, uniforms })
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

  const state = { structure: 0, intensity: 0.9, vel: 0 }

  const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    uniforms.uRes.value = [window.innerWidth, window.innerHeight]
  }
  resize()
  window.addEventListener('resize', resize)

  // Brush trail: add a point when the cursor travels far enough; strengths decay each frame.
  let head = 0
  let last = { x: -1, y: -1 }
  const onMove = (e: PointerEvent) => {
    const x = e.clientX / window.innerWidth
    const y = 1 - e.clientY / window.innerHeight
    const dx = x - last.x
    const dy = y - last.y
    if (dx * dx + dy * dy < 0.0004) return
    last = { x, y }
    head = (head + 1) % TRAIL
    trail[head].set(x, y, 1)
  }
  window.addEventListener('pointermove', onMove, { passive: true })

  let running = true
  const tick = (time: number) => {
    if (!running) return
    uniforms.uTime.value = time
    for (const t of trail) t.z *= 0.965
    uniforms.uStructure.value = state.structure
    uniforms.uIntensity.value = state.intensity
    uniforms.uVel.value += (state.vel - uniforms.uVel.value) * 0.08
    renderer.render({ scene: mesh })
  }
  gsap.ticker.add(tick)

  const onVisibility = () => {
    running = !document.hidden
  }
  document.addEventListener('visibilitychange', onVisibility)

  const setTheme = (t: 'dark' | 'light') => {
    const next = palettes[t]
    for (const [key, val] of [
      ['uBg', next.bg],
      ['uC1', next.c1],
      ['uC2', next.c2],
      ['uC3', next.c3],
    ] as const) {
      const target = hex(val)
      gsap.to(uniforms[key].value, { x: target.x, y: target.y, z: target.z, duration: 0.8, ease: 'snap' })
    }
    gsap.to(uniforms.uLum.value, { 0: next.lum[0], 1: next.lum[1], duration: 0.8, ease: 'snap' })
  }

  instance = {
    state,
    setTheme,
    destroy() {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVisibility)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      gl.canvas.remove()
      document.documentElement.classList.remove('has-gl')
      instance = null
    },
  }
  return instance
}
