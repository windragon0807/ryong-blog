import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Surface } from './Surface'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description: string
  hints?: string[]
  icon?: ReactNode
  className?: string
  framed?: boolean
}

export function EmptyState({
  title,
  description,
  hints = [],
  icon,
  className,
  framed = true,
}: EmptyStateProps) {
  const content = (
    <>
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200/90 bg-white/80 text-zinc-500 shadow-[0_8px_20px_-16px_rgba(15,23,42,0.45)] dark:border-zinc-700/70 dark:bg-zinc-900/75 dark:text-zinc-300">
        {icon ?? <Search className="size-5" />}
      </div>

      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{title}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>

      {hints.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {hints.map((hint) => (
            <Badge key={hint} variant="count" className="px-2.5 py-1 text-[11px]">
              {hint}
            </Badge>
          ))}
        </div>
      ) : null}
    </>
  )

  if (!framed) {
    return <div className={cn('px-6 py-10 text-center', className)}>{content}</div>
  }

  return (
    <Surface className={cn('rounded-2xl px-6 py-10 text-center', className)}>
      {content}
    </Surface>
  )
}
