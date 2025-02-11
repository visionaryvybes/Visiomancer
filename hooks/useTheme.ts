import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface UseThemeReturn {
  theme: string
  setTheme: (theme: string) => void
  themes: string[]
  systemTheme: string | undefined
  isLoading: boolean
  isDark: boolean
  isLight: boolean
  toggleTheme: () => void
}

export function useTheme(): UseThemeReturn {
  const { theme, setTheme, systemTheme, themes } = useNextTheme()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')
  const isLight = theme === 'light' || (theme === 'system' && systemTheme === 'light')

  const toggleTheme = () => {
    if (isDark) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return {
    theme: theme || 'system',
    setTheme,
    themes: themes || [],
    systemTheme,
    isLoading,
    isDark,
    isLight,
    toggleTheme,
  }
} 