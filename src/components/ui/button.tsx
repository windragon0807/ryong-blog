import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium outline-none transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring/45 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'rounded-md bg-primary px-4 py-2 text-primary-foreground shadow-sm hover:bg-primary/88 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/88',
        secondary:
          'rounded-md border border-border bg-secondary px-4 py-2 text-secondary-foreground shadow-sm hover:bg-secondary/78',
        outline:
          'rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground',
        ghost:
          'rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        glass:
          'glass-surface rounded-2xl border border-zinc-200/90 bg-white/86 px-4 py-2 text-zinc-700 shadow-[0_12px_28px_-20px_rgba(15,23,42,0.45)] backdrop-blur-md hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white/95 hover:text-zinc-900 hover:shadow-[0_18px_32px_-22px_rgba(15,23,42,0.45)] dark:border-zinc-700/80 dark:bg-zinc-800/78 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-700/80 dark:hover:text-white dark:hover:shadow-[0_20px_36px_-24px_rgba(2,6,23,0.78)]',
        iconGlass:
          'glass-surface rounded-xl border border-zinc-200/90 bg-white/82 text-zinc-500 shadow-sm leading-none backdrop-blur-md hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white/95 hover:text-zinc-700 hover:shadow-[0_12px_24px_-18px_rgba(15,23,42,0.45)] dark:border-zinc-700/80 dark:bg-zinc-800/75 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700/80 dark:hover:text-zinc-100 dark:hover:shadow-[0_14px_28px_-18px_rgba(2,6,23,0.75)]',
        subtle:
          'rounded-lg border border-zinc-200/90 bg-zinc-50/85 px-3 py-2 text-zinc-600 shadow-sm hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white hover:text-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-900/85 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
        danger:
          'rounded-md border border-destructive/35 bg-destructive/10 px-4 py-2 text-destructive hover:bg-destructive/15 dark:border-destructive/45',
      },
      size: {
        default: 'h-9',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-lg px-5',
        icon: 'h-9 w-9 gap-0 p-0 inline-grid place-items-center',
        iconSm: 'h-7 w-7 gap-0 inline-grid place-items-center rounded-md p-0 [&_svg]:size-4',
        iconLg: 'h-10 w-10 gap-0 inline-grid place-items-center p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
