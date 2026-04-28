import Link from 'next/link'
import type { Post } from '@/types/notion'
import { Surface } from '@/components/common/Surface'

interface Props {
  posts: Post[]
}

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section className="mt-14 border-t border-zinc-200 pt-8 dark:border-zinc-700">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        관련 글
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Surface key={post.id} interactive className="rounded-xl bg-white p-0 dark:bg-zinc-800/70">
            <Link href={`/posts/${post.slug}`} className="group block px-4 py-3">
              <p className="line-clamp-2 text-sm font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                {post.title}
              </p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(post.date).toLocaleDateString('ko-KR')}
              </p>
            </Link>
          </Surface>
        ))}
      </div>
    </section>
  )
}
