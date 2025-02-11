import { useEffect, useCallback } from 'react'

type KeyHandler = (event: KeyboardEvent) => void

interface KeyMap {
  [key: string]: KeyHandler
}

interface UseKeyboardNavigationOptions {
  enabled?: boolean
  preventDefault?: boolean
}

export function useKeyboardNavigation(
  keyMap: KeyMap,
  { enabled = true, preventDefault = true }: UseKeyboardNavigationOptions = {}
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      const handler = keyMap[event.key]
      if (handler) {
        if (preventDefault) {
          event.preventDefault()
        }
        handler(event)
      }
    },
    [keyMap, enabled, preventDefault]
  )

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, enabled])

  return {
    enabled,
  }
} 