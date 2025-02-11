'use client'

import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { toast } from 'sonner'

interface CartItem {
  id: string
  variantId: string
  quantity: number
  title: string
  price: number
  image: string
}

interface UseCartReturn {
  items: CartItem[]
  total: number
  count: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (itemId: string, variantId: string) => void
  updateQuantity: (itemId: string, variantId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  totalPrice: number
  hasItems: boolean
  findItem: (itemId: string) => CartItem | undefined
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [count, setCount] = useState(0)
  const { getItem, setItem } = useLocalStorage()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = getItem<CartItem[]>('cart', [])
    setItems(savedCart)
  }, [])

  // Update localStorage whenever cart changes
  useEffect(() => {
    setItem('cart', items)
    
    // Update totals
    const newTotal = items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0)
    const newCount = items.reduce((total: number, item: CartItem) => total + item.quantity, 0)
    
    setTotal(newTotal)
    setCount(newCount)
  }, [items, setItem])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((currentItems: CartItem[]) => {
      // Check if item already exists
      const existingItemIndex = currentItems.findIndex((i: CartItem) => 
        i.id === item.id && i.variantId === item.variantId
      )

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...currentItems]
        const existingItem = updatedItems[existingItemIndex]
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + 1
        }
        return updatedItems
      }

      // Add new item if it doesn't exist
      return [...currentItems, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (itemId: string, variantId: string) => {
    setItems((currentItems: CartItem[]) => {
      return currentItems.filter((item: CartItem) => 
        !(item.id === itemId && item.variantId === variantId)
      )
    })
  }

  const updateQuantity = (itemId: string, variantId: string, quantity: number) => {
    setItems((currentItems: CartItem[]) => {
      const updatedItems = currentItems.map((item: CartItem) => {
        if (item.id === itemId && item.variantId === variantId) {
          return { ...item, quantity }
        }
        return item
      })

      // Remove item if quantity is 0
      return updatedItems.filter((item: CartItem) => item.quantity > 0)
    })
  }

  const clearCart = () => {
    setItems([])
    toast.success('Cart cleared')
  }

  const itemCount = count

  const totalPrice = total

  const hasItems = items.length > 0

  const findItem = (itemId: string) => {
    return items.find(item => item.id === itemId)
  }

  return {
    items,
    total,
    count,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
    hasItems,
    findItem,
  }
} 