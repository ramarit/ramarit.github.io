import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Key projects and achievements showcasing my expertise in digital strategy, front-end development, and technical leadership across various industries.',
  openGraph: {
    title: 'Projects - Ryan Amarit',
    description: 'Key projects and achievements showcasing my expertise in digital strategy, front-end development, and technical leadership across various industries.',
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
    title: 'Projects - Ryan Amarit',
    description: 'Key projects and achievements showcasing my expertise in digital strategy, front-end development, and technical leadership across various industries.',
    images: ['https://ryanamarit.com/opengraph.png'],
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
