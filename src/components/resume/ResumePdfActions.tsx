'use client'

import { useCallback, useState } from 'react'
import { downloadResumeAsA4Pdf } from '@/lib/resume-a4-download'

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

function PrintIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
      <path
        d="M7 8V4h10v4M7 14H5a2 2 0 0 1-2-2v-2a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v2a2 2 0 0 1-2 2h-2m-10 0h10v6H7z"
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

const actionButtonClassName =
  'inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'

export function ResumePdfActions({ pdfUrl }: { pdfUrl: string }) {
  const [isConverting, setIsConverting] = useState(false)

  const handleDownload = useCallback(async () => {
    if (isConverting) return

    setIsConverting(true)
    try {
      await downloadResumeAsA4Pdf(pdfUrl)
    } catch (error) {
      console.error('A4 PDF 변환 다운로드 실패:', error)
      window.open(pdfUrl, '_blank', 'noopener,noreferrer')
    } finally {
      setIsConverting(false)
    }
  }, [isConverting, pdfUrl])

  const handlePrint = useCallback(() => {
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.src = pdfUrl

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
      } catch {
        window.open(pdfUrl, '_blank', 'noopener,noreferrer')
      } finally {
        window.setTimeout(() => iframe.remove(), 1500)
      }
    }

    document.body.appendChild(iframe)
  }, [pdfUrl])

  return (
    <div className="flex items-center justify-end gap-2">
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
      <button type="button" onClick={handlePrint} className={actionButtonClassName}>
        <PrintIcon className="h-4 w-4" />
        인쇄
      </button>
    </div>
  )
}
