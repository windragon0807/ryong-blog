'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppLauncherMenu } from './AppLauncherMenu'
import { useHeaderBrandScope } from './HeaderBrandScopeProvider'
import { HeaderSearchOverlay } from './HeaderSearchOverlay'
import { ICON_CONTROL_BUTTON_CLASS_NAME } from './IconControlButton'
import { ThemeModeButton } from './ThemeModeButton'
import { ThemeSettingsMenu } from './ThemeSettingsMenu'

function HomeIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path
        d="M4 11.5 12 5l8 6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 10.75V19h11v-8.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 19v-4.5h4V19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Header() {
  const pathname = usePathname()
  const { scope } = useHeaderBrandScope()
  const isExplorerLayout =
    pathname === '/' ||
    pathname === '/portfolio' ||
    pathname.startsWith('/tags/') ||
    pathname.startsWith('/series/')
  const isResumeLayout = pathname === '/resume'
  const isPortfolioLayout = pathname === '/portfolio'
  const shouldShowHomeButton = isResumeLayout || isPortfolioLayout
  const brandLabel =
    scope === 'resume'
      ? 'ryong.resume'
      : scope === 'portfolio'
        ? 'ryong.portfolio'
        : 'ryong.log'
  const brandCharacters = Array.from(brandLabel)
  const brandHref = scope === 'portfolio' ? '/portfolio' : '/'
  const maxWidthClassName = isExplorerLayout ? 'max-w-[1200px]' : 'max-w-3xl'

  const headerInner = (
    <div className="flex min-h-14 items-center justify-between gap-3 py-2 sm:gap-4 sm:py-0">
      <div className="min-w-0">
        <Link
          href={brandHref}
          className="brand-link relative inline-grid max-w-full truncate font-bold text-lg text-zinc-900 dark:text-zinc-100"
        >
          <span className="brand-base block">{brandLabel}</span>
          <span aria-hidden className="brand-animated-layer">
            {brandCharacters.map((character, index) => (
              <span
                key={`${brandLabel}-${character}-${index}`}
                className="brand-animated-char"
                style={{ '--brand-char-index': index } as CSSProperties}
              >
                {character}
              </span>
            ))}
          </span>
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {shouldShowHomeButton && (
          <Link
            href="/"
            aria-label="홈으로 이동"
            className={`${ICON_CONTROL_BUTTON_CLASS_NAME} relative overflow-hidden`.trim()}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.18),transparent_38%),linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.02))] dark:bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.12),transparent_38%),linear-gradient(180deg,rgba(148,163,184,0.1),rgba(15,23,42,0.04))]"
            />
            <span className="sr-only">홈으로 이동</span>
            <HomeIcon className="relative z-10 h-[18px] w-[18px]" />
          </Link>
        )}
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
