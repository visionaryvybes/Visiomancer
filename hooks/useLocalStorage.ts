import { useState, useCallback } from 'react'

export function useLocalStorage() {
  const getItem = useCallback(<T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
      return defaultValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  }, [])

  const setItem = useCallback((key: string, value: unknown) => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [])

  const removeItem = useCallback((key: string) => {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [])

  return {
    getItem,
    setItem,
    removeItem,
  }
} 