import * as React from 'react'
import { cn } from '@/lib/utils'

const Surface = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    interactive?: boolean
  }
>(({ className, interactive = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'glass-surface rounded-xl border border-zinc-200/85 bg-card text-card-foreground shadow-sm dark:border-zinc-700/70',
      interactive &&
        'transition-[background-color,border-color,box-shadow,transform] duration-220 ease-out hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white/95 hover:shadow-[0_18px_32px_-22px_rgba(15,23,42,0.45)] dark:hover:border-zinc-500 dark:hover:bg-zinc-800/80 dark:hover:shadow-[0_20px_36px_-24px_rgba(2,6,23,0.78)]',
      className
    )}
    {...props}
  />
))
Surface.displayName = 'Surface'

export function CardShell({
  className,
  compact = false,
  ...props
}: React.ComponentProps<'article'> & {
  compact?: boolean
}) {
  return (
    <article
      className={cn(
        'post-card-motion post-card-surface glass-card-shell glass-surface relative isolate transform-gpu origin-center translate-y-0 scale-100 overflow-hidden border border-zinc-200/72 bg-white/80 backdrop-blur-[11px] dark:border-zinc-700/68 dark:bg-zinc-800/72',
        compact ? 'rounded-xl' : 'rounded-2xl',
        className
      )}
      {...props}
    />
  )
}

export { Surface }
