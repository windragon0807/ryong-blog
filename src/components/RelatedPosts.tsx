import Link from 'next/link'
import type { Post } from '@/types/notion'

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
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="group rounded-xl border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/70 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <p className="line-clamp-2 text-sm font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
              {post.title}
            </p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {new Date(post.date).toLocaleDateString('ko-KR')}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
