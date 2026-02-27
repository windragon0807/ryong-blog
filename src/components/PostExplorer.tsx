'use client'

import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import type { Post } from '@/types/notion'
import type { SearchDocument } from '@/lib/postContent'
import { AnimatedNumber } from './AnimatedNumber'
import { PostCard } from './PostCard'

interface Props {
  posts: Post[]
  emptyMessage?: string
}

export function PostExplorer({
  posts,
  emptyMessage = '조건에 맞는 글이 없습니다.',
}: Props) {
  const [query, setQuery] = useState('')
  const [animationCycle, setAnimationCycle] = useState(0)
  const [searchDocuments, setSearchDocuments] = useState<SearchDocument[]>(() =>
    postsToFallbackDocuments(posts)
  )

  useEffect(() => {
    setSearchDocuments(postsToFallbackDocuments(posts))
  }, [posts])

  useEffect(() => {
    let cancelled = false
    const postIds = new Set(posts.map((post) => post.id))

    fetch('/api/search-index', {
      method: 'GET',
      cache: 'force-cache',
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error())))
      .then((documents: SearchDocument[]) => {
        if (cancelled) return
        const scoped = documents.filter((document) => postIds.has(document.id))
        if (scoped.length > 0) {
          setSearchDocuments(scoped)
        }
      })
      .catch(() => {
        // Keep fallback index when request fails.
      })

    return () => {
      cancelled = true
    }
  }, [posts])

  const fuse = useMemo(() => {
    return new Fuse(searchDocuments, {
      keys: [
        { name: 'title', weight: 3.8 },
        { name: 'description', weight: 2.2 },
        { name: 'tags', weight: 2.1 },
        { name: 'series', weight: 1.8 },
        { name: 'content', weight: 1.4 },
      ],
      threshold: 0.36,
      ignoreLocation: true,
      minMatchCharLength: 1,
    })
  }, [searchDocuments])

  const filteredPosts = useMemo(() => {
    const normalized = query.trim()
    if (!normalized) return posts

    const matchedIds = new Set(
      fuse.search(normalized).map((result) => result.item.id)
    )

    return posts.filter((post) => matchedIds.has(post.id))
  }, [fuse, posts, query])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnimationCycle((previous) => previous + 1)
    }, 90)

    return () => window.clearTimeout(timer)
  }, [query, posts])

  return (
    <>
      <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="group relative max-w-xl flex-1">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-all duration-200 ease-out group-focus-within:scale-110 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="제목, 본문, 태그로 검색..."
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white/95 pr-3 pl-9 text-sm text-zinc-700 placeholder:text-zinc-400 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] transition-[border-color,box-shadow,background-color] duration-200 focus:border-blue-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800/95 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-700 dark:focus:bg-zinc-800 dark:focus:ring-blue-900/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <span
            key={filteredPosts.length}
            className="inline-flex min-w-[3rem] justify-end text-xs text-zinc-400 transition-all duration-200 ease-out motion-safe:animate-[count-pop_280ms_ease] dark:text-zinc-400"
          >
            <AnimatedNumber value={filteredPosts.length} />개
          </span>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.length === 0 ? (
          <p className="col-span-full py-20 text-center text-zinc-400 dark:text-zinc-400">
            {emptyMessage}
          </p>
        ) : (
          filteredPosts.map((post, index) => (
            <PostCard
              key={`${post.id}-${animationCycle}`}
              post={post}
              motionIndex={index}
              motionCycle={animationCycle}
            />
          ))
        )}
      </section>
    </>
  )
}

function postsToFallbackDocuments(posts: Post[]): SearchDocument[] {
  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    tags: post.tags,
    series: post.series,
    content: post.description,
  }))
}
