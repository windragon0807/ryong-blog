'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useRef, useState } from 'react'

export type NotionMediaRefreshConfig =
  | {
      postId: string
      kind: 'cover' | 'icon'
    }
  | {
      postId: string
      kind: 'block-image'
      blockId: string
    }

interface RetryableImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  maxRetries?: number
  retryDelayMs?: number
  skeletonClassName?: string
  notionRefresh?: NotionMediaRefreshConfig
  onImageResolved?: (dimensions: { naturalWidth: number; naturalHeight: number }) => void
}

const DEFAULT_SKELETON_CLASS =
  'absolute inset-0 animate-pulse bg-zinc-200/75 dark:bg-zinc-700/70'

const resolvedNotionMediaCache = new Map<string, string>()
const inflightNotionMediaRequests = new Map<string, Promise<string | null>>()

export function RetryableImage({
  maxRetries = 3,
  retryDelayMs = 450,
  skeletonClassName = DEFAULT_SKELETON_CLASS,
  notionRefresh,
  onImageResolved,
  className = '',
  src,
  alt,
  ...props
}: RetryableImageProps) {
  const [currentSrc, setCurrentSrc] = useState<ImageProps['src']>(src)
  const [loaded, setLoaded] = useState(false)
  const [retryToken, setRetryToken] = useState(0)
  const [permanentError, setPermanentError] = useState(false)
  const retryCountRef = useRef(0)
  const backgroundRetryCountRef = useRef(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)
  const refreshAttemptedRef = useRef(false)

  const currentSourceKey = getSrcKey(currentSrc)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
    }
  }, [])

  const scheduleBackgroundRetry = () => {
    backgroundRetryCountRef.current += 1
    const delay = Math.min(12_000, retryDelayMs * (maxRetries + backgroundRetryCountRef.current))

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
    }

    retryTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return

      refreshAttemptedRef.current = false
      setPermanentError(false)
      setLoaded(false)
      setRetryToken((previousToken) => previousToken + 1)
    }, delay)
  }

  const tryRefreshNotionMedia = async () => {
    if (!notionRefresh) {
      setPermanentError(true)
      return
    }

    if (refreshAttemptedRef.current) return

    refreshAttemptedRef.current = true
    let refreshedUrl = await resolveNotionMediaUrl(notionRefresh)
    const currentSrcKey = getSrcKey(currentSrc)

    // If cached URL is the same stale URL, force one uncached refresh attempt.
    if (refreshedUrl && refreshedUrl === currentSrcKey) {
      clearNotionMediaCache(notionRefresh)
      refreshedUrl = await resolveNotionMediaUrl(notionRefresh, { forceRefresh: true })
    }

    if (!mountedRef.current) return
    refreshAttemptedRef.current = false

    if (!refreshedUrl || refreshedUrl === currentSrcKey) {
      setPermanentError(true)
      scheduleBackgroundRetry()
      return
    }

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }

    retryCountRef.current = 0
    backgroundRetryCountRef.current = 0
    setPermanentError(false)
    setLoaded(false)
    setCurrentSrc(refreshedUrl)
    setRetryToken((previousToken) => previousToken + 1)
  }

  const handleError = () => {
    setLoaded(false)
    if (retryCountRef.current >= maxRetries) {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
        retryTimerRef.current = null
      }
      void tryRefreshNotionMedia()
      return
    }

    retryCountRef.current += 1
    const delay = retryDelayMs * retryCountRef.current
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
    }
    retryTimerRef.current = setTimeout(() => {
      setRetryToken((previousToken) => previousToken + 1)
    }, delay)
  }

  return (
    <>
      {!loaded && (
        <div
          aria-hidden
          className={skeletonClassName}
        />
      )}
      {!permanentError && (
        <Image
          key={`${currentSourceKey}:${retryToken}`}
          src={currentSrc}
          alt={alt}
          {...props}
          onLoad={(event) => {
            if (retryTimerRef.current) {
              clearTimeout(retryTimerRef.current)
              retryTimerRef.current = null
            }
            retryCountRef.current = 0
            backgroundRetryCountRef.current = 0
            refreshAttemptedRef.current = false

            const imageElement = event.currentTarget
            if (onImageResolved && imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0) {
              onImageResolved({
                naturalWidth: imageElement.naturalWidth,
                naturalHeight: imageElement.naturalHeight,
              })
            }

            if (mountedRef.current) {
              setLoaded(true)
            }
          }}
          onError={handleError}
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`.trim()}
        />
      )}
    </>
  )
}

function getSrcKey(src: ImageProps['src']): string {
  if (typeof src === 'string') return src
  if ('src' in src) return src.src
  return src.default.src
}

async function resolveNotionMediaUrl(
  config: NotionMediaRefreshConfig,
  options?: { forceRefresh?: boolean }
): Promise<string | null> {
  const cacheKey = getNotionMediaCacheKey(config)
  if (options?.forceRefresh) {
    return requestNotionMediaUrl(config, cacheKey, { forceRefresh: true })
  }

  const cached = resolvedNotionMediaCache.get(cacheKey)
  if (cached) return cached

  const inflight = inflightNotionMediaRequests.get(cacheKey)
  if (inflight) return inflight
  return requestNotionMediaUrl(config, cacheKey)
}

function clearNotionMediaCache(config: NotionMediaRefreshConfig) {
  const cacheKey = getNotionMediaCacheKey(config)
  resolvedNotionMediaCache.delete(cacheKey)
  inflightNotionMediaRequests.delete(cacheKey)
}

function getNotionMediaCacheKey(config: NotionMediaRefreshConfig): string {
  return config.kind === 'block-image'
    ? `${config.postId}:${config.kind}:${config.blockId}`
    : `${config.postId}:${config.kind}`
}

async function requestNotionMediaUrl(
  config: NotionMediaRefreshConfig,
  cacheKey: string,
  options?: { forceRefresh?: boolean }
): Promise<string | null> {
  if (options?.forceRefresh) {
    resolvedNotionMediaCache.delete(cacheKey)
    inflightNotionMediaRequests.delete(cacheKey)
  }

  const query = new URLSearchParams({
    postId: config.postId,
    kind: config.kind,
  })

  if (config.kind === 'block-image') {
    query.set('blockId', config.blockId)
  }

  const request = fetch(`/api/notion-media?${query.toString()}`, {
    method: 'GET',
    cache: 'no-store',
  })
    .then(async (response) => {
      if (!response.ok) return null
      const data = (await response.json()) as { url?: string | null }
      const refreshedUrl = typeof data.url === 'string' ? data.url : null

      if (refreshedUrl) {
        resolvedNotionMediaCache.set(cacheKey, refreshedUrl)
      }
      return refreshedUrl
    })
    .catch(() => null)
    .finally(() => {
      inflightNotionMediaRequests.delete(cacheKey)
    })

  inflightNotionMediaRequests.set(cacheKey, request)
  return request
}
