import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type FilterChipTone = 'neutral' | 'series'

export function FilterChip({
  href,
  active = false,
  tone = 'neutral',
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & {
  active?: boolean
  tone?: FilterChipTone
}) {
  const activeClass =
    tone === 'series'
      ? 'border-blue-500/85 bg-blue-600/90 text-white shadow-[0_10px_18px_-14px_rgba(37,99,235,0.9)] dark:border-blue-400/85 dark:bg-blue-500/85 dark:text-zinc-900'
      : 'border-zinc-900 bg-zinc-900 text-white shadow-[0_12px_20px_-14px_rgba(24,24,27,0.72)] dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'

  return (
    <Link
      href={href}
      className={cn(
        'rounded-full border px-3 py-1 text-sm backdrop-blur-sm transition-[background-color,border-color,color,box-shadow,transform] duration-220 ease-out hover:-translate-y-0.5',
        active
          ? activeClass
          : 'border-zinc-300/90 bg-white/75 text-zinc-600 hover:border-zinc-500 hover:bg-white/95 hover:text-zinc-800 dark:border-zinc-600/85 dark:bg-zinc-800/65 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700/72 dark:hover:text-zinc-100',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
