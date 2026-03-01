import type { CSSProperties } from 'react'
import Link from 'next/link'
import type { Post } from '@/types/notion'
import { PostPageIcon } from '@/components/notion/PostPageIcon'
import { RetryableImage } from '@/components/RetryableImage'
import { getCoverAccent } from '@/lib/coverAccent'

interface Props {
  post: Post
  variant?: 'grid' | 'list'
  density?: 'default' | 'compact'
  motionIndex?: number
  motionCycle?: number
}

export function PostCard({
  post,
  variant = 'grid',
  density = 'default',
  motionIndex = 0,
  motionCycle = 0,
}: Props) {
  const isList = variant === 'list'
  const isCompact = density === 'compact'
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
  const interactionClass = isCompact
    ? 'transition-[translate,scale,border-color,box-shadow,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:scale-[1.005] hover:border-zinc-300/70 hover:shadow-[0_18px_34px_-24px_rgba(15,23,42,0.32)] dark:hover:border-zinc-500/70 dark:hover:shadow-[0_20px_42px_-24px_rgba(10,20,35,0.54)]'
    : 'transition-[translate,scale,border-color,box-shadow,filter] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.01] hover:border-zinc-300/75 hover:shadow-[0_22px_45px_-26px_rgba(15,23,42,0.34)] hover:brightness-[1.01] dark:hover:border-zinc-500/72 dark:hover:shadow-[0_24px_55px_-26px_rgba(10,20,35,0.62)] dark:hover:brightness-[1.03]'

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`group block ${isList ? '' : 'h-full'}`}
      style={motionStyle}
      data-motion-cycle={motionCycle}
    >
      <article
        className={`post-card-motion post-card-surface glass-card-shell glass-surface relative isolate transform-gpu origin-center translate-y-0 scale-100 overflow-hidden border border-zinc-200/72 bg-white/80 backdrop-blur-[11px] dark:border-zinc-700/68 dark:bg-zinc-800/72 ${
          isCompact ? 'rounded-xl' : 'rounded-2xl'
        } ${
          isList ? '' : 'h-full'
        } ${interactionClass}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'linear-gradient(160deg, rgba(255,255,255,0.26) 2%, rgba(255,255,255,0) 38%), radial-gradient(circle at 84% 12%, rgba(148,163,184,0.18) 0%, rgba(148,163,184,0) 43%)',
          }}
        />
        <div className={isList ? 'sm:flex sm:min-h-[13rem]' : ''}>
          <div
            className={`relative z-10 overflow-hidden border-white/65 dark:border-zinc-700/60 ${
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
            <div
              className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                isCompact
                  ? 'from-black/24 via-black/4 to-transparent opacity-75 group-hover:opacity-85'
                  : 'from-black/35 via-black/5 to-transparent group-hover:opacity-90'
              }`}
            />
            {!isCompact && (
              <div
                className="absolute inset-0 opacity-65 mix-blend-soft-light transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                style={{
                  background: `radial-gradient(circle at 75% 82%, ${accent.soft} 0%, transparent 62%)`,
                }}
              />
            )}
          </div>

          <div
            className={`relative z-10 flex flex-col ${
              isList ? 'flex-1 p-5' : isCompact ? 'p-3' : 'p-4'
            }`}
          >
            <div className="flex items-start gap-3">
              {post.icon && (
                <div
                  className={`mt-0.5 shrink-0 rounded-lg border border-zinc-200/90 bg-white/75 backdrop-blur-sm transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.03] dark:border-zinc-700/80 dark:bg-zinc-900/72 ${
                    isCompact
                      ? 'flex h-8 w-8 min-h-8 min-w-8 items-center justify-center p-1'
                      : 'flex h-10 w-10 min-h-10 min-w-10 items-center justify-center p-1'
                  }`}
                >
                  <PostPageIcon
                    icon={post.icon}
                    size={isCompact ? 18 : 24}
                    postId={post.id}
                    className=""
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2
                  className={`line-clamp-2 leading-snug font-semibold text-zinc-900 transition-colors duration-300 ease-out group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 ${
                    isList
                      ? 'text-[1.72rem]'
                      : isCompact
                        ? 'text-base'
                        : 'text-lg'
                  }`}
                >
                  {post.title}
                </h2>
                <time
                  className={`block text-zinc-400 dark:text-zinc-400 ${
                    isCompact ? 'mt-1 text-[11px]' : 'mt-2 text-xs'
                  }`}
                >
                  {formattedDate}
                </time>

                {post.description && !isCompact && (
                  <p
                    className={`mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-300 ${
                      isList ? 'line-clamp-3' : 'line-clamp-2'
                    }`}
                  >
                    {post.description}
                  </p>
                )}

                {!isCompact && (post.series || post.tags.length > 0) && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.series && (
                      <span className="inline-flex items-center rounded-md border border-blue-200/95 bg-blue-50/80 px-2 py-0.5 text-xs font-medium text-blue-700 backdrop-blur-sm dark:border-blue-700/80 dark:bg-blue-900/35 dark:text-blue-300">
                        Series · {post.series}
                      </span>
                    )}
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md border border-zinc-200/85 bg-zinc-100/75 px-2 py-0.5 text-xs font-medium text-zinc-600 backdrop-blur-sm dark:border-zinc-700/70 dark:bg-zinc-700/65 dark:text-zinc-300"
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
