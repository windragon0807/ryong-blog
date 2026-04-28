'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
  tooltip?: string
  size?: 'sm' | 'md' | 'lg'
}

export const iconButtonClassName =
  'relative overflow-hidden [&_svg]:z-10'

export function IconButton({
  label,
  tooltip,
  children,
  className,
  size = 'md',
  ...props
}: IconButtonProps) {
  const button = (
    <Button
      type="button"
      variant="iconGlass"
      size={size === 'sm' ? 'iconSm' : size === 'lg' ? 'iconLg' : 'icon'}
      aria-label={label}
      className={cn(iconButtonClassName, className)}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {children}
    </Button>
  )

  if (!tooltip) return button

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
