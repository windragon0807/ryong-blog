'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <div className="relative inline-flex items-center">
      <span
        className="code-copy-toast pointer-events-none absolute top-1/2 right-8 -translate-y-1/2 whitespace-nowrap rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
        data-visible={copied ? 'true' : 'false'}
      >
        Copied
      </span>
      <Button
        type="button"
        variant="ghost"
        size="iconSm"
        onClick={handleCopy}
        className="text-zinc-500 hover:bg-zinc-200/80 hover:text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600/70 dark:hover:text-zinc-100"
        aria-label={copied ? '코드 복사됨' : '코드 복사'}
        title={copied ? '복사됨' : '코드 복사'}
      >
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      </Button>
    </div>
  )
}
