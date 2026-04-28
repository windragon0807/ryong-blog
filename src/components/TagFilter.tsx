import { FilterChip } from '@/components/common/FilterChip'

interface Props {
  tags: string[]
  activeTag?: string
}

export function TagFilter({ tags, activeTag }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <FilterChip
        href="/"
        active={!activeTag}
      >
        전체
      </FilterChip>
      {tags.map((tag) => (
        <FilterChip
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          active={activeTag === tag}
        >
          {tag}
        </FilterChip>
      ))}
    </div>
  )
}
