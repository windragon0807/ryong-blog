import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/types/notion'
import { PostPageIcon } from '@/components/notion/PostPageIcon'

interface Props {
  post: Post
}

export function PostCard({ post }: Props) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <article className="h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-800/80 dark:hover:border-zinc-500">
        <div className="relative aspect-[16/9] overflow-hidden border-b border-zinc-200/80 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900">
          {post.cover ? (
            <Image
              src={post.cover}
              alt={`${post.title} 배너`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#dbeafe_0,#dbeafe_28%,transparent_60%),radial-gradient(circle_at_80%_30%,#bfdbfe_0,#bfdbfe_22%,transparent_55%)] dark:bg-[radial-gradient(circle_at_25%_25%,#1e3a8a_0,#1e3a8a_25%,transparent_58%),radial-gradient(circle_at_80%_30%,#1d4ed8_0,#1d4ed8_22%,transparent_52%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
        </div>

        <div className="flex flex-col p-4">
          <div className="flex items-start gap-3">
            {post.icon && (
              <div className="mt-0.5 shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-900/40">
                <PostPageIcon icon={post.icon} size={24} className="shrink-0" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-2 text-lg leading-snug font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                {post.title}
              </h2>
              <time className="mt-2 block text-xs text-zinc-400 dark:text-zinc-400">
                {formattedDate}
              </time>

              {post.description && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-300">
                  {post.description}
                </p>
              )}

              {post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
