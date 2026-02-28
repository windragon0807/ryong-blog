import type { PostIcon } from '@/types/notion'
import { RetryableImage } from '@/components/RetryableImage'

interface Props {
  icon: PostIcon | null
  size?: number
  postId?: string
  className?: string
}

export function PostPageIcon({ icon, size = 44, postId, className = '' }: Props) {
  if (!icon) return null

  if (icon.type === 'emoji') {
    return (
      <span
        className={`inline-flex items-center justify-center leading-none ${className}`.trim()}
        style={{ width: size, height: size, fontSize: Math.max(16, Math.round(size * 0.78)) }}
        aria-hidden="true"
      >
        {icon.emoji}
      </span>
    )
  }

  return (
    <span
      className="relative inline-flex"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <RetryableImage
        src={icon.url}
        alt=""
        fill
        unoptimized
        className={`rounded-xl object-cover ${className}`.trim()}
        notionRefresh={postId ? { postId, kind: 'icon' } : undefined}
        skeletonClassName="absolute inset-0 animate-pulse rounded-xl bg-zinc-200/80 dark:bg-zinc-700/70"
      />
    </span>
  )
}
