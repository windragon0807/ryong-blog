import type { Metadata } from 'next'
import Image from 'next/image'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllSlugs } from '@/lib/notion'
import { PostPageIcon } from '@/components/notion/PostPageIcon'
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
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
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
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <article>
        {/* 헤더 */}
        <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-700">
          {post.cover && (
            <figure className="mb-5 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
              <Image
                src={post.cover}
                alt={`${post.title} 배너`}
                width={1200}
                height={630}
                className="h-auto w-full object-cover"
                priority
                unoptimized
              />
            </figure>
          )}
          {post.icon && (
            <div className="mb-2">
              <PostPageIcon icon={post.icon} size={70} />
            </div>
          )}
          <div className="mb-3 flex items-center gap-2">
            <time className="text-sm text-zinc-400 dark:text-zinc-400">
              {formattedDate}
            </time>
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
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
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
      </article>
    </>
  )
}
