import { FilterChip } from '@/components/common/FilterChip'

interface Props {
  seriesList: string[]
  activeSeries?: string
}

export function SeriesFilter({ seriesList, activeSeries }: Props) {
  if (seriesList.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {seriesList.map((series) => (
        <FilterChip
          key={series}
          href={`/series/${encodeURIComponent(series)}`}
          active={activeSeries === series}
          tone="series"
        >
          {series}
        </FilterChip>
      ))}
    </div>
  )
}
