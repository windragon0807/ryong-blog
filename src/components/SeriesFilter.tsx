import Link from 'next/link'

interface Props {
  seriesList: string[]
  activeSeries?: string
}

export function SeriesFilter({ seriesList, activeSeries }: Props) {
  if (seriesList.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {seriesList.map((series) => (
        <Link
          key={series}
          href={`/series/${encodeURIComponent(series)}`}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            activeSeries === series
              ? 'border-blue-500 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-500 dark:text-zinc-900'
              : 'border-zinc-300 text-zinc-600 hover:border-zinc-500 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-zinc-500'
          }`}
        >
          {series}
        </Link>
      ))}
    </div>
  )
}
