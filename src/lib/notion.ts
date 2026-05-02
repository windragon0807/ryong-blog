import { Client } from '@notionhq/client'
import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import type { Post, PostSource, Block, RichText } from '@/types/notion'
import type {
  PageObjectResponse,
  BlockObjectResponse,
  PartialBlockObjectResponse,
  QueryDatabaseParameters,
} from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const BLOG_DATABASE_ID = process.env.NOTION_DATABASE_ID!
const PORTFOLIO_DATABASE_ID =
  process.env.NOTION_PORTFOLIO_DATABASE_ID?.trim() || '31d3d4af55eb80989dddeb5baa502d11'
const NEWS_DATABASE_ID =
  process.env.NOTION_NEWS_DATABASE_ID?.trim() || '3533d4af55eb8072a237e18b8ef1b042'

// `/posts/[slug]` 가 검색하는 DB 집합 (블로그·포트폴리오만). News 는 슬러그 충돌 방지를 위해 제외.
const POST_DETAIL_DATABASE_IDS = Array.from(
  new Set([BLOG_DATABASE_ID, PORTFOLIO_DATABASE_ID].filter(Boolean))
)

// 전체 콘텐츠 DB (webhook 검증 / getPostByPageId 등 generic lookup용)
const CONTENT_DATABASE_IDS = Array.from(
  new Set([...POST_DETAIL_DATABASE_IDS, NEWS_DATABASE_ID].filter(Boolean))
)
const CACHE_TTL_SECONDS = process.env.NODE_ENV === 'development' ? 120 : 3600

export const NOTION_CACHE_TAGS = {
  schema: 'notion:schema',
  posts: 'notion:posts',
  blocks: 'notion:blocks',
} as const

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

interface DatabaseSchema {
  title: string | null
  slug: string | null
  description: string | null
  seriesSelect: string | null
  seriesRich: string | null
  tags: string | null
  published: string | null
  date: string | null
}

export interface PostMediaUrls {
  cover: string | null
  iconUrl: string | null
}

function extractRichText(richTextArr: RichText[]): string {
  return richTextArr.map((t) => t.plain_text).join('')
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[\s_-]/g, '')
}

function findProperty(
  properties: Record<string, { type: string }>,
  aliases: string[],
  expectedType: string
): string | null {
  const aliasSet = new Set(aliases.map(normalizeKey))

  for (const [name, def] of Object.entries(properties)) {
    if (def.type === expectedType && aliasSet.has(normalizeKey(name))) {
      return name
    }
  }

  for (const [name, def] of Object.entries(properties)) {
    if (def.type === expectedType) return name
  }

  return null
}

async function getDatabaseSchemaCached(databaseId: string): Promise<DatabaseSchema> {
  return unstable_cache(async (): Promise<DatabaseSchema> => {
    const database = await notion.databases.retrieve({ database_id: databaseId })
    const properties = (database as { properties: Record<string, { type: string }> })
      .properties

    return {
      title: findProperty(properties, ['title', '이름', 'name'], 'title'),
      slug: findProperty(properties, ['slug', '슬러그'], 'rich_text'),
      description: findProperty(
        properties,
        ['description', '요약', '설명', 'excerpt'],
        'rich_text'
      ),
      seriesSelect: findProperty(properties, ['series', '시리즈'], 'select'),
      seriesRich: findProperty(properties, ['series', '시리즈'], 'rich_text'),
      tags: findProperty(properties, ['tags', 'tag', '태그'], 'multi_select'),
      published: findProperty(
        properties,
        ['published', 'publish', '공개', '게시'],
        'checkbox'
      ),
      date: findProperty(properties, ['date', 'publishedat', '날짜'], 'date'),
    }
  }, [`notion-schema:${databaseId}`], {
    revalidate: CACHE_TTL_SECONDS,
    tags: [NOTION_CACHE_TAGS.schema],
  })()
}

const getDatabaseSchema = cache(async (databaseId: string): Promise<DatabaseSchema> => {
  return getDatabaseSchemaCached(databaseId)
})

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

function getPageCoverUrl(page: Pick<PageObjectResponse, 'cover'>): string | null {
  return page.cover?.type === 'external'
    ? page.cover.external.url
    : page.cover?.type === 'file'
      ? page.cover.file.url
      : null
}

function getPageIcon(page: Pick<PageObjectResponse, 'icon'>): Post['icon'] {
  return page.icon?.type === 'emoji'
    ? { type: 'emoji' as const, emoji: page.icon.emoji }
    : page.icon?.type === 'external'
      ? { type: 'image' as const, url: page.icon.external.url }
      : page.icon?.type === 'file'
        ? { type: 'image' as const, url: page.icon.file.url }
        : null
}

function getPostSource(databaseId: string): PostSource {
  if (databaseId === NEWS_DATABASE_ID) return 'news'
  if (databaseId === PORTFOLIO_DATABASE_ID) return 'portfolio'
  return 'blog'
}

function pageToPost(
  page: PageObjectResponse,
  schema: DatabaseSchema,
  source: PostSource
): Post {
  const props = page.properties as Record<string, unknown>

  const titleProp = schema.title ? props[schema.title] : undefined
  const slugProp = schema.slug ? props[schema.slug] : undefined
  const descriptionProp = schema.description ? props[schema.description] : undefined
  const seriesSelectProp = schema.seriesSelect ? props[schema.seriesSelect] : undefined
  const seriesRichProp = schema.seriesRich ? props[schema.seriesRich] : undefined
  const tagsProp = schema.tags ? props[schema.tags] : undefined
  const publishedProp = schema.published ? props[schema.published] : undefined
  const dateProp = schema.date ? props[schema.date] : undefined

  const title = extractRichText(
    (titleProp as { title?: RichText[] })?.title ?? []
  )

  const rawSlug = extractRichText(
    (slugProp as { rich_text?: RichText[] })?.rich_text ?? []
  )

  const slug = rawSlug || slugify(title) || page.id.replace(/-/g, '')

  const description = extractRichText(
    (descriptionProp as { rich_text?: RichText[] })?.rich_text ?? []
  )

  const seriesFromSelect =
    (seriesSelectProp as { select?: { name?: string } | null })?.select?.name ??
    null
  const seriesFromRich = extractRichText(
    (seriesRichProp as { rich_text?: RichText[] })?.rich_text ?? []
  )
  const series = seriesFromSelect ?? (seriesFromRich || null)

  const tags: string[] = (
    (tagsProp as { multi_select?: { name: string }[] })?.multi_select ?? []
  ).map((t) => t.name)

  const published =
    schema.published == null
      ? true
      : ((publishedProp as { checkbox?: boolean })?.checkbox ?? false)

  const date =
    ((dateProp as { date?: { start?: string } | null })?.date?.start ??
      page.created_time ??
      '')

  const cover = getPageCoverUrl(page)
  const icon = getPageIcon(page)

  return {
    id: page.id,
    title,
    slug,
    description,
    series,
    tags,
    published,
    date,
    icon,
    cover,
    source,
  }
}

async function queryAllPages(databaseId: string, params: {
  filter?: QueryDatabaseParameters['filter']
  sorts?: QueryDatabaseParameters['sorts']
}): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = []
  let cursor: string | undefined

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: params.filter,
      sorts: params.sorts,
      start_cursor: cursor,
      page_size: 100,
    })

    pages.push(
      ...response.results.filter(
        (page): page is PageObjectResponse => 'properties' in page
      )
    )

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return pages
}

// ─────────────────────────────────────────────
// Query Functions
// ─────────────────────────────────────────────

/** published=true 포스트 목록 (최신순) */
async function getPostsImpl(databaseId: string): Promise<Post[]> {
  const schema = await getDatabaseSchema(databaseId)
  const source = getPostSource(databaseId)
  const filter = schema.published
    ? { property: schema.published, checkbox: { equals: true } }
    : undefined
  const sorts = schema.date
    ? [{ property: schema.date, direction: 'descending' as const }]
    : [{ timestamp: 'created_time' as const, direction: 'descending' as const }]

  const pages = await queryAllPages(databaseId, { filter, sorts })

  return pages.map((page) => pageToPost(page, schema, source))
}

async function getPostsCached(databaseId: string): Promise<Post[]> {
  return unstable_cache(
    async () => getPostsImpl(databaseId),
    [`notion-posts:${databaseId}`],
    {
      revalidate: CACHE_TTL_SECONDS,
      tags: [NOTION_CACHE_TAGS.posts],
    }
  )()
}

export const getPosts = cache(async (): Promise<Post[]> => {
  return getPostsCached(BLOG_DATABASE_ID)
})

export const getPortfolioPosts = cache(async (): Promise<Post[]> => {
  return getPostsCached(PORTFOLIO_DATABASE_ID)
})

export const getNewsPosts = cache(async (): Promise<Post[]> => {
  return getPostsCached(NEWS_DATABASE_ID)
})

export const getAllContentPosts = cache(async (): Promise<Post[]> => {
  const postGroups = await Promise.all(
    CONTENT_DATABASE_IDS.map((databaseId) => getPostsCached(databaseId))
  )

  return postGroups
    .flat()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

async function getPostBySlugFromDatabase(
  databaseId: string,
  slug: string
): Promise<Post | null> {
  const decodedSlug = normalizeSlug(slug)
  const posts = await getPostsCached(databaseId)
  return posts.find((post) => post.slug === decodedSlug || post.slug === slug) ?? null
}

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  for (const databaseId of POST_DETAIL_DATABASE_IDS) {
    const post = await getPostBySlugFromDatabase(databaseId, slug)
    if (post) return post
  }

  return null
})

export const getNewsPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  return getPostBySlugFromDatabase(NEWS_DATABASE_ID, slug)
})

