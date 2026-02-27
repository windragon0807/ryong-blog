'use client'

import { useEffect, useState } from 'react'

const SHOW_AFTER_SCROLL_Y = 280

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    const updateVisible = () => {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_Y)
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(updateVisible)
    }

    updateVisible()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="맨 위로 이동"
      className={`fixed right-4 bottom-6 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/95 text-zinc-600 shadow-lg backdrop-blur transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-300 ${
        visible
          ? 'translate-y-0 opacity-100 hover:-translate-y-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      >
        <path d="M12 18V6" strokeLinecap="round" />
        <path d="m7 11 5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
