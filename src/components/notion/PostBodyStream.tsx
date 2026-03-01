import { getPageBlocks } from '@/lib/notion'
import { extractTocHeadings } from '@/lib/toc'
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
      <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-200/80 dark:bg-zinc-700/80" />
      <div className="h-5 w-full animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/70" />
      <div className="h-5 w-11/12 animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/70" />
      <div className="h-5 w-4/5 animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/70" />
      <div className="my-2 h-48 w-full animate-pulse rounded-xl border border-zinc-200 bg-zinc-100/60 dark:border-zinc-700 dark:bg-zinc-800/60" />
      <div className="h-5 w-full animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/70" />
      <div className="h-5 w-10/12 animate-pulse rounded bg-zinc-200/70 dark:bg-zinc-700/70" />
    </div>
  )
}
