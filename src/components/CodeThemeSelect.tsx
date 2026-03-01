'use client'

import { useEffect, useState } from 'react'
import {
  CODE_THEME_OPTIONS,
  DEFAULT_DARK_CODE_THEME,
  DEFAULT_LIGHT_CODE_THEME,
  type CodeThemeName,
  isCodeThemeName,
} from '@/lib/codeThemes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

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
      <Select
        value={selectedTheme}
        onValueChange={(value) => handleChange(value as CodeThemeName)}
      >
        <SelectTrigger
          aria-label="코드 테마 선택"
          className={cn('h-10 w-full text-sm', className)}
        >
          <SelectValue placeholder="코드 테마를 선택하세요" />
        </SelectTrigger>
        <SelectContent position="popper">
          {CODE_THEME_OPTIONS.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              {theme.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
