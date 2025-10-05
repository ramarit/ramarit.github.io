'use client'

import { useScrollDepth } from '@/hooks/useScrollDepth'

interface AboutClientProps {
  children: React.ReactNode
}

export function AboutClient({ children }: AboutClientProps) {
  // Track scroll depth for about page
  useScrollDepth({ 
    milestones: [25, 50, 75, 100],
    throttleMs: 200 
  })

  return <>{children}</>
}
