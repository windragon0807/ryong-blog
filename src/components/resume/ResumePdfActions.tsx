'use client'

import { useCallback, useState } from 'react'
import { ArrowRight, Download, LoaderCircle } from 'lucide-react'
import { ActionButton, ActionLink } from '@/components/common/ActionControl'
import { buildResumeAsA4Pdf } from '@/lib/resume-a4-download'

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
    <div className="-mt-1 flex justify-end sm:mt-0">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <ActionButton
          type="button"
          variant="subtle"
          onClick={handleDownload}
          disabled={isConverting}
          className={isConverting ? 'cursor-wait opacity-80' : ''}
          aria-busy={isConverting}
        >
          {isConverting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isConverting ? '변환 중...' : '다운로드'}
        </ActionButton>
        <ActionLink
          href="/portfolio"
          variant="subtle"
        >
          포트폴리오 보기
          <ArrowRight className="h-4 w-4" />
        </ActionLink>
      </div>
    </div>
  )
}
