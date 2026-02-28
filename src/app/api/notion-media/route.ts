import { NextRequest } from 'next/server'
import { getPostMediaUrlsById, getPosts } from '@/lib/notion'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type MediaKind = 'cover' | 'icon'

function isMediaKind(value: string | null): value is MediaKind {
  return value === 'cover' || value === 'icon'
}

function noStoreHeaders() {
  return {
    'Cache-Control': 'no-store, max-age=0',
  }
}

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId')?.trim() ?? ''
  const kindParam = request.nextUrl.searchParams.get('kind')

  if (!postId || !isMediaKind(kindParam)) {
    return Response.json(
      { ok: false, message: 'postId and kind(cover|icon) are required' },
      { status: 400, headers: noStoreHeaders() }
    )
  }

  try {
    const posts = await getPosts()
    const isPublishedPost = posts.some((post) => post.id === postId)
    if (!isPublishedPost) {
      return Response.json({ ok: false, message: 'Post not found' }, { status: 404 })
    }

    const media = await getPostMediaUrlsById(postId)
    const url = kindParam === 'cover' ? media?.cover : media?.iconUrl

    if (!url) {
      return Response.json(
        { ok: false, message: 'Media not found', url: null },
        { status: 404, headers: noStoreHeaders() }
      )
    }

    return Response.json({ ok: true, url }, { headers: noStoreHeaders() })
  } catch {
    return Response.json(
      { ok: false, message: 'Failed to refresh notion media', url: null },
      { status: 500, headers: noStoreHeaders() }
    )
  }
}
