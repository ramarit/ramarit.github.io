import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from '@/components/SocialIcons'
import portraitImage from '@/images/photos/Ryan_Amarit.webp'

export const metadata: Metadata = {
  title: 'About',
  description: 'I am Ryan Amarit, a Digital Strategy Consultant and Senior Web Developer with 8+ years of experience helping businesses turn digital strategy into measurable results.',
  openGraph: {
    title: 'About - Ryan Amarit',
    description: 'I am Ryan Amarit, a Digital Strategy Consultant and Senior Web Developer with 8+ years of experience helping businesses turn digital strategy into measurable results.',
    images: [
      {
        url: 'https://ryanamarit.com/opengraph.png',
        width: 1200,
        height: 630,
        alt: 'Ryan Amarit - Digital Strategy Consultant & Front-End Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About - Ryan Amarit',
    description: 'I am Ryan Amarit, a Digital Strategy Consultant and Senior Web Developer with 8+ years of experience helping businesses turn digital strategy into measurable results.',
    images: ['https://ryanamarit.com/opengraph.png'],
  },
}

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <Image
              src={portraitImage}
              alt=""
              sizes="(min-width: 1024px) 32rem, 20rem"
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover object-top dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              I'm Ryan Amarit — I help businesses turn digital strategy into measurable results.
            </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              I bring 8+ years of experience as a Digital Strategy Consultant and Senior Web Developer, 
              blending strategy and hands-on development to create websites that perform. My work spans 
              front-end development (Vue.js, Astro, React), CMS strategy (Contentful, WordPress, Drupal, Webflow), 
              and SEO optimization — always with the goal of aligning digital initiatives with business outcomes.
            </p>
            <p>
              Over the years, I've helped teams cut publishing times in half, modernized legacy sites 
              into faster and more flexible platforms, and improved conversion rates by making user 
              journeys simpler and more effective.
            </p>
            <p>
              At the core, I believe great digital strategy is about clarity: building solutions that 
              are fast, accessible, and easy to maintain, while keeping the focus on results.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink
              href="https://www.linkedin.com/in/ryanamarit/"
              icon={LinkedInIcon}
            >
              Follow on LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:ramarit@gmail.com"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              ramarit@gmail.com
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
