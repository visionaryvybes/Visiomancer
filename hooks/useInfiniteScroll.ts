import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export function useInfiniteScroll({
  threshold = 0.5,
  rootMargin = '100px',
  enabled = true,
}: UseInfiniteScrollOptions = {}) {
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout>()

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
  })

  useEffect(() => {
    if (!enabled || !inView || isLoading || !hasMore) return

    const loadMore = () => {
      setIsLoading(true)
      // Simulate loading delay
      loadMoreTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }

    loadMore()

    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current)
      }
    }
  }, [inView, isLoading, hasMore, enabled])

  return {
    ref,
    isLoading,
    hasMore,
    setHasMore,
  }
} 