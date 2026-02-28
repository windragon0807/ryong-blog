import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getPostByPageId, NOTION_CACHE_TAGS } from '@/lib/notion'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type NotionWebhookPayload = {
  id?: unknown
  type?: unknown
  verification_token?: unknown
  entity?: {
    id?: unknown
    type?: unknown
  }
  data?: unknown
}

function asString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a, 'utf8')
  const bBuffer = Buffer.from(b, 'utf8')
  if (aBuffer.length !== bBuffer.length) return false
  return timingSafeEqual(aBuffer, bBuffer)
}

function createNotionSignature(rawBody: string, verificationToken: string): string {
  const digest = createHmac('sha256', verificationToken).update(rawBody).digest('hex')
  return `sha256=${digest}`
}

function parsePayload(rawBody: string): NotionWebhookPayload | null {
  try {
    const parsed = JSON.parse(rawBody) as unknown
    if (!parsed || typeof parsed !== 'object') return null
    return parsed as NotionWebhookPayload
  } catch {
    return null
  }
}

function extractPageId(payload: NotionWebhookPayload): string | null {
  const entityType = asString(payload.entity?.type)?.toLowerCase()
  const entityId = asString(payload.entity?.id)
  if (entityType === 'page' && entityId) {
    return entityId
  }

  if (!payload.data || typeof payload.data !== 'object') {
    return null
  }

  const data = payload.data as Record<string, unknown>

  const pageId = asString(data.page_id)
  if (pageId) return pageId

  const page = data.page
  if (page && typeof page === 'object') {
    const pageObjectId = asString((page as Record<string, unknown>).id)
    if (pageObjectId) return pageObjectId
  }

  const parent = data.parent
  if (parent && typeof parent === 'object') {
    const parentObject = parent as Record<string, unknown>
    const parentType = asString(parentObject.type)?.toLowerCase()
    if (parentType === 'page_id') {
      return asString(parentObject.page_id)
    }
  }

  return null
}

function revalidateCommonPaths() {
  revalidateTag(NOTION_CACHE_TAGS.schema, 'max')
  revalidateTag(NOTION_CACHE_TAGS.posts, 'max')
  revalidateTag(NOTION_CACHE_TAGS.blocks, 'max')

  revalidatePath('/')
  revalidatePath('/sitemap.xml')
  revalidatePath('/api/search-index')
  revalidatePath('/posts/[slug]', 'page')
  revalidatePath('/tags/[tag]', 'page')
  revalidatePath('/series/[series]', 'page')
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  if (!rawBody) {
    return Response.json(
      { ok: false, message: 'Webhook body is required' },
      { status: 400 }
    )
  }

  const payload = parsePayload(rawBody)
  if (!payload) {
    return Response.json({ ok: false, message: 'Invalid JSON body' }, { status: 400 })
  }

  const verificationTokenFromPayload = asString(payload.verification_token)
  if (verificationTokenFromPayload) {
    console.info(
      '[notion-webhook] verification token received. Save this value as NOTION_WEBHOOK_VERIFICATION_TOKEN.',
      verificationTokenFromPayload
    )

    return Response.json({
      ok: true,
      verificationTokenReceived: true,
    })
  }

  const configuredToken = process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN?.trim()
  if (!configuredToken) {
    return Response.json(
      {
        ok: false,
        message: 'NOTION_WEBHOOK_VERIFICATION_TOKEN is not configured',
      },
      { status: 500 }
    )
  }

  const receivedSignature = asString(request.headers.get('x-notion-signature'))
  if (!receivedSignature) {
    return Response.json({ ok: false, message: 'Missing X-Notion-Signature' }, { status: 401 })
  }

  const expectedSignature = createNotionSignature(rawBody, configuredToken)
  if (!safeEqual(receivedSignature, expectedSignature)) {
    return Response.json({ ok: false, message: 'Invalid signature' }, { status: 401 })
  }

  revalidateCommonPaths()

  const pageId = extractPageId(payload)
  let revalidatedSlug: string | null = null
  const revalidatedTags: string[] = []
  let revalidatedSeries: string | null = null

  if (pageId) {
    try {
      const post = await getPostByPageId(pageId)
      if (post?.slug) {
        revalidatedSlug = post.slug
        revalidatePath(`/posts/${encodeURIComponent(post.slug)}`)
      }

      post?.tags.forEach((tag) => {
        revalidatedTags.push(tag)
        revalidatePath(`/tags/${encodeURIComponent(tag)}`)
      })

      if (post?.series) {
        revalidatedSeries = post.series
        revalidatePath(`/series/${encodeURIComponent(post.series)}`)
      }
    } catch (error) {
      console.error('[notion-webhook] failed to resolve page metadata', {
        pageId,
        error,
      })
    }
  }

  return Response.json({
    ok: true,
    eventId: asString(payload.id),
    eventType: asString(payload.type),
    pageId,
    revalidatedSlug,
    revalidatedTags,
    revalidatedSeries,
    revalidatedAt: new Date().toISOString(),
  })
}

export async function GET() {
  return Response.json({
    ok: true,
    message: 'POST Notion webhook events to this endpoint.',
  })
}
