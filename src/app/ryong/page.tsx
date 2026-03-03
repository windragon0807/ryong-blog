import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { logoutAdminAction, uploadResumePdfAdminAction } from '@/app/ryong/actions'
import { getResumePdfUrl, isResumePdfStorageConfigured } from '@/lib/resume-pdf'

type AdminPageSearchParams = Promise<{
  upload?: string
}>

export default async function RyongAdminPage({
  searchParams,
}: {
  searchParams: AdminPageSearchParams
}) {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/ryong')
  }

  if (!session.user.isAdmin) {
    redirect('/ryong/denied')
  }

  const githubLogin = session.user.githubLogin ?? 'unknown'
  const params = await searchParams
  const uploadStatus = params.upload
  const isBlobConfigured = isResumePdfStorageConfigured()
  const currentResumePdfUrl = isBlobConfigured ? await getResumePdfUrl() : null

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
          Admin Mode
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          /ryong 관리자 진입 완료
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          GitHub 계정 <strong>@{githubLogin}</strong> 으로 인증되었습니다.
        </p>
      </header>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200">
        이후 관리자 기능(내부 관리 도구)을 이 공간에 확장하면 됩니다.
      </div>

      <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">이력서 PDF 업로드</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            업로드한 PDF는 <code>/resume</code> 페이지에 즉시 반영됩니다.
          </p>
        </div>

        {uploadStatus === 'success' && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-700/50 dark:bg-emerald-900/20 dark:text-emerald-300">
            업로드가 완료되었습니다.
          </p>
        )}
        {uploadStatus === 'missing' && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
            PDF 파일을 선택해주세요.
          </p>
        )}
        {uploadStatus === 'invalid-type' && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
            PDF 파일만 업로드할 수 있습니다.
          </p>
        )}
        {uploadStatus === 'too-large' && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
            파일 크기는 25MB 이하여야 합니다.
          </p>
        )}
        {uploadStatus === 'no-storage' && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-700/50 dark:bg-rose-900/20 dark:text-rose-300">
            저장소가 설정되지 않았습니다. <code>BLOB_READ_WRITE_TOKEN</code> 을 먼저 설정해주세요.
          </p>
        )}
        {uploadStatus === 'failed' && (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-700/50 dark:bg-rose-900/20 dark:text-rose-300">
            업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}

        {!isBlobConfigured && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300">
            현재 저장소 토큰이 없어 업로드를 사용할 수 없습니다.
          </p>
        )}

        <form action={uploadResumePdfAdminAction} className="space-y-3">
          <input
            type="file"
            name="resumePdf"
            accept="application/pdf,.pdf"
            required
            disabled={!isBlobConfigured}
            className="block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:file:bg-zinc-100 dark:file:text-zinc-900 dark:hover:file:bg-zinc-300"
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!isBlobConfigured}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              PDF 업로드
            </button>
            <Link
              href="/resume"
              target="_blank"
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              /resume 확인
            </Link>
          </div>
        </form>

        {currentResumePdfUrl && (
          <p className="break-all text-xs text-zinc-500 dark:text-zinc-400">
            현재 업로드 파일: {currentResumePdfUrl}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            로그아웃
          </button>
        </form>
        <Link
          href="/"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          블로그 홈으로
        </Link>
      </div>
    </section>
  )
}
