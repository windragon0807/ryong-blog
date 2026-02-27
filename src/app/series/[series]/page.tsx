import type { Metadata } from 'next'
import { getAllSeries, getPostsBySeries } from '@/lib/notion'
import { PostExplorer } from '@/components/PostExplorer'
import { SeriesFilter } from '@/components/SeriesFilter'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ series: string }>
}

export async function generateStaticParams() {
  const seriesList = await getAllSeries()
  return seriesList.map((series) => ({ series: encodeURIComponent(series) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { series } = await params
  const decodedSeries = decodeURIComponent(series)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  return {
    title: `${decodedSeries} 시리즈`,
    description: `${decodedSeries} 시리즈 글 모음`,
    alternates: {
      canonical: `${siteUrl}/series/${encodeURIComponent(decodedSeries)}`,
    },
  }
}

export default async function SeriesPage({ params }: PageProps) {
  const { series } = await params
  const decodedSeries = decodeURIComponent(series)
  const [posts, seriesList] = await Promise.all([
    getPostsBySeries(decodedSeries),
    getAllSeries(),
  ])

  return (
    <div className="relative left-1/2 w-[min(1200px,calc(100vw-2rem))] -translate-x-1/2">
      <section className="mb-8">
        <h1 className="mb-2 text-2xl font-bold">{decodedSeries}</h1>
        <p className="text-zinc-500 dark:text-zinc-300">{posts.length}개의 시리즈 글</p>
      </section>

      <section className="mb-6">
        <SeriesFilter seriesList={seriesList} activeSeries={decodedSeries} />
      </section>

      <PostExplorer
        posts={posts}
        emptyMessage="해당 시리즈의 글이 없습니다."
      />
    </div>
  )
}
