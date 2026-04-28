import Link from 'next/link'
import type { ComponentProps } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ActionVariant = 'default' | 'subtle' | 'glass' | 'outline' | 'secondary'
type ActionButtonProps = Omit<ComponentProps<typeof Button>, 'variant'> & {
  variant?: ActionVariant
}
type ActionLinkProps = ComponentProps<typeof Link> & {
  variant?: ActionVariant
}

export function ActionButton({
  className,
  variant = 'default',
  ...props
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn('gap-2', className)}
      {...props}
    />
  )
}

export function ActionLink({
  href,
  className,
  variant = 'subtle',
  children,
  ...props
}: ActionLinkProps) {
  return (
    <Button asChild variant={variant} className={cn('gap-2', className)}>
      <Link href={href} {...props}>
        {children}
      </Link>
    </Button>
  )
}

export { buttonVariants }
