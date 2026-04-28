'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { SettingsSection } from '@/components/common/SettingsSection'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { BlogThemeSelect } from './BlogThemeSelect'
import { CodeThemeSelect } from './CodeThemeSelect'
import { FontThemeSelect } from './FontThemeSelect'
import { IconControlButton } from './IconControlButton'
import { LogoMotionSelect } from './LogoMotionSelect'

export function ThemeSettingsMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconControlButton srLabel="환경설정 열기">
          <SlidersHorizontal aria-hidden="true" className="block h-[18px] w-[18px]" />
        </IconControlButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={9}
        aria-label="환경설정 패널"
        data-settings-menu-portal=""
        className="settings-popover w-[min(92vw,22rem)] rounded-2xl border-zinc-200/90 bg-white/95 p-3 shadow-[0_24px_60px_-30px_rgba(20,20,30,0.55)] backdrop-blur-xl dark:border-zinc-700/80 dark:bg-zinc-900/95"
      >
        <p className="px-1 text-[11px] font-semibold tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
          SETTINGS
        </p>

        <div className="mt-2 grid gap-2.5">
          <SettingsSection label="Font" marker="Aa" delayMs={60}>
            <FontThemeSelect className="h-10 w-full text-sm" />
          </SettingsSection>
          <SettingsSection label="Code" marker="</>" delayMs={120}>
            <CodeThemeSelect className="h-10 w-full text-sm" />
          </SettingsSection>
          <SettingsSection label="Theme" marker="●" delayMs={180}>
            <BlogThemeSelect className="h-10 w-full text-sm" />
          </SettingsSection>
          <SettingsSection label="Logo" marker="~" delayMs={240}>
            <LogoMotionSelect className="h-10 w-full text-sm" />
          </SettingsSection>
        </div>
      </PopoverContent>
    </Popover>
  )
}
