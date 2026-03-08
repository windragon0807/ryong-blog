import type { Metadata } from 'next'
import Link from 'next/link'
import { ResumePdfActions } from '@/components/resume/ResumePdfActions'
import { ResumePdfViewer } from '@/components/resume/ResumePdfViewer'
import { getResumePdfUrl, isResumePdfStorageConfigured } from '@/lib/resume-pdf'

export const metadata: Metadata = {
  title: '이력서',
  description: '관리자 페이지에서 업로드한 최신 이력서 PDF',
  alternates: {
    canonical: '/resume',
  },
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

function ResumeNotice({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
        <div className="mt-4">
          <Link
            href="/ryong"
            className="inline-flex items-center rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            관리자 페이지로 이동
          </Link>
        </div>
      </div>
    </section>
  )
}

export default async function ResumePage() {
  if (!isResumePdfStorageConfigured()) {
    return (
      <ResumeNotice
        title="이력서 저장소가 설정되지 않았습니다"
        description="BLOB_READ_WRITE_TOKEN 환경변수를 설정한 뒤 /ryong 관리자 페이지에서 PDF를 업로드해주세요."
      />
    )
  }

  const pdfUrl = await getResumePdfUrl()

  if (!pdfUrl) {
    return (
      <ResumeNotice
        title="업로드된 이력서 PDF가 없습니다"
        description="관리자 페이지(/ryong)에서 이력서 PDF를 업로드하면 이 페이지에 바로 표시됩니다."
      />
    )
  }

  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2">
      <div className="mx-auto w-full max-w-[1280px] px-3 pt-2 pb-5 sm:px-6 sm:pt-4 sm:pb-8">
        <div className="mx-auto w-full max-w-[1120px]">
          <ResumePdfActions pdfUrl={pdfUrl} />
        </div>
        <div className="mx-auto mt-4 w-full max-w-[1120px]">
          <ResumePdfViewer pdfUrl={pdfUrl} />
        </div>
      </div>
    </section>
  )
}
