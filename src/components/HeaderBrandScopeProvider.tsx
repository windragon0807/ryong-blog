'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'

export type HeaderBrandScope = 'log' | 'portfolio' | 'resume'

interface HeaderBrandScopeContextValue {
  scope: HeaderBrandScope
  setOverrideScope: (scope: HeaderBrandScope | null) => void
}

const HeaderBrandScopeContext = createContext<HeaderBrandScopeContextValue | null>(null)

function getScopeFromPathname(pathname: string): HeaderBrandScope {
  if (pathname === '/resume') return 'resume'
  if (pathname === '/portfolio') return 'portfolio'
  return 'log'
}

export function HeaderBrandScopeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const pathnameScope = useMemo(() => getScopeFromPathname(pathname), [pathname])
  const [overrideState, setOverrideState] = useState<{
    pathname: string
    scope: HeaderBrandScope
  } | null>(null)

  const scope =
    overrideState && overrideState.pathname === pathname
      ? overrideState.scope
      : pathnameScope

  const value = useMemo(
    () => ({
      scope,
      setOverrideScope: (nextScope: HeaderBrandScope | null) => {
        setOverrideState(nextScope ? { pathname, scope: nextScope } : null)
      },
    }),
    [pathname, scope]
  )

  return (
    <HeaderBrandScopeContext.Provider value={value}>
      {children}
    </HeaderBrandScopeContext.Provider>
  )
}

export function useHeaderBrandScope() {
  const context = useContext(HeaderBrandScopeContext)

  if (!context) {
    throw new Error('useHeaderBrandScope must be used within HeaderBrandScopeProvider.')
  }

  return context
}
