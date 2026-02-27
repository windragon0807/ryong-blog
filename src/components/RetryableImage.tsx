'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface RetryableImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  maxRetries?: number
  retryDelayMs?: number
  skeletonClassName?: string
}

const DEFAULT_SKELETON_CLASS =
  'absolute inset-0 animate-pulse bg-zinc-200/75 dark:bg-zinc-700/70'

export function RetryableImage({
  maxRetries = 3,
  retryDelayMs = 450,
  skeletonClassName = DEFAULT_SKELETON_CLASS,
  className = '',
  src,
  alt,
  ...props
}: RetryableImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [retryToken, setRetryToken] = useState(0)
  const [permanentError, setPermanentError] = useState(false)
  const retryCountRef = useRef(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const srcKey = getSrcKey(src)

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
    }
  }, [])

  const handleError = () => {
    setLoaded(false)
    if (retryCountRef.current >= maxRetries) {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
        retryTimerRef.current = null
      }
      setPermanentError(true)
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
          key={`${srcKey}:${retryToken}`}
          src={src}
          alt={alt}
          {...props}
          onLoad={() => {
            if (retryTimerRef.current) {
              clearTimeout(retryTimerRef.current)
              retryTimerRef.current = null
            }
            retryCountRef.current = 0
            setLoaded(true)
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
