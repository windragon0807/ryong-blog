import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import type { Block, KnownBlock, Post, RichText } from '@/types/notion'
import { getPageBlocks, getPosts, NOTION_CACHE_TAGS } from './notion'

const CONTENT_CACHE_TTL_SECONDS = process.env.NODE_ENV === 'development' ? 90 : 3600
const READING_WORDS_PER_MINUTE = 300

export interface SearchDocument {
  id: string
  slug: string
  title: string
  description: string
  tags: string[]
  series: string | null
  content: string
}

export interface ReadingStats {
  words: number
  minutes: number
}

export function extractPlainTextFromBlocks(blocks: Block[]): string {
  const fragments: string[] = []

  const walk = (items: Block[]) => {
    for (const block of items) {
      switch (block.type) {
        case 'paragraph':
          fragments.push(
            richTextToString(
              (block as Extract<KnownBlock, { type: 'paragraph' }>).paragraph.rich_text
            )
          )
          break
        case 'heading_1':
          fragments.push(
            richTextToString(
              (block as Extract<KnownBlock, { type: 'heading_1' }>).heading_1.rich_text
            )
          )
          break
        case 'heading_2':
          fragments.push(
            richTextToString(
              (block as Extract<KnownBlock, { type: 'heading_2' }>).heading_2.rich_text
            )
          )
          break
        case 'heading_3':
          fragments.push(
            richTextToString(
              (block as Extract<KnownBlock, { type: 'heading_3' }>).heading_3.rich_text
            )
          )
          break
        case 'bulleted_list_item':
          fragments.push(
            richTextToString(
              (block as Extract<KnownBlock, { type: 'bulleted_list_item' }>)
                .bulleted_list_item.rich_text
            )
          )
          break
        case 'numbered_list_item':
          fragments.push(
            richTextToString(
              (block as Extract<KnownBlock, { type: 'numbered_list_item' }>)
                .numbered_list_item.rich_text
            )
          )
          break
        case 'quote':
          fragments.push(
            richTextToString(
              (block as Extract<KnownBlock, { type: 'quote' }>).quote.rich_text
            )
          )
          break
        case 'callout':
          fragments.push(
            richTextToString(
              (block as Extract<KnownBlock, { type: 'callout' }>).callout.rich_text
            )
          )
          break
        case 'toggle':
          fragments.push(
            richTextToString(
              (block as Extract<KnownBlock, { type: 'toggle' }>).toggle.rich_text
            )
          )
          break
        case 'bookmark':
          fragments.push(
            (block as Extract<KnownBlock, { type: 'bookmark' }>).bookmark.url
          )
          fragments.push(
            richTextToString(
              (block as Extract<KnownBlock, { type: 'bookmark' }>).bookmark.caption
            )
          )
          break
        case 'code':
          fragments.push(
            (block as Extract<KnownBlock, { type: 'code' }>)
              .code.rich_text.map((token) => token.plain_text)
              .join('')
          )
          break
      }

      const children = (block as { children?: Block[] }).children
      if (children && children.length > 0) {
        walk(children)
      }
    }
  }

  walk(blocks)

  return fragments
    .map((value) => value.trim())
    .filter(Boolean)
    .join('\n')
}

export function estimateReadingStats(text: string): ReadingStats {
  const normalized = text.trim()
  if (!normalized) {
    return { words: 0, minutes: 1 }
  }

  const words = normalized.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / READING_WORDS_PER_MINUTE))

  return { words, minutes }
}

export const getPostReadingStats = cache(async (postId: string): Promise<ReadingStats> => {
  const blocks = await getPageBlocks(postId)
  return estimateReadingStats(extractPlainTextFromBlocks(blocks))
})

async function getSearchDocumentsImpl(): Promise<SearchDocument[]> {
  const posts = await getPosts()
  const documents = await Promise.all(
    posts.map(async (post) => {
      const blocks = await getPageBlocks(post.id)
      const content = extractPlainTextFromBlocks(blocks)

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        description: post.description,
        tags: post.tags,
        series: post.series,
        content: content.slice(0, 6000),
      } satisfies SearchDocument
    })
  )

  return documents
}

const getSearchDocumentsCached = unstable_cache(
  getSearchDocumentsImpl,
  ['post-search-documents'],
  {
    revalidate: CONTENT_CACHE_TTL_SECONDS,
    tags: [NOTION_CACHE_TAGS.posts, NOTION_CACHE_TAGS.blocks],
  }
)

export const getSearchDocuments = cache(async (): Promise<SearchDocument[]> => {
  return getSearchDocumentsCached()
})

export async function getRelatedPosts(currentPost: Post, limit = 3): Promise<Post[]> {
  const posts = await getPosts()

  return posts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag)).length
      const sameSeries =
        currentPost.series && post.series && currentPost.series === post.series ? 1 : 0
      const dateGap =
        Math.abs(
          new Date(currentPost.date).getTime() - new Date(post.date).getTime()
        ) /
        (1000 * 60 * 60 * 24)
      const recencyScore = Number.isFinite(dateGap) ? Math.max(0, 2 - dateGap / 60) : 0

      return {
        post,
        score: sharedTags * 4 + sameSeries * 5 + recencyScore,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post)
}

function richTextToString(richText: RichText[]): string {
  return richText.map((token) => token.plain_text).join('')
}
