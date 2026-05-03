import type { CSSProperties, ReactNode } from 'react'

export function SettingsSection({
  label,
  delayMs,
  children,
}: {
  label: string
  delayMs: number
  children: ReactNode
}) {
  return (
    <section
      className="settings-item rounded-xl border border-zinc-200/80 bg-zinc-50/85 p-3 dark:border-zinc-700/70 dark:bg-zinc-800/70"
      style={{ '--settings-item-delay': `${delayMs}ms` } as CSSProperties}
    >
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {children}
    </section>
  )
}
