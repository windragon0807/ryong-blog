import { NextRequest } from 'next/server'
import { getPostImageBlockUrlById, getPostMediaUrlsById, getPosts } from '@/lib/notion'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type MediaKind = 'cover' | 'icon' | 'block-image'

function isMediaKind(value: string | null): value is MediaKind {
  return value === 'cover' || value === 'icon' || value === 'block-image'
}

function noStoreHeaders() {
  return {
    'Cache-Control': 'no-store, max-age=0',
  }
}

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId')?.trim() ?? ''
  const blockId = request.nextUrl.searchParams.get('blockId')?.trim() ?? ''
  const kindParam = request.nextUrl.searchParams.get('kind')

  if (
    !postId ||
    !isMediaKind(kindParam) ||
    (kindParam === 'block-image' && !blockId)
  ) {
    return Response.json(
      {
        ok: false,
        message: 'postId and kind(cover|icon|block-image) are required',
      },
      { status: 400, headers: noStoreHeaders() }
    )
  }

  try {
    const posts = await getPosts()
    const isPublishedPost = posts.some((post) => post.id === postId)
    if (!isPublishedPost) {
      return Response.json({ ok: false, message: 'Post not found' }, { status: 404 })
    }

    let resolvedUrl: string | null = null
    if (kindParam === 'block-image') {
      resolvedUrl = await getPostImageBlockUrlById(postId, blockId)
    } else {
      const media = await getPostMediaUrlsById(postId)
      resolvedUrl = kindParam === 'cover' ? media?.cover ?? null : media?.iconUrl ?? null
    }

    if (!resolvedUrl) {
      return Response.json(
        { ok: false, message: 'Media not found', url: null },
        { status: 404, headers: noStoreHeaders() }
      )
    }

    return Response.json({ ok: true, url: resolvedUrl }, { headers: noStoreHeaders() })
  } catch {
    return Response.json(
      { ok: false, message: 'Failed to refresh notion media', url: null },
      { status: 500, headers: noStoreHeaders() }
    )
  }
}
