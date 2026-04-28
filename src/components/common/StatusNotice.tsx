import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type StatusTone = 'info' | 'success' | 'warning' | 'danger'

const toneClassNames: Record<StatusTone, string> = {
  info:
    'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-700/50 dark:bg-emerald-900/20 dark:text-emerald-300',
  warning:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-700/50 dark:bg-amber-900/20 dark:text-amber-300',
  danger:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-700/50 dark:bg-rose-900/20 dark:text-rose-300',
}

export function StatusNotice({
  tone = 'info',
  className,
  children,
}: {
  tone?: StatusTone
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('rounded-lg border px-3 py-2 text-sm', toneClassNames[tone], className)}>
      {children}
    </div>
  )
}
