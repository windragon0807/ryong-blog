'use client'

import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useAnimatedPresence } from '@/hooks/useAnimatedPresence'
import { IconControlButton } from './IconControlButton'
import { EmptyStatePanel } from './EmptyStatePanel'
import { PostCard } from './PostCard'
import { usePostSearch } from './PostSearchProvider'

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  )
}

function ShortcutHint({
  keyText,
  label,
}: {
  keyText: string
  label: string
}) {
  return (
    <div className="hidden items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-400 md:inline-flex">
      <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
        {keyText}
      </kbd>
      {label}
    </div>
  )
}

export function HeaderSearchOverlay() {
  const { query, setQuery, isOpen, setIsOpen, resultCount, resultPosts, enabled } =
    usePostSearch()
  const normalizedQuery = query.trim()
  const hasQuery = normalizedQuery.length > 0
  const hasResults = resultPosts.length > 0
  const resultTotal = hasQuery ? (resultCount ?? resultPosts.length) : resultPosts.length
  const inputRef = useRef<HTMLInputElement | null>(null)
  const closeOverlay = useCallback(() => setIsOpen(false), [setIsOpen])
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
        closeOverlay()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeOverlay, enabled, isOpen, setIsOpen])

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
    <div className="fixed inset-0 z-[220] px-3 pt-14 md:px-4 md:pt-18">
      <button
        type="button"
        aria-label="검색 닫기"
        onClick={closeOverlay}
        className={`absolute inset-0 bg-zinc-950/52 backdrop-blur-[1.5px] ${
          state === 'exiting'
            ? 'opacity-0 transition-opacity duration-180 ease-out'
            : 'search-overlay-backdrop-enter opacity-100'
        }`}
      />

      <div
        className={`relative mx-auto w-[min(1120px,calc(100vw-1.5rem))] overflow-hidden rounded-[24px] border border-zinc-200/90 bg-white/96 p-4 shadow-[0_34px_80px_-32px_rgba(16,24,40,0.72)] backdrop-blur-xl will-change-[transform,opacity] dark:border-zinc-700/80 dark:bg-zinc-900/94 dark:shadow-[0_34px_85px_-28px_rgba(2,6,23,0.82)] ${
          state === 'exiting'
            ? 'translate-y-3 opacity-0 transition-[opacity,transform] duration-180 ease-out'
            : 'search-overlay-panel-enter glass-surface translate-y-0 opacity-100'
        }`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent dark:via-blue-300/35"
        />

        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              포스트 검색
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              제목, 본문, 태그를 통합해서 빠르게 찾습니다.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ShortcutHint keyText="/" label="열기" />
            <ShortcutHint keyText="Esc" label="닫기" />
            <button
              type="button"
              onClick={closeOverlay}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-zinc-500 transition-colors hover:border-zinc-200 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 dark:focus:ring-zinc-600"
              aria-label="검색 팝업 닫기"
            >
              <CloseIcon className="h-[17px] w-[17px]" />
            </button>
          </div>
        </div>

        <div className="relative mb-3 rounded-2xl bg-gradient-to-r from-blue-200/65 via-cyan-200/40 to-teal-200/65 p-[1px] dark:from-blue-800/50 dark:via-cyan-900/35 dark:to-emerald-800/45">
          <div className="relative overflow-hidden rounded-[15px] border border-zinc-200/70 bg-zinc-50/90 shadow-inner shadow-zinc-200/35 dark:border-zinc-700/80 dark:bg-zinc-800/75 dark:shadow-zinc-950/25">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="제목, 본문, 태그 검색..."
              className="h-14 w-full bg-transparent pl-12 pr-12 text-[16px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-200/65 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-blue-800/55"
            />
            {hasQuery && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute top-1/2 right-3 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                aria-label="검색어 초기화"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between text-xs">
          <p className="text-zinc-500 dark:text-zinc-400">
            {hasQuery ? (
              <>
                <span className="font-medium text-zinc-700 dark:text-zinc-200">
                  &quot;{normalizedQuery}&quot;
                </span>{' '}
                검색 결과입니다.
              </>
            ) : (
              '검색어를 입력하면 포스트 리스트가 즉시 필터됩니다.'
            )}
          </p>
          <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-500 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300">
            {hasQuery ? `${resultTotal}개 결과` : `${resultTotal}개 포스트`}
          </span>
        </div>

        <div className="glass-surface relative max-h-[calc(100vh-15.5rem)] overflow-y-auto rounded-2xl border border-zinc-200/90 bg-gradient-to-b from-zinc-50 to-zinc-100/70 p-3 md:p-4 dark:border-zinc-700/80 dark:from-zinc-800/70 dark:to-zinc-900/65">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-35"
            style={{
              backgroundImage:
                'radial-gradient(circle at 12% 8%, rgba(148,163,184,0.1) 0, transparent 33%), radial-gradient(circle at 92% 11%, rgba(59,130,246,0.08) 0, transparent 32%)',
            }}
          />
          <div className="relative">
            {!hasQuery ? (
              <EmptyStatePanel
                className="mx-auto max-w-xl py-12"
                icon={<SearchIcon className="h-5 w-5" />}
                title="검색어를 입력해 포스트를 찾아보세요"
                description="제목, 본문, 태그를 한 번에 검색할 수 있어요."
                hints={['nextjs', 'lighthouse', 'zoom']}
                framed={false}
              />
            ) : !hasResults ? (
              <EmptyStatePanel
                className="mx-auto max-w-xl py-12"
                icon={<SearchIcon className="h-5 w-5" />}
                title="검색 결과가 없습니다"
                description="조금 더 짧은 키워드나 다른 태그로 시도해보세요."
                hints={['React', 'Notion', '성능 최적화']}
                framed={false}
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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
    </div>
  ) : null

  return (
    <>
      <IconControlButton
        srLabel="포스트 검색 열기"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon className="block h-[18px] w-[18px]" />
      </IconControlButton>

      {typeof document !== 'undefined' ? createPortal(overlay, document.body) : null}
    </>
  )
}
