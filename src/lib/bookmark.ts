import { unstable_cache } from 'next/cache'
import { cache } from 'react'

export interface BookmarkMetadata {
  title: string | null
  description: string | null
  image: string | null
  icon: string | null
  siteName: string | null
  url: string
}

export interface ParsedBookmarkUrl {
  href: string
  host: string
  label: string
}

const BOOKMARK_FETCH_TIMEOUT_MS = 3500
const BOOKMARK_METADATA_REVALIDATE_SECONDS = 60 * 60 * 24

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function extractMetaContent(html: string, keys: string[]): string | null {
  for (const key of keys) {
    const escaped = escapeRegex(key)
    const patterns = [
      new RegExp(
        `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']+)["'][^>]*>`,
        'i'
      ),
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${escaped}["'][^>]*>`,
        'i'
      ),
    ]

    for (const pattern of patterns) {
      const matched = html.match(pattern)
      if (matched?.[1]) return decodeHtml(matched[1])
    }
  }

  return null
}

function extractTitle(html: string): string | null {
  const matched = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  if (!matched?.[1]) return null
  return decodeHtml(matched[1])
}

function extractIconHref(html: string): string | null {
  const patterns = [
    /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i,
    /<link[^>]+href=["']([^"']+)["'][^>]*rel=["'][^"']*icon[^"']*["'][^>]*>/i,
  ]

  for (const pattern of patterns) {
    const matched = html.match(pattern)
    if (matched?.[1]) return decodeHtml(matched[1])
  }

  return null
}

function toAbsoluteUrl(baseUrl: string, maybeRelativeUrl: string | null): string | null {
  if (!maybeRelativeUrl) return null
  try {
    return new URL(maybeRelativeUrl, baseUrl).toString()
  } catch {
    return null
  }
}

function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase()

  if (host === 'localhost' || host === '::1' || host === '0.0.0.0') return true
  if (host.endsWith('.local')) return true
  if (/^127\./.test(host)) return true
  if (/^10\./.test(host)) return true
  if (/^192\.168\./.test(host)) return true
  if (/^169\.254\./.test(host)) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true

  return false
}

function sanitizeUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null
    if (isBlockedHost(parsed.hostname)) return null
    return parsed.toString()
  } catch {
    return null
  }
}

export function parseBookmarkUrl(url: string): ParsedBookmarkUrl {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    const pathname = parsed.pathname === '/' ? '' : parsed.pathname
    return {
      href: parsed.toString(),
      host,
      label: `${host}${pathname}`,
    }
  } catch {
    return {
      href: url,
      host: 'external-link',
      label: url,
    }
  }
}

async function getBookmarkMetadataImpl(rawUrl: string): Promise<BookmarkMetadata | null> {
  const safeUrl = sanitizeUrl(rawUrl)
  if (!safeUrl) return null

  try {
    const response = await fetch(safeUrl, {
      redirect: 'follow',
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(BOOKMARK_FETCH_TIMEOUT_MS),
      cache: 'no-store',
    })

    if (!response.ok) return null

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html')) return null

    const html = (await response.text()).slice(0, 350_000)
    const resolvedUrl = response.url || safeUrl

    const title = extractMetaContent(html, ['og:title', 'twitter:title']) ?? extractTitle(html)
    const description = extractMetaContent(html, [
      'og:description',
      'twitter:description',
      'description',
    ])
    const image = toAbsoluteUrl(
      resolvedUrl,
      extractMetaContent(html, ['og:image:secure_url', 'og:image', 'twitter:image'])
    )
    const icon = toAbsoluteUrl(resolvedUrl, extractIconHref(html))
    const siteName = extractMetaContent(html, ['og:site_name', 'twitter:site'])
    const canonical = toAbsoluteUrl(
      resolvedUrl,
      extractMetaContent(html, ['og:url']) ?? resolvedUrl
    )

    return {
      title,
      description,
      image,
      icon,
      siteName,
      url: canonical ?? safeUrl,
    }
  } catch {
    return null
  }
}

const getBookmarkMetadataCached = unstable_cache(
  getBookmarkMetadataImpl,
  ['bookmark-og-metadata'],
  {
    revalidate: BOOKMARK_METADATA_REVALIDATE_SECONDS,
  }
)

export const getBookmarkMetadata = cache(async (rawUrl: string) => {
  return getBookmarkMetadataCached(rawUrl)
})
