import type { Metadata } from 'next'
import Link from 'next/link'
import { PostExplorer } from '@/components/PostExplorer'
import { getPortfolioPosts } from '@/lib/notion'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'portfolio | ryong.log',
  description: '작업 기록과 포트폴리오를 모아둔 목록입니다.',
  alternates: {
    canonical: '/portfolio',
  },
}

export default async function PortfolioPage() {
  const posts = await getPortfolioPosts()

  return (
    <div className="relative left-1/2 w-[min(1200px,calc(100vw-2rem))] -translate-x-1/2 -mt-3 pt-0 md:mt-0 md:pt-3">
      <div className="mb-3 flex items-center md:mb-4">
        <Link
          href="/resume"
          className="glass-surface inline-flex h-10 items-center gap-2 rounded-2xl border border-zinc-200/90 bg-white/86 px-4 text-sm font-medium text-zinc-700 shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)] backdrop-blur-md transition-[background-color,border-color,color,box-shadow,transform] duration-220 ease-out hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white/95 hover:text-zinc-900 hover:shadow-[0_18px_32px_-22px_rgba(15,23,42,0.45)] focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700/80 dark:bg-zinc-800/78 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-700/80 dark:hover:text-white dark:hover:shadow-[0_20px_36px_-24px_rgba(2,6,23,0.78)] dark:focus:ring-zinc-600"
        >
          <span aria-hidden className="text-base leading-none text-zinc-400 dark:text-zinc-500">
            ←
          </span>
          <span>이력서 보기</span>
        </Link>
      </div>
      <PostExplorer
        posts={posts}
        emptyTitle="아직 포트폴리오가 없어요"
        emptyMessage="아직 게시된 포트폴리오 항목이 없습니다."
      />
    </div>
  )
}
