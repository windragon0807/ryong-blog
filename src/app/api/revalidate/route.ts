import { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { NOTION_CACHE_TAGS } from '@/lib/notion'

type RevalidatePayload = {
  slug?: string
  tags?: string[]
  series?: string
}

function getRequestSecret(request: NextRequest): string | null {
  return (
    request.nextUrl.searchParams.get('secret') ??
    request.headers.get('x-revalidate-secret')
  )
}

function parsePayload(value: unknown): RevalidatePayload {
  if (!value || typeof value !== 'object') return {}
  const payload = value as Record<string, unknown>

  return {
    slug: typeof payload.slug === 'string' ? payload.slug : undefined,
    tags: Array.isArray(payload.tags)
      ? payload.tags.filter((tag): tag is string => typeof tag === 'string')
      : undefined,
    series: typeof payload.series === 'string' ? payload.series : undefined,
  }
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.NOTION_REVALIDATE_SECRET
  if (!expectedSecret) {
    return Response.json(
      { ok: false, message: 'NOTION_REVALIDATE_SECRET is not configured' },
      { status: 500 }
    )
  }

  const receivedSecret = getRequestSecret(request)
  if (!receivedSecret || receivedSecret !== expectedSecret) {
    return Response.json({ ok: false, message: 'Invalid secret' }, { status: 401 })
  }

  let payload: RevalidatePayload = {}
  try {
    payload = parsePayload(await request.json())
  } catch {
    // Empty payload is allowed.
  }

  revalidateTag(NOTION_CACHE_TAGS.schema, 'max')
  revalidateTag(NOTION_CACHE_TAGS.posts, 'max')
  revalidateTag(NOTION_CACHE_TAGS.blocks, 'max')

  revalidatePath('/')
  revalidatePath('/sitemap.xml')

  if (payload.slug) {
    revalidatePath(`/posts/${payload.slug}`)
  }

  if (payload.tags) {
    payload.tags.forEach((tag) => {
      revalidatePath(`/tags/${encodeURIComponent(tag)}`)
    })
  }

  if (payload.series) {
    revalidatePath(`/series/${encodeURIComponent(payload.series)}`)
  }

  return Response.json({
    ok: true,
    revalidatedAt: new Date().toISOString(),
    payload,
  })
}

export async function GET(request: NextRequest) {
  const expectedSecret = process.env.NOTION_REVALIDATE_SECRET
  const receivedSecret = getRequestSecret(request)

  if (!expectedSecret || receivedSecret !== expectedSecret) {
    return Response.json({ ok: false, message: 'Invalid secret' }, { status: 401 })
  }

  revalidateTag(NOTION_CACHE_TAGS.posts, 'max')
  revalidateTag(NOTION_CACHE_TAGS.blocks, 'max')
  revalidatePath('/')

  return Response.json({ ok: true, message: 'Revalidated homepage and post caches' })
}
