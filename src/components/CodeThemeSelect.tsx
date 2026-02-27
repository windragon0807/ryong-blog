'use client'

import { useEffect, useState } from 'react'
import {
  CODE_THEME_OPTIONS,
  DEFAULT_DARK_CODE_THEME,
  DEFAULT_LIGHT_CODE_THEME,
  type CodeThemeName,
  isCodeThemeName,
} from '@/lib/codeThemes'

const STORAGE_KEY = 'code-theme'

type CodeThemeSelectProps = {
  className?: string
}

export function CodeThemeSelect({ className = '' }: CodeThemeSelectProps) {
  const [selectedTheme, setSelectedTheme] = useState<CodeThemeName>(readInitialTheme)

  const handleChange = (nextTheme: CodeThemeName) => {
    setSelectedTheme(nextTheme)
  }

  useEffect(() => {
    applyCodeTheme(selectedTheme)
    try {
      localStorage.setItem(STORAGE_KEY, selectedTheme)
    } catch {
      // Ignore storage failures in private mode.
    }
  }, [selectedTheme])

  return (
    <label className="block">
      <span className="sr-only">코드 테마</span>
      <select
        aria-label="코드 테마 선택"
        value={selectedTheme}
        onChange={(event) => handleChange(event.target.value as CodeThemeName)}
        className={`h-9 w-44 shrink-0 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-2 text-xs text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-500 ${className}`}
      >
        {CODE_THEME_OPTIONS.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function applyCodeTheme(theme: CodeThemeName) {
  document.documentElement.setAttribute('data-code-theme', theme)
}

function readInitialTheme(): CodeThemeName {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_LIGHT_CODE_THEME
  }

  const appliedTheme = document.documentElement.getAttribute('data-code-theme')
  if (isCodeThemeName(appliedTheme)) {
    return appliedTheme
  }

  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY)
    if (isCodeThemeName(storedTheme)) {
      return storedTheme
    }
  } catch {
    // Storage can be unavailable in private mode.
  }

  const prefersDark =
    document.documentElement.classList.contains('dark') ||
    window.matchMedia('(prefers-color-scheme: dark)').matches

  return prefersDark ? DEFAULT_DARK_CODE_THEME : DEFAULT_LIGHT_CODE_THEME
}
