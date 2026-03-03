const A4_WIDTH_PT = 595.28
const A4_HEIGHT_PT = 841.89
const MIN_REMAINDER_PT = 1

function createFileName() {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  return `resume-a4-${y}${m}${d}.pdf`
}

async function fetchPdfBytes(pdfUrl: string) {
  const response = await fetch(pdfUrl, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`PDF 파일을 불러오지 못했습니다. (${response.status})`)
  }
  return response.arrayBuffer()
}

function downloadBlobPdf(bytes: Uint8Array, fileName: string) {
  const arrayBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
  const objectUrl = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

export async function downloadResumeAsA4Pdf(pdfUrl: string, fileName = createFileName()) {
  const [{ PDFDocument }, pdfBytes] = await Promise.all([
    import('pdf-lib'),
    fetchPdfBytes(pdfUrl),
  ])

  const sourcePdf = await PDFDocument.load(pdfBytes)
  const outputPdf = await PDFDocument.create()
  const sourcePages = sourcePdf.getPages()

  for (const sourcePage of sourcePages) {
    const { width: srcWidth, height: srcHeight } = sourcePage.getSize()

    if (srcWidth <= 0 || srcHeight <= 0) {
      continue
    }

    const scale = A4_WIDTH_PT / srcWidth
    const scaledSourceHeight = srcHeight * scale
    const totalPageCount = Math.max(1, Math.ceil(scaledSourceHeight / A4_HEIGHT_PT))
    const lastVisibleHeight = scaledSourceHeight - (totalPageCount - 1) * A4_HEIGHT_PT

    // Reuse one embedded page across all output pages to avoid resource duplication.
    const embeddedPage = await outputPdf.embedPage(sourcePage)

    for (let pageIndex = 0; pageIndex < totalPageCount; pageIndex += 1) {
      const outPage = outputPdf.addPage([A4_WIDTH_PT, A4_HEIGHT_PT])
      let y = A4_HEIGHT_PT - scaledSourceHeight + pageIndex * A4_HEIGHT_PT

      // Keep final short slice aligned near the top for more natural reading flow.
      if (pageIndex === totalPageCount - 1 && lastVisibleHeight > MIN_REMAINDER_PT) {
        y = A4_HEIGHT_PT - lastVisibleHeight
      }

      outPage.drawPage(embeddedPage, {
        x: 0,
        y,
        width: A4_WIDTH_PT,
        height: scaledSourceHeight,
      })
    }
  }

  const outputBytes = await outputPdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  })
  downloadBlobPdf(outputBytes, fileName)
}
