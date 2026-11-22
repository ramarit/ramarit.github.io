export type Role = {
  company: string
  note?: string
  place: string
  dates: string
  titles: { title: string; dates: string }[]
  points: string[]
}

export const experience: Role[] = [
  {
    company: '8am',
    note: 'formerly AffiniPay',
    place: 'Remote',
    dates: '2021 — now',
    titles: [
      { title: 'Web Development Tech Lead', dates: '2026 — now' },
      { title: 'Senior Web Developer', dates: '2022 — 2026' },
      { title: 'Web Developer', dates: '2021 — 2022' },
    ],
    points: [
      'Tech lead for the platform behind 8 brand websites; led the migrations onto one Astro monorepo.',
      'Built the Tailwind + Storybook component library and the Contentful tools content teams publish with.',
      'Set up the team’s AI workflows: refinement reviews, a bug-to-PR pipeline and spec-driven development.',
    ],
  },
  {
    company: 'Freelance',
    place: 'Part-time',
    dates: '2019 — now',
    titles: [{ title: 'Web Developer', dates: '2019 — now' }],
    points: ['Marketing sites on Contentful, Webflow, WordPress and Shopify, tuned for speed, accessibility and SEO.'],
  },
  {
    company: 'Balcom Agency',
    place: 'Fort Worth, TX',
    dates: '2018 — 2021',
    titles: [{ title: 'Web Developer', dates: '2018 — 2021' }],
    points: [
      'Led technical implementation of 3–4 Drupal 8 client sites a year, from discovery to launch.',
      'Maintained 55+ Drupal and WordPress sites and trained client teams to update them on their own.',
    ],
  },
  {
    company: 'Fluke Corporation',
    place: 'Everett, WA',
    dates: '2017 — 2018',
    titles: [{ title: 'Front-End Web Developer', dates: '2017 — 2018' }],
    points: ['Automated CMS content migration in Python, improving data accuracy by 90% and saving days per project.'],
  },
]

export const education = [
  'B.F.A., Visual Art — University of North Texas',
  'Graduate Certificate, Computer Science — Seattle University',
  'Web Development Certificate — Seattle University',
]
