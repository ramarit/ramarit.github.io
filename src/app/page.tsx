'use client'

import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { useScrollDepth } from '@/hooks/useScrollDepth'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/SocialIcons'
import logo8am from '@/images/logos/8am.svg'
import logoConsulting from '@/images/logos/consulting.svg'
import logoBalcom from '@/images/logos/balcom.svg'
import logoFluke from '@/images/logos/Fluke_Corporation_logo.png'

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function BriefcaseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2.75 9.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
        className="fill-zinc-100 stroke-zinc-400 dark:fill-zinc-100/10 dark:stroke-zinc-500"
      />
      <path
        d="M3 14.25h6.249c.484 0 .952-.002 1.316.319l.777.682a.996.996 0 0 0 1.316 0l.777-.682c.364-.32.832-.319 1.316-.319H21M8.75 6.5V4.75a2 2 0 0 1 2-2h2.5a2 2 0 0 1 2 2V6.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function TrophyIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function SparklesIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0L9.937 15.5Z"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
      <path
        d="M20 3v4M22 5h-4M4 17v2M5 18H3M17 3l.5 1L19 4l-1.5.5L17 6l-.5-1.5L15 4l1.5-.5L17 3Z"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
    </svg>
  )
}

function ArrowDownIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}


function SocialLink({
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link> & {
  icon: React.ComponentType<{ className?: string }>
}) {
  const posthog = usePostHog()
  
  const handleClick = () => {
    const hrefString = typeof props.href === 'string' ? props.href : props.href?.toString() || ''
    posthog?.capture('social_link_clicked', {
      platform: hrefString.includes('linkedin') ? 'linkedin' : 'email',
      url: hrefString,
    })
  }

  return (
    <Link className="group -m-1 p-1" {...props} onClick={handleClick}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}



function Resume() {
  const posthog = usePostHog()
  
  useEffect(() => {
    posthog?.capture('section_viewed', {
      section: 'work_experience',
    })
  }, [posthog])

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <BriefcaseIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Work Experience</span>
      </h2>
      <div className="mt-6 space-y-8">
        {/* 8am */}
        <div className="flex gap-4">
          <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
            <Image src={logo8am} alt="" className="h-7 w-7 object-contain" unoptimized />
          </div>
          <div className="flex flex-auto flex-col">
            <div className="flex flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                8am (formerly AffiniPay)
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                Senior Web Developer
              </dd>
              <dt className="sr-only">Date</dt>
              <dd className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
                2021 - Present
              </dd>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>• Lead front-end development of high-performance marketing websites using Vue.js and React (Next.js, Gatsby), delivering faster load times and improved user engagement.</li>
              <li>• Architected scalable component systems with Tailwind and Storybook, reducing design-to-dev handoff time by 40% and ensuring brand consistency across multiple sites.</li>
              <li>• Integrated headless CMS solutions (Contentful) that cut content publishing time by 60%, enabling marketing teams to launch campaigns independently.</li>
              <li>• Directed migration of legacy WordPress, HubSpot, and Gridsome sites into modern Astro.js monorepo, achieving 30–50% faster load times and lower maintenance costs.</li>
              <li>• Implemented SEO and accessibility best practices, achieving WCAG 2.1 compliance and improving search rankings across all marketing properties.</li>
              <li>• Led cross-functional projects from design to launch, integrating experimentation frameworks and A/B testing to optimize marketing performance and conversion rates.</li>
            </ul>
          </div>
        </div>

        {/* Digital Strategy Consultant */}
        <div className="flex gap-4">
          <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
            <Image src={logoConsulting} alt="" className="h-7 w-7 object-contain" unoptimized />
          </div>
          <div className="flex flex-auto flex-col">
            <div className="flex flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Digital Strategy Consultant
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                Self-Employed
              </dd>
              <dt className="sr-only">Date</dt>
              <dd className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
                2019 - Present
              </dd>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>• Build high-performance marketing websites using Vue.js and React, focusing on component architecture, performance optimization, and SEO best practices.</li>
              <li>• Lead full-stack front-end projects from design to launch, integrating headless CMSs and implementing accessibility standards for scalable solutions.</li>
              <li>• Implement experimentation frameworks and A/B testing strategies to optimize marketing performance and conversion rates.</li>
              <li>• Provide technical leadership on modern front-end architectures, component systems, and performance optimization, enabling teams to deliver measurable results.</li>
            </ul>
          </div>
        </div>

        {/* Balcom Agency */}
        <div className="flex gap-4">
          <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
            <Image src={logoBalcom} alt="" className="h-7 w-7 object-contain" unoptimized />
          </div>
          <div className="flex flex-auto flex-col">
            <div className="flex flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Balcom Agency
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                Web Developer
              </dd>
              <dt className="sr-only">Date</dt>
              <dd className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
                2018 - 2021
              </dd>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>• Built 3–4 high-performance client websites annually using Drupal 8, developing custom component-based themes and responsive designs that improved performance and user experience.</li>
              <li>• Maintained a portfolio of 55+ Drupal and WordPress sites, implementing performance optimizations, SEO best practices, and accessibility improvements that reduced support requests.</li>
              <li>• Collaborated with cross-functional teams to deliver scalable front-end solutions, ensuring consistent component architecture and brand alignment across all client projects.</li>
            </ul>
          </div>
        </div>

        {/* Fluke Corporation */}
        <div className="flex gap-4">
          <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
            <Image src={logoFluke} alt="" className="h-7 w-7 object-contain" unoptimized />
          </div>
          <div className="flex flex-auto flex-col">
            <div className="flex flex-wrap gap-x-2">
              <dt className="sr-only">Company</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Fluke Corporation
              </dd>
              <dt className="sr-only">Role</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                Front End Web Developer
              </dd>
              <dt className="sr-only">Date</dt>
              <dd className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
                2017 - 2018
              </dd>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <li>• Developed high-performance landing pages, forms, and micro-sites using Drupal 7, implementing responsive designs and performance optimizations that increased lead capture rates.</li>
              <li>• Automated content migration workflows using Python, improving data accuracy by 90% and reducing migration time from days to hours.</li>
              <li>• Built reusable component libraries and established front-end development standards, improving code quality and reducing development time across marketing campaigns.</li>
              <li>• Implemented SEO best practices and accessibility improvements across all marketing properties, contributing to improved search rankings and user experience.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Awards() {
  const posthog = usePostHog()
  
  useEffect(() => {
    posthog?.capture('section_viewed', {
      section: 'awards_achievements',
    })
  }, [posthog])

  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
          <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <TrophyIcon className="h-6 w-6 flex-none" />
            <span className="ml-3">Awards & Achievements</span>
          </h2>
      <div className="mt-6 space-y-6">
        <div className="flex gap-4">
          <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
            <SparklesIcon className="h-5 w-5 text-teal-500" />
          </div>
          <div className="flex flex-auto flex-col">
            <div className="flex flex-wrap gap-x-2">
              <dt className="sr-only">Award</dt>
              <dd className="w-full flex-none text-sm font-medium text-zinc-900 dark:text-zinc-100">
                2022 Best of Interactive
              </dd>
              <dt className="sr-only">Organization</dt>
              <dd className="text-xs text-zinc-500 dark:text-zinc-400">
                Local American Advertising Awards
              </dd>
              <dt className="sr-only">Location</dt>
              <dd className="ml-auto text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                Fort Worth, TX
              </dd>
            </div>
            <div className="mt-2">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                <a href="https://www.renfrofoods.com/" className="text-teal-500 hover:text-teal-600 transition-colors" target="_blank" rel="noopener noreferrer">
                  www.renfrofoods.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  // Track scroll depth with custom milestones
  useScrollDepth({ 
    milestones: [25, 50, 75, 100],
    throttleMs: 200 
  })

  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Senior Front-End Engineer
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          I'm Ryan Amarit. I build high-performance, interactive marketing websites with 8+ years of experience. Expert in Vue.js and React, specializing in scalable component systems, headless CMS integration, SEO, accessibility, and experimentation frameworks.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink
              href="https://www.linkedin.com/in/ryanamarit/"
              aria-label="Follow on LinkedIn"
              icon={LinkedInIcon}
            />
            <SocialLink
              href="mailto:ramarit@gmail.com"
              aria-label="Email"
              icon={MailIcon}
            />
          </div>
        </div>
      </Container>
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto max-w-4xl">
            <Resume />
          </div>
      </Container>
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto max-w-4xl">
          <Awards />
        </div>
      </Container>
    </>
  )
}
