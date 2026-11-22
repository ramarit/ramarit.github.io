export type Role = {
  company: string
  note?: string
  place: string
  dates: string
  /** Oldest first, so the promotion path reads left to right. */
  titles: { title: string; dates: string }[]
  /** The big number. `count` animates 0 → count; omit it for non-numeric values like "8 → 1". */
  /** Omit for a compact entry (meta line + headline only). */
  stat?: { value: string; count?: number; prefix?: string; suffix?: string; label: string }
  /** What changed, in one line. */
  headline: string
  /** The proof behind it. */
  points: string[]
}

export const experience: Role[] = [
  {
    company: '8am',
    note: 'formerly AffiniPay',
    place: 'Remote',
    dates: '2021 — now',
    titles: [
      { title: 'Web Developer', dates: '2021' },
      { title: 'Senior Web Developer', dates: '2022' },
      { title: 'Web Development Tech Lead', dates: '2026' },
    ],
    stat: { value: '8 → 1', label: '8 brand sites on 1 platform' },
    headline: 'Moved eight brand websites onto one Astro platform and the design system they share.',
    points: [
      'New pages launch 40% faster on the multi-brand page system.',
      'Awwwards Honorable Mention and CSSDA Special Kudos for the 2026 Fall Release.',
      'Contentful tools that let content teams publish without waiting on a developer.',
      'AI workflows for the team: adversarial AI code reviews, a bug-to-PR pipeline and spec-driven development.',
    ],
  },
  {
    company: 'Freelance',
    place: 'Part-time',
    dates: '2019 — now',
    titles: [],
    headline: 'Brought in to fix sites other agencies left behind.',
    points: [],
  },
  {
    company: 'Balcom Agency',
    place: 'Fort Worth, TX',
    dates: '2018 — 2021',
    titles: [{ title: 'Web Developer', dates: '2018' }],
    stat: { value: '55+', count: 55, suffix: '+', label: 'client sites supported' },
    headline: 'The developer clients talked to, from discovery to launch to support.',
    points: [
      'Led discovery and technical implementation for 3–4 Drupal 8 builds a year.',
      'Trained client teams to update their own sites, and answered their support questions directly.',
      'Built sites for the Modern Art Museum of Fort Worth, Sinclair Oil and Renfro Foods, which went on to win 2022 Best of Interactive at the American Advertising Awards, Fort Worth.',
    ],
  },
  {
    company: 'Fluke Corporation',
    place: 'Everett, WA',
    dates: '2017 — 2018',
    titles: [{ title: 'Front-End Web Developer', dates: '2017' }],
    stat: { value: '90%', count: 90, suffix: '%', label: 'better data accuracy' },
    headline: 'Automated CMS content migration in Python.',
    points: ['Improved data accuracy by 90% and saved days of manual work on every migration project.'],
  },
]

export const education = [
  'B.F.A., Visual Art — University of North Texas',
  'Graduate Certificate, Computer Science — Seattle University',
  'Web Development Certificate — Seattle University',
]
