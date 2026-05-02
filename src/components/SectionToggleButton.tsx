'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { History, Newspaper } from 'lucide-react'
import { ICON_CONTROL_BUTTON_CLASS_NAME } from './IconControlButton'

export function SectionToggleButton() {
  const pathname = usePathname()
  const isHistory = pathname === '/'
  const isNews = pathname === '/news'

  if (!isHistory && !isNews) return null

  const targetHref = isNews ? '/' : '/news'
  const srLabel = isNews ? 'History로 전환' : 'News로 전환'

  return (
    <Link
      href={targetHref}
      aria-label={srLabel}
      title={srLabel}
      aria-pressed={isNews}
      className={`${ICON_CONTROL_BUTTON_CLASS_NAME} relative overflow-hidden`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 grid place-items-center transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,translate,scale] ${
          isHistory
            ? 'translate-x-0 scale-100 opacity-100'
            : '-translate-x-7 scale-95 opacity-0'
        }`}
      >
        <History className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-0 grid place-items-center transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,translate,scale] ${
          isNews
            ? 'translate-x-0 scale-100 opacity-100'
            : 'translate-x-7 scale-95 opacity-0'
        }`}
      >
        <Newspaper className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
    </Link>
  )
}
