'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { IconControlButton } from './IconControlButton'

function SunIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.75v2.1M12 19.15v2.1M21.25 12h-2.1M4.85 12h-2.1M18.54 5.46l-1.48 1.48M6.94 17.06l-1.48 1.48M18.54 18.54l-1.48-1.48M6.94 6.94 5.46 5.46" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path
        d="M19 14.6A7.6 7.6 0 1 1 9.4 5a6.5 6.5 0 0 0 9.6 9.6Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ThemeModeButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <IconControlButton
      srLabel={
        mounted ? (isDark ? '라이트 모드로 전환' : '다크 모드로 전환') : '테마 전환'
      }
      aria-pressed={mounted ? isDark : undefined}
      onClick={() => {
        if (!mounted) return
        setTheme(isDark ? 'light' : 'dark')
      }}
      className="relative overflow-hidden"
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
          isDark
            ? 'opacity-100 bg-[radial-gradient(circle_at_30%_28%,rgba(250,250,255,0.18),transparent_38%),linear-gradient(180deg,rgba(59,130,246,0.12),rgba(15,23,42,0.08))]'
            : 'opacity-100 bg-[radial-gradient(circle_at_30%_28%,rgba(250,204,21,0.22),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(250,204,21,0.06))]'
        }`}
      />
      <span
        aria-hidden="true"
        className={`absolute inset-0 grid place-items-center transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,translate,scale] ${
          isDark
            ? '-translate-x-7 scale-95 opacity-0'
            : 'translate-x-0 scale-100 opacity-100'
        }`}
      >
        <SunIcon className="h-[18px] w-[18px]" />
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 grid place-items-center transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,translate,scale] ${
          isDark
            ? 'translate-x-0 scale-100 opacity-100'
            : 'translate-x-7 scale-95 opacity-0'
        }`}
      >
        <MoonIcon className="h-[18px] w-[18px]" />
      </span>
    </IconControlButton>
  )
}
