import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimationConfig {
  duration?: number
  delay?: number
  ease?: string
}

interface UseAnimationReturn {
  shouldReduceMotion: boolean
  getTransition: (config?: AnimationConfig) => any
  isAnimating: boolean
  setIsAnimating: (value: boolean) => void
}

export function useAnimation(defaultConfig: AnimationConfig = {}): UseAnimationReturn {
  const prefersReducedMotion = useReducedMotion()
  const shouldReduceMotion = prefersReducedMotion ?? false
  const [isAnimating, setIsAnimating] = useState(false)

  const getTransition = (config: AnimationConfig = {}) => {
    if (shouldReduceMotion) {
      return { duration: 0 }
    }

    return {
      duration: config.duration || defaultConfig.duration || 0.3,
      delay: config.delay || defaultConfig.delay || 0,
      ease: config.ease || defaultConfig.ease || 'easeInOut',
    }
  }

  useEffect(() => {
    if (shouldReduceMotion) {
      setIsAnimating(false)
    }
  }, [shouldReduceMotion])

  return {
    shouldReduceMotion,
    getTransition,
    isAnimating,
    setIsAnimating,
  }
} 