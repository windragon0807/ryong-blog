import Link from 'next/link'

interface Props {
  tags: string[]
  activeTag?: string
}

export function TagFilter({ tags, activeTag }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={`rounded-full border px-3 py-1 text-sm backdrop-blur-sm transition-[background-color,border-color,color,box-shadow,transform] duration-220 ease-out hover:-translate-y-0.5 ${
          !activeTag
            ? 'border-zinc-900 bg-zinc-900 text-white shadow-[0_12px_20px_-14px_rgba(24,24,27,0.72)] dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
            : 'border-zinc-300/90 bg-white/75 text-zinc-600 hover:border-zinc-500 hover:bg-white/95 hover:text-zinc-800 dark:border-zinc-600/85 dark:bg-zinc-800/65 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700/72 dark:hover:text-zinc-100'
        }`}
      >
        전체
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          className={`rounded-full border px-3 py-1 text-sm backdrop-blur-sm transition-[background-color,border-color,color,box-shadow,transform] duration-220 ease-out hover:-translate-y-0.5 ${
            activeTag === tag
              ? 'border-zinc-900 bg-zinc-900 text-white shadow-[0_12px_20px_-14px_rgba(24,24,27,0.72)] dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
              : 'border-zinc-300/90 bg-white/75 text-zinc-600 hover:border-zinc-500 hover:bg-white/95 hover:text-zinc-800 dark:border-zinc-600/85 dark:bg-zinc-800/65 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700/72 dark:hover:text-zinc-100'
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
