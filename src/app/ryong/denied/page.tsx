import { redirect } from 'next/navigation'
import { auth, signIn, signOut } from '@/auth'
import { ActionButton, ActionLink } from '@/components/common/ActionControl'

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
          <ActionButton
            type="submit"
            variant="outline"
          >
            다른 계정으로 다시 로그인
          </ActionButton>
        </form>
        <form
          action={async () => {
            'use server'
            await signIn('github', { redirectTo: '/ryong' })
          }}
        >
          <ActionButton
            type="submit"
          >
            GitHub 로그인
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
