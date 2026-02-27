'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  code: string
}

export function CodeCopyButton({ code }: Props) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = code
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 dark:text-zinc-300 hover:bg-zinc-200/80 dark:hover:bg-zinc-600/70 hover:text-zinc-700 dark:hover:text-zinc-100 transition-colors"
      aria-label={copied ? '코드 복사됨' : '코드 복사'}
      title={copied ? '복사됨' : '코드 복사'}
    >
      {copied ? (
        <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m5 13 4 4L19 7"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4">
          <rect
            x="9"
            y="9"
            width="11"
            height="11"
            rx="2"
            ry="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15V6a2 2 0 0 1 2-2h9"
          />
        </svg>
      )}
    </button>
  )
}
