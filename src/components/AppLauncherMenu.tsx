'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IconControlButton } from './IconControlButton'

interface AppLink {
  id: string
  name: string
  description: string
  href: string
  iconSrc: string
}

const APP_LINKS: AppLink[] = [
  {
    id: 'openrun',
    name: 'Openrun',
    description: '커뮤니티 기반 러닝 M2E',
    href: 'https://open-run.vercel.app/',
    iconSrc: '/apps/openrun-icon.png',
  },
]

function AppLauncherIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" />
    </svg>
  )
}

export function AppLauncherMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconControlButton srLabel="애플리케이션 메뉴 열기">
          <AppLauncherIcon className="block h-[18px] w-[18px]" />
        </IconControlButton>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={9}
        aria-label="애플리케이션 패널"
        className="settings-popover w-[min(92vw,20rem)] rounded-2xl border-zinc-200/90 bg-white/95 p-3 shadow-[0_24px_60px_-30px_rgba(20,20,30,0.55)] backdrop-blur-xl dark:border-zinc-700/80 dark:bg-zinc-900/95"
      >
        <p className="px-1 text-[11px] font-semibold tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
          APPLICATIONS
        </p>

        <div className="mt-2 grid gap-2.5">
          {APP_LINKS.map((app, index) => (
            <a
              key={app.id}
              href={app.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="settings-item flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/85 p-3 transition hover:border-zinc-300 hover:bg-white dark:border-zinc-700/70 dark:bg-zinc-800/70 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
              style={{ '--settings-item-delay': `${60 + index * 60}ms` } as CSSProperties}
            >
              <Image
                src={app.iconSrc}
                alt={app.name}
                width={40}
                height={40}
                priority
                className="h-10 w-10 rounded-xl border border-zinc-200 bg-white object-cover dark:border-zinc-600"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {app.name}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {app.description}
                </p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
            </a>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
