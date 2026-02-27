import Link from 'next/link'
import { ThemeSettingsMenu } from './ThemeSettingsMenu'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      <div className="relative h-14">
        <div className="max-w-3xl mx-auto h-full px-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-lg text-zinc-900 dark:text-zinc-100 hover:opacity-70 transition-opacity"
          >
            ryong.log
          </Link>
          <ThemeToggle />
        </div>

        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
          <ThemeSettingsMenu />
        </div>
      </div>
    </header>
  )
}
