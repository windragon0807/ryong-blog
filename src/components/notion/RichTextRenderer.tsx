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
              className="themed-inline-code inline-flex items-center rounded-md border px-1.5 py-0.5 text-sm font-mono transition-colors"
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
