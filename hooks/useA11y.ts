import { useCallback, useEffect, useState } from 'react'
import { useTheme } from './useTheme'

interface UseA11yOptions {
  enableHighContrast?: boolean
  enableReducedMotion?: boolean
  enableFontScaling?: boolean
}

interface UseA11yReturn {
  isHighContrast: boolean
  toggleHighContrast: () => void
  prefersReducedMotion: boolean
  toggleReducedMotion: () => void
  fontScale: number
  increaseFontScale: () => void
  decreaseFontScale: () => void
  resetFontScale: () => void
  focusVisible: boolean
  setFocusVisible: (visible: boolean) => void
}

export function useA11y({
  enableHighContrast = true,
  enableReducedMotion = true,
  enableFontScaling = true,
}: UseA11yOptions = {}): UseA11yReturn {
  const { setTheme } = useTheme()
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [fontScale, setFontScale] = useState(1)
  const [focusVisible, setFocusVisible] = useState(true)

  useEffect(() => {
    if (enableReducedMotion) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [enableReducedMotion])

  const toggleHighContrast = useCallback(() => {
    if (!enableHighContrast) return
    setIsHighContrast(prev => {
      const newValue = !prev
      setTheme(newValue ? 'high-contrast' : 'dark')
      return newValue
    })
  }, [enableHighContrast, setTheme])

  const toggleReducedMotion = useCallback(() => {
    if (!enableReducedMotion) return
    setPrefersReducedMotion(prev => !prev)
  }, [enableReducedMotion])

  const increaseFontScale = useCallback(() => {
    if (!enableFontScaling) return
    setFontScale(prev => Math.min(prev + 0.1, 2))
  }, [enableFontScaling])

  const decreaseFontScale = useCallback(() => {
    if (!enableFontScaling) return
    setFontScale(prev => Math.max(prev - 0.1, 0.8))
  }, [enableFontScaling])

  const resetFontScale = useCallback(() => {
    if (!enableFontScaling) return
    setFontScale(1)
  }, [enableFontScaling])

  useEffect(() => {
    if (!enableFontScaling) return
    document.documentElement.style.setProperty('--font-scale', fontScale.toString())
  }, [fontScale, enableFontScaling])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setFocusVisible(true)
      }
    }

    const handleMouseDown = () => {
      setFocusVisible(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return {
    isHighContrast,
    toggleHighContrast,
    prefersReducedMotion,
    toggleReducedMotion,
    fontScale,
    increaseFontScale,
    decreaseFontScale,
    resetFontScale,
    focusVisible,
    setFocusVisible,
  }
} 