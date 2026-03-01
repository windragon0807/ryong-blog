'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Post } from '@/types/notion'

interface PostSearchContextValue {
  query: string
  setQuery: (value: string) => void
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  resultCount: number | null
  setResultCount: (value: number | null) => void
  resultPosts: Post[]
  setResultPosts: (value: Post[]) => void
  enabled: boolean
}

const PostSearchContext = createContext<PostSearchContextValue | null>(null)

interface PostSearchProviderProps {
  children: React.ReactNode
}

function isExplorerRoute(pathname: string): boolean {
  return pathname === '/' || pathname.startsWith('/tags/') || pathname.startsWith('/series/')
}

export function PostSearchProvider({ children }: PostSearchProviderProps) {
  const pathname = usePathname()
  const enabled = isExplorerRoute(pathname)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [resultCount, setResultCount] = useState<number | null>(null)
  const [resultPosts, setResultPosts] = useState<Post[]>([])

  const value = useMemo(
    () => ({
      query: enabled ? query : '',
      setQuery,
      isOpen: enabled ? isOpen : false,
      setIsOpen,
      resultCount: enabled ? resultCount : null,
      setResultCount,
      resultPosts: enabled ? resultPosts : [],
      setResultPosts,
      enabled,
    }),
    [enabled, isOpen, query, resultCount, resultPosts]
  )

  return <PostSearchContext.Provider value={value}>{children}</PostSearchContext.Provider>
}

export function usePostSearch() {
  const context = useContext(PostSearchContext)
  if (!context) {
    throw new Error('usePostSearch must be used within PostSearchProvider.')
  }
  return context
}
