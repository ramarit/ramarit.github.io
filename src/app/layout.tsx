import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Ryan Amarit',
    default: 'Ryan Amarit - Senior Front-End Engineer',
  },
  description:
    'I am Ryan Amarit, a Senior Front-End Engineer with 8+ years of experience building high-performance, interactive marketing websites. Expert in Vue.js and React, specializing in component systems, SEO, accessibility, and experimentation.',
  keywords: [
    'Digital Strategy Consultant',
    'Front-End Developer',
    'Web Developer',
    'Vue.js',
    'Astro.js',
    'React',
    'Next.js',
    'Gatsby',
    'Component Systems',
    'Headless CMS',
    'Contentful',
    'SEO Optimization',
    'Accessibility',
    'Performance Optimization',
    'A/B Testing',
    'Experimentation Frameworks',
    'Ryan Amarit',
    '8am',
    'AffiniPay',
  ],
  authors: [{ name: 'Ryan Amarit' }],
  creator: 'Ryan Amarit',
  publisher: 'Ryan Amarit',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ryanamarit.com',
    siteName: 'Ryan Amarit - Senior Front-End Engineer',
    title: 'Ryan Amarit - Senior Front-End Engineer',
    description:
      'I build high-performance, interactive marketing websites with 8+ years of experience. Expert in Vue.js and React, specializing in component systems, SEO, accessibility, and experimentation.',
    images: [
      {
        url: 'https://ryanamarit.com/opengraph.png',
        width: 1200,
        height: 630,
        alt: 'Ryan Amarit - Senior Front-End Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ryan Amarit - Senior Front-End Engineer',
    description:
      'I build high-performance, interactive marketing websites with 8+ years of experience. Expert in Vue.js and React, specializing in component systems, SEO, accessibility, and experimentation.',
    images: ['https://ryanamarit.com/opengraph.png'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ryanamarit.com/',
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ryan Amarit',
    jobTitle: 'Senior Front-End Engineer',
    description:
      'I build high-performance, interactive marketing websites with 8+ years of experience. Expert in Vue.js and React, specializing in component systems, SEO, accessibility, and experimentation.',
    url: 'https://ryanamarit.com',
    image: 'https://ryanamarit.com/opengraph.png',
    sameAs: [
      'https://www.linkedin.com/in/ryanamarit/',
      'mailto:ramarit@gmail.com',
    ],
    worksFor: {
      '@type': 'Organization',
      name: '8am (formerly AffiniPay)',
      url: 'https://www.8am.com/',
    },
    knowsAbout: [
      'Digital Strategy',
      'Front-End Development',
      'Vue.js',
      'React',
      'Next.js',
      'Gatsby',
      'Component Systems',
      'Headless CMS',
      'Contentful',
      'SEO Optimization',
      'Accessibility',
      'Performance Optimization',
      'A/B Testing',
      'Experimentation Frameworks',
    ],
    award: {
      '@type': 'Award',
      name: '2022 Best of Interactive',
      description: 'Local American Advertising Awards - Fort Worth, TX',
      dateAwarded: '2022',
    },
  }

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
