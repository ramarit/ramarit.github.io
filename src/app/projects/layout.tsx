import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Key projects and achievements showcasing my expertise in building high-performance marketing websites, scalable component systems, and front-end engineering solutions that drive measurable results.',
  openGraph: {
    title: 'Projects - Ryan Amarit',
    description: 'Key projects and achievements showcasing my expertise in building high-performance marketing websites, scalable component systems, and front-end engineering solutions that drive measurable results.',
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
    description: 'Key projects and achievements showcasing my expertise in building high-performance marketing websites, scalable component systems, and front-end engineering solutions that drive measurable results.',
    images: ['https://www.ryanamarit.com/opengraph.png'],
  },
  alternates: {
    canonical: 'https://www.ryanamarit.com/projects/',
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
