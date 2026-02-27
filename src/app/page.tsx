import type { Metadata } from 'next'
import { getPosts, getAllTags, getAllSeries } from '@/lib/notion'
import { PostExplorer } from '@/components/PostExplorer'
import { SeriesFilter } from '@/components/SeriesFilter'
import { SubscriptionCta } from '@/components/SubscriptionCta'
import { TagFilter } from '@/components/TagFilter'

export const revalidate = 3600 // ISR: 1시간마다 재생성

export const metadata: Metadata = {
  title: 'ryong.log',
  description: '개발하며 배운 것들을 기록합니다.',
  alternates: {
    canonical: '/',
  },
}

export default async function HomePage() {
  const [posts, tags, seriesList] = await Promise.all([
    getPosts(),
    getAllTags(),
    getAllSeries(),
  ])

  return (
    <div className="relative left-1/2 w-[min(1200px,calc(100vw-2rem))] -translate-x-1/2">
      <section className="mb-8">
        <h1 className="text-2xl font-bold mb-2">ryong.log</h1>
        <p className="text-zinc-500 dark:text-zinc-300">
          개발하며 배운 것들을 기록합니다.
        </p>
      </section>

      {tags.length > 0 && (
        <section className="mb-6">
          <TagFilter tags={tags} />
        </section>
      )}

      {seriesList.length > 0 && (
        <section className="mb-6">
          <SeriesFilter seriesList={seriesList} />
        </section>
      )}

      <PostExplorer
        posts={posts}
        emptyMessage="아직 게시된 글이 없습니다."
      />

      <SubscriptionCta className="mt-10" />
    </div>
  )
}
