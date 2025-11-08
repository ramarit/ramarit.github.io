'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { useScrollDepth } from '@/hooks/useScrollDepth'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'

const projects = [
  {
    name: 'Legal Tech Marketing Sites',
    description:
      'Led front-end engineering for 8am (formerly AffiniPay) and its legal technology brands. Built high-performance marketing websites using Vue.js and React, implementing scalable component systems, headless CMS integration, and experimentation frameworks across multiple high-traffic sites.',
    link: { href: 'https://www.8am.com/', label: '8am.com, MyCase.com, LawPay.com, Casepeer.com, Docketwise.com' },
    stack: 'Astro.js, Vue, Contentful, Tailwind',
    contributions: [
      'Migrated multiple high-traffic marketing sites from WordPress, HubSpot, Webflow, and Gridsome into a unified Astro.js + Vue monorepo, achieving 30–50% faster load times.',
      'Built scalable component systems with Tailwind and Storybook, reducing design-to-dev handoff time by 40% and ensuring brand consistency across brands.',
      'Architected headless CMS integration with Contentful, cutting content publishing time by 60% and enabling marketing teams to launch campaigns independently.',
      'Implemented SEO best practices and accessibility standards (WCAG 2.1), improving search rankings and user experience across all properties.',
      'Integrated experimentation frameworks and A/B testing capabilities to optimize marketing performance and conversion rates.',
      'Led cross-functional projects from design to launch, partnering with internal teams and agencies to deliver on aggressive deadlines.'
    ]
  },
  {
    name: 'The Modern Art Museum',
    description:
      'Built a high-performance Drupal 8 website with custom component-based theme architecture, responsive design, and flexible content management capabilities.',
    link: { href: 'https://www.themodern.org/', label: 'themodern.org' },
    stack: 'Drupal 8, SCSS, JavaScript'
  },
  {
    name: 'Sinclair Oil',
    description:
      'Developed corporate website with custom Drupal component architecture, headless CMS integration, and interactive "Find a Station" locator tool with performance optimization.',
    link: { href: 'https://www.sinclairoil.com/', label: 'sinclairoil.com' },
    stack: 'Drupal 8, SCSS, JavaScript'
  },
  {
    name: 'Renfro Foods E-commerce',
    description:
      'Built high-performance e-commerce site with custom Shopify component architecture, enhanced navigation, product filtering, and mobile-first responsive design.',
    link: { href: 'https://www.renfrofoods.com/', label: 'renfrofoods.com' },
    stack: 'Shopify (Liquid), HTML, SCSS, JavaScript'
  },
]

function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Projects() {
  const posthog = usePostHog()
  
  useEffect(() => {
    posthog?.capture('page_viewed', {
      page: 'projects',
      section: 'projects_portfolio',
    })
  }, [posthog])

  // Track scroll depth for projects page
  useScrollDepth({ 
    milestones: [25, 50, 75, 100],
    throttleMs: 200 
  })

  return (
    <SimpleLayout
      title="Key Projects & Achievements"
      intro="Here are some of the most impactful projects I've worked on throughout my career. Each project demonstrates my expertise in building high-performance marketing websites, scalable component systems, and front-end engineering solutions that drive measurable results."
    >
      <div className="space-y-16">
        {/* Featured Legal Tech Marketing Sites */}
        <Card as="div" className="lg:col-span-3">
          <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
            Legal Tech Marketing Sites
          </h2>
          <Card.Description>
            Led front-end engineering for 8am (formerly AffiniPay) and its legal technology brands. Built high-performance marketing websites using Vue.js and React, implementing scalable component systems, headless CMS integration, and experimentation frameworks across multiple high-traffic sites.
          </Card.Description>
          <div className="mt-4">
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span>Migrated multiple high-traffic marketing sites from WordPress, HubSpot, Webflow, and Gridsome into a unified Astro.js + Vue monorepo, achieving 30–50% faster load times.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span>Built scalable component systems with Tailwind and Storybook, reducing design-to-dev handoff time by 40% and ensuring brand consistency across brands.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span>Architected headless CMS integration with Contentful, cutting content publishing time by 60% and enabling marketing teams to launch campaigns independently.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span>Implemented SEO best practices and accessibility standards (WCAG 2.1), improving search rankings and user experience across all properties.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span>Integrated experimentation frameworks and A/B testing capabilities to optimize marketing performance and conversion rates.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-teal-500">•</span>
                <span>Led cross-functional projects from design to launch, partnering with internal teams and agencies to deliver on aggressive deadlines.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <strong>Tech Stack:</strong> Astro.js, Vue, Contentful, Tailwind
            </p>
          </div>
          <div className="mt-6">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <strong>Sites:</strong>
            </p>
            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
              <a href="https://www.8am.com/" className="text-teal-500 hover:text-teal-600">8am.com</a>
              <span className="text-zinc-400">•</span>
              <a href="https://www.mycase.com/" className="text-teal-500 hover:text-teal-600">MyCase.com</a>
              <span className="text-zinc-400">•</span>
              <a href="https://www.lawpay.com/" className="text-teal-500 hover:text-teal-600">LawPay.com</a>
              <span className="text-zinc-400">•</span>
              <a href="https://www.casepeer.com/" className="text-teal-500 hover:text-teal-600">Casepeer.com</a>
              <span className="text-zinc-400">•</span>
              <a href="https://www.docketwise.com/" className="text-teal-500 hover:text-teal-600">Docketwise.com</a>
            </div>
          </div>
        </Card>

        {/* Other Projects Grid */}
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.slice(1).map((project) => (
            <Card as="li" key={project.name}>
              <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
                {project.name}
              </h2>
              <Card.Description>{project.description}</Card.Description>
              <div className="mt-4">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  <strong>Tech Stack:</strong> {project.stack}
                </p>
              </div>
              <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 dark:text-zinc-200">
                <LinkIcon className="h-6 w-6 flex-none" />
                <a 
                  href={project.link.href} 
                  className="ml-2 text-teal-500 hover:text-teal-600 transition-colors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => {
                    posthog?.capture('project_link_clicked', {
                      project_name: project.name,
                      project_url: project.link.href,
                      tech_stack: project.stack,
                    })
                  }}
                >
                  {project.link.label}
                </a>
              </p>
            </Card>
          ))}
        </ul>
      </div>
    </SimpleLayout>
  )
}
