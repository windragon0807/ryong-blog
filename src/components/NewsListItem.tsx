import type { CSSProperties } from 'react'
import Link from 'next/link'
import type { Post } from '@/types/notion'
import { PostPageIcon } from '@/components/notion/PostPageIcon'

interface Props {
  post: Post
  motionIndex?: number
}

function NewsFallbackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="h-[18px] w-[18px] text-zinc-400 dark:text-zinc-500"
    >
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 12.5h8M8 16h5" strokeLinecap="round" />
    </svg>
  )
}

export function NewsListItem({ post, motionIndex = 0 }: Props) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  const delayMs = Math.min(motionIndex * 40, 240)
  const motionStyle = {
    '--card-delay': `${delayMs}ms`,
  } as CSSProperties

  return (
    <Link
      href={`/news/${post.slug}`}
      className="post-card-motion group flex items-center gap-3 rounded-xl border border-zinc-200/75 bg-white/70 px-4 py-3 transition-[border-color,background-color,box-shadow,transform] duration-200 hover:-translate-y-px hover:border-zinc-300 hover:bg-white hover:shadow-[0_10px_28px_-22px_rgba(15,23,42,0.32)] dark:border-zinc-700/60 dark:bg-zinc-900/45 dark:hover:border-zinc-500 dark:hover:bg-zinc-900/70"
      style={motionStyle}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200/85 bg-white/85 dark:border-zinc-700/75 dark:bg-zinc-900/72">
        {post.icon ? (
          <PostPageIcon icon={post.icon} size={20} postId={post.id} />
        ) : (
          <NewsFallbackIcon />
        )}
      </div>

      <h3 className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-800 transition-colors duration-200 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-zinc-50 sm:text-base">
        {post.title}
      </h3>

      {formattedDate && (
        <time className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
          {formattedDate}
        </time>
      )}
    </Link>
  )
}
