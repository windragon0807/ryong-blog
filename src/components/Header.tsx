'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppLauncherMenu } from './AppLauncherMenu'
import { BrandLogo } from './BrandLogo'
import { SectionToggleButton } from './SectionToggleButton'
import { useHeaderBrandScope } from './HeaderBrandScopeProvider'
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
  const shouldShowHomeButton =
    pathname === '/resume' || pathname === '/portfolio'
  const brandLabel =
    scope === 'resume'
      ? 'ryong.resume'
      : scope === 'portfolio'
        ? 'ryong.portfolio'
        : 'ryong.log'
  const brandHref = scope === 'portfolio' ? '/portfolio' : '/'

  return (
    <header className="glass-surface header-sticky top-0 z-50 w-full">
      <div className="w-full px-4 md:px-[60px]">
        <div className="flex min-h-14 items-center justify-between gap-3 py-2 sm:gap-4 sm:py-0">
          <div className="min-w-0">
            <Link
              href={brandHref}
              className="brand-link relative inline-grid max-w-full truncate font-bold text-lg text-zinc-900 dark:text-zinc-100"
            >
              <BrandLogo label={brandLabel} />
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
            <SectionToggleButton />
            <ThemeModeButton />
            <AppLauncherMenu />
            <ThemeSettingsMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
