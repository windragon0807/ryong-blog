'use client'

import { useEffect } from 'react'
import {
  useHeaderBrandScope,
  type HeaderBrandScope,
} from './HeaderBrandScopeProvider'

export function HeaderBrandScopeHydrator({ scope }: { scope: HeaderBrandScope }) {
  const { setOverrideScope } = useHeaderBrandScope()

  useEffect(() => {
    setOverrideScope(scope)

    return () => {
      setOverrideScope(null)
    }
  }, [scope, setOverrideScope])

  return null
}
