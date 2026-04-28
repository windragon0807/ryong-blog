import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { logoutAdminAction, uploadResumePdfAdminAction } from '@/app/ryong/actions'
import { ActionButton, ActionLink } from '@/components/common/ActionControl'
import { Surface } from '@/components/common/Surface'
import { StatusNotice } from '@/components/common/StatusNotice'
import { Input } from '@/components/ui/input'
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

      <StatusNotice>
        이후 관리자 기능(내부 관리 도구)을 이 공간에 확장하면 됩니다.
      </StatusNotice>

      <Surface className="space-y-4 rounded-xl bg-white p-5 dark:bg-zinc-900">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">이력서 PDF 업로드</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            업로드한 PDF는 <code>/resume</code> 페이지에 즉시 반영됩니다.
          </p>
        </div>

        {uploadStatus === 'success' && (
          <StatusNotice tone="success">
            업로드가 완료되었습니다.
          </StatusNotice>
        )}
        {uploadStatus === 'missing' && (
          <StatusNotice tone="warning">
            PDF 파일을 선택해주세요.
          </StatusNotice>
        )}
        {uploadStatus === 'invalid-type' && (
          <StatusNotice tone="warning">
            PDF 파일만 업로드할 수 있습니다.
          </StatusNotice>
        )}
        {uploadStatus === 'too-large' && (
          <StatusNotice tone="warning">
            파일 크기는 25MB 이하여야 합니다.
          </StatusNotice>
        )}
        {uploadStatus === 'no-storage' && (
          <StatusNotice tone="danger">
            저장소가 설정되지 않았습니다. <code>BLOB_READ_WRITE_TOKEN</code> 을 먼저 설정해주세요.
          </StatusNotice>
        )}
        {uploadStatus === 'failed' && (
          <StatusNotice tone="danger">
            업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </StatusNotice>
        )}

        {!isBlobConfigured && (
          <StatusNotice tone="warning">
            현재 저장소 토큰이 없어 업로드를 사용할 수 없습니다.
          </StatusNotice>
        )}

        <form action={uploadResumePdfAdminAction} className="space-y-3">
          <Input
            type="file"
            name="resumePdf"
            accept="application/pdf,.pdf"
            required
            disabled={!isBlobConfigured}
          />
          <div className="flex flex-wrap gap-3">
            <ActionButton
              type="submit"
              disabled={!isBlobConfigured}
            >
              PDF 업로드
            </ActionButton>
            <ActionLink
              href="/resume"
              target="_blank"
              variant="outline"
            >
              /resume 확인
            </ActionLink>
          </div>
        </form>

        {currentResumePdfUrl && (
          <p className="break-all text-xs text-zinc-500 dark:text-zinc-400">
            현재 업로드 파일: {currentResumePdfUrl}
          </p>
        )}
      </Surface>

      <div className="flex flex-wrap gap-3">
        <form action={logoutAdminAction}>
          <ActionButton
            type="submit"
          >
            로그아웃
          </ActionButton>
        </form>
        <ActionLink
          href="/"
          variant="outline"
        >
          블로그 홈으로
        </ActionLink>
      </div>
    </section>
  )
}
