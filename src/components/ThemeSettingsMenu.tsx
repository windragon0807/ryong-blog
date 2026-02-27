'use client'

import type { CSSProperties } from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import { useAnimatedPresence } from '@/hooks/useAnimatedPresence'
import { CodeThemeSelect } from './CodeThemeSelect'
import { FontThemeSelect } from './FontThemeSelect'

export function ThemeSettingsMenu() {
  const [open, setOpen] = useState(false)
  const { isMounted, state } = useAnimatedPresence(open, {
    enterDelayMs: 16,
    exitDurationMs: 180,
  })
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        aria-label="환경설정 열기"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((previous) => !previous)}
        className="h-9 w-9 rounded-xl border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 dark:focus:ring-zinc-600"
      >
        <span className="sr-only">환경설정</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mx-auto h-[18px] w-[18px]"
        >
          <line x1="4" y1="21" x2="4" y2="14" strokeLinecap="round" />
          <line x1="4" y1="10" x2="4" y2="3" strokeLinecap="round" />
          <line x1="12" y1="21" x2="12" y2="12" strokeLinecap="round" />
          <line x1="12" y1="8" x2="12" y2="3" strokeLinecap="round" />
          <line x1="20" y1="21" x2="20" y2="16" strokeLinecap="round" />
          <line x1="20" y1="12" x2="20" y2="3" strokeLinecap="round" />
          <line x1="2" y1="14" x2="6" y2="14" strokeLinecap="round" />
          <line x1="10" y1="8" x2="14" y2="8" strokeLinecap="round" />
          <line x1="18" y1="16" x2="22" y2="16" strokeLinecap="round" />
        </svg>
      </button>

      {isMounted ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="환경설정 패널"
          data-state={state}
          className="settings-popover absolute right-0 top-[calc(100%+0.55rem)] z-50 w-[min(92vw,22rem)]"
        >
          <div className="rounded-2xl border border-zinc-200/90 bg-white/95 p-3 shadow-[0_24px_60px_-30px_rgba(20,20,30,0.55)] backdrop-blur-xl dark:border-zinc-700/80 dark:bg-zinc-900/95">
            <p className="px-1 text-[11px] font-semibold tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
              SETTINGS
            </p>

            <div className="mt-2 grid gap-2.5">
              <section
                className="settings-item rounded-xl border border-zinc-200/80 bg-zinc-50/85 p-3 dark:border-zinc-700/70 dark:bg-zinc-800/70"
                style={{ '--settings-item-delay': '60ms' } as CSSProperties}
              >
                <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-zinc-200 bg-white text-[10px] font-bold text-zinc-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                    Aa
                  </span>
                  Font
                </p>
                <FontThemeSelect className="h-10 w-full text-sm" />
              </section>

              <section
                className="settings-item rounded-xl border border-zinc-200/80 bg-zinc-50/85 p-3 dark:border-zinc-700/70 dark:bg-zinc-800/70"
                style={{ '--settings-item-delay': '120ms' } as CSSProperties}
              >
                <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md border border-zinc-200 bg-white text-[9px] font-bold text-zinc-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                    {'</>'}
                  </span>
                  Code
                </p>
                <CodeThemeSelect className="h-10 w-full text-sm" />
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
