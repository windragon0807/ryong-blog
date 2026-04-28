'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { RetryableImage, type NotionMediaRefreshConfig } from '@/components/RetryableImage'
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogRawContent,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  unoptimized?: boolean
  notionRefresh?: NotionMediaRefreshConfig
}

export function LightboxImage({
  src,
  alt,
  width,
  height,
  className = '',
  unoptimized = false,
  notionRefresh,
}: Props) {
  const [open, setOpen] = useState(false)
  const [aspectRatio, setAspectRatio] = useState<number>(() => {
    if (width > 0 && height > 0) {
      return width / height
    }
    return 16 / 9
  })

  useEffect(() => {
    if (!open) return

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
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in"
        style={{ aspectRatio }}
        aria-label="이미지 확대"
      >
        <RetryableImage
          key={src}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          unoptimized={unoptimized}
          notionRefresh={notionRefresh}
          onImageResolved={({ naturalWidth, naturalHeight }) => {
            setAspectRatio(naturalWidth / naturalHeight)
          }}
          skeletonClassName="absolute inset-0 animate-pulse bg-zinc-200/80 dark:bg-zinc-700/65"
        />
      </button>

      <DialogPortal>
        <DialogOverlay className="lightbox-overlay z-[90] bg-black/86" />
        <DialogRawContent className="fixed inset-0 z-[91] flex items-center justify-center p-4 outline-none">
          <DialogTitle className="sr-only">이미지 확대 보기</DialogTitle>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 rounded-full border border-white/25 bg-black/40 p-2 text-white transition-colors hover:bg-black/70"
            aria-label="이미지 닫기"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="lightbox-panel max-h-[88vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
            data-state={open ? 'open' : 'closed'}
            loading="eager"
            decoding="async"
          />
        </DialogRawContent>
      </DialogPortal>
    </Dialog>
  )
}
