const A4_WIDTH_PT = 595.28
const A4_HEIGHT_PT = 841.89
const MIN_REMAINDER_PX = 2
const EXPORT_TARGET_WIDTH_PX = 2000
const EXPORT_IMAGE_QUALITY = 0.93

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

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.floor(width))
  canvas.height = Math.max(1, Math.floor(height))
  return canvas
}

function yieldToMainThread() {
  return new Promise<void>((resolve) => {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => resolve())
      return
    }

    window.setTimeout(resolve, 0)
  })
}

function canvasToJpegBytes(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Uint8Array>((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error('이미지 인코딩에 실패했습니다.'))
          return
        }

        try {
          const arrayBuffer = await blob.arrayBuffer()
          resolve(new Uint8Array(arrayBuffer))
        } catch (error) {
          reject(error)
        }
      },
      'image/jpeg',
      quality,
    )
  })
}

export async function buildResumeAsA4Pdf(pdfUrl: string, fileName = createFileName()) {
  const [{ PDFDocument }, pdfjs, pdfBytes] = await Promise.all([
    import('pdf-lib'),
    import('pdfjs-dist'),
    fetchPdfBytes(pdfUrl),
  ])

  const { getDocument, GlobalWorkerOptions, version } = pdfjs
  GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`

  const loadingTask = getDocument({
    data: pdfBytes,
    useWorkerFetch: true,
    withCredentials: false,
    cMapPacked: true,
  })
  const sourcePdf = await loadingTask.promise

  const outputPdf = await PDFDocument.create()
  const a4Ratio = A4_HEIGHT_PT / A4_WIDTH_PT

  for (let pageNumber = 1; pageNumber <= sourcePdf.numPages; pageNumber += 1) {
    const sourcePage = await sourcePdf.getPage(pageNumber)
    const baseViewport = sourcePage.getViewport({ scale: 1 })
    const renderScale = EXPORT_TARGET_WIDTH_PX / baseViewport.width
    const renderViewport = sourcePage.getViewport({ scale: renderScale })
    const sliceHeightPx = Math.max(1, Math.floor(renderViewport.width * a4Ratio))
    const renderCanvas = createCanvas(renderViewport.width, sliceHeightPx)
    const renderContext = renderCanvas.getContext('2d', { alpha: false })

    if (!renderContext) {
      continue
    }

    let offsetY = 0
    const totalHeight = Math.max(1, Math.floor(renderViewport.height))

    while (offsetY < totalHeight) {
      const remainingHeight = totalHeight - offsetY
      const currentSliceHeight = Math.min(sliceHeightPx, remainingHeight)

      if (currentSliceHeight <= MIN_REMAINDER_PX) {
        break
      }

      if (renderCanvas.height !== currentSliceHeight) {
        renderCanvas.height = currentSliceHeight
      }

      renderContext.fillStyle = '#ffffff'
      renderContext.fillRect(0, 0, renderCanvas.width, currentSliceHeight)

      await sourcePage.render({
        canvas: renderCanvas,
        canvasContext: renderContext,
        viewport: renderViewport,
        intent: 'print',
        transform: [1, 0, 0, 1, 0, -offsetY],
      }).promise

      const imageBytes = await canvasToJpegBytes(renderCanvas, EXPORT_IMAGE_QUALITY)
      const embeddedImage = await outputPdf.embedJpg(imageBytes)
      const outputPage = outputPdf.addPage([A4_WIDTH_PT, A4_HEIGHT_PT])
      const drawnHeightPt = (currentSliceHeight / renderCanvas.width) * A4_WIDTH_PT
      outputPage.drawImage(embeddedImage, {
        x: 0,
        y: A4_HEIGHT_PT - drawnHeightPt,
        width: A4_WIDTH_PT,
        height: drawnHeightPt,
      })

      offsetY += currentSliceHeight
      await yieldToMainThread()
    }

    sourcePage.cleanup()
    await yieldToMainThread()
  }

  const outputBytes = await outputPdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
  })

  return {
    bytes: outputBytes,
    fileName,
  }
}
