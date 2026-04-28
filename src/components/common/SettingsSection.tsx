import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SettingsSection({
  label,
  marker,
  delayMs,
  children,
}: {
  label: string
  marker: ReactNode
  delayMs: number
  children: ReactNode
}) {
  return (
    <section
      className="settings-item rounded-xl border border-zinc-200/80 bg-zinc-50/85 p-3 dark:border-zinc-700/70 dark:bg-zinc-800/70"
      style={{ '--settings-item-delay': `${delayMs}ms` } as CSSProperties}
    >
      <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
        <span
          className={cn(
            'inline-flex h-5 w-5 items-center justify-center rounded-md border border-zinc-200 bg-white text-[10px] font-bold text-zinc-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300'
          )}
        >
          {marker}
        </span>
        {label}
      </p>
      {children}
    </section>
  )
}
