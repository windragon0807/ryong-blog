import Link from 'next/link'
import type { Post } from '@/types/notion'

interface SeriesTimelineProps {
  seriesName: string
  posts: Post[]
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function SeriesTimeline({ seriesName, posts }: SeriesTimelineProps) {
  if (posts.length === 0) return null

  const timelinePosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <section className="glass-surface mb-6 overflow-hidden rounded-2xl border border-zinc-200/85 p-5 dark:border-zinc-700/70">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
            SERIES TIMELINE
          </p>
          <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {seriesName} 연재 흐름
          </h2>
        </div>
        <span className="rounded-full border border-zinc-200/80 bg-white/75 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-700/70 dark:bg-zinc-900/70 dark:text-zinc-300">
          총 {posts.length}편
        </span>
      </div>

      <ol className="relative ml-1 border-l border-zinc-200/90 pl-4 dark:border-zinc-700/80">
        {timelinePosts.map((post, index) => (
          <li key={post.id} className="relative pb-4 last:pb-0">
            <span
              className={`absolute -left-[22px] top-[7px] h-2.5 w-2.5 rounded-full border ${
                index === 0
                  ? 'border-blue-300 bg-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.14)] dark:border-blue-200 dark:bg-blue-400 dark:shadow-[0_0_0_4px_rgba(96,165,250,0.18)]'
                  : 'border-zinc-300 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700'
              }`}
            />

            <Link
              href={`/posts/${post.slug}`}
              className="group block rounded-lg px-2 py-1 transition-colors hover:bg-white/60 dark:hover:bg-zinc-800/55"
            >
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatDate(post.date)}
              </p>
              <p className="mt-1 text-sm font-medium text-zinc-800 transition-colors group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-blue-300">
                {post.title}
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
