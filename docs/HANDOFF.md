# Handoff: ryanamarit.com rebuild (Astro + GSAP + WebGL)

**Branch:** `astro-gsap-rebuild` (local, **not pushed**). **Do not push to `master`.** Every push to master deploys to ryanamarit.com through `.github/workflows/deploy.yml`. Ship through a PR that Ryan merges.

**Approved plan:** `~/.claude/plans/purrfect-puzzling-magpie-of-57898e4e-ff08-4e9a-9fbb-92cf326e160e.md` (includes an "Addendum" section).

## Goal
Replace the old Tailwind "Spotlight" Next.js template with a custom, **experimental / immersive** portfolio that could plausibly win an **Awwwards Site of the Day** (stretch: Developer Award). Positioning: **design engineer / web tech lead**. The site itself is the proof of GSAP and WebGL skill.

Concept: **"From canvas to code."** Ryan has a B.F.A. in Visual Art and became an engineer. A WebGL "paint field" sits behind every page. During the Process scene it turns from wet paint into a dot grid ("structure"/"code"), then back into paint as the card "ships."

## Status at handoff

### Done (builds clean: `npx astro check` 0 errors, `npx astro build` OK)
- Next.js template removed; Astro scaffold in place. Kept assets: `public/CNAME`, `public/favicon.ico`, `public/opengraph.png`, `src/assets/photos/ryan-amarit.webp`, `src/assets/logos/{8am.svg,balcom.svg,fluke.png,freelance.svg}`.
- `astro.config.mjs`: `site`, `trailingSlash: 'always'`, sitemap (excludes `/thank-you/`), Tailwind v4 via `@tailwindcss/vite`.
- **Content** (single source of truth; the copy has been fact-checked with Ryan):
  - `src/content/site.ts`: name, intro, crafts (hero cycle words), process steps, skills.
  - `src/content/work.ts`: 5 projects; full case-study sections for `8am-web-platform` and `ruleriq`.
  - `src/content/experience.ts`: roles and education.
- **Layout:** `src/layouts/Base.astro`. It has SEO/OG tags, Google Fonts (Bricolage Grotesque variable `opsz,wdth,wght`, Geist, JetBrains Mono), an inline theme script, Astro `ClientRouter` (`fallback="none"`), and these persisted layers: `#gl` (WebGL host), `#transition` (5 accent panels), `.cursor`. Also the `#smooth-wrapper > #smooth-content` structure for ScrollSmoother, the skip link, and a script that calls `boot()` from `src/motion/app.ts`.
- **Homepage sections** (static markup and styles done): `Hero`, `Process` (Canvas → Code SVG stage, code panel, card), `Work` + `WorkCard` (generated CSS cover art from `hue`), `Lab` (3 experiments with no-JS fallbacks and a `<details>` code view for each), `Timeline`, `Contact`, `Header`, `Footer`.
- **Styles:** `src/styles/global.css`. Tokens are on `:root`, light theme via `[data-theme='light']`, and `html:not(.has-gl)` gets a CSS gradient fallback. Every section is styled. Motion pre-states hang off `.js-motion`.
- **Motion core:** `src/motion/core.ts` registers all GSAP plugins, defines the custom eases `paint` and `snap`, sets matchMedia `conditions`, and exports the `Scene` type.
- **WebGL field:** `src/motion/gl/field.ts`, built with OGL. It's a domain-warped fbm shader with a 14-point cursor brush trail, `state.structure` (0→1 dot grid), `state.intensity`, `state.vel`, light/dark palettes via `setTheme()`, pause when the tab is hidden, half-resolution rendering, and a `destroy()`. **Written but not wired up or visually tested yet.**
- `.gitignore` updated for `dist/` and `.astro/`.

### Deliberately disabled
- In `Base.astro` the inline script **does not add `.js-motion`** yet (commented, with a TODO). Re-enable it in the same change that makes `boot()` run the scenes. Otherwise the hero stays hidden until a 2.5s CSS fallback fires.
- `src/motion/app.ts` is a no-op `boot()`.

