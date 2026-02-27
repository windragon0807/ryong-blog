interface Props {
  className?: string
}

export function SubscriptionCta({ className = '' }: Props) {
  const newsletterUrl = process.env.NEXT_PUBLIC_NEWSLETTER_URL?.trim()
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim()

  return (
    <section
      className={`rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-5 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-800/70 ${className}`.trim()}
    >
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        새 글을 놓치지 않기
      </p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
        이메일로 업데이트를 받아보세요.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {newsletterUrl && (
          <a
            href={newsletterUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
          >
            이메일 구독
          </a>
        )}
        {!newsletterUrl && email && (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
          >
            이메일 문의
          </a>
        )}
        {!newsletterUrl && !email && (
          <span className="text-sm text-zinc-400 dark:text-zinc-400">
            구독 링크를 준비 중입니다.
          </span>
        )}
      </div>
    </section>
  )
}
