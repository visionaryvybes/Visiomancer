import { useCallback, useEffect, useRef, useState } from 'react'

interface TouchPosition {
  x: number
  y: number
}

interface UseGesturesOptions {
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void
  onPinch?: (scale: number) => void
  threshold?: number
  enabled?: boolean
}

interface UseGesturesReturn {
  ref: React.RefObject<HTMLDivElement>
  isGesturing: boolean
  scale: number
}

export function useGestures({
  onSwipe,
  onPinch,
  threshold = 50,
  enabled = true,
}: UseGesturesOptions = {}): UseGesturesReturn {
  const ref = useRef<HTMLDivElement>(null)
  const [isGesturing, setIsGesturing] = useState(false)
  const [scale, setScale] = useState(1)
  const touchStart = useRef<TouchPosition>({ x: 0, y: 0 })
  const touchEnd = useRef<TouchPosition>({ x: 0, y: 0 })

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    touchEnd.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }

    if (e.touches.length === 2 && onPinch) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const newScale = distance / 100
      setScale(newScale)
      onPinch(newScale)
    }

    setIsGesturing(true)
  }, [onPinch])

  const handleTouchEnd = useCallback(() => {
    const deltaX = touchStart.current.x - touchEnd.current.x
    const deltaY = touchStart.current.y - touchEnd.current.y

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        onSwipe?.(deltaX > 0 ? 'left' : 'right')
      } else {
        onSwipe?.(deltaY > 0 ? 'up' : 'down')
      }
    }

    setIsGesturing(false)
    setScale(1)
  }, [onSwipe, threshold])

  useEffect(() => {
    const element = ref.current
    if (!element || !enabled) return

    element.addEventListener('touchstart', handleTouchStart)
    element.addEventListener('touchmove', handleTouchMove)
    element.addEventListener('touchend', handleTouchEnd)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    ref,
    isGesturing,
    scale,
  }
} 