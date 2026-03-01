'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useAnimatedPresence } from '@/hooks/useAnimatedPresence'
import { IconControlButton } from './IconControlButton'
import { PostCard } from './PostCard'
import { usePostSearch } from './PostSearchProvider'

export function HeaderSearchOverlay() {
  const { query, setQuery, isOpen, setIsOpen, resultCount, resultPosts, enabled } =
    usePostSearch()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { isMounted, state } = useAnimatedPresence(isOpen, {
    enterDelayMs: 16,
    exitDurationMs: 180,
  })

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsOpen(true)
      }

      if (!isOpen && event.key === '/') {
        const target = event.target as HTMLElement | null
        const isTypingElement =
          target?.tagName === 'INPUT' ||
          target?.tagName === 'TEXTAREA' ||
          target?.isContentEditable
        if (!isTypingElement) {
          event.preventDefault()
          setIsOpen(true)
        }
      }

      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, isOpen, setIsOpen])

  useEffect(() => {
    if (!isOpen) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }

    document.body.style.overflow = ''
    return undefined
  }, [isOpen])

  if (!enabled) return null

  const overlay = isMounted ? (
    <div className="fixed inset-0 z-[220]">
      <button
        type="button"
        aria-label="검색 닫기"
        onClick={() => setIsOpen(false)}
        className={`absolute inset-0 bg-zinc-950/55 transition-opacity duration-200 ${
          state === 'entered' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`relative mx-auto mt-20 w-[min(1120px,calc(100vw-1.5rem))] rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_30px_80px_-35px_rgba(16,24,40,0.65)] transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900 ${
          state === 'entered'
            ? 'translate-y-0 scale-100 opacity-100'
            : '-translate-y-2 scale-[0.98] opacity-0'
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-[0.1em] text-zinc-500 dark:text-zinc-400">
            SEARCH POSTS
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md px-2 py-1 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            ESC
          </button>
        </div>

        <div className="relative">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="제목, 본문, 태그로 검색..."
            className="h-14 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-12 pr-4 text-[17px] text-zinc-900 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-600 dark:focus:ring-blue-900/40"
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <p>
            {query.trim().length > 0
              ? `${resultCount ?? 0}개 글이 검색 조건에 맞습니다.`
              : '검색어를 입력하면 포스트 리스트가 즉시 필터됩니다.'}
          </p>
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-md border border-zinc-200 px-2 py-1 transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              초기화
            </button>
          )}
        </div>

        <div className="mt-4 max-h-[calc(100vh-17rem)] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
          {query.trim().length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
              검색어를 입력해 포스트를 찾아보세요.
            </p>
          ) : resultPosts.length === 0 ? (
            <p className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
              검색 결과가 없습니다.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {resultPosts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  density="compact"
                  motionIndex={index}
                  motionCycle={0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null

  return (
    <>
      <IconControlButton
        srLabel="포스트 검색 열기"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="block h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </IconControlButton>

      {typeof document !== 'undefined' ? createPortal(overlay, document.body) : null}
    </>
  )
}
