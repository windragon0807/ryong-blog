import type { RichText } from '@/types/notion'

interface Props {
  richText: RichText[]
}

export function RichTextRenderer({ richText }: Props) {
  return (
    <>
      {richText.map((text, i) => {
        const { bold, italic, strikethrough, underline, code } = text.annotations
        const href = text.href ?? text.text?.link?.url

        let node: React.ReactNode = text.plain_text

        if (code) {
          node = (
            <code
              key={i}
              className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-sm font-mono text-blue-700 dark:border-cyan-700/60 dark:bg-cyan-900/30 dark:text-cyan-200"
            >
              {node}
            </code>
          )
        } else {
          if (bold) node = <strong key={i}>{node}</strong>
          if (italic) node = <em key={i}>{node}</em>
          if (strikethrough) node = <s key={i}>{node}</s>
          if (underline) node = <u key={i}>{node}</u>
        }

        if (href) {
          node = (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:opacity-70 transition-opacity"
            >
              {node}
            </a>
          )
        }

        return <span key={i}>{node}</span>
      })}
    </>
  )
}
