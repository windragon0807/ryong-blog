import type { Metadata } from 'next'
import { getPostsByTag, getAllTags } from '@/lib/notion'
import { PostCard } from '@/components/PostCard'
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
  return {
    title: `#${decodedTag}`,
    description: `${decodedTag} 관련 글 모음`,
  }
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const [posts, allTags] = await Promise.all([
    getPostsByTag(decodedTag),
    getAllTags(),
  ])

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

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {posts.length === 0 ? (
          <p className="col-span-full py-20 text-center text-zinc-400 dark:text-zinc-400">
            해당 태그의 글이 없습니다.
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>
    </div>
  )
}
