import type Lenis from 'lenis'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export function getLenisInstance() {
  if (typeof window === 'undefined') return null
  return window.__lenis ?? null
}
