import { useState, useEffect } from 'react'

interface UseImageLoaderReturn {
  isLoading: boolean
  error: string | null
  handleLoad: () => void
  handleError: () => void
}

export function useImageLoader(src?: string): UseImageLoaderReturn {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!src) {
      setError('No image source provided')
      setIsLoading(false)
      return
    }

    // Reset states when src changes
    setIsLoading(true)
    setError(null)

    // Preload image
    const img = new Image()
    img.src = src

    img.onload = () => {
      setIsLoading(false)
    }

    img.onerror = () => {
      setError('Failed to load image')
      setIsLoading(false)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError('Failed to load image')
    setIsLoading(false)
  }

  return {
    isLoading,
    error,
    handleLoad,
    handleError
  }
} 