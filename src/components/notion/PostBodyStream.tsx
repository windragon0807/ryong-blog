import { getPageBlocks } from '@/lib/notion'
import { extractTocHeadings } from '@/lib/toc'
import { Skeleton } from '@/components/ui/skeleton'
import { BlockRenderer } from './BlockRenderer'
import { FloatingToc } from './FloatingToc'

interface Props {
  postId: string
  postTitle: string
}

export async function PostBodyStream({ postId, postTitle }: Props) {
  const blocks = await getPageBlocks(postId)
  const tocHeadings = extractTocHeadings(blocks)
  const fullTocHeadings = [{ id: 'post-title', text: postTitle, level: 1 as const }, ...tocHeadings]

  return (
    <>
      <BlockRenderer postId={postId} blocks={blocks} />
      <FloatingToc headings={fullTocHeadings} />
    </>
  )
}

export function PostBodyFallback() {
  return (
    <div aria-busy="true" className="space-y-5">
      <Skeleton className="h-5 w-2/3 bg-zinc-200/80 dark:bg-zinc-700/80" />
      <Skeleton className="h-5 w-full bg-zinc-200/70 dark:bg-zinc-700/70" />
      <Skeleton className="h-5 w-11/12 bg-zinc-200/70 dark:bg-zinc-700/70" />
      <Skeleton className="h-5 w-4/5 bg-zinc-200/70 dark:bg-zinc-700/70" />
      <Skeleton className="my-2 h-48 w-full rounded-xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-700 dark:bg-zinc-800/60" />
      <Skeleton className="h-5 w-full bg-zinc-200/70 dark:bg-zinc-700/70" />
      <Skeleton className="h-5 w-10/12 bg-zinc-200/70 dark:bg-zinc-700/70" />
    </div>
  )
}