### Not started
1. `src/motion/app.ts` orchestration (spec below).
2. Scenes: `src/motion/scenes/{hero,process,work,lab,timeline,contact,split,magnetic,cursor}.ts`.
3. Page transitions with `ClientRouter`.
4. Pages: `src/pages/about/index.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro` (only `caseStudies` from `work.ts`), `src/pages/thank-you/index.astro`, `src/pages/404.astro`. CSS for these already exists: `.page-hero`, `.page-title`, `.cs-*`, `.about-grid`, `.portrait`, `.facts`, `.next-project`. Old URLs `/about/`, `/projects/` and `/thank-you/` must keep resolving.
5. Analytics: `src/lib/analytics.ts`.
6. Workflow: `.github/workflows/deploy.yml`.
7. QA, README rewrite, then push the branch and open the PR.

## Known visual issues to fix
- **Hero name letter-spacing is too tight.** Letters in "Ryan" collide at desktop width. Ease `letter-spacing` in `.hero-name` from `-0.055em` to about `-0.035em`, or lower `wdth`.
- **Static / reduced-motion state of the Process stage shows every layer at once**: brush stroke, wireframe, code and card overlap. Define a proper end state for no-JS and reduced motion: hide `.pc-stroke` and `.pc-wire`, keep the card and code. Under `.js-motion`, the scene sets the initial states.
- A `#transition`-style dev toolbar (Astro dev toolbar) shows at the bottom in dev. Ignore it; it doesn't ship.

## Specs for the remaining work

### `app.ts` (orchestration)
- **`boot()` runs once:**
  - If not reduced motion and WebGL is available, call `createField(document.getElementById('gl'))` after first paint (`requestIdleCallback` or `setTimeout`).
  - Init the cursor (fine pointer only).
  - Delegate a click handler on `[data-theme-toggle]`: flip `documentElement.dataset.theme`, write it to `localStorage`, call `getField()?.setTheme()`.
  - Init analytics.
  - Register the router hooks.
- **On `astro:page-load`, `setupPage()`:**
  - Add `.js-motion` if not reduced motion.
  - Create `ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.1, effects: true, smoothTouch: 0.1 })`, skipped under reduced motion.
  - Create one `gsap.matchMedia()` and `mm.add(conditions, (ctx) => …)` running each scene whose root exists.
  - Add per-section GL presets with `ScrollTrigger` on `[data-gl]`: `onToggle` tweens `field.state.intensity`. Suggested values: hero .95, work .5, lab .45, experience .4, contact .9, inner pages .55.
  - Map scroll velocity to `field.state.vel`.
  - Handle hash links: same-page `a[href*="#"]` calls `smoother.scrollTo(target, true, 'top top')`. On load with `location.hash`, scroll there.
  - Analytics `pageview()` + `trackPage()`.
- **On `astro:before-swap`:** `mm.revert()`, `smoother.kill()`, `ScrollTrigger.getAll().forEach(t => t.kill())`, run analytics cleanup. The GL canvas persists; don't destroy it.
- **Transitions (skip under reduced motion):**
  - In `astro:before-preparation`, wrap `event.loader`: `const orig = e.loader; e.loader = async () => { await exit(); await orig() }`. `exit()` animates the `#transition span` elements `scaleY: 0 → 1`, `transformOrigin: 'bottom'`, stagger 0.05, ease `snap`.
  - After the next `astro:page-load`, `enter()` animates them `scaleY → 0` with `transformOrigin: 'top'`.
  - Optionally pulse `field.state.intensity` during the swap.
- **Lazy init:** the plan said lazy scene init. It's fine to init all scenes on load; they're cheap. The expensive part is WebGL, and that's already deferred.

