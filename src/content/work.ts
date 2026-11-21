export type Project = {
  slug: string
  title: string
  client: string
  year: string
  role: string
  summary: string
  tags: string[]
  /** Hue for the generated cover art (0–360). */
  hue: number
  /** Internal case study page, or an external link. */
  caseStudy: boolean
  href?: string
  award?: string
  links?: { label: string; href: string }[]
  sections?: { heading: string; body: string[] }[]
}

export const projects: Project[] = [
  {
    slug: '8am-web-platform',
    title: '8am Web Platform',
    client: '8am (formerly AffiniPay)',
    year: '2021 — now',
    role: 'Web Development Tech Lead',
    summary:
      'One platform, design system and content model behind 8 B2B SaaS brand websites, from 8am.com to MyCase, LawPay, CASEpeer and Docketwise.',
    tags: ['Astro', 'Vue', 'React', 'TypeScript', 'Contentful', 'Tailwind', 'Storybook', 'GSAP'],
    hue: 78,
    caseStudy: true,
    links: [
      { label: '8am.com', href: 'https://www.8am.com/' },
      { label: 'MyCase', href: 'https://www.mycase.com/' },
      { label: 'LawPay', href: 'https://www.lawpay.com/' },
      { label: 'CASEpeer', href: 'https://www.casepeer.com/' },
      { label: 'Docketwise', href: 'https://www.docketwise.com/' },
      { label: 'Awwwards Honorable Mention', href: 'https://www.awwwards.com/sites/8am-showcase-26-fall-release' },
    ],
    award: 'Awwwards Honorable Mention — 2026 Fall Release',
    sections: [
      {
        heading: 'The problem',
        body: [
          'The brands had grown up on different stacks: WordPress, HubSpot, Webflow and Gridsome. Each had its own components, its own content model and its own way of shipping a page, so shared work had to be rebuilt brand by brand.',
        ],
      },
      {
        heading: 'One platform',
        body: [
          'I led the migrations that moved the sites into a single Astro monorepo, including the Gridsome to Astro replatform, and designed the component architecture that replaced the old setups. It is now the standard every brand ships on.',
          'A Tailwind CSS + Storybook component library gives Design and Engineering one shared source for components, variants and states. A multi-brand page system built on it cut time-to-launch for new pages by 40%.',
        ],
      },
      {
        heading: 'Tools for the people who publish',
        body: [
          'I build Contentful apps so content teams can publish and reuse pages without waiting on a developer. One is a copy uploader: it generates a writing template from each content type’s schema, editors write in the template and upload it back, and the app maps the copy into the right fields.',
        ],
      },
      {
        heading: 'Motion',
        body: [
          'I design and build the GSAP animation and interaction across the sites, from scroll-driven sequences and SVG animation to micro-interactions, including a fully animated product landing page.',
        ],
      },
      {
        heading: 'Measurement and quality',
        body: [
          'I set up and manage GA4, Google Tag Manager and cookie-consent compliance across the properties, implement A/B tests for the Growth team, and own technical SEO, Core Web Vitals and WCAG 2.1 AA accessibility.',
        ],
      },
      {
        heading: 'Working with AI',
        body: [
          'I set up the team’s internal AI workflows: automated “grilling” reviews, a bug-to-pull-request pipeline and spec-driven development with Claude, Claude Skills and OpenSpec, with human review before anything ships.',
        ],
      },
      {
        heading: 'The team',
        body: [
          'Promoted twice in five years, from Web Developer to Senior Web Developer to Web Development Tech Lead. I set the web team’s priorities with Marketing, Growth, Design, Brand and Content, and lead and mentor a second developer.',
        ],
      },
    ],
  },
  {
    slug: 'ruleriq',
    title: 'RulerIQ',
    client: 'Side project',
    year: '2026',
    role: 'Founder & engineer',
    summary:
      'A SaaS that asks ChatGPT, Perplexity, Gemini and Claude what buyers ask, and shows a brand which pages AI cites and what to fix.',
    tags: ['Next.js', 'TypeScript', 'Postgres', 'MCP', 'Stripe', 'AI agents'],
    hue: 32,
    caseStudy: true,
    links: [{ label: 'ruleriq.com', href: 'https://ruleriq.com' }],
    sections: [
      {
        heading: 'Why I built it',
        body: [
          'More buyers ask an AI assistant which tool to use than search for it. A handful of products already claim to measure what those assistants say about a brand. I dug into how they work and decided I could build my own.',
        ],
      },
      {
        heading: 'What it does',
        body: [
          'RulerIQ asks the four major assistants the questions a buyer would ask, records which brands they name and which pages they cite, and turns the gaps into a fix list: pages to get listed on, wrong facts to correct, and paste-ready FAQ, JSON-LD and llms.txt.',
          'It ships as an MCP server first, so customers can use it straight from Claude, ChatGPT or Cursor.',
        ],
      },
      {
        heading: 'How it’s built',
        body: [
          'TypeScript end to end: a Next.js app, a Postgres-backed job queue and background worker on Fly.io, Clerk auth, Stripe billing, PostHog analytics, and Slack, Notion, Linear and Google Search Console integrations.',
        ],
      },
      {
        heading: 'Building with agents',
        body: [
          'I run development with a team of AI coding agents. I write the specs, review every pull request and gate merges on CI (typecheck, tests, build): 240+ merged PRs and 700+ automated tests in the first three weeks.',
        ],
      },
      {
        heading: 'What I learned',
        body: [
          'The hard part wasn’t the scoring, it was honesty. AI answers change from run to run, so I spent as much time measuring that noise, and refusing to show numbers that weren’t real, as I did building the score.',
        ],
      },
    ],
  },
  {
    slug: 'modern-art-museum',
    title: 'Modern Art Museum of Fort Worth',
    client: 'Agency work',
    year: 'Drupal 8',
    role: 'Web developer',
    summary:
      'A component-based Drupal 8 theme with responsive layouts and flexible content management for one of the country’s great modern art museums.',
    tags: ['Drupal 8', 'SCSS', 'JavaScript'],
    hue: 210,
    caseStudy: false,
    href: 'https://www.themodern.org/',
  },
  {
    slug: 'sinclair-oil',
    title: 'Sinclair Oil',
    client: 'Agency work',
    year: 'Drupal 8',
    role: 'Web developer',
    summary:
      'A corporate site on a custom Drupal component architecture, with an interactive “Find a Station” locator.',
    tags: ['Drupal 8', 'SCSS', 'JavaScript'],
    hue: 150,
    caseStudy: false,
    href: 'https://www.sinclairoil.com/',
  },
  {
    slug: 'renfro-foods',
    title: 'Renfro Foods',
    client: 'Client work',
    year: 'Shopify',
    role: 'Web developer',
    summary:
      'An e-commerce site on a custom Shopify component architecture, with better navigation, product filtering and a mobile-first design.',
    tags: ['Shopify', 'Liquid', 'SCSS', 'JavaScript'],
    hue: 4,
    caseStudy: false,
    href: 'https://www.renfrofoods.com/',
    award: '2022 Best of Interactive · American Advertising Awards, Fort Worth',
  },
]

export const caseStudies = projects.filter((p) => p.caseStudy)
