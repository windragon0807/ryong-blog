'use client'

import { useEffect, useState } from 'react'
import {
  DEFAULT_FONT_THEME,
  FONT_THEME_OPTIONS,
  type FontThemeName,
  getFontThemeStack,
  isFontThemeName,
} from '@/lib/fontThemes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

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
      <Select
        value={selectedTheme}
        onValueChange={(value) => setSelectedTheme(value as FontThemeName)}
      >
        <SelectTrigger aria-label="폰트 선택" className={cn('h-10 w-full text-sm', className)}>
          <SelectValue placeholder="폰트를 선택하세요" />
        </SelectTrigger>
        <SelectContent position="popper">
          {FONT_THEME_OPTIONS.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              {theme.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
