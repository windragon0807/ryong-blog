'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppLauncherMenu } from './AppLauncherMenu'
import { HeaderSearchOverlay } from './HeaderSearchOverlay'
import { ThemeSettingsMenu } from './ThemeSettingsMenu'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  const pathname = usePathname()
  const isExplorerLayout =
    pathname === '/' ||
    pathname.startsWith('/tags/') ||
    pathname.startsWith('/series/')

  return (
    <header className="glass-surface sticky top-0 z-50 w-full border-b border-zinc-200/90 bg-white/78 backdrop-blur-xl dark:border-zinc-700/80 dark:bg-zinc-900/72">
      <div className="relative h-14">
        <div
          className={`${isExplorerLayout ? 'max-w-[1200px]' : 'max-w-3xl'} mx-auto h-full px-4 flex items-center justify-between`}
        >
          <Link
            href="/"
            className="font-bold text-lg text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity"
          >
            ryong.log
          </Link>
          <ThemeToggle />
        </div>

        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 sm:right-4">
          {isExplorerLayout && <HeaderSearchOverlay />}
          <AppLauncherMenu />
          <ThemeSettingsMenu />
        </div>
      </div>
    </header>
  )
}
