'use client'

import {
  useMemo,
  useSyncExternalStore,
  type CSSProperties,
} from 'react'
import {
  DEFAULT_LOGO_MOTION,
  isLogoMotionName,
  type LogoMotionName,
} from '@/lib/logoMotions'
import TypingText from './TypingText'

// data-logo-motion 외부 store 구독 — useState/useEffect 없이 SSR/hydration 일관성 유지
function subscribeMotion(callback: () => void) {
  if (typeof document === 'undefined') return () => {}
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-logo-motion'],
  })
  return () => observer.disconnect()
}

function getMotionSnapshot(): LogoMotionName {
  if (typeof document === 'undefined') return DEFAULT_LOGO_MOTION
  const value = document.documentElement.getAttribute('data-logo-motion')
  return isLogoMotionName(value) ? value : DEFAULT_LOGO_MOTION
}

function useLogoMotion(): LogoMotionName {
  return useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    () => DEFAULT_LOGO_MOTION
  )
}

interface BrandLogoProps {
  label: string
}

export function BrandLogo({ label }: BrandLogoProps) {
  const motion = useLogoMotion()
  const chars = useMemo(() => Array.from(label), [label])

  if (motion === 'typing') {
    return (
      <TypingText
        key={label}
        text={label}
        wrapper="span"
        charDelay={80}
        loop
        loopPause={1500}
        deleteOnLoop
        deleteCharDelay={50}
      />
    )
  }

  return (
    <>
      <span className="brand-base block">{label}</span>
      <span aria-hidden className="brand-animated-layer">
        {chars.map((character, index) => (
          <span
            key={`${label}-${index}`}
            className="brand-animated-char"
            style={{ '--brand-char-index': index } as CSSProperties}
          >
            {character}
          </span>
        ))}
      </span>
    </>
  )
}
