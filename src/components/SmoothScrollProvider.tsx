'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { getLenisInstance } from '@/lib/lenis'

const DESKTOP_BREAKPOINT = 769

export function SmoothScrollProvider() {
  const pathname = usePathname()
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    if (window.innerWidth < DESKTOP_BREAKPOINT) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.16,
      gestureOrientation: 'vertical',
      wheelMultiplier: 1.12,
      touchMultiplier: 1,
      overscroll: true,
    })

    window.__lenis = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    rafId = window.requestAnimationFrame(raf)

    const onHashChange = () => {
      if (!window.location.hash) return
      const targetId = decodeURIComponent(window.location.hash.slice(1))
      const target = document.getElementById(targetId)
      if (!target) return
      lenis.scrollTo(target, {
        offset: -84,
        duration: 0.62,
      })
    }

    onHashChange()
    window.addEventListener('hashchange', onHashChange)

    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.cancelAnimationFrame(rafId)
      lenis.destroy()
      if (window.__lenis === lenis) {
        delete window.__lenis
      }
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    const lenis = getLenisInstance()
    if (!lenis) return

    const frameId = window.requestAnimationFrame(() => {
      lenis.resize()
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [pathname])

  return null
}
