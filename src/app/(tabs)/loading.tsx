// 주의: PostCard 의 정적 미러 — PostCard 레이아웃 변경 시 함께 업데이트할 것.
// 현재 미러: 커버(aspect-[16/9]) + p-4 컨텐트 영역 안의 [아이콘 10x10] + [제목 2줄 (line-clamp-2)] + [날짜 text-xs].
// description / 태그 / 시리즈 배지는 실제 렌더링에서 비어있는 경우가 많아 스켈레톤에서도 표현하지 않음.
function PostCardSkeleton() {
  return (
    <div className="block h-full">
      <div className="post-card-surface relative h-full overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm dark:border-zinc-700/60 dark:bg-zinc-900/45">
        <div className="relative aspect-[16/9] animate-pulse overflow-hidden bg-zinc-200/80 dark:bg-zinc-700/70" />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-10 w-10 shrink-0 animate-pulse rounded-lg bg-zinc-200/80 dark:bg-zinc-700/70" />
            <div className="min-w-0 flex-1">
              <div className="space-y-1.5">
                <div className="h-5 w-full animate-pulse rounded bg-zinc-200/80 dark:bg-zinc-700/70" />
                <div className="h-5 w-3/5 animate-pulse rounded bg-zinc-200/80 dark:bg-zinc-700/70" />
              </div>
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/55" />
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
