import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

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
        d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55.47.98 1.05.98h1.9c.58 0 1.05-.43 1.05-.98v-2.34M12 14.66V9M8 9h8"
        className="fill-none stroke-zinc-400 dark:stroke-zinc-500"
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
  return (
    <Link className="group -m-1 p-1" {...props}>
      <Icon className="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300" />
    </Link>
  )
}



function Resume() {
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
              <li>• Delivered faster, more responsive client-facing applications by leading frontend development with Vue.js and AstroJS, contributing to improved user engagement and reduced support requests.</li>
              <li>• Architected Contentful CMS integrations that cut content publishing time by 60%, enabling marketing teams to launch campaigns without developer support.</li>
              <li>• Built and maintained a Tailwind/Storybook design system that reduced design-to-dev handoff time by 40% and ensured brand consistency across multiple sites.</li>
              <li>• Directed the migration of legacy WordPress, HubSpot, and Gridsome sites into a modern Astro.js monorepo, resulting in 30–50% faster load times and lower long-term maintenance costs.</li>
              <li>• Partnered with design and product stakeholders to optimize user journeys, which increased trial sign-ups and conversions on core marketing pages.</li>
              <li>• Instituted code quality and accessibility standards, achieving WCAG 2.1 compliance and reducing regression bugs by 25% through structured reviews and CI/CD practices.</li>
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
              <li>• Advise clients on web strategy, content management, and SEO optimization, helping them align digital initiatives with business goals.</li>
              <li>• Lead full project lifecycles, including planning, design, and deployment, ensuring scalable and maintainable web solutions.</li>
              <li>• Provide technical guidance on modern front-end architectures, CMS workflows, and performance optimization, enabling teams to manage websites efficiently and independently.</li>
              <li>• Collaborate with clients to define digital priorities, optimize user experience, and track measurable outcomes, supporting growth and engagement objectives.</li>
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
              <li>• Delivered 3–4 new client websites per year in Drupal 8, creating custom themes and responsive designs that improved usability and client satisfaction scores.</li>
              <li>• Managed a portfolio of 55+ Drupal and WordPress sites, providing proactive maintenance and training that reduced client support requests and increased CMS adoption by non-technical staff.</li>
              <li>• Partnered with design, account, and strategy teams to enhance UI/UX on client projects, resulting in higher engagement metrics and stronger alignment with brand goals.</li>
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
              <li>• Developed landing pages, forms, emails, and micro-sites that supported marketing campaigns, increased lead capture, and ensured consistent cross-platform performance.</li>
              <li>• Automated content migration from multiple CMS sites to a new Drupal 7 instance using Python, improving data accuracy by 90% and reducing manual migration time by several days per project.</li>
              <li>• Assisted in creating automated test scripts with Selenium and Python, boosting testing efficiency and reducing release defects, contributing to higher product quality.</li>
              <li>• Trained content managers on Git workflows, enabling faster, error-free content updates and reducing developer intervention for routine changes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Awards() {
  return (
    <div className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40">
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <TrophyIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Awards & Achievements</span>
      </h2>
      <div className="mt-6 space-y-6">
        <div className="flex gap-4">
          <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
            <div className="h-2 w-2 rounded-full bg-teal-500"></div>
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
              <dd className="ml-auto text-xs text-zinc-400 dark:text-zinc-500">
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
  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Digital Strategy Consultant & Front-End Developer
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          I’m Ryan Amarit. I help businesses align digital strategy with measurable outcomes through strategic consulting, modern web development, and performance optimization.
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
