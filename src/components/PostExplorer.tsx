import type { Post } from '@/types/notion'
import { PostCard } from './PostCard'
import { EmptyStatePanel } from './EmptyStatePanel'

interface Props {
  posts: Post[]
  emptyTitle?: string
  emptyMessage?: string
}

export function PostExplorer({
  posts,
  emptyTitle = '아직 게시된 글이 없어요',
  emptyMessage = '조건에 맞는 글이 없습니다.',
}: Props) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {posts.length === 0 ? (
        <EmptyStatePanel
          className="col-span-full py-14"
          title={emptyTitle}
          description={emptyMessage}
          hints={['Notion에서 새 글 작성', '게시(Published) 체크', '잠시 후 자동 반영']}
        />
      ) : (
        posts.map((post, index) => (
          <PostCard key={post.id} post={post} motionIndex={index} />
        ))
      )}
    </section>
  )
}
