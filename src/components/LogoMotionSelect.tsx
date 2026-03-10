'use client'

import { useEffect, useState } from 'react'
import {
  DEFAULT_LOGO_MOTION,
  LOGO_MOTION_OPTIONS,
  type LogoMotionName,
  isLogoMotionName,
} from '@/lib/logoMotions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'logo-motion'

type LogoMotionSelectProps = {
  className?: string
}

export function LogoMotionSelect({ className = '' }: LogoMotionSelectProps) {
  const [selectedMotion, setSelectedMotion] = useState<LogoMotionName>(readInitialMotion)

  useEffect(() => {
    applyLogoMotion(selectedMotion)
    try {
      localStorage.setItem(STORAGE_KEY, selectedMotion)
    } catch {
      // Ignore storage failures in private mode.
    }
  }, [selectedMotion])

  return (
    <label className="block">
      <span className="sr-only">로고 애니메이션</span>
      <Select
        value={selectedMotion}
        onValueChange={(value) => setSelectedMotion(value as LogoMotionName)}
      >
        <SelectTrigger
          aria-label="로고 애니메이션 선택"
          className={cn('h-10 w-full text-sm', className)}
        >
          <SelectValue placeholder="로고 애니메이션을 선택하세요" />
        </SelectTrigger>
        <SelectContent position="popper" data-settings-menu-portal="">
          {LOGO_MOTION_OPTIONS.map((motion) => (
            <SelectItem key={motion.value} value={motion.value}>
              <span className="flex flex-col">
                <span>{motion.label}</span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                  {motion.description}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}

function applyLogoMotion(motion: LogoMotionName) {
  document.documentElement.setAttribute('data-logo-motion', motion)
}

function readInitialMotion(): LogoMotionName {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_LOGO_MOTION
  }

  const appliedMotion = document.documentElement.getAttribute('data-logo-motion')
  if (isLogoMotionName(appliedMotion)) {
    return appliedMotion
  }

  try {
    const storedMotion = localStorage.getItem(STORAGE_KEY)
    if (isLogoMotionName(storedMotion)) {
      return storedMotion
    }
  } catch {
    // Storage can be unavailable in private mode.
  }

  return DEFAULT_LOGO_MOTION
}
