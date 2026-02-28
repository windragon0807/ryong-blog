import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, signIn, signOut } from '@/auth'

export default async function RyongDeniedPage() {
  const session = await auth()

  if (session?.user.isAdmin) {
    redirect('/ryong')
  }

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600 dark:text-red-400">
          Access Denied
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          관리자 계정이 아닙니다
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          `/ryong`은 지정된 GitHub 관리자 계정만 접근할 수 있습니다.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/ryong' })
          }}
        >
          <button
            type="submit"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            다른 계정으로 다시 로그인
          </button>
        </form>
        <form
          action={async () => {
            'use server'
            await signIn('github', { redirectTo: '/ryong' })
          }}
        >
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            GitHub 로그인
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

