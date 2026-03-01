'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconControlButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  srLabel: string
  children: ReactNode
}

const BASE_CLASS_NAME =
  'glass-surface inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/90 bg-white/82 text-zinc-500 shadow-sm leading-none backdrop-blur-md transition-[background-color,border-color,color,box-shadow,transform] duration-220 ease-out hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white/95 hover:text-zinc-700 hover:shadow-[0_12px_24px_-18px_rgba(15,23,42,0.45)] focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700/80 dark:bg-zinc-800/75 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-700/80 dark:hover:text-zinc-100 dark:hover:shadow-[0_14px_28px_-18px_rgba(2,6,23,0.75)] dark:focus:ring-zinc-600'

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
