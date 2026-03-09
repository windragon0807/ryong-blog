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

function ResumePdfLoadingSkeleton() {
  const lineClassName = 'rounded-full bg-zinc-300/72 dark:bg-zinc-700/72 animate-pulse'

  return (
    <div className="resume-loading-shell relative aspect-[210/297] overflow-hidden bg-[linear-gradient(155deg,rgba(244,246,255,0.96)_0%,rgba(233,238,248,0.92)_48%,rgba(221,229,243,0.96)_100%)] dark:bg-[linear-gradient(155deg,rgba(18,22,31,0.98)_0%,rgba(25,31,43,0.96)_45%,rgba(16,20,29,0.98)_100%)]">
      <div className="resume-skeleton-drift absolute inset-x-[14%] top-6 h-20 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/18" />
      <div
        className="resume-skeleton-drift absolute right-[-10%] bottom-[-4%] h-56 w-56 rounded-full bg-violet-200/45 blur-3xl dark:bg-violet-500/18"
        style={{ animationDelay: '-1.6s' }}
      />
      <div className="absolute inset-5 rounded-[30px] border border-white/55 bg-white/26 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.55)] backdrop-blur-[2px] dark:border-white/6 dark:bg-white/[0.03]" />
      <div className="absolute inset-4 rotate-[-1.35deg] rounded-[30px] border border-white/65 bg-white/44 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.5)] dark:border-white/8 dark:bg-white/[0.05]" />
      <div className="absolute inset-[1.15rem] rotate-[1.15deg] rounded-[32px] border border-white/72 bg-white/58 shadow-[0_26px_72px_-44px_rgba(15,23,42,0.58)] dark:border-white/10 dark:bg-white/[0.06]" />

      <div className="absolute inset-4">
        <div className="relative h-full overflow-hidden rounded-[30px] border border-white/82 bg-white/88 p-5 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.68)] sm:p-6 dark:border-white/10 dark:bg-zinc-950/78">
          <div className="resume-skeleton-shimmer pointer-events-none absolute inset-y-0 left-[-32%] w-[40%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.78),transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_70%)] dark:bg-[radial-gradient(circle_at_top,rgba(148,163,184,0.12),transparent_70%)]" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className="h-14 w-14 rounded-[22px] bg-zinc-200/82 dark:bg-zinc-800/84 animate-pulse"
                  style={{ animationDelay: '120ms' }}
                />
                <div className="space-y-2 pt-0.5">
                  <div className={`${lineClassName} h-5 w-36`} />
                  <div className={`${lineClassName} h-3.5 w-24`} style={{ animationDelay: '180ms' }} />
                </div>
              </div>
              <div className="rounded-full border border-zinc-200/75 bg-white/72 px-3 py-1.5 text-[11px] font-medium tracking-[0.14em] text-zinc-400 uppercase shadow-sm backdrop-blur-sm dark:border-zinc-700/70 dark:bg-zinc-900/68 dark:text-zinc-500">
                Rendering PDF
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[1.15fr_0.85fr] gap-4">
              <div className="space-y-3 rounded-[26px] border border-zinc-200/75 bg-zinc-50/84 p-4 dark:border-zinc-800 dark:bg-zinc-900/72">
                <div className={`${lineClassName} h-3.5 w-20`} style={{ animationDelay: '80ms' }} />
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <div
                    className="h-20 w-20 rounded-[24px] bg-zinc-200/78 dark:bg-zinc-800/78 animate-pulse"
                    style={{ animationDelay: '220ms' }}
                  />
                  <div className="space-y-2 pt-1">
                    <div className={`${lineClassName} h-6 w-44`} />
                    <div className={`${lineClassName} h-3.5 w-28`} style={{ animationDelay: '160ms' }} />
                    <div className={`${lineClassName} h-3.5 w-36`} style={{ animationDelay: '240ms' }} />
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-zinc-200/75 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="mb-3 flex items-center gap-2">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={`mini-chip-${index}`}
                      className="h-2.5 w-2.5 rounded-full bg-zinc-300/82 dark:bg-zinc-700/78 animate-pulse"
                      style={{ animationDelay: `${index * 130}ms` }}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={`right-line-${index}`}
                      className={`${lineClassName} h-3 ${index === 3 ? 'w-3/5' : 'w-full'}`}
                      style={{ animationDelay: `${index * 140}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid flex-1 grid-cols-[0.92fr_1.08fr] gap-4">
              <div className="space-y-4 rounded-[26px] border border-zinc-200/70 bg-white/72 p-4 dark:border-zinc-800 dark:bg-zinc-900/56">
                {[0, 1, 2].map((section) => (
                  <div key={`left-section-${section}`} className="space-y-2.5">
                    <div
                      className={`${lineClassName} h-3 w-24`}
                      style={{ animationDelay: `${section * 140}ms` }}
                    />
                    <div className={`${lineClassName} h-10 w-full rounded-2xl`} />
                  </div>
                ))}
              </div>

              <div className="rounded-[26px] border border-zinc-200/70 bg-zinc-50/88 p-4 dark:border-zinc-800 dark:bg-zinc-900/72">
                <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4">
                  <div className="space-y-2.5">
                    <div className={`${lineClassName} h-3.5 w-24`} />
                    <div className={`${lineClassName} h-4 w-3/4`} style={{ animationDelay: '180ms' }} />
                  </div>
                  <div className="grid grid-cols-[18px_1fr] gap-x-3 gap-y-4">
                    {[0, 1, 2, 3].map((index) => (
                      <FragmentRow
                        key={`timeline-${index}`}
                        delay={index * 110}
                        lineClassName={lineClassName}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-zinc-200/75 bg-white/75 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/65">
                    <div className={`${lineClassName} h-3.5 w-28`} style={{ animationDelay: '260ms' }} />
                    <div className="flex gap-2">
                      {[0, 1, 2].map((index) => (
                        <div
                          key={`footer-chip-${index}`}
                          className="h-6 w-14 rounded-full bg-zinc-200/82 dark:bg-zinc-800/82 animate-pulse"
                          style={{ animationDelay: `${index * 120}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FragmentRow({
  delay,
  lineClassName,
}: {
  delay: number
  lineClassName: string
}) {
  return (
    <>
      <div
        className="mt-0.5 h-4 w-4 rounded-full bg-zinc-300/80 dark:bg-zinc-700/78 animate-pulse"
        style={{ animationDelay: `${delay}ms` }}
      />
      <div className="space-y-2">
        <div className={`${lineClassName} h-3.5 w-32`} style={{ animationDelay: `${delay + 80}ms` }} />
        <div className={`${lineClassName} h-3 w-full`} style={{ animationDelay: `${delay + 160}ms` }} />
      </div>
    </>
  )
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
      {loading && <ResumePdfLoadingSkeleton />}

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
