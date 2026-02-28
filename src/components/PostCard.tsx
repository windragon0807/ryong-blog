import type { CSSProperties } from 'react'
import Link from 'next/link'
import type { Post } from '@/types/notion'
import { PostPageIcon } from '@/components/notion/PostPageIcon'
import { RetryableImage } from '@/components/RetryableImage'
import { getCoverAccent } from '@/lib/coverAccent'

interface Props {
  post: Post
  variant?: 'grid' | 'list'
  motionIndex?: number
  motionCycle?: number
}

export function PostCard({
  post,
  variant = 'grid',
  motionIndex = 0,
  motionCycle = 0,
}: Props) {
  const isList = variant === 'list'
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
  const accent = getCoverAccent(post.cover ?? post.slug)
  const delayMs = Math.min(motionIndex * 55, 320)
  const motionStyle = {
    '--card-delay': `${delayMs}ms`,
  } as CSSProperties

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`group block ${isList ? '' : 'h-full'}`}
      style={motionStyle}
      data-motion-cycle={motionCycle}
    >
      <article
        className={`post-card-motion post-card-surface transform-gpu origin-center translate-y-0 scale-100 overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-[translate,scale,border-color,box-shadow,filter] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.01] hover:border-zinc-300 hover:shadow-[0_22px_45px_-26px_rgba(15,23,42,0.45)] hover:brightness-[1.008] dark:border-zinc-700 dark:bg-zinc-800/80 dark:hover:border-zinc-500 dark:hover:shadow-[0_24px_55px_-26px_rgba(10,20,35,0.7)] dark:hover:brightness-[1.03] ${
          isList ? '' : 'h-full'
        }`}
      >
        <div className={isList ? 'sm:flex sm:min-h-[13rem]' : ''}>
          <div
            className={`relative overflow-hidden border-zinc-200/80 dark:border-zinc-700 ${
              isList
                ? 'aspect-[16/9] border-b sm:h-auto sm:w-[42%] sm:border-r sm:border-b-0'
                : 'aspect-[16/9] border-b'
            }`}
            style={{
              backgroundImage: `radial-gradient(circle at 18% 20%, ${accent.light} 0%, transparent 48%), radial-gradient(circle at 85% 24%, ${accent.dark} 0%, transparent 52%)`,
            }}
          >
            {post.cover ? (
              <RetryableImage
                src={post.cover}
                alt={`${post.title} 배너`}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                sizes={
                  isList
                    ? '(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 36vw'
                    : '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw'
                }
                unoptimized
                notionRefresh={{ postId: post.id, kind: 'cover' }}
                skeletonClassName="absolute inset-0 animate-pulse bg-zinc-200/80 dark:bg-zinc-700/70"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,#dbeafe_0,#dbeafe_28%,transparent_60%),radial-gradient(circle_at_80%_30%,#bfdbfe_0,#bfdbfe_22%,transparent_55%)] dark:bg-[radial-gradient(circle_at_25%_25%,#1e3a8a_0,#1e3a8a_25%,transparent_58%),radial-gradient(circle_at_80%_30%,#1d4ed8_0,#1d4ed8_22%,transparent_52%)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
            <div
              className="absolute inset-0 opacity-65 mix-blend-soft-light transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              style={{
                background: `radial-gradient(circle at 75% 82%, ${accent.soft} 0%, transparent 62%)`,
              }}
            />
          </div>

          <div className={`flex flex-col ${isList ? 'flex-1 p-5' : 'p-4'}`}>
            <div className="flex items-start gap-3">
              {post.icon && (
                <div className="mt-0.5 shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 p-1 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.03] dark:border-zinc-700 dark:bg-zinc-900/40">
                  <PostPageIcon
                    icon={post.icon}
                    size={24}
                    postId={post.id}
                    className="shrink-0"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2
                  className={`line-clamp-2 leading-snug font-semibold text-zinc-900 transition-colors duration-300 ease-out group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 ${
                    isList ? 'text-[1.72rem]' : 'text-lg'
                  }`}
                >
                  {post.title}
                </h2>
                <time className="mt-2 block text-xs text-zinc-400 dark:text-zinc-400">
                  {formattedDate}
                </time>

                {post.description && (
                  <p
                    className={`mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-300 ${
                      isList ? 'line-clamp-3' : 'line-clamp-2'
                    }`}
                  >
                    {post.description}
                  </p>
                )}

                {(post.series || post.tags.length > 0) && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.series && (
                      <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        Series · {post.series}
                      </span>
                    )}
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
        </div>
      </article>
    </Link>
  )
}
