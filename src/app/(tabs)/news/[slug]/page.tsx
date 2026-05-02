import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { HeaderBrandScopeHydrator } from '@/components/HeaderBrandScopeHydrator'
import { getNewsPostBySlug, getAllNewsSlugs } from '@/lib/notion'
import { RetryableImage } from '@/components/RetryableImage'
import { PostPageIcon } from '@/components/notion/PostPageIcon'
import { PostReadingTime } from '@/components/notion/PostReadingTime'
import { PostBodyFallback, PostBodyStream } from '@/components/notion/PostBodyStream'

export const revalidate = 3600 // ISR: 1시간마다 재생성

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getNewsPostBySlug(slug)
  if (!post) return { title: 'News를 찾을 수 없습니다' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const canonicalUrl = `${siteUrl}/news/${post.slug}`

  return {
    title: post.title,
    description: post.description || 'News',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: canonicalUrl,
      images: post.cover
        ? [{ url: post.cover }]
        : [
            {
              url: `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}`,
              width: 1200,
              height: 630,
            },
          ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.cover
        ? [post.cover]
        : [`${siteUrl}/api/og?title=${encodeURIComponent(post.title)}`],
    },
  }
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getNewsPostBySlug(slug)
  if (!post) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const canonicalUrl = `${siteUrl}/news/${post.slug}`

  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: 'ryong' },
    mainEntityOfPage: canonicalUrl,
    image: post.cover
      ? [post.cover]
      : [`${siteUrl}/api/og?title=${encodeURIComponent(post.title)}`],
  }

  return (
    <>
      <HeaderBrandScopeHydrator scope="log" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="px-1 sm:px-0">
        <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-700">
          {post.cover && (
            <figure className="post-hero-cover mb-5 overflow-hidden rounded-2xl">
              <div className="relative aspect-[1200/630] w-full overflow-hidden">
                <RetryableImage
                  src={post.cover}
                  alt={`${post.title} 배너`}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                  notionRefresh={{ postId: post.id, kind: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 768px"
                  skeletonClassName="absolute inset-0 animate-pulse bg-zinc-200/85 dark:bg-zinc-700/70"
                />
              </div>
            </figure>
          )}
          {post.icon && (
            <div className="post-hero-icon mb-2">
              <PostPageIcon icon={post.icon} size={70} postId={post.id} />
            </div>
          )}
          <div className="post-hero-meta mb-3 flex items-center gap-3">
            <time className="text-sm text-zinc-400 dark:text-zinc-400">
              {formattedDate}
            </time>
            <span className="text-zinc-300 dark:text-zinc-600">·</span>
            <Suspense
              fallback={
                <span className="text-sm text-zinc-400 dark:text-zinc-400">
                  읽는 시간 계산 중
                </span>
              }
            >
              <PostReadingTime postId={post.id} />
            </Suspense>
          </div>
          <h1
            id="post-title"
            className="post-hero-title mb-3 scroll-mt-24 text-3xl font-bold leading-tight"
          >
            {post.title}
          </h1>
          {post.description && (
            <p className="post-hero-description text-lg text-zinc-500 dark:text-zinc-300">
              {post.description}
            </p>
          )}
        </header>

        <Suspense fallback={<PostBodyFallback />}>
          <PostBodyStream postId={post.id} />
        </Suspense>
      </article>
    </>
  )
}
