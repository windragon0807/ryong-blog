import type { ReactNode } from 'react'
import { EmptyState } from '@/components/common/EmptyState'

interface EmptyStatePanelProps {
  title: string
  description: string
  hints?: string[]
  icon?: ReactNode
  className?: string
  framed?: boolean
}

export function EmptyStatePanel(props: EmptyStatePanelProps) {
  return <EmptyState {...props} />
}
