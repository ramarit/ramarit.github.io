# Ryan Amarit — Portfolio

A personal design engineer portfolio built with **Astro 7**, **GSAP 3.15**, and **WebGL**. The site features immersive scene-based motion, horizontal scrolling project grids, and smooth ClientRouter page transitions with progressive enhancement at its core.

## Live

[http://127.0.0.1:4321](http://127.0.0.1:4321) (development) • Deployed via branch PR to `master`

---

## Quick Start

```bash
# Install
npm install

# Development server with HMR
npx astro dev

# Open http://127.0.0.1:4321
```

## Build

```bash
npm run build
```

Output goes to `dist/` (static export). 7 pages built successfully; `npx astro check` reports 0 errors.

---

## Branches & PR Process

- Work happens on branch `astro-gsap-rebuild`
- When ready: commit, push `astro-gsap-rebuild`, open a PR against `master`
- Ryan merges; **never push directly to `master`** — every master push deploys ryanamarit.com

---

## Requirements & Constraints

### Progressive Enhancement (hard rule)

- Content must be complete with **JS off** and under **reduced motion**
- No Lighthouse 95+ claim
- No "trial sign-up" lift claim
- No 30–50% load-time or 60% publishing claims unless confirmed
- Ryan leads one other developer unofficially

### Copy Rules

- Say **"A/B tests for Growth"** only (no trial sign-up language)
- RulerIQ is **pre-launch; no users**
- No GitHub link in footer
- No "open to work" badge

### URL Stability

- `/about/`, `/projects/`, `/thank-you/` must resolve as before
- Old URLs must continue working

### Environment

- `PUBLIC_POSTHOG_KEY` (renamed from `NEXT_PUBLIC_POSTHOG_KEY`)
- `.env` must **not** contain the PostHog key committed to source
- Vite/astro config uses `./dist` output

---

## Pages

| Path | Description |
|---|---|
| `/` | Home — hero intro, process, work grid |
| `/about/` | About page — portrait + blurb |
| `/projects/` | Index — horizontal scroll grid of case studies |
| `/projects/[slug]` | Case study template (e.g. `/projects/8am-web-platform`) |
| `/thank-you/` | Thank-you page |
| `/404/` | Custom 404 |

---

## Scenes / Motion

Eight GSAP/GL scenes under `src/motion/scenes/`:

| Scene | Key Features |
|---|---|
| `hero` | Masked character intro, scramble-text roles, variable-font wght/wdth cursor proximity |
| `process` | Four-step vertical stack; deferred WebGL field receives `structure` changes via local shader-state object |
| `work` | Horizontal scroll pinch-zoom; CSS scoped to `.work .work-track` / `.work .work-card` so Projects index grid is unaffected |
| `lab` | Interactive particle / grid playground |
| `timeline` | Staggered reveal with scroll-linked scrub |
| `contact` | Form + map area |
| `split` | SplitText-powered heading reveals; play immediately when already in view |
| `magnetic` | Cursor-attraction links |

Core orchestration: `src/motion/app.ts` — ScrollSmoother, matchMedia scenes, GL intensity presets, velocity mapping, hash links, theme toggle, cursor, ClientRouter transitions, teardown.

---

## Reduced Motion & No-JS

- `reduce` and `nojs` query support in CDP helper scripts (`shot.mjs`, `eval.mjs`, `clip.mjs`)
- `REDUCE=1` and `NOJS=1` env flags emulate those modes
- Hero and Process render fully; Process shows static end state with all four steps, card, and code panel
- About heading and other SplitText reveals respect `prefers-reduced-motion` (pause/revert)

---

## Theme Toggle

- `[data-theme-toggle]` persists to `localStorage`
- `htmlClass` and `meta theme-color` update accordingly
- Light: `rgb(241, 238, 230)` text on `#0a0a0b` background
- Dark: `rgb(242, 239, 232)` text on `#0a0a0b` background

---

## QA Checklist

- [x] Reduced-motion screens inspected (`reduce-home-1440.png`, `reduce-process-1440.png`, `nojs-process-1440.png`)
- [x] Light theme toggles and persists
- [x] ClientRouter navigation: `/` → `/projects/` → case study → `/about/` and back — no console errors beyond expected headless WebGL
- [x] Hash links (`/#contact`, `/#process`) land at correct scroll positions
- [x] `npx astro check` → 0 errors; `npm run build` → 7 pages built
- [x] Desktop QA: hero, process (sketch/structure/code/ship), horizontal work, lab, timeline, contact, about, projects index, 8am case study
- [x] Mobile QA: hero, work cards, lab

---

## Workflows

`.github/workflows/deploy.yml` — updated for Astro static export, `PUBLIC_POSTHOG_KEY: ${{ vars.PUBLIC_POSTHOG_KEY }}`, Node 22.

---

## Local Development

- Node 22.18.0; Astro pinned to 7.3.8; all deps pinned exactly
- GSAP 3.15.1 plugins registered in `src/motion/core.ts`; house eases `paint` and `snap`
- `#gl`, `#transition`, `.cursor` use `transition:persist`
- `#smooth-wrapper/#smooth-content` recreated per page
- `src/motion/gl/field.ts` written; fallback is CSS gradient on `html:not(.has-gl)`
- Dev server at http://127.0.0.1:4321; `npx astro dev logs` for errors

---

## Committing & PR

```bash
# Stage all changed/new files
git add .

# Commit with descriptive message
git commit -m "chore: Astro + GSAP + WebGL rebuild — see PR #XX"

# Push branch
git push origin astro-gsap-rebuild

# Open PR against master via GitHub UI
# Ryan merges; never push to master directly
```