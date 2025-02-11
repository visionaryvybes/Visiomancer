'use client'

import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { toast } from 'sonner'

interface Product {
  id: string
  title: string
  description: string
  images: { src: string }[]
  variants: Array<{
    id: string
    title: string
    price: number
    is_enabled: boolean
    options: Record<string, string>
  }>
  options: Array<{
    name: string
    values: string[]
  }>
}

interface UseProductReturn {
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  recentlyViewed: Product[]
  addToRecentlyViewed: (product: Product) => void
  compareList: Product[]
  addToCompare: (product: Product) => void
  removeFromCompare: (productId: string) => void
  clearCompareList: () => void
  toggleWishlist: (product: Product) => void
}

const WISHLIST_KEY = 'wishlist'
const RECENTLY_VIEWED_KEY = 'recentlyViewed'
const MAX_RECENTLY_VIEWED = 10

export function useProduct(): UseProductReturn {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [compareList, setCompareList] = useState<Product[]>([])
  const { getItem, setItem } = useLocalStorage()

  // Load data from localStorage on mount
  useEffect(() => {
    const savedRecentlyViewed = getItem<Product[]>(RECENTLY_VIEWED_KEY, [])
    const savedWishlist = getItem<Product[]>(WISHLIST_KEY, [])
    const savedCompareList = getItem<Product[]>('compare-list', [])

    setRecentlyViewed(savedRecentlyViewed)
    setWishlist(savedWishlist)
    setCompareList(savedCompareList)
  }, [])

  // Update localStorage when data changes
  useEffect(() => {
    setItem(RECENTLY_VIEWED_KEY, recentlyViewed)
  }, [recentlyViewed, setItem])

  useEffect(() => {
    setItem(WISHLIST_KEY, wishlist)
  }, [wishlist, setItem])

  useEffect(() => {
    setItem('compare-list', compareList)
  }, [compareList, setItem])

  const addToWishlist = (product: Product) => {
    setWishlist(current => {
      const exists = current.some(item => item.id === product.id)
      if (exists) return current
      toast.success('Added to wishlist')
      return [...current, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist(current => {
      toast.success('Removed from wishlist')
      return current.filter(item => item.id !== productId)
    })
  }

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some(item => item.id === productId)
  }

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(current => {
      const filtered = current.filter(item => item.id !== product.id)
      return [product, ...filtered].slice(0, MAX_RECENTLY_VIEWED)
    })
  }

  const toggleWishlist = (product: Product) => {
    setWishlist((current: Product[]) => {
      const exists = current.some((item: Product) => item.id === product.id)
      if (exists) {
        // Remove from wishlist
        return current.filter((item: Product) => item.id !== product.id)
      } else {
        // Add to wishlist
        return [...current, product]
      }
    })
  }

  const addToCompare = (product: Product) => {
    setCompareList(current => {
      if (current.length >= 4) {
        toast.error('Can only compare up to 4 products')
        return current
      }
      const exists = current.some(item => item.id === product.id)
      if (exists) return current
      toast.success('Added to compare')
      return [...current, product]
    })
  }

  const removeFromCompare = (productId: string) => {
    setCompareList(current => {
      toast.success('Removed from compare')
      return current.filter(item => item.id !== productId)
    })
  }

  const clearCompareList = () => {
    setCompareList([])
    toast.success('Compare list cleared')
  }

  return {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    recentlyViewed,
    addToRecentlyViewed,
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompareList,
    toggleWishlist,
  }
} 