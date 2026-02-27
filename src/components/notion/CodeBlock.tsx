import Image from 'next/image'
import { codeToHtml } from 'shiki'
import type { RichText } from '@/types/notion'
import { SHIKI_THEME_RECORD } from '@/lib/codeThemes'
import { getCodeLanguageIconSrc } from '@/lib/codeLanguageIcons'
import { RichTextRenderer } from './RichTextRenderer'
import { CodeCopyButton } from './CodeCopyButton'

interface Props {
  code: string
  language: string
  caption: RichText[]
}

export async function CodeBlock({ code, language, caption }: Props) {
  const normalizedLang = normalizeLanguage(language, code)
  const languageIconSrc = getCodeLanguageIconSrc(normalizedLang)

  const html = await codeToHtml(code, {
    lang: normalizedLang,
    themes: SHIKI_THEME_RECORD,
    defaultColor: false,
  })

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
          </div>
          <CodeCopyButton code={code} />
        </div>
        {/* code */}
        <div className="bg-white dark:bg-zinc-800">
          <div
            className="[&>pre]:!bg-transparent [&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:text-sm [&>pre]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      {caption.length > 0 && (
        <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-300">
          <RichTextRenderer richText={caption} />
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
