import type { MetadataRoute } from 'next'
import {
  getAllContentPosts,
  getAllTags,
  getAllSeries,
  getPortfolioPosts,
} from '@/lib/notion'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const [posts, portfolioPosts, tags, seriesList] = await Promise.all([
    getAllContentPosts(),
    getPortfolioPosts(),
    getAllTags(),
    getAllSeries(),
  ])

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${siteUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const seriesEntries: MetadataRoute.Sitemap = seriesList.map((series) => ({
    url: `${siteUrl}/series/${encodeURIComponent(series)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/portfolio`,
      lastModified:
        portfolioPosts.length > 0
          ? new Date(
              portfolioPosts.reduce((latest, post) =>
                new Date(post.date).getTime() > new Date(latest.date).getTime()
                  ? post
                  : latest
              ).date
            )
          : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...postEntries,
    ...tagEntries,
    ...seriesEntries,
  ]
}
