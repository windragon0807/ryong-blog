'use client'

import Link from 'next/link'
import { useCallback, useState } from 'react'
import { buildResumeAsA4Pdf } from '@/lib/resume-a4-download'

function DownloadIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path
        d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SpinnerIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="9" className="opacity-20" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-spin origin-center"
      />
    </svg>
  )
}

function ArrowRightIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path
        d="M5 12h12m0 0-4-4m4 4-4 4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const actionButtonClassName =
  'inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'

function bytesToPdfBlob(bytes: Uint8Array) {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
  return new Blob([arrayBuffer], { type: 'application/pdf' })
}

function downloadBlobPdf(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

export function ResumePdfActions({ pdfUrl }: { pdfUrl: string }) {
  const [isConverting, setIsConverting] = useState(false)

  const handleDownload = useCallback(async () => {
    if (isConverting) return

    // Open the popup synchronously during the user gesture to avoid popup blockers.
    const previewWindow = window.open('', '_blank')
    if (previewWindow && !previewWindow.closed) {
      previewWindow.document.title = 'PDF 생성 중...'
      previewWindow.document.body.innerHTML =
        '<div style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#374151;background:#fff;">A4 PDF를 생성하는 중입니다...</div>'

      // Keep focus on the current tab while conversion runs.
      previewWindow.blur()
      window.focus()
      window.setTimeout(() => {
        if (!previewWindow.closed) {
          previewWindow.blur()
          window.focus()
        }
      }, 0)
    }

    setIsConverting(true)
    try {
      const { bytes, fileName } = await buildResumeAsA4Pdf(pdfUrl)
      const blob = bytesToPdfBlob(bytes)
      const objectUrl = URL.createObjectURL(blob)

      if (previewWindow && !previewWindow.closed) {
        previewWindow.location.href = objectUrl
        previewWindow.focus()
      } else {
        downloadBlobPdf(blob, fileName)
      }

      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 5 * 60 * 1000)
    } catch (error) {
      console.error('A4 PDF 변환 다운로드 실패:', error)

      if (previewWindow && !previewWindow.closed) {
        previewWindow.location.href = pdfUrl
        previewWindow.focus()
      } else {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer')
      }
    } finally {
      setIsConverting(false)
    }
  }, [isConverting, pdfUrl])

  return (
    <div className="flex justify-end">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isConverting}
          className={`${actionButtonClassName} ${isConverting ? 'cursor-wait opacity-80' : ''}`}
          aria-busy={isConverting}
        >
          {isConverting ? (
            <SpinnerIcon className="h-4 w-4" />
          ) : (
            <DownloadIcon className="h-4 w-4" />
          )}
          {isConverting ? '변환 중...' : '다운로드'}
        </button>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200/90 bg-zinc-50/85 px-3 py-2 text-sm font-medium text-zinc-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white hover:text-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-900/85 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          포트폴리오 보기
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
