import { BlobNotFoundError, head, put } from '@vercel/blob'

const DEFAULT_RESUME_PDF_BLOB_PATH = 'resume/latest.pdf'
const MAX_RESUME_PDF_SIZE_BYTES = 25 * 1024 * 1024

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? ''
}

function getBlobCommandOptions() {
  const token = getBlobToken()
  return token ? { token } : {}
}

export function getResumePdfBlobPath() {
  return process.env.RESUME_PDF_BLOB_PATH?.trim() || DEFAULT_RESUME_PDF_BLOB_PATH
}

export function isResumePdfStorageConfigured() {
  return Boolean(getBlobToken())
}

function isPdfFile(file: File) {
  const byType = file.type.toLowerCase() === 'application/pdf'
  const byName = file.name.toLowerCase().endsWith('.pdf')
  return byType || byName
}

export async function getResumePdfUrl() {
  if (!isResumePdfStorageConfigured()) {
    return null
  }

  try {
    const metadata = await head(getResumePdfBlobPath(), getBlobCommandOptions())
    return metadata.url
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return null
    }

    if (error instanceof Error && /No token found/i.test(error.message)) {
      return null
    }

    throw error
  }
}

export async function uploadResumePdf(file: File) {
  if (!isResumePdfStorageConfigured()) {
    throw new Error('BLOB_NOT_CONFIGURED')
  }

  if (!isPdfFile(file)) {
    throw new Error('INVALID_FILE_TYPE')
  }

  if (file.size <= 0) {
    throw new Error('EMPTY_FILE')
  }

  if (file.size > MAX_RESUME_PDF_SIZE_BYTES) {
    throw new Error('FILE_TOO_LARGE')
  }

  const fileData = await file.arrayBuffer()
  const payload = new Blob([fileData], { type: 'application/pdf' })

  const uploaded = await put(getResumePdfBlobPath(), payload, {
    ...getBlobCommandOptions(),
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/pdf',
    cacheControlMaxAge: 60,
  })

  return uploaded.url
}
