import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground',
        outline:
          'border-border text-foreground',
        tag:
          'border-zinc-200/85 bg-zinc-100/75 text-zinc-600 backdrop-blur-sm dark:border-zinc-700/70 dark:bg-zinc-700/65 dark:text-zinc-300',
        series:
          'border-blue-200/95 bg-blue-50/80 text-blue-700 backdrop-blur-sm dark:border-blue-700/80 dark:bg-blue-900/35 dark:text-blue-300',
        count:
          'rounded-full border-zinc-200/80 bg-white/75 px-3 py-1 text-zinc-600 dark:border-zinc-700/70 dark:bg-zinc-900/70 dark:text-zinc-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
