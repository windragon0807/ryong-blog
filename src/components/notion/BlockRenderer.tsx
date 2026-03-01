import type { ReactNode } from 'react'
import type { Block } from '@/types/notion'
import {
  isKnownBlock,
  renderKnownBlock,
  renderUnsupportedBlock,
} from './block-renderers'

interface Props {
  postId: string
  blocks: Block[]
}

type ListBlockType = 'bulleted_list_item' | 'numbered_list_item'

export function BlockRenderer({ postId, blocks }: Props) {
  return (
    <div className="notion-content">
      <BlockList postId={postId} blocks={blocks} />
    </div>
  )
}

function BlockList({ postId, blocks }: { postId: string; blocks: Block[] }) {
  const elements: ReactNode[] = []
  let index = 0

  while (index < blocks.length) {
    const currentBlock = blocks[index]

    if (isListBlockType(currentBlock.type)) {
      const { items, nextIndex } = collectContiguousListItems(
        blocks,
        index,
        currentBlock.type
      )
      elements.push(renderListGroup(postId, currentBlock.type, items))
      index = nextIndex
      continue
    }

    elements.push(<BlockNode key={currentBlock.id} postId={postId} block={currentBlock} />)
    index++
  }

  return <>{elements}</>
}

function isListBlockType(type: string): type is ListBlockType {
  return type === 'bulleted_list_item' || type === 'numbered_list_item'
}

function collectContiguousListItems(
  blocks: Block[],
  startIndex: number,
  listType: ListBlockType
): { items: Block[]; nextIndex: number } {
  const items: Block[] = []
  let index = startIndex

  while (index < blocks.length && blocks[index].type === listType) {
    items.push(blocks[index])
    index++
  }

  return { items, nextIndex: index }
}

function renderListGroup(postId: string, listType: ListBlockType, items: Block[]): ReactNode {
  const listClass = 'my-3 list-inside space-y-1 pl-4'

  if (listType === 'bulleted_list_item') {
    return (
      <ul key={items[0].id} className={`list-disc ${listClass}`}>
        {items.map((item) => (
          <BlockNode key={item.id} postId={postId} block={item} />
        ))}
      </ul>
    )
  }

  return (
    <ol key={items[0].id} className={`list-decimal ${listClass}`}>
      {items.map((item) => (
        <BlockNode key={item.id} postId={postId} block={item} />
      ))}
    </ol>
  )
}

async function BlockNode({ postId, block }: { postId: string; block: Block }) {
  if (!isKnownBlock(block)) {
    return renderUnsupportedBlock(block.type)
  }

  return renderKnownBlock(block, {
    postId,
    renderBlocks: (nestedBlocks) =>
      nestedBlocks.length > 0 ? <BlockList postId={postId} blocks={nestedBlocks} /> : null,
  })
}
