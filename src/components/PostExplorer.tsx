'use client'

import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import type { Post } from '@/types/notion'
import type { SearchDocument } from '@/lib/postContent'
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

  return (
    <>
      <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xl flex-1">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
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
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white pr-3 pl-9 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 dark:text-zinc-400">
            {filteredPosts.length}개
          </span>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.length === 0 ? (
          <p className="col-span-full py-20 text-center text-zinc-400 dark:text-zinc-400">
            {emptyMessage}
          </p>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
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
