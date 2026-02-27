export interface Post {
  id: string
  title: string
  slug: string
  description: string
  series: string | null
  tags: string[]
  published: boolean
  date: string
  icon: PostIcon | null
  cover: string | null
}

export type PostIcon =
  | { type: 'emoji'; emoji: string }
  | { type: 'image'; url: string }

// ─── Notion Block Types (discriminated union) ───

interface BlockBase {
  id: string
  has_children: boolean
}

export interface ParagraphBlock extends BlockBase {
  type: 'paragraph'
  paragraph: { rich_text: RichText[] }
}

export interface Heading1Block extends BlockBase {
  type: 'heading_1'
  heading_1: { rich_text: RichText[]; is_toggleable: boolean }
}

export interface Heading2Block extends BlockBase {
  type: 'heading_2'
  heading_2: { rich_text: RichText[]; is_toggleable: boolean }
}

export interface Heading3Block extends BlockBase {
  type: 'heading_3'
  heading_3: { rich_text: RichText[]; is_toggleable: boolean }
}

export interface BulletedListBlock extends BlockBase {
  type: 'bulleted_list_item'
  bulleted_list_item: { rich_text: RichText[] }
  children?: Block[]
}

export interface NumberedListBlock extends BlockBase {
  type: 'numbered_list_item'
  numbered_list_item: { rich_text: RichText[] }
  children?: Block[]
}

export interface CodeBlock extends BlockBase {
  type: 'code'
  code: {
    rich_text: RichText[]
    language: string
    caption: RichText[]
  }
}

export interface ImageBlock extends BlockBase {
  type: 'image'
  image:
    | { type: 'external'; external: { url: string }; caption: RichText[] }
    | { type: 'file'; file: { url: string; expiry_time: string }; caption: RichText[] }
}

export interface QuoteBlock extends BlockBase {
  type: 'quote'
  quote: { rich_text: RichText[] }
}

export interface CalloutBlock extends BlockBase {
  type: 'callout'
  callout: {
    rich_text: RichText[]
    icon: { type: 'emoji'; emoji: string } | { type: 'external'; external: { url: string } }
  }
}

export interface DividerBlock extends BlockBase {
  type: 'divider'
}

export interface ToggleBlock extends BlockBase {
  type: 'toggle'
  toggle: { rich_text: RichText[] }
  children?: Block[]
}

export interface ColumnListBlock extends BlockBase {
  type: 'column_list'
  children?: Block[]
}

export interface ColumnBlock extends BlockBase {
  type: 'column'
  children?: Block[]
}

export interface BookmarkBlock extends BlockBase {
  type: 'bookmark'
  bookmark: {
    url: string
    caption: RichText[]
  }
}

// 알려진 블록 타입만 유니온으로 구성 (switch default로 미지원 타입 처리)
export type KnownBlock =
  | ParagraphBlock
  | Heading1Block
  | Heading2Block
  | Heading3Block
  | BulletedListBlock
  | NumberedListBlock
  | CodeBlock
  | ImageBlock
  | QuoteBlock
  | CalloutBlock
  | DividerBlock
  | ToggleBlock
  | ColumnListBlock
  | ColumnBlock
  | BookmarkBlock

// Notion API에서 오는 모든 블록 (알 수 없는 타입 포함)
export type Block = KnownBlock | (BlockBase & { type: string })

export interface RichText {
  type: 'text' | 'mention' | 'equation'
  plain_text: string
  href: string | null
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  text?: {
    content: string
    link: { url: string } | null
  }
}
