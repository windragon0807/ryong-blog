import type { Block, RichText } from '@/types/notion'

export interface TocHeading {
  id: string
  text: string
  level: 1 | 2 | 3
}

export function getHeadingId(blockId: string): string {
  return `heading-${blockId.replace(/-/g, '')}`
}

export function extractTocHeadings(blocks: Block[]): TocHeading[] {
  const headings: TocHeading[] = []

  const walk = (items: Block[]) => {
    for (const block of items) {
      if (block.type === 'heading_1') {
        const headingBlock = block as { heading_1: { rich_text: RichText[] } }
        headings.push({
          id: getHeadingId(block.id),
          text: getRichTextPlain(headingBlock.heading_1.rich_text),
          level: 1,
        })
      } else if (block.type === 'heading_2') {
        const headingBlock = block as { heading_2: { rich_text: RichText[] } }
        headings.push({
          id: getHeadingId(block.id),
          text: getRichTextPlain(headingBlock.heading_2.rich_text),
          level: 2,
        })
      } else if (block.type === 'heading_3') {
        const headingBlock = block as { heading_3: { rich_text: RichText[] } }
        headings.push({
          id: getHeadingId(block.id),
          text: getRichTextPlain(headingBlock.heading_3.rich_text),
          level: 3,
        })
      }

      const childBlocks = (block as { children?: Block[] }).children
      if (childBlocks && childBlocks.length > 0) {
        walk(childBlocks)
      }
    }
  }

  walk(blocks)
  return headings
}

function getRichTextPlain(richText: RichText[]): string {
  const text = richText.map((token) => token.plain_text).join('').trim()
  return text.length > 0 ? text : '제목'
}
