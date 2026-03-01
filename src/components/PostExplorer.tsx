'use client'

import { useEffect, useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import type { Post } from '@/types/notion'
import type { SearchDocument } from '@/lib/postContent'
import { usePostSearch } from './PostSearchProvider'
import { PostCard } from './PostCard'
import { EmptyStatePanel } from './EmptyStatePanel'

interface Props {
  posts: Post[]
  emptyTitle?: string
  emptyMessage?: string
}

export function PostExplorer({
  posts,
  emptyTitle = '아직 게시된 글이 없어요',
  emptyMessage = '조건에 맞는 글이 없습니다.',
}: Props) {
  const { query, setResultCount, setResultPosts } = usePostSearch()
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
  }, [posts])

  useEffect(() => {
    setResultCount(filteredPosts.length)
    setResultPosts(filteredPosts)
  }, [filteredPosts, setResultCount, setResultPosts])

  useEffect(() => {
    return () => setResultCount(null)
  }, [setResultCount])

  useEffect(() => {
    return () => setResultPosts([])
  }, [setResultPosts])

  return (
    <>
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {posts.length === 0 ? (
          <EmptyStatePanel
            className="col-span-full py-14"
            title={emptyTitle}
            description={emptyMessage}
            hints={['Notion에서 새 글 작성', '게시(Published) 체크', '잠시 후 자동 반영']}
          />
        ) : (
          posts.map((post, index) => (
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
