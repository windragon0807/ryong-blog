'use client'

import { useEffect, useState } from 'react'

type Wrapper = 'p' | 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type Phase = 'typing' | 'paused-full' | 'deleting' | 'paused-empty'

type Props = {
  text: string
  className?: string
  wrapper?: Wrapper
  charDelay?: number
  cursor?: boolean
  loop?: boolean
  loopPause?: number
  deleteOnLoop?: boolean
  deleteCharDelay?: number
}

export default function TypingText({
  text,
  className,
  wrapper = 'p',
  charDelay = 80,
  cursor = true,
  loop = false,
  loopPause = 1500,
  deleteOnLoop = false,
  deleteCharDelay = 50,
}: Props) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing')

  useEffect(() => {
    let cancelled = false
    let rafId = 0
    let timeoutId: number | undefined

    const startTyping = () => {
      setPhase('typing')
      let startTime = 0
      const tick = (now: number) => {
        if (cancelled) return
        if (startTime === 0) startTime = now
        const elapsed = now - startTime
        const next = Math.min(text.length, Math.floor(elapsed / charDelay))
        setIndex(next)
        if (next < text.length) {
          rafId = requestAnimationFrame(tick)
          return
        }
        if (!loop) return
        setPhase('paused-full')
        timeoutId = window.setTimeout(() => {
          if (cancelled) return
          if (deleteOnLoop) {
            startDeleting()
          } else {
            setIndex(0)
            startTyping()
          }
        }, loopPause)
      }
      rafId = requestAnimationFrame(tick)
    }

    const startDeleting = () => {
      setPhase('deleting')
      const initialLength = text.length
      let startTime = 0
      const tick = (now: number) => {
        if (cancelled) return
        if (startTime === 0) startTime = now
        const elapsed = now - startTime
        const removed = Math.floor(elapsed / deleteCharDelay)
        const next = Math.max(0, initialLength - removed)
        setIndex(next)
        if (next > 0) {
          rafId = requestAnimationFrame(tick)
          return
        }
        setPhase('paused-empty')
        timeoutId = window.setTimeout(() => {
          if (cancelled) return
          startTyping()
        }, loopPause)
      }
      rafId = requestAnimationFrame(tick)
    }

    // 2 프레임 deferred 후 시작 (레이아웃 안정화 대기)
    requestAnimationFrame(() => {
      if (cancelled) return
      requestAnimationFrame(() => {
        if (cancelled) return
        startTyping()
      })
    })

    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [text, charDelay, loop, loopPause, deleteOnLoop, deleteCharDelay])

  const Tag = wrapper
  const displayed = text.slice(0, index)
  // 커서: 타이핑/삭제 중이거나, loop 의 paused 단계에서 노출 (사이클 끝점에서도 유지)
  const showCursor =
    cursor &&
    (phase === 'typing' ||
      phase === 'deleting' ||
      (loop && (phase === 'paused-full' || phase === 'paused-empty')))

  return (
    <Tag className={`${className ?? ''} grid`}>
      <span aria-hidden className='invisible col-start-1 row-start-1'>
        {text}
      </span>
      <span className='col-start-1 row-start-1'>
        {displayed}
        {showCursor && (
          <span aria-hidden className='inline-block animate-cursor-blink'>
            |
          </span>
        )}
      </span>
    </Tag>
  )
}
