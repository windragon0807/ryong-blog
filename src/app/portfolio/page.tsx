import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { ActionLink } from '@/components/common/ActionControl'
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
        <ActionLink
          href="/resume"
          variant="glass"
        >
          <ArrowLeft className="h-4 w-4 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
          <span>이력서 보기</span>
        </ActionLink>
      </div>
      <PostExplorer
        posts={posts}
        emptyTitle="아직 포트폴리오가 없어요"
        emptyMessage="아직 게시된 포트폴리오 항목이 없습니다."
      />
    </div>
  )
}
