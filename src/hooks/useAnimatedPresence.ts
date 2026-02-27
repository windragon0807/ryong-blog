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
    let mountTimer: ReturnType<typeof setTimeout> | null = null
    let enterTimer: ReturnType<typeof setTimeout> | null = null
    let exitStartTimer: ReturnType<typeof setTimeout> | null = null
    let exitEndTimer: ReturnType<typeof setTimeout> | null = null

    if (open) {
      mountTimer = setTimeout(() => {
        setIsMounted(true)
        setState(prefersReducedMotion ? 'entered' : 'entering')
      }, 0)

      if (!prefersReducedMotion) {
        enterTimer = setTimeout(() => {
          setState('entered')
        }, enterDelayMs)
      }

      return () => {
        if (mountTimer) clearTimeout(mountTimer)
        if (enterTimer) clearTimeout(enterTimer)
      }
    }

    if (!isMounted) return

    if (prefersReducedMotion) {
      exitEndTimer = setTimeout(() => {
        setState('exited')
        setIsMounted(false)
      }, 0)

      return () => {
        if (exitEndTimer) clearTimeout(exitEndTimer)
      }
    }

    exitStartTimer = setTimeout(() => {
      setState('exiting')
    }, 0)
    exitEndTimer = setTimeout(() => {
      setState('exited')
      setIsMounted(false)
    }, exitDurationMs)

    return () => {
      if (exitStartTimer) clearTimeout(exitStartTimer)
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
