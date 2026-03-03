'use client'

import { useEffect, useRef, useState } from 'react'

type PdfPageImage = {
  page: number
  src: string
  width: number
  height: number
  links: PdfPageLink[]
}

type PdfPageLink = {
  href: string
  left: number
  top: number
  width: number
  height: number
}

function RefreshIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path
        d="M20 11a8 8 0 1 0 2.3 5.7M20 11V4m0 7h-7"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function normalizeError(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'PDF를 불러오는 중 문제가 발생했습니다.'
}

function isSafeLinkUrl(url: string) {
  return /^(https?:|mailto:|tel:)/i.test(url)
}

export function ResumePdfViewer({ pdfUrl }: { pdfUrl: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [pages, setPages] = useState<PdfPageImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [renderVersion, setRenderVersion] = useState(0)

  useEffect(() => {
    const target = containerRef.current
    if (!target) return undefined

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const nextWidth = Math.floor(entry.contentRect.width)
      if (nextWidth > 0) {
        setContainerWidth(nextWidth)
      }
    })

    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!containerWidth) return undefined

    let cancelled = false
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        const { getDocument, GlobalWorkerOptions, version } = pdfjs

        GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`

        const loadingTask = getDocument({
          url: pdfUrl,
          useWorkerFetch: true,
          withCredentials: false,
          cMapPacked: true,
        })

        const pdf = await loadingTask.promise
        const outputScale = Math.min(window.devicePixelRatio || 1, 2)
        const renderedPages: PdfPageImage[] = []

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled) return

          const page = await pdf.getPage(pageNumber)
          const baseViewport = page.getViewport({ scale: 1 })
          const fitScale = containerWidth / baseViewport.width
          const renderViewport = page.getViewport({ scale: fitScale * outputScale })

          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.floor(renderViewport.width))
          canvas.height = Math.max(1, Math.floor(renderViewport.height))

          const canvasContext = canvas.getContext('2d', { alpha: false })
          if (!canvasContext) {
            throw new Error('캔버스 컨텍스트를 생성할 수 없습니다.')
          }

          await page.render({
            canvas,
            canvasContext,
            viewport: renderViewport,
          }).promise

          const layoutViewport = page.getViewport({ scale: fitScale })
          const annotations = await page.getAnnotations()
          const links: PdfPageLink[] = []

          for (const annotation of annotations as Array<Record<string, unknown>>) {
            if (annotation.subtype !== 'Link') continue

            const hrefCandidate =
              (typeof annotation.url === 'string' && annotation.url) ||
              (typeof annotation.unsafeUrl === 'string' && annotation.unsafeUrl) ||
              null

            if (!hrefCandidate || !isSafeLinkUrl(hrefCandidate)) continue

            const rect = Array.isArray(annotation.rect) ? annotation.rect : null
            if (!rect || rect.length !== 4) continue

            const viewportRect = layoutViewport.convertToViewportRectangle([
              Number(rect[0]),
              Number(rect[1]),
              Number(rect[2]),
              Number(rect[3]),
            ])

            const left = Math.max(0, Math.min(viewportRect[0], viewportRect[2]))
            const top = Math.max(0, Math.min(viewportRect[1], viewportRect[3]))
            const width = Math.abs(viewportRect[0] - viewportRect[2])
            const height = Math.abs(viewportRect[1] - viewportRect[3])

            if (width < 2 || height < 2) continue

            links.push({
              href: hrefCandidate,
              left,
              top,
              width,
              height,
            })
          }

          renderedPages.push({
            page: pageNumber,
            src: canvas.toDataURL('image/jpeg', 0.94),
            width: layoutViewport.width,
            height: layoutViewport.height,
            links,
          })
        }

        if (cancelled) return
        setPages(renderedPages)
      } catch (caughtError) {
        if (cancelled) return
        setError(normalizeError(caughtError))
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [containerWidth, pdfUrl, renderVersion])

  const cardClassName =
    'overflow-hidden rounded-2xl border border-zinc-200/85 bg-white shadow-[0_16px_45px_-30px_rgba(15,23,42,0.4)] dark:border-zinc-700/80 dark:bg-zinc-950 dark:shadow-[0_18px_44px_-30px_rgba(2,6,23,0.75)]'

  return (
    <div ref={containerRef} className={cardClassName}>
      {loading && (
        <div className="aspect-[210/297] animate-pulse bg-zinc-100 dark:bg-zinc-800" />
      )}

      {!loading && error && (
        <div className="p-4">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-800/60 dark:bg-rose-900/20 dark:text-rose-300">
            <p className="font-medium">PDF를 렌더링할 수 없습니다.</p>
            <p className="mt-1 break-all text-xs opacity-90">{error}</p>
            <button
              type="button"
              onClick={() => setRenderVersion((version) => version + 1)}
              className="mt-3 inline-flex items-center gap-2 rounded-md border border-rose-300 px-3 py-1.5 text-xs font-medium transition hover:bg-rose-100 dark:border-rose-700 dark:hover:bg-rose-900/40"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              다시 렌더링
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="divide-y divide-zinc-200/85 dark:divide-zinc-700/75">
          {pages.map((page) => (
            <figure key={page.page} className="relative bg-white dark:bg-zinc-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={page.src}
                alt={`이력서 PDF ${page.page} 페이지`}
                className="block w-full"
                loading={page.page <= 2 ? 'eager' : 'lazy'}
              />
              {page.links.map((link, index) => (
                <a
                  key={`${page.page}-${index}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`PDF 링크 열기: ${link.href}`}
                  className="absolute rounded-[2px] bg-transparent transition-colors hover:bg-sky-500/10 focus-visible:bg-sky-500/15 focus-visible:outline-none"
                  style={{
                    left: `${(link.left / page.width) * 100}%`,
                    top: `${(link.top / page.height) * 100}%`,
                    width: `${(link.width / page.width) * 100}%`,
                    height: `${(link.height / page.height) * 100}%`,
                  }}
                />
              ))}
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
