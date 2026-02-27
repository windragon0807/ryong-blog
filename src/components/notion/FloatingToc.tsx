'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { TocHeading } from '@/lib/toc'

interface Props {
  headings: TocHeading[]
}

export function FloatingToc({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '')
  const isManualScrollingRef = useRef(false)
  const manualScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const visibleHeadings = useMemo(
    () => headings.filter((heading) => heading.text.trim().length > 0),
    [headings]
  )

  useEffect(() => {
    if (visibleHeadings.length === 0) return

    const elements = visibleHeadings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrollingRef.current) return

        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (intersecting[0]?.target?.id) {
          setActiveId(intersecting[0].target.id)
        }
      },
      {
        rootMargin: '-90px 0px -65% 0px',
        threshold: [0, 1],
      }
    )

    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      if (manualScrollTimerRef.current) {
        clearTimeout(manualScrollTimerRef.current)
      }
    }
  }, [visibleHeadings])

  if (visibleHeadings.length === 0) return null

  const handleMove = (targetId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const target = document.getElementById(targetId)
    if (!target) return

    const distance = Math.abs(target.getBoundingClientRect().top)
    const lockDuration = Math.min(1200, Math.max(350, Math.round(distance * 0.6)))

    isManualScrollingRef.current = true
    if (manualScrollTimerRef.current) {
      clearTimeout(manualScrollTimerRef.current)
    }
    manualScrollTimerRef.current = setTimeout(() => {
      isManualScrollingRef.current = false
    }, lockDuration)

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${targetId}`)
    setActiveId(targetId)
  }

  return (
    <aside className="fixed top-24 right-[max(1rem,calc((100vw-48rem)/2-17rem))] z-40 hidden w-60 xl:block">
      <nav className="max-h-[calc(100vh-8rem)] overflow-y-auto border-l border-zinc-200 pl-4 dark:border-zinc-700">
        <ul className="space-y-0.5">
          {visibleHeadings.map((heading) => {
            const isActive = activeId === heading.id
            const indent =
              heading.level === 1
                ? ''
                : heading.level === 2
                  ? 'pl-4'
                  : 'pl-8'

            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  onClick={handleMove(heading.id)}
                  className={`block py-0.5 pr-2 text-[14px] leading-[1.45] font-medium transition-colors ${indent} ${
                    isActive
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300'
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
