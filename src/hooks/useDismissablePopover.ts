'use client'

import { useEffect, type Dispatch, type RefObject, type SetStateAction } from 'react'

export function useDismissablePopover(
  open: boolean,
  wrapperRef: RefObject<HTMLElement | null>,
  setOpen: Dispatch<SetStateAction<boolean>>
) {
  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, setOpen, wrapperRef])
}
