export default function PostLoading() {
  return (
    <article>
      <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-700">
        <div className="mb-5 h-56 w-full animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-700 dark:bg-zinc-800/60" />
        <div className="mb-3 h-4 w-36 animate-pulse rounded bg-zinc-200/80 dark:bg-zinc-700/80" />
        <div className="mb-3 h-10 w-3/4 animate-pulse rounded bg-zinc-200/80 dark:bg-zinc-700/80" />
        <div className="h-6 w-2/3 animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/70" />
      </header>
      <div className="space-y-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-200/80 dark:bg-zinc-700/80" />
        <div className="h-5 w-full animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/70" />
        <div className="h-5 w-11/12 animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/70" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/70" />
      </div>
    </article>
  )
}
