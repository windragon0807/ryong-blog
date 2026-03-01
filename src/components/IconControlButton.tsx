'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconControlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  srLabel: string
  children: ReactNode
}

const BASE_CLASS_NAME =
  'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 shadow-sm leading-none transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 dark:focus:ring-zinc-600'

export function IconControlButton({
  srLabel,
  className = '',
  children,
  ...props
}: IconControlButtonProps) {
  return (
    <button
      type="button"
      aria-label={srLabel}
      className={`${BASE_CLASS_NAME} ${className}`.trim()}
      {...props}
    >
      <span className="sr-only">{srLabel}</span>
      {children}
    </button>
  )
}
