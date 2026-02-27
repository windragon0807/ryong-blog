import Image from 'next/image'
import { codeToHtml } from 'shiki'
import type { RichText } from '@/types/notion'
import { SHIKI_THEME_RECORD } from '@/lib/codeThemes'
import { getCodeLanguageIconSrc } from '@/lib/codeLanguageIcons'
import { RichTextRenderer } from './RichTextRenderer'
import { CodeCopyButton } from './CodeCopyButton'

interface Props {
  blockId: string
  code: string
  language: string
  caption: RichText[]
}

export async function CodeBlock({ blockId, code, language, caption }: Props) {
  const normalizedLang = normalizeLanguage(language, code)
  const languageIconSrc = getCodeLanguageIconSrc(normalizedLang)
  const { fileName, highlightLines, visibleCaption } = parseCaption(caption)

  const html = await codeToHtml(code, {
    lang: normalizedLang,
    themes: SHIKI_THEME_RECORD,
    defaultColor: false,
  })
  const decoratedHtml = decorateCodeHtml(html, blockId, highlightLines)

  return (
    <div className="my-6 notion-code">
      <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-600">
        {/* language badge */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-700 border-b border-zinc-200 dark:border-zinc-600">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[5px]">
              <Image
                src={languageIconSrc}
                alt=""
                aria-hidden
                width={16}
                height={16}
                unoptimized
                className="h-full w-full object-contain"
              />
            </span>
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-300">
              {language}
            </span>
            {fileName && (
              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {fileName}
              </span>
            )}
          </div>
          <CodeCopyButton code={code} />
        </div>
        {/* code */}
        <div className="bg-white dark:bg-zinc-800">
          <div
            className="[&>pre]:!bg-transparent [&>pre]:px-0 [&>pre]:py-3 [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: decoratedHtml }}
          />
        </div>
      </div>
      {visibleCaption.length > 0 && (
        <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-300">
          <RichTextRenderer richText={visibleCaption} />
        </p>
      )}
    </div>
  )
}

function normalizeLanguage(lang: string, code: string): string {
  const map: Record<string, string> = {
    'plain text': 'text',
    'plain_text': 'text',
    shell: 'bash',
    sh: 'bash',
  }
  const normalized = map[lang.toLowerCase()] ?? lang.toLowerCase()

  // Notion language is often "typescript"/"javascript" even when snippet is JSX-like.
  // Switching to tsx/jsx improves tokenization quality noticeably.
  const jsxLike = /<\/?[A-Za-z][^>]*>/.test(code) || /className=/.test(code)
  if (jsxLike && (normalized === 'typescript' || normalized === 'ts')) return 'tsx'
  if (jsxLike && (normalized === 'javascript' || normalized === 'js')) return 'jsx'

  return normalized
}

function parseCaption(caption: RichText[]): {
  fileName: string | null
  highlightLines: Set<number>
  visibleCaption: RichText[]
} {
  const plain = caption.map((token) => token.plain_text).join('').trim()
  if (!plain) {
    return { fileName: null, highlightLines: new Set(), visibleCaption: caption }
  }

  const metaMatch = plain.match(/\{([\d,\-\s]+)\}\s*$/)
  const highlightLines = parseLineRanges(metaMatch?.[1] ?? '')
  const plainWithoutMeta = plain.replace(/\{([\d,\-\s]+)\}\s*$/, '').trim()

  const fileNameCandidate = plainWithoutMeta.split(/\s+/)[0]
  const looksLikeFileName =
    /[\\/]/.test(fileNameCandidate) || /\.[a-z0-9]+$/i.test(fileNameCandidate)

  const fileName = looksLikeFileName ? fileNameCandidate : null
  const visibleCaption = fileName ? [] : caption

  return { fileName, highlightLines, visibleCaption }
}

function parseLineRanges(input: string): Set<number> {
  const output = new Set<number>()
  if (!input.trim()) return output

  input.split(',').forEach((segment) => {
    const value = segment.trim()
    if (!value) return

    if (value.includes('-')) {
      const [fromRaw, toRaw] = value.split('-', 2)
      const from = Number(fromRaw)
      const to = Number(toRaw)
      if (!Number.isFinite(from) || !Number.isFinite(to)) return
      const start = Math.max(1, Math.min(from, to))
      const end = Math.max(start, Math.max(from, to))
      for (let line = start; line <= end; line += 1) {
        output.add(line)
      }
      return
    }

    const line = Number(value)
    if (Number.isFinite(line) && line > 0) {
      output.add(line)
    }
  })

  return output
}

function decorateCodeHtml(
  html: string,
  blockId: string,
  highlightLines: Set<number>
): string {
  const match = html.match(/<code>([\s\S]*?)<\/code>/)
  if (!match?.[1]) return html

  const content = match[1]
  const lines = content.split('\n')
  const safeBlockId = blockId.replace(/[^a-zA-Z0-9_-]/g, '')

  const decorated = lines
    .map((lineHtml, index) => {
      const line = index + 1
      const lineId = `code-${safeBlockId}-L${line}`
      const highlighted = highlightLines.has(line)
      const classes = highlighted ? 'code-line code-line--highlighted' : 'code-line'
      const lineContent = lineHtml.length > 0 ? lineHtml : '&nbsp;'

      return `<span class="${classes}" data-line="${line}" id="${lineId}"><a class="code-line-anchor" href="#${lineId}" aria-label="라인 ${line}" tabindex="-1">${line}</a><span class="code-line-content">${lineContent}</span></span>`
    })
    .join('')

  return html.replace(content, decorated)
}
