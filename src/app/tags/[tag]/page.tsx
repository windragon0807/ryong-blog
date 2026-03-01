import type { Metadata } from 'next'
import { getPostsByTag, getAllTags } from '@/lib/notion'
import { PostExplorer } from '@/components/PostExplorer'
import { TagFilter } from '@/components/TagFilter'

export const revalidate = 3600 // ISR: 1시간마다 재생성

interface PageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({ tag: encodeURIComponent(tag) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return {
    title: `#${decodedTag}`,
    description: `${decodedTag} 관련 글 모음`,
    alternates: {
      canonical: `${siteUrl}/tags/${encodeURIComponent(decodedTag)}`,
    },
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const [posts, allTags] = await Promise.all([getPostsByTag(decodedTag), getAllTags()])

  return (
    <div className="relative left-1/2 w-[min(1200px,calc(100vw-2rem))] -translate-x-1/2">
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-2">#{decodedTag}</h1>
        <p className="text-zinc-500 dark:text-zinc-300">
          {posts.length}개의 글
        </p>
      </section>

      <section className="mb-6">
        <TagFilter tags={allTags} activeTag={decodedTag} />
      </section>

      <PostExplorer
        posts={posts}
        emptyTitle={`#${decodedTag} 태그 글이 없어요`}
        emptyMessage="해당 태그의 글이 없습니다."
      />
    </div>
  )
}