### Scenes (each `(root, c) => cleanup`; respect `c.reduce`)
- **hero:**
  - `gsap.set([name, foot], { visibility: 'visible' })` first.
  - `SplitText.create(lines, { type: 'chars', mask: 'chars', charsClass: 'char', aria: 'none' })`. The h1 already has an `aria-label`.
  - Intro: chars `from { yPercent: 115, rotate: 8 }`, stagger 0.045, ease `paint`; foot children fade up.
  - **Variable-font proximity (desktop, fine pointer):** on pointermove, for each char compute its distance to the cursor and `gsap.quickTo(char, '--wght')` / `'--wdth'`. Letters near the cursor go thinner and wider (800→250 wght, 85→100 wdth, falloff about 260px).
  - Cycle `[data-craft]` through `JSON.parse(dataset.crafts)` with ScrambleText, `repeat: -1`, paused when the hero is off-screen.
  - Scroll-out parallax on the name.
- **process (the signature piece):**
  - Pin `[data-process-pin]` `end: '+=250%'` on desktop (about 180% on mobile), with a `scrub` timeline.
  - (1) Draw `[data-pc-stroke]` with DrawSVG 0→100%.
  - (2) `morphSVG: '[data-pc-frame]'`, strokeWidth 22→2, stroke → `--ink-soft`; draw the `[data-pc-wire] path` elements; `field.state.structure` 0→1.
  - (3) Show `[data-pc-code]`; "type" each `[data-line]` with `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)` and `ease: steps(len)`. Don't use ScrambleText here; it would strip the syntax-colour spans.
  - (4) Card in (`autoAlpha`, `scale .92→1`, `y`), SVG fades to 0.3, `structure` back to 0.
  - Use `onUpdate` to toggle `.is-active` on `.process-steps li` by progress quarter.
- **work:**
  - Desktop: pin `[data-work-pin]`. Translate `[data-work-track]` x to `-(scrollWidth - innerWidth)`, ease none, `invalidateOnRefresh`.
  - Card `.art` parallax via `containerAnimation`.
  - Velocity skew on the track with a clamped `quickTo('skewX')`.
  - Hover tilt (fine pointer).
  - Mobile: `ScrollTrigger.batch` fade-up.
- **lab:**
  - Throw: `Draggable.create(pills, { bounds: arena, inertia: true, edgeResistance: 0.8 })`. Shuffle tweens pills to random in-bounds x/y. The List toggle uses `Flip.getState`, resets x/y, toggles `.is-list`, then `Flip.from`.
  - Principles: remove `.is-static`, stack the cards, and `go(±1)` flies the top card out. Use `Observer.create({ type: 'touch,pointer', onLeft, onRight, tolerance: 40 })`, wire up the prev/next buttons, and set `inert` on the cards that aren't on top.
  - Morph: cycle circle, star, blob, rounded square, triangle with `morphSVG` and an elastic ease, and update `[data-morph-label]`.
  - `<details>` toggle: ScrambleText the `[data-code]` text on open.
  - Fire `motion_lab_interacted`.
- **timeline:**
  - Scrub `[data-tl-draw]` `scaleY` 0→1 over `[data-tl]` (`start: 'top 70%'`, `end: 'bottom 70%'`).
  - `[data-tl-item]` fade/slide in.
  - Highlight the promotion titles as the line passes.
- **contact:**
  - SplitText chars reveal on `[data-contact-big]`.
  - On hover, a char wave.
- **magnetic (global):** `[data-magnetic]` follows the pointer with `quickTo` x/y × 0.35 and snaps back elastically on leave.
- **split (global):** `[data-split]` headings, SplitText `lines` with `mask: 'lines'`, reveal once on enter.
- **cursor:** `.cursor` follows via `quickTo`, scales up over `a, button, [data-magnetic]`, hides on leave. Fine pointer only, and not under reduced motion.

### Analytics (`src/lib/analytics.ts`)
- Only if `import.meta.env.PUBLIC_POSTHOG_KEY` is set: `await import('posthog-js')`, init with `api_host: 'https://us.i.posthog.com'`, `capture_pageview: false`, `person_profiles: 'identified_only'`.
- Delegate clicks on `[data-track]`: event name from `data-track`, plus props `name` (from `data-track-name`) and `href`.
- `section_viewed` once per `[data-section]` (IntersectionObserver).
- Scroll depth milestones at 25, 50, 75 and 100%. ScrollSmoother keeps native scroll, so `window.scrollY` works.
- The old site's PostHog key is in `.env` as `NEXT_PUBLIC_POSTHOG_KEY` (gitignored; **don't print or commit it**). Rename it locally to `PUBLIC_POSTHOG_KEY`.
- The old production site never sent events: CI had no env set, and the Next rewrites don't run in a static export.

### Workflow
In `deploy.yml`:
- Node `22`
- `npm ci`
- `npm run build`
- upload `./dist` (was `./out`)
- `env: PUBLIC_POSTHOG_KEY: ${{ vars.PUBLIC_POSTHOG_KEY }}` on the build step

Tell Ryan to add the repo **variable**. It's a public project key, not a secret.

## Rules and gotchas
- **Copy rules (from Ryan):**
  - No "Lighthouse 95+" claim.
  - No trial sign-up lift claim; say "A/B tests for Growth" only.
  - Don't publish "30–50% faster load times" or "60% faster publishing" unless Ryan confirms them.
  - Ryan leads **one** other developer, unofficially.
  - Ryan only **reviews** AWS Lambda work.
  - RulerIQ is a pre-launch side project; claim no users.
  - No GitHub link on the site.
  - Don't say "open to work". Ryan is employed and looking quietly.
- **Node:** local is 22.18.0, so Astro is pinned to **7.3.8**. Newer 7.4.x needs Node ≥ 22.23.4. `npm audit` flags two Astro advisories (dynamic-tag XSS, `@astrojs/node` image endpoint); neither applies to this static site. Upgrade once Node is updated.
- All deps are pinned exactly: `gsap@3.15.1` (all plugins free; `SplitText` supports `mask`, `aria`, `autoSplit`), `ogl@1.0.11`, `tailwindcss` / `@tailwindcss/vite@4.3.4`, `@astrojs/sitemap@3.7.4`, `posthog-js@1.446.0`, `typescript@6.0.3`, `@astrojs/check@0.9.12`.
- **Astro 7 dev server runs as a daemon:**
  - `npx astro dev --port 4321 --host 127.0.0.1`
  - `npx astro dev status|logs|stop`
  - Ryan reviews at http://localhost:4321
- **Escaping:** in `.astro` templates, literal `{` `}` inside `<pre>` must be written as `&#123;` / `&#125;`. See `Process.astro`.
- **ScrollSmoother:** fixed elements (header, `#gl`, `#transition`, `.cursor`) must stay **outside** `#smooth-content`. They already are.
- **SVG lines:** don't use DrawSVG on paths with `vector-effect: non-scaling-stroke`. That's why the timeline line is a CSS `scaleY` element.
- **Progressive enhancement is a hard rule.** Content must be complete with JS off and under reduced motion. Animations only add.

## Verification checklist (before opening the PR)
- `npx astro check` and `npx astro build` are clean.
- In Chrome at http://localhost:4321:
  - every scene works at 1440px and 390px wide
  - keyboard-only pass: focus is visible; lab buttons work
  - reduced motion (DevTools rendering emulation): all content visible, no smooth scroll or WebGL
  - JS disabled: all content readable
  - theme toggle works and the shader palette follows it
  - page transitions work between `/`, `/projects/`, a case study and `/about/`, and back
- Lighthouse mobile on `npm run build && npm run preview`. Targets: Performance ≥ 90, Accessibility 100, SEO 100. Report the real numbers, and don't put them on the site.
- No console errors. The WebGL fallback works when WebGL is disabled.
- PostHog events show in the debugger with a local key.
- Then: commit, `git push -u origin astro-gsap-rebuild`, open a PR to `master` with a summary and screenshots. Ryan merges.
