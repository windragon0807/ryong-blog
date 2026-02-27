'use client'

import { useEffect, useState } from 'react'
import {
  DEFAULT_FONT_THEME,
  FONT_THEME_OPTIONS,
  type FontThemeName,
  getFontThemeStack,
  isFontThemeName,
} from '@/lib/fontThemes'

const STORAGE_KEY = 'font-theme'

type FontThemeSelectProps = {
  className?: string
}

export function FontThemeSelect({ className = '' }: FontThemeSelectProps) {
  const [selectedTheme, setSelectedTheme] = useState<FontThemeName>(readInitialTheme)

  useEffect(() => {
    applyFontTheme(selectedTheme)
    try {
      localStorage.setItem(STORAGE_KEY, selectedTheme)
    } catch {
      // Ignore storage failures in private mode.
    }
  }, [selectedTheme])

  return (
    <label className="block">
      <span className="sr-only">폰트 테마</span>
      <select
        aria-label="폰트 선택"
        value={selectedTheme}
        onChange={(event) => setSelectedTheme(event.target.value as FontThemeName)}
        className={`h-9 w-40 shrink-0 rounded-lg border border-zinc-200 bg-white px-2 text-xs text-zinc-700 focus:ring-2 focus:ring-zinc-300 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:focus:ring-zinc-500 ${className}`}
      >
        {FONT_THEME_OPTIONS.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function applyFontTheme(theme: FontThemeName) {
  const stack = getFontThemeStack(theme)
  const root = document.documentElement
  root.setAttribute('data-font-theme', theme)
  root.style.setProperty('--font-user', stack)
  document.body?.style.setProperty('font-family', stack)
}

function readInitialTheme(): FontThemeName {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_FONT_THEME
  }

  const appliedTheme = document.documentElement.getAttribute('data-font-theme')
  if (isFontThemeName(appliedTheme)) {
    return appliedTheme
  }

  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY)
    if (isFontThemeName(storedTheme)) {
      return storedTheme
    }
  } catch {
    // Storage can be unavailable.
  }

  return DEFAULT_FONT_THEME
}
