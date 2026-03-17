'use client'

import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface UseAnimatedPresenceOptions {
  enterDelayMs?: number
  exitDurationMs?: number
}

type PresenceState = 'entering' | 'entered' | 'exiting' | 'exited'

export function useAnimatedPresence(
  open: boolean,
  options: UseAnimatedPresenceOptions = {}
) {
  const { enterDelayMs = 16, exitDurationMs = 180 } = options
  const prefersReducedMotion = usePrefersReducedMotion()
  const [isMounted, setIsMounted] = useState(open)
  const [state, setState] = useState<PresenceState>(open ? 'entered' : 'exited')

  useEffect(() => {
    let enterTimer: number | null = null
    let exitEndTimer: number | null = null
    let enterFrameOne: number | null = null
    let enterFrameTwo: number | null = null
    let exitFrame: number | null = null

    if (open) {
      enterFrameOne = window.requestAnimationFrame(() => {
        setIsMounted(true)

        if (prefersReducedMotion) {
          setState('entered')
          return
        }

        setState('entering')

        const completeEnter = () => {
          setState('entered')
        }

        // Safari can coalesce zero-delay timers into the same paint, skipping the transition.
        // Double-rAF ensures the entering frame is committed before moving to entered.
        enterFrameTwo = window.requestAnimationFrame(() => {
          if (enterDelayMs > 0) {
            enterTimer = window.setTimeout(completeEnter, enterDelayMs)
            return
          }

          completeEnter()
        })
      })

      return () => {
        if (enterTimer) clearTimeout(enterTimer)
        if (enterFrameOne !== null) cancelAnimationFrame(enterFrameOne)
        if (enterFrameTwo !== null) cancelAnimationFrame(enterFrameTwo)
      }
    }

    if (!isMounted) return

    if (prefersReducedMotion) {
      exitFrame = window.requestAnimationFrame(() => {
        setState('exited')
        setIsMounted(false)
      })

      return () => {
        if (exitFrame !== null) cancelAnimationFrame(exitFrame)
      }
    }

    exitFrame = window.requestAnimationFrame(() => {
      setState('exiting')
      exitEndTimer = window.setTimeout(() => {
        setState('exited')
        setIsMounted(false)
      }, exitDurationMs)
    })

    return () => {
      if (exitFrame !== null) cancelAnimationFrame(exitFrame)
      if (exitEndTimer) clearTimeout(exitEndTimer)
    }
  }, [enterDelayMs, exitDurationMs, isMounted, open, prefersReducedMotion])

  return {
    isMounted,
    state,
    isEntering: state === 'entering',
    isExiting: state === 'exiting',
    isVisible: state === 'entering' || state === 'entered',
    prefersReducedMotion,
  }
}
