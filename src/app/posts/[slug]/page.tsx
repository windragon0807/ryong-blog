import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllSlugs } from '@/lib/notion'
import { getRelatedPosts } from '@/lib/postContent'
import { ReadingProgress } from '@/components/ReadingProgress'
import { RelatedPosts } from '@/components/RelatedPosts'
import { RetryableImage } from '@/components/RetryableImage'
import { GiscusComments } from '@/components/GiscusComments'
import { PostPageIcon } from '@/components/notion/PostPageIcon'
import { PostReadingTime } from '@/components/notion/PostReadingTime'
import { PostBodyFallback, PostBodyStream } from '@/components/notion/PostBodyStream'

export const revalidate = 3600 // ISR: 1시간마다 재생성

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: '글을 찾을 수 없습니다' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${siteUrl}/posts/${post.slug}`,
    },
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      url: `${siteUrl}/posts/${post.slug}`,
      images: post.cover
        ? [
            {
              url: post.cover,
            },
          ]
        : [
            {
              url: `${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&tags=${encodeURIComponent(post.tags.join(','))}`,
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
        : [`${siteUrl}/api/og?title=${encodeURIComponent(post.title)}&tags=${encodeURIComponent(post.tags.join(','))}`],
    },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()
  const relatedPosts = await getRelatedPosts(post, 3)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const canonicalUrl = `${siteUrl}/posts/${post.slug}`

  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'ryong',
    },
    mainEntityOfPage: canonicalUrl,
    image: post.cover ? [post.cover] : [`${siteUrl}/api/og?title=${encodeURIComponent(post.title)}`],
    keywords: post.tags.join(', '),
  }

  return (
    <>
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article>
        {/* 헤더 */}
        <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-700">
          {post.cover && (
            <figure className="mb-5 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <div className="relative aspect-[1200/630] w-full overflow-hidden">
                <RetryableImage
                  src={post.cover}
                  alt={`${post.title} 배너`}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 768px"
                  skeletonClassName="absolute inset-0 animate-pulse bg-zinc-200/85 dark:bg-zinc-700/70"
                />
              </div>
            </figure>
          )}
          {post.icon && (
            <div className="mb-2">
              <PostPageIcon icon={post.icon} size={70} />
            </div>
          )}
          <div className="mb-3 flex items-center gap-3">
            <time className="text-sm text-zinc-400 dark:text-zinc-400">
              {formattedDate}
            </time>
            <span className="text-zinc-300 dark:text-zinc-600">·</span>
            <Suspense
              fallback={
                <span className="text-sm text-zinc-400 dark:text-zinc-400">읽는 시간 계산 중</span>
              }
            >
              <PostReadingTime postId={post.id} />
            </Suspense>
          </div>
          <h1
            id="post-title"
            className="mb-3 scroll-mt-24 text-3xl font-bold leading-tight"
          >
            {post.title}
          </h1>
          {post.description && (
            <p className="text-lg text-zinc-500 dark:text-zinc-300">
              {post.description}
            </p>
          )}
          {(post.series || post.tags.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.series && (
                <Link
                  href={`/series/${encodeURIComponent(post.series)}`}
                  className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                >
                  Series · {post.series}
                </Link>
              )}
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 본문 */}
        <Suspense fallback={<PostBodyFallback />}>
          <PostBodyStream postId={post.id} postTitle={post.title} />
        </Suspense>

        <GiscusComments />
        <RelatedPosts posts={relatedPosts} />
      </article>
    </>
  )
}
