import { getPosts, getAllTags } from '@/lib/notion'
import { PostCard } from '@/components/PostCard'
import { TagFilter } from '@/components/TagFilter'

export const revalidate = 3600 // ISR: 1시간마다 재생성

export default async function HomePage() {
  const [posts, tags] = await Promise.all([getPosts(), getAllTags()])

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

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {posts.length === 0 ? (
          <p className="col-span-full py-20 text-center text-zinc-400 dark:text-zinc-400">
            아직 게시된 글이 없습니다.
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>
    </div>
  )
}
