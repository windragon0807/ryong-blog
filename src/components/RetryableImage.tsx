'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useRef, useState } from 'react'

type NotionMediaRefreshConfig = {
  postId: string
  kind: 'cover' | 'icon'
}

interface RetryableImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  maxRetries?: number
  retryDelayMs?: number
  skeletonClassName?: string
  notionRefresh?: NotionMediaRefreshConfig
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

  const tryRefreshNotionMedia = async () => {
    if (!notionRefresh || refreshAttemptedRef.current) {
      setPermanentError(true)
      return
    }

    refreshAttemptedRef.current = true
    const refreshedUrl = await resolveNotionMediaUrl(notionRefresh)

    if (!mountedRef.current) return
    if (!refreshedUrl || refreshedUrl === getSrcKey(currentSrc)) {
      setPermanentError(true)
      return
    }

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }

    retryCountRef.current = 0
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
          onLoad={() => {
            if (retryTimerRef.current) {
              clearTimeout(retryTimerRef.current)
              retryTimerRef.current = null
            }
            retryCountRef.current = 0
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

async function resolveNotionMediaUrl(config: NotionMediaRefreshConfig): Promise<string | null> {
  const cacheKey = `${config.postId}:${config.kind}`
  const cached = resolvedNotionMediaCache.get(cacheKey)
  if (cached) return cached

  const inflight = inflightNotionMediaRequests.get(cacheKey)
  if (inflight) return inflight

  const request = fetch(
    `/api/notion-media?postId=${encodeURIComponent(config.postId)}&kind=${encodeURIComponent(config.kind)}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  )
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
