// 주의: NewsListItem 의 정적 미러 — NewsListItem 레이아웃 변경 시 함께 업데이트할 것
function NewsItemSkeleton() {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-zinc-200/75 bg-white/70 px-4 py-3 dark:border-zinc-700/60 dark:bg-zinc-900/45">
      <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-zinc-200/80 dark:bg-zinc-700/70" />
      <div className="h-4 max-w-md flex-1 animate-pulse rounded bg-zinc-200/80 dark:bg-zinc-700/70" />
      <div className="h-3 w-24 shrink-0 animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/55" />
    </li>
  )
}

export default function NewsLoading() {
  return (
    <div
      role="status"
      aria-label="News 콘텐츠를 불러오는 중"
      className="relative left-1/2 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 pt-5 md:pt-6"
    >
      <ul className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <NewsItemSkeleton key={idx} />
        ))}
      </ul>
    </div>
  )
}
