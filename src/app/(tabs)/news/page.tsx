import type { Metadata } from 'next'
import { getNewsPosts } from '@/lib/notion'
import { NewsList } from '@/components/NewsList'

export const revalidate = 3600 // ISR: 1시간마다 재생성

export const metadata: Metadata = {
  title: 'News',
  description: '소식과 업데이트',
  alternates: {
    canonical: '/news',
  },
}

export default async function NewsPage() {
  const posts = await getNewsPosts()

  return (
    <div className="relative left-1/2 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 pt-5 md:pt-6">
      <NewsList
        posts={posts}
        emptyTitle="아직 News가 없어요"
        emptyMessage="새 소식이 등록되면 여기에 표시됩니다."
      />
    </div>
  )
}
