import type { Post } from '@/types/notion'
import { NewsListItem } from './NewsListItem'
import { EmptyStatePanel } from './EmptyStatePanel'

interface Props {
  posts: Post[]
  emptyTitle?: string
  emptyMessage?: string
}

export function NewsList({
  posts,
  emptyTitle = '아직 News가 없어요',
  emptyMessage = '새 소식이 등록되면 여기에 표시됩니다.',
}: Props) {
  if (posts.length === 0) {
    return (
      <EmptyStatePanel
        className="py-14"
        title={emptyTitle}
        description={emptyMessage}
        hints={['Notion에서 새 News 작성', '잠시 후 자동 반영']}
      />
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {posts.map((post, index) => (
        <li key={post.id}>
          <NewsListItem post={post} motionIndex={index} />
        </li>
      ))}
    </ul>
  )
}
