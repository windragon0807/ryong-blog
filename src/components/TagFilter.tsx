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
        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
          !activeTag
            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
            : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:border-zinc-500 dark:hover:border-zinc-500'
        }`}
      >
        전체
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          className={`px-3 py-1 text-sm rounded-full border transition-colors ${
            activeTag === tag
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
              : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-300 hover:border-zinc-500 dark:hover:border-zinc-500'
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  )
}
