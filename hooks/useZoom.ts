import { useCallback, useState } from 'react'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

interface UseZoomOptions {
  maxScale?: number
  minScale?: number
  initialScale?: number
  onZoomChange?: (scale: number) => void
}

interface UseZoomReturn {
  scale: number
  isZoomed: boolean
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  ZoomWrapper: typeof TransformWrapper
  ZoomComponent: typeof TransformComponent
}

export function useZoom({
  maxScale = 4,
  minScale = 1,
  initialScale = 1,
  onZoomChange,
}: UseZoomOptions = {}): UseZoomReturn {
  const [scale, setScale] = useState(initialScale)
  const [isZoomed, setIsZoomed] = useState(false)

  const handleZoomChange = useCallback((ref: any) => {
    const newScale = ref.state.scale
    setScale(newScale)
    setIsZoomed(newScale > 1)
    onZoomChange?.(newScale)
  }, [onZoomChange])

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.5, maxScale))
    setIsZoomed(true)
  }, [maxScale])

  const zoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev / 1.5, minScale)
      setIsZoomed(newScale > 1)
      return newScale
    })
  }, [minScale])

  const resetZoom = useCallback(() => {
    setScale(initialScale)
    setIsZoomed(false)
  }, [initialScale])

  return {
    scale,
    isZoomed,
    zoomIn,
    zoomOut,
    resetZoom,
    ZoomWrapper: TransformWrapper,
    ZoomComponent: TransformComponent,
  }
} 