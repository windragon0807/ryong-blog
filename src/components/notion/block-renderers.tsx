import type { ReactNode } from 'react'
import { getBookmarkMetadata, parseBookmarkUrl } from '@/lib/bookmark'
import { getHeadingId } from '@/lib/toc'
import type { Block, KnownBlock, RichText } from '@/types/notion'
import { CodeBlock } from './CodeBlock'
import { LightboxImage } from './LightboxImage'
import { RichTextRenderer } from './RichTextRenderer'

interface RendererContext {
  postId: string
  renderBlocks: (blocks: Block[]) => ReactNode
}

type RendererMap = {
  [K in KnownBlock['type']]: (
    block: Extract<KnownBlock, { type: K }>,
    context: RendererContext
  ) => ReactNode | Promise<ReactNode>
}

function richTextToPlain(richText: RichText[]): string {
  return richText.map((token) => token.plain_text).join('').trim()
}

const knownBlockRenderers = {
  paragraph: (block) => (
    <p className="my-3 leading-relaxed text-zinc-700 dark:text-zinc-200">
      <RichTextRenderer richText={block.paragraph.rich_text} />
    </p>
  ),

  heading_1: (block) => (
    <h1
      id={getHeadingId(block.id)}
      className="mt-10 mb-4 scroll-mt-24 text-3xl font-bold text-zinc-900 dark:text-zinc-100"
    >
      <RichTextRenderer richText={block.heading_1.rich_text} />
    </h1>
  ),

  heading_2: (block) => (
    <h2
      id={getHeadingId(block.id)}
      className="mt-8 mb-3 scroll-mt-24 border-b border-zinc-200 pb-2 text-2xl font-bold text-zinc-900 dark:border-zinc-600 dark:text-zinc-100"
    >
      <RichTextRenderer richText={block.heading_2.rich_text} />
    </h2>
  ),

  heading_3: (block) => (
    <h3
      id={getHeadingId(block.id)}
      className="mt-6 mb-2 scroll-mt-24 text-xl font-semibold text-zinc-900 dark:text-zinc-100"
    >
      <RichTextRenderer richText={block.heading_3.rich_text} />
    </h3>
  ),

  bulleted_list_item: (block, context) => (
    <li className="leading-relaxed text-zinc-700 dark:text-zinc-200">
      <RichTextRenderer richText={block.bulleted_list_item.rich_text} />
      {block.children && block.children.length > 0 && (
        <ul className="mt-1 list-inside list-disc space-y-1 pl-4">
          {context.renderBlocks(block.children)}
        </ul>
      )}
    </li>
  ),

  numbered_list_item: (block, context) => (
    <li className="leading-relaxed text-zinc-700 dark:text-zinc-200">
      <RichTextRenderer richText={block.numbered_list_item.rich_text} />
      {block.children && block.children.length > 0 && (
        <ol className="mt-1 list-inside list-decimal space-y-1 pl-4">
          {context.renderBlocks(block.children)}
        </ol>
      )}
    </li>
  ),

  code: (block) => (
    <CodeBlock
      blockId={block.id}
      code={block.code.rich_text.map((token) => token.plain_text).join('')}
      language={block.code.language}
      caption={block.code.caption}
    />
  ),

  image: (block, context) => {
    const src =
      block.image.type === 'external'
        ? block.image.external.url
        : block.image.file.url
    const caption = block.image.caption
    return (
      <figure className="my-6">
        <div className="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100/70 dark:border-zinc-600 dark:bg-zinc-800/55">
          <LightboxImage
            src={src}
            alt={caption.map((token) => token.plain_text).join('') || '이미지'}
            width={800}
            height={450}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.005]"
            unoptimized={src.includes('amazonaws') || src.includes('notion')}
            notionRefresh={{
              postId: context.postId,
              kind: 'block-image',
              blockId: block.id,
            }}
          />
        </div>
        {caption.length > 0 && (
          <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-300">
            <RichTextRenderer richText={caption} />
          </figcaption>
        )}
      </figure>
    )
  },

  quote: (block) => (
    <blockquote className="relative my-5 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/80 px-5 py-4 pl-6 dark:border-zinc-700 dark:bg-zinc-800/35">
      <span
        aria-hidden
        className="absolute top-0 left-0 h-full w-1.5 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-2 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/75 text-[1.35rem] font-serif leading-none text-zinc-300/85 shadow-sm dark:bg-zinc-900/45 dark:text-zinc-500/75"
      >
        “
      </span>
      <p className="relative pr-8 text-[1.03rem] leading-8 text-zinc-700 dark:text-zinc-200">
        <RichTextRenderer richText={block.quote.rich_text} />
      </p>
    </blockquote>
  ),

  callout: (block) => {
    const icon =
      block.callout.icon.type === 'emoji'
        ? block.callout.icon.emoji
        : '💡'
    return (
      <div className="my-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20">
        <span className="shrink-0 text-xl">{icon}</span>
        <p className="leading-relaxed text-zinc-700 dark:text-zinc-200">
          <RichTextRenderer richText={block.callout.rich_text} />
        </p>
      </div>
    )
  },

  divider: () => <hr className="my-8 border-zinc-200 dark:border-zinc-600" />,

  toggle: (block, context) => (
    <details className="notion-toggle my-3">
      <summary className="list-none flex cursor-pointer items-center gap-2 font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-100">
        <span className="toggle-chevron text-zinc-400 transition-transform duration-200">
          <svg
            viewBox="0 0 10 10"
            className="h-3 w-3"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M2 1.7L8 5L2 8.3Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <RichTextRenderer richText={block.toggle.rich_text} />
      </summary>
      {block.children && block.children.length > 0 && (
        <div className="pt-2 pl-6">{context.renderBlocks(block.children)}</div>
      )}
    </details>
  ),

  column_list: (block, context) => {
    const columns =
      block.children?.filter(
        (child): child is Extract<KnownBlock, { type: 'column' }> =>
          child.type === 'column'
      ) ?? []
    if (columns.length === 0) return null

    return (
      <section className="my-6 flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
        {columns.map((column) => (
          <div key={column.id} className="min-w-0 flex-1">
            {context.renderBlocks(column.children ?? [])}
          </div>
        ))}
      </section>
    )
  },

  column: (block, context) => (
    <div className="min-w-0">{context.renderBlocks(block.children ?? [])}</div>
  ),

  bookmark: async (block) => {
    const caption = richTextToPlain(block.bookmark.caption)
    const info = parseBookmarkUrl(block.bookmark.url)
    const metadata = await getBookmarkMetadata(info.href)

    const title = caption || metadata?.title || metadata?.siteName || info.host
    const description = metadata?.description
    const displayUrl = parseBookmarkUrl(metadata?.url ?? info.href).label
    const hostInitial = (metadata?.siteName || info.host).charAt(0).toUpperCase()
    const thumbnail = metadata?.image
    const favicon = metadata?.icon

    return (
      <a
        href={metadata?.url ?? info.href}
        target="_blank"
        rel="noreferrer noopener"
        className="group my-5 block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/40 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/70"
      >
        <div className="flex min-h-28 items-stretch">
          <div className="min-w-0 flex-1 px-5 py-4">
            <p className="truncate text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </p>
            {description && (
              <p className="mt-1 max-h-11 overflow-hidden text-sm leading-5 text-zinc-500 dark:text-zinc-400">
                {description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-2">
              {favicon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={favicon}
                  alt=""
                  className="h-5 w-5 shrink-0 rounded"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-100 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/35 dark:text-blue-300">
                  {hostInitial}
                </div>
              )}
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                {displayUrl}
              </p>
              <span className="shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                ↗
              </span>
            </div>
          </div>
          {thumbnail && (
            <div className="hidden w-44 shrink-0 border-l border-zinc-200/80 bg-zinc-100/60 dark:border-zinc-700 dark:bg-zinc-900/50 sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnail}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          {!thumbnail && (
            <div className="hidden w-44 shrink-0 border-l border-zinc-200/80 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:border-zinc-700 dark:from-zinc-800/50 dark:to-zinc-900/60 sm:flex sm:items-center sm:justify-center">
              <span className="text-sm text-zinc-400 dark:text-zinc-500">Bookmark</span>
            </div>
          )}
        </div>
      </a>
    )
  },
} satisfies RendererMap

export function isKnownBlock(block: Block): block is KnownBlock {
  return Object.hasOwn(knownBlockRenderers, block.type)
}

export function renderKnownBlock(
  block: KnownBlock,
  context: RendererContext
): ReactNode | Promise<ReactNode> {
  const renderer = knownBlockRenderers[block.type] as (
    value: KnownBlock,
    ctx: RendererContext
  ) => ReactNode | Promise<ReactNode>

  return renderer(block, context)
}

export function renderUnsupportedBlock(type: string): ReactNode {
  return (
    <div className="my-2 rounded bg-zinc-100 px-3 py-2 text-sm text-zinc-400 dark:bg-zinc-700 dark:text-zinc-300">
      [{type}] — 지원하지 않는 블록 타입
    </div>
  )
}
