'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useTheme } from 'next-themes'

const GISCUS_REPO = process.env.NEXT_PUBLIC_GISCUS_REPO
const GISCUS_REPO_ID = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
const GISCUS_CATEGORY = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
const GISCUS_CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { resolvedTheme } = useTheme()
  const enabled = useMemo(
    () =>
      Boolean(
        GISCUS_REPO &&
          GISCUS_REPO_ID &&
          GISCUS_CATEGORY &&
          GISCUS_CATEGORY_ID
      ),
    []
  )

  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const theme = resolvedTheme === 'dark' ? 'dark_dimmed' : 'light'
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', GISCUS_REPO as string)
    script.setAttribute('data-repo-id', GISCUS_REPO_ID as string)
    script.setAttribute('data-category', GISCUS_CATEGORY as string)
    script.setAttribute('data-category-id', GISCUS_CATEGORY_ID as string)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', theme)
    script.setAttribute('data-lang', 'ko')
    script.setAttribute('data-loading', 'lazy')

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(script)
  }, [enabled, resolvedTheme])

  if (!enabled) return null

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">댓글</h2>
      <div ref={containerRef} />
    </section>
  )
}
