'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface AnimatedNumberProps {
  value: number
  durationMs?: number
}

export function AnimatedNumber({ value, durationMs = 260 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValueRef = useRef(value)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const from = previousValueRef.current
    const to = value

    if (from === to) return

    const effectiveDuration = prefersReducedMotion ? 1 : durationMs
    const startedAt = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const progress = Math.min(1, elapsed / effectiveDuration)
      const eased = 1 - (1 - progress) ** 3
      const nextValue = Math.round(from + (to - from) * eased)
      setDisplayValue(nextValue)

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick)
      } else {
        previousValueRef.current = to
      }
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [durationMs, prefersReducedMotion, value])

  return <>{displayValue}</>
}
