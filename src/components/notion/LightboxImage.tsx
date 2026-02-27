'use client'

import { useEffect, useState } from 'react'
import { RetryableImage } from '@/components/RetryableImage'
import { useAnimatedPresence } from '@/hooks/useAnimatedPresence'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  unoptimized?: boolean
}

export function LightboxImage({
  src,
  alt,
  width,
  height,
  className = '',
  unoptimized = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const { isMounted, state } = useAnimatedPresence(open, {
    enterDelayMs: 16,
    exitDurationMs: 180,
  })

  useEffect(() => {
    if (!isMounted) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isMounted])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in"
        aria-label="이미지 확대"
      >
        <RetryableImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          unoptimized={unoptimized}
          skeletonClassName="absolute inset-0 animate-pulse bg-zinc-200/80 dark:bg-zinc-700/65"
        />
      </button>

      {isMounted && (
        <div
          className="lightbox-overlay fixed inset-0 z-[90] flex items-center justify-center bg-black/86 p-4"
          data-state={state}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 rounded-full border border-white/25 bg-black/40 p-2 text-white transition-colors hover:bg-black/70"
            aria-label="이미지 닫기"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="lightbox-panel max-h-[88vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
            data-state={state}
            onClick={(event) => event.stopPropagation()}
            loading="eager"
            decoding="async"
          />
        </div>
      )}
    </>
  )
}
