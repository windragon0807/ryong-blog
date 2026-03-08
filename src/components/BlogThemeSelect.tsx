'use client'

import { useEffect, useState } from 'react'
import {
  BLOG_THEME_OPTIONS,
  DEFAULT_BLOG_THEME,
  type BlogThemeName,
  getBlogThemePalette,
  isBlogThemeName,
} from '@/lib/blogThemes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'blog-theme'
const STORAGE_USER_SET_KEY = 'blog-theme-user-set'

type BlogThemeSelectProps = {
  className?: string
}

export function BlogThemeSelect({ className = '' }: BlogThemeSelectProps) {
  const [selectedTheme, setSelectedTheme] = useState<BlogThemeName>(readInitialTheme)
  const [shouldPersist, setShouldPersist] = useState<boolean>(readPersistFlag)

  useEffect(() => {
    applyBlogTheme(selectedTheme)
    if (shouldPersist) {
      try {
        localStorage.setItem(STORAGE_KEY, selectedTheme)
        localStorage.setItem(STORAGE_USER_SET_KEY, 'true')
      } catch {
        // Ignore storage failures in private mode.
      }
    }
  }, [selectedTheme, shouldPersist])

  return (
    <label className="block">
      <span className="sr-only">블로그 테마</span>
      <Select
        value={selectedTheme}
        onValueChange={(value) => {
          setShouldPersist(true)
          setSelectedTheme(value as BlogThemeName)
        }}
      >
        <SelectTrigger aria-label="블로그 테마 선택" className={cn('h-10 w-full text-sm', className)}>
          <SelectValue placeholder="테마 색상을 선택하세요" />
        </SelectTrigger>
        <SelectContent position="popper">
          {BLOG_THEME_OPTIONS.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="inline-flex h-3.5 w-3.5 shrink-0 rounded-full border border-black/6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.55)]"
                  style={{ backgroundColor: theme.accent }}
                />
                <span>{theme.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}

function applyBlogTheme(theme: BlogThemeName) {
  const palette = getBlogThemePalette(theme)
  const root = document.documentElement

  root.setAttribute('data-blog-theme', theme)
  root.style.setProperty('--theme-accent', palette.accent)
  root.style.setProperty('--theme-accent-dark', palette.accentDark)
  root.style.setProperty('--theme-selection-bg', palette.selection)
  root.style.setProperty('--theme-progress-start', palette.progressStart)
  root.style.setProperty('--theme-progress-mid', palette.progressMid)
  root.style.setProperty('--theme-progress-end', palette.progressEnd)
  root.style.setProperty('--theme-progress-glow', palette.progressGlow)
  root.style.setProperty('--theme-progress-dark-start', palette.progressDarkStart)
  root.style.setProperty('--theme-progress-dark-mid', palette.progressDarkMid)
  root.style.setProperty('--theme-progress-dark-end', palette.progressDarkEnd)
  root.style.setProperty('--theme-progress-dark-glow', palette.progressDarkGlow)
  root.style.setProperty('--theme-inline-code-bg', palette.inlineCodeBg)
  root.style.setProperty('--theme-inline-code-border', palette.inlineCodeBorder)
  root.style.setProperty('--theme-inline-code-text', palette.inlineCodeText)
  root.style.setProperty('--theme-inline-code-dark-bg', palette.inlineCodeDarkBg)
  root.style.setProperty('--theme-inline-code-dark-border', palette.inlineCodeDarkBorder)
  root.style.setProperty('--theme-inline-code-dark-text', palette.inlineCodeDarkText)
}

function readInitialTheme(): BlogThemeName {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_BLOG_THEME
  }

  const appliedTheme = document.documentElement.getAttribute('data-blog-theme')
  if (isBlogThemeName(appliedTheme)) {
    return appliedTheme
  }

  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY)
    const isUserSetTheme = localStorage.getItem(STORAGE_USER_SET_KEY) === 'true'
    const isLegacyExplicitTheme = isBlogThemeName(storedTheme) && storedTheme !== 'moss'
    if ((isUserSetTheme || isLegacyExplicitTheme) && isBlogThemeName(storedTheme)) {
      return storedTheme
    }
  } catch {
    // Storage can be unavailable.
  }

  return DEFAULT_BLOG_THEME
}

function readPersistFlag(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    if (localStorage.getItem(STORAGE_USER_SET_KEY) === 'true') {
      return true
    }

    const storedTheme = localStorage.getItem(STORAGE_KEY)
    return isBlogThemeName(storedTheme) && storedTheme !== 'moss'
  } catch {
    return false
  }
}
