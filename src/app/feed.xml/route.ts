import { Feed } from 'feed'

export const dynamic = 'force-static'

export async function GET(req: Request) {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ryanamarit.com'

  let author = {
    name: 'Ryan Amarit',
    email: 'ramarit@gmail.com',
  }

  let feed = new Feed({
    title: author.name,
    description: 'Digital Strategy Consultant & Front-End Developer - Portfolio and professional insights',
    author,
    id: siteUrl,
    link: siteUrl,
    image: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
  })

  // Add main pages as feed items
  feed.addItem({
    title: 'About - Ryan Amarit',
    id: `${siteUrl}/about/`,
    link: `${siteUrl}/about/`,
    content: 'Learn about Ryan Amarit, a Digital Strategy Consultant and Senior Web Developer with 8+ years of experience helping businesses turn digital strategy into measurable results.',
    author: [author],
    contributor: [author],
    date: new Date(),
  })

  feed.addItem({
    title: 'Projects - Ryan Amarit',
    id: `${siteUrl}/projects/`,
    link: `${siteUrl}/projects/`,
    content: 'Key projects and achievements showcasing expertise in digital strategy, front-end development, and technical leadership across various industries.',
    author: [author],
    contributor: [author],
    date: new Date(),
  })

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'application/xml',
      'cache-control': 's-maxage=31556952',
    },
  })
}
