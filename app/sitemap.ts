import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma' // Make sure this path matches your project

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://minifylinks.com'

  // 1. Get all your dynamic blog posts
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // 2. Format blog posts for the sitemap
  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8, // Blogs are important, but less than the homepage
  }))

  // 3. Define your static pages (Home, Blog List, Privacy)
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1, // Homepage is the most important
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9, // Main blog feed is very important
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(), // You can hardcode a date here if you rarely update it
      changeFrequency: 'monthly' as const,
      priority: 0.5, // Legal pages are low priority for search ranking
    },
  ]

  // 4. Combine them
  return [...staticRoutes, ...blogUrls]
}