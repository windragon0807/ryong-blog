'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const update = () => {
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      const next = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0
      setProgress(next)
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed top-14 left-0 z-40 h-[3px] w-full bg-transparent">
      <div
        className="h-full origin-left bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-400 shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-transform duration-150"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
