import Image from 'next/image'
import type { PostIcon } from '@/types/notion'

interface Props {
  icon: PostIcon | null
  size?: number
  className?: string
}

export function PostPageIcon({ icon, size = 44, className = '' }: Props) {
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
    <Image
      src={icon.url}
      alt=""
      width={size}
      height={size}
      className={`rounded-xl object-cover ${className}`.trim()}
      unoptimized
    />
  )
}
