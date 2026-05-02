'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const TAB_ORDER = ['/', '/news'] as const
type TabPath = (typeof TAB_ORDER)[number]

function isTabPath(path: string): path is TabPath {
  return (TAB_ORDER as readonly string[]).includes(path)
}

type Direction = 'from-left' | 'from-right' | 'none'

interface NavState {
  prev: string
  direction: Direction
}

// 라이프사이클 메모:
// - 이 layout 은 /(tabs) 세그먼트 내에서만 마운트 유지된다 (/, /news, /news/[slug] 포함).
// - /posts/[slug] 등 (tabs) 밖으로 나갔다 돌아오면 layout 자체가 unmount → remount 되어
//   `prev` 가 `pathname` 으로 재초기화되므로 첫 진입 슬라이드는 재생되지 않는다 (의도된 동작).
// - direction 계산은 React 권장 "set state during render" 패턴으로 즉시 동기 재렌더 처리.
export default function TabsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [navState, setNavState] = useState<NavState>({
    prev: pathname,
    direction: 'none',
  })

  if (navState.prev !== pathname) {
    let direction: Direction = 'none'
    if (isTabPath(navState.prev) && isTabPath(pathname)) {
      const prevIdx = TAB_ORDER.indexOf(navState.prev)
      const currIdx = TAB_ORDER.indexOf(pathname)
      direction = currIdx > prevIdx ? 'from-right' : 'from-left'
    }
    setNavState({ prev: pathname, direction })
  }

  useEffect(() => {
    if (!isTabPath(pathname)) return
    const target: TabPath = pathname === '/' ? '/news' : '/'
    router.prefetch(target)
  }, [pathname, router])

  const animClass =
    navState.direction === 'from-right'
      ? 'tab-slide-from-right'
      : navState.direction === 'from-left'
        ? 'tab-slide-from-left'
        : ''

  return (
    <div key={pathname} className={animClass}>
      {children}
    </div>
  )
}
