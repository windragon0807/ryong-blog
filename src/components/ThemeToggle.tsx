'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  if (!mounted) {
    return <div className={styles.placeholder} aria-hidden />
  }

  const isDark = resolvedTheme === 'dark'
  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <div className={styles.root} data-state={isDark ? 'dark' : 'light'}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="테마 전환"
        role="switch"
        aria-checked={isDark}
        className={styles.switch}
      >
        <span className={styles.scene}>
          <span className={styles.sky} />
          <span className={styles.cloudLeft} />
          <span className={styles.cloudRight} />
          <span className={styles.stars} />
          <span className={styles.sunGlow} />
          <span className={styles.sun} />
          <span className={styles.moon} />
          <span className={styles.hillBack} />
          <span className={styles.hillLeft} />
          <span className={styles.hillFront} />
          <span className={styles.bush} />
          <span className={styles.trunk} />
          <span className={styles.trunkHighlight} />
          <span className={styles.trunkShadow} />
          <span className={styles.canopyBase} />
          <span className={styles.canopyPuffLeft} />
          <span className={styles.canopyPuffTop} />
          <span className={styles.canopyPuffRight} />
          <span className={styles.canopyShade} />
          <span className={styles.branchMain} />
          <span className={styles.branchLeft} />
          <span className={styles.branchRight} />
          <span className={styles.branchTwigLeft} />
          <span className={styles.branchTwigRight} />
        </span>
        <span className={styles.thumb} />
      </button>
    </div>
  )
}