/** 특정 태그의 포스트 목록 */
async function getPostsByTagImpl(tag: string): Promise<Post[]> {
  const schema = await getDatabaseSchema(BLOG_DATABASE_ID)
  if (!schema.tags) return []

  const filter: QueryDatabaseParameters['filter'] = schema.published
    ? {
        and: [
          { property: schema.tags, multi_select: { contains: tag } },
          { property: schema.published, checkbox: { equals: true } },
        ],
      }
    : { property: schema.tags, multi_select: { contains: tag } }

  const sorts = schema.date
    ? [{ property: schema.date, direction: 'descending' as const }]
    : [{ timestamp: 'created_time' as const, direction: 'descending' as const }]

  const pages = await queryAllPages(BLOG_DATABASE_ID, {
    filter,
    sorts,
  })

  return pages.map((page) => pageToPost(page, schema, 'blog'))
}

const getPostsByTagCached = unstable_cache(
  getPostsByTagImpl,
  [`notion-posts-by-tag:${BLOG_DATABASE_ID}`],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [NOTION_CACHE_TAGS.posts],
  }
)

export const getPostsByTag = cache(async (tag: string): Promise<Post[]> => {
  return getPostsByTagCached(tag)
})

/** 전체 태그 목록 집계 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getPosts()
  const tagSet = new Set<string>()
  posts.forEach((post) => post.tags.forEach((tagName) => tagSet.add(tagName)))
  return Array.from(tagSet).sort()
}

/** 페이지 블록 트리 재귀 조회 */
async function getPageBlocksImpl(blockId: string): Promise<Block[]> {
  const blocks: Block[] = []

  let cursor: string | undefined = undefined
  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    })

    const fetched = response.results as (
      | BlockObjectResponse
      | PartialBlockObjectResponse
    )[]

    const resolvedBlocks = await Promise.all(
      fetched.map(async (block) => {
        if (!('type' in block)) return null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b = block as any

        if (b.has_children) {
          b.children = await getPageBlocks(b.id)
        }

        return b as Block
      })
    )

    blocks.push(...resolvedBlocks.filter((block): block is Block => block != null))

    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return blocks
}

const getPageBlocksCached = unstable_cache(
  getPageBlocksImpl,
  ['notion-page-blocks'],
  {
    revalidate: CACHE_TTL_SECONDS,
    tags: [NOTION_CACHE_TAGS.blocks],
  }
)

export const getPageBlocks = cache(async (blockId: string): Promise<Block[]> => {
  return getPageBlocksCached(blockId)
})

/** /posts/[slug] 용 — 블로그·포트폴리오 슬러그만 반환 (News 제외) */
export async function getAllSlugs(): Promise<string[]> {
  const groups = await Promise.all(
    POST_DETAIL_DATABASE_IDS.map((databaseId) => getPostsCached(databaseId))
  )
  const slugs = groups.flat().map((post) => post.slug).filter(Boolean)
  return Array.from(new Set(slugs))
}

/** /news/[slug] 용 — News DB 슬러그만 반환 */
export async function getAllNewsSlugs(): Promise<string[]> {
  const posts = await getPostsCached(NEWS_DATABASE_ID)
  const slugs = posts.map((post) => post.slug).filter(Boolean)
  return Array.from(new Set(slugs))
}

/** 특정 시리즈의 포스트 목록 */
export async function getPostsBySeries(series: string): Promise<Post[]> {
  const posts = await getPosts()
  return posts.filter((post) => post.series === series)
}

/** 전체 시리즈 목록 집계 */
export async function getAllSeries(): Promise<string[]> {
  const posts = await getPosts()
  const seriesSet = new Set<string>()
  posts.forEach((post) => {
    if (post.series) {
      seriesSet.add(post.series)
    }
  })
  return Array.from(seriesSet).sort()
}

export async function getPostMediaUrlsById(postId: string): Promise<PostMediaUrls | null> {
  const page = await notion.pages.retrieve({ page_id: postId })
  if (!('properties' in page)) {
    return null
  }

  const icon = getPageIcon(page)

  return {
    cover: getPageCoverUrl(page),
    iconUrl: icon?.type === 'image' ? icon.url : null,
  }
}

function hasBlockId(blocks: Block[], targetBlockId: string): boolean {
  for (const block of blocks) {
    if (block.id === targetBlockId) {
      return true
    }

    if (!('children' in block)) continue

    const children = block.children
    if (Array.isArray(children) && children.length > 0) {
      if (hasBlockId(children as Block[], targetBlockId)) {
        return true
      }
    }
  }

  return false
}

export async function getPostImageBlockUrlById(
  postId: string,
  blockId: string
): Promise<string | null> {
  const pageBlocks = await getPageBlocks(postId)
  if (!hasBlockId(pageBlocks, blockId)) {
    return null
  }

  const block = await notion.blocks.retrieve({ block_id: blockId })
  if (!('type' in block) || block.type !== 'image') {
    return null
  }

  return block.image.type === 'external'
    ? block.image.external.url
    : block.image.file.url
}

export async function getPostByPageId(postId: string): Promise<Post | null> {
  const page = await notion.pages.retrieve({ page_id: postId })

  if (!('properties' in page)) {
    return null
  }

  const parent =
    page.parent?.type === 'database_id' ? page.parent.database_id ?? null : null
  if (!parent || !CONTENT_DATABASE_IDS.includes(parent)) {
    return null
  }

  const schema = await getDatabaseSchema(parent)
  return pageToPost(page, schema, getPostSource(parent))
}
