// 주의: PostCard 의 정적 미러 — PostCard 레이아웃 변경 시 함께 업데이트할 것
function PostCardSkeleton() {
  return (
    <div className="block h-full">
      <div className="post-card-surface relative h-full overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm dark:border-zinc-700/60 dark:bg-zinc-900/45">
        <div className="relative aspect-[16/9] animate-pulse overflow-hidden bg-zinc-200/80 dark:bg-zinc-700/70" />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-10 w-10 shrink-0 animate-pulse rounded-lg bg-zinc-200/80 dark:bg-zinc-700/70" />
            <div className="min-w-0 flex-1">
              <div className="h-5 w-4/5 animate-pulse rounded bg-zinc-200/80 dark:bg-zinc-700/70" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/55" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/55" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/55" />
              </div>
              <div className="mt-4 flex gap-1.5">
                <div className="h-5 w-16 animate-pulse rounded-full bg-zinc-200/70 dark:bg-zinc-700/55" />
                <div className="h-5 w-12 animate-pulse rounded-full bg-zinc-200/70 dark:bg-zinc-700/55" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomeLoading() {
  return (
    <div
      role="status"
      aria-label="콘텐츠를 불러오는 중"
      className="relative left-1/2 w-[min(1200px,calc(100vw-2rem))] -translate-x-1/2 pt-5 md:pt-6"
    >
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <PostCardSkeleton key={idx} />
        ))}
      </section>
    </div>
  )
}
