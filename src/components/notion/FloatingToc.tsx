'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getLenisInstance } from '@/lib/lenis'
import type { TocHeading } from '@/lib/toc'

interface Props {
  headings: TocHeading[]
}

export function FloatingToc({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? '')
  const [indicatorTop, setIndicatorTop] = useState(0)
  const [indicatorHeight, setIndicatorHeight] = useState(20)
  const isManualScrollingRef = useRef(false)
  const manualScrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  const updateIndicator = useCallback((targetId: string) => {
    const trackElement = trackRef.current
    const activeElement = itemRefs.current[targetId]
    if (!trackElement || !activeElement) return

    const trackHeight = Math.floor(trackElement.getBoundingClientRect().height)
    const rawTop = activeElement.offsetTop
    const remainingHeight = Math.max(16, trackHeight - rawTop)
    const nextHeight = Math.max(16, Math.min(activeElement.offsetHeight, remainingHeight))
    const nextTop = Math.min(rawTop, Math.max(0, trackHeight - nextHeight))

    setIndicatorTop(nextTop)
    setIndicatorHeight(nextHeight)
  }, [])

  const scrollActiveItemIntoView = useCallback(
    (targetId: string, behavior: ScrollBehavior = 'auto') => {
      const navElement = navRef.current
      const activeElement = itemRefs.current[targetId]
      if (!navElement || !activeElement) return

      const padding = 16
      const currentScrollTop = navElement.scrollTop
      const activeTop = activeElement.offsetTop
      const activeBottom = activeTop + activeElement.offsetHeight
      const visibleTop = currentScrollTop + padding
      const visibleBottom = currentScrollTop + navElement.clientHeight - padding

      if (activeTop >= visibleTop && activeBottom <= visibleBottom) {
        return
      }

      const centeredScrollTop =
        activeTop - navElement.clientHeight / 2 + activeElement.offsetHeight / 2
      const maxScrollTop = Math.max(0, navElement.scrollHeight - navElement.clientHeight)
      const nextScrollTop = Math.min(Math.max(0, centeredScrollTop), maxScrollTop)

      navElement.scrollTo({
        top: nextScrollTop,
        behavior,
      })
    },
    []
  )

  const visibleHeadings = useMemo(
    () => headings.filter((heading) => heading.text.trim().length > 0),
    [headings]
  )
  const minimumHeadingLevel = useMemo(
    () =>
      visibleHeadings.length > 0
        ? Math.min(...visibleHeadings.map((heading) => heading.level))
        : 1,
    [visibleHeadings]
  )
  const currentActiveId = useMemo(() => {
    if (visibleHeadings.some((heading) => heading.id === activeId)) {
      return activeId
    }
    return visibleHeadings[0]?.id ?? ''
  }, [activeId, visibleHeadings])

  useEffect(() => {
    updateIndicator(currentActiveId)
  }, [currentActiveId, updateIndicator, visibleHeadings])

  useEffect(() => {
    scrollActiveItemIntoView(currentActiveId)
  }, [currentActiveId, scrollActiveItemIntoView])

  useEffect(() => {
    const handleResize = () => {
      updateIndicator(currentActiveId)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentActiveId, updateIndicator])

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

    const lenis = getLenisInstance()
    if (lenis) {
      const duration = Math.min(0.76, Math.max(0.42, distance / 1800))
      lenis.scrollTo(target, { offset: -84, duration })
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    history.replaceState(null, '', `#${targetId}`)
    setActiveId(targetId)
    scrollActiveItemIntoView(targetId, 'smooth')
  }

  return (
    <aside className="fixed top-24 right-[max(1rem,calc((100vw-48rem)/2-17rem))] z-40 hidden w-60 xl:block">
      <nav
        ref={navRef}
        className="max-h-[calc(100vh-8rem)] overflow-y-auto border-l border-zinc-200 pl-4 dark:border-zinc-700"
      >
        <div ref={trackRef} className="floating-toc-track relative">
          <span
            aria-hidden
            className="toc-active-rail pointer-events-none absolute left-[-17px] w-[2px] rounded-full"
            style={{
              backgroundColor: 'var(--theme-accent-current)',
              transform: `translateY(${indicatorTop}px)`,
              height: `${Math.max(16, indicatorHeight)}px`,
              opacity: indicatorHeight > 0 ? 1 : 0,
            }}
          />
          <ul className="space-y-0.5">
            {visibleHeadings.map((heading) => {
              const isActive = currentActiveId === heading.id
              const displayLevel = Math.max(1, heading.level - minimumHeadingLevel + 1)
              const indent =
                displayLevel === 1
                  ? ''
                  : displayLevel === 2
                    ? 'pl-4'
                    : displayLevel === 3
                      ? 'pl-8'
                      : 'pl-12'

              return (
                <li key={heading.id}>
                  <a
                    ref={(node) => {
                      itemRefs.current[heading.id] = node
                    }}
                    href={`#${heading.id}`}
                    onClick={handleMove(heading.id)}
                    style={isActive ? { color: 'var(--theme-accent-current)' } : undefined}
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
        </div>
      </nav>
    </aside>
  )
}
