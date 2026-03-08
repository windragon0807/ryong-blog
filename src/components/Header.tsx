'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppLauncherMenu } from './AppLauncherMenu'
import { HeaderSearchOverlay } from './HeaderSearchOverlay'
import { ThemeModeButton } from './ThemeModeButton'
import { ThemeSettingsMenu } from './ThemeSettingsMenu'

export function Header() {
  const pathname = usePathname()
  const isExplorerLayout =
    pathname === '/' ||
    pathname.startsWith('/tags/') ||
    pathname.startsWith('/series/')
  const isResumeLayout = pathname === '/resume'
  const brandLabel = isResumeLayout ? 'ryong.resume' : 'ryong.log'
  const maxWidthClassName = isExplorerLayout ? 'max-w-[1200px]' : 'max-w-3xl'
  const headerInner = (
    <div className="flex min-h-14 items-center justify-between gap-3 py-2 sm:gap-4 sm:py-0">
      <div className="min-w-0">
        <Link
          href="/"
          className="inline-flex max-w-full items-center truncate font-bold text-lg text-zinc-900 transition-opacity hover:opacity-70 dark:text-zinc-100"
        >
          {brandLabel}
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {isExplorerLayout && <HeaderSearchOverlay />}
        <ThemeModeButton />
        <AppLauncherMenu />
        <ThemeSettingsMenu />
      </div>
    </div>
  )

  return (
    <header className="glass-surface header-sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-700/70">
      {isResumeLayout ? (
        <div className="mx-auto w-full max-w-[1280px] px-3 sm:px-6">
          <div className="mx-auto w-full max-w-[1120px]">{headerInner}</div>
        </div>
      ) : (
        <div className={`${maxWidthClassName} mx-auto px-3 sm:px-4`}>
          {headerInner}
        </div>
      )}
    </header>
  )
}
