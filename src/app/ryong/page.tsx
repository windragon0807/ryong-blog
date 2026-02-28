import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'

export default async function RyongAdminPage() {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/ryong')
  }

  if (!session.user.isAdmin) {
    redirect('/ryong/denied')
  }

  const githubLogin = session.user.githubLogin ?? 'unknown'

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
        이후 관리자 기능(이력서 에디터, 내부 관리 도구)을 이 공간에 확장하면 됩니다.
      </div>

      <div className="flex flex-wrap gap-3">
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/' })
          }}
        >
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
