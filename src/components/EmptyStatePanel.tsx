import type { ReactNode } from 'react'

interface EmptyStatePanelProps {
  title: string
  description: string
  hints?: string[]
  icon?: ReactNode
  className?: string
  framed?: boolean
}

function SearchIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  )
}

export function EmptyStatePanel({
  title,
  description,
  hints = [],
  icon,
  className = '',
  framed = true,
}: EmptyStatePanelProps) {
  return (
    <div
      className={`rounded-2xl px-6 py-10 text-center ${
        framed
          ? 'glass-surface border border-zinc-200/90 dark:border-zinc-700/70'
          : ''
      } ${className}`.trim()}
    >
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200/90 bg-white/80 text-zinc-500 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.45)] dark:border-zinc-700/70 dark:bg-zinc-900/75 dark:text-zinc-300">
        {icon ?? <SearchIcon />}
      </div>

      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{title}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>

      {hints.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {hints.map((hint) => (
            <span
              key={hint}
              className="rounded-full border border-zinc-200/90 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-zinc-500 dark:border-zinc-700/70 dark:bg-zinc-900/70 dark:text-zinc-300"
            >
              {hint}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
