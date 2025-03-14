'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

interface CartItem {
  id: string
  title: string
  price: number
  image: string
  variantId: string
  quantity?: number
  size?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (itemId: string, variantId?: string) => void
  removeItem: (itemId: string, variantId?: string) => void
  updateQuantity: (itemId: string, variantId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  isOpen: boolean
  setCartOpen: (isOpen: boolean) => void
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [itemCount, setItemCount] = useState(0)

  // Update item count whenever items change
  useEffect(() => {
    const count = items.reduce((total, item) => total + (item.quantity || 1), 0)
    setItemCount(count)
  }, [items])

  const addToCart = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => item.id === newItem.id && item.variantId === newItem.variantId
      )
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...currentItems]
        const existingItem = updatedItems[existingItemIndex]
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: (existingItem.quantity || 1) + 1
        }
        return updatedItems
      }
      
      return [...currentItems, { ...newItem, quantity: 1 }]
    })
    
    // Open cart when adding items
    setIsOpen(true)
  }

  const removeFromCart = (itemId: string, variantId?: string) => {
    setItems(currentItems => {
      if (variantId) {
        return currentItems.filter(
          item => !(item.id === itemId && item.variantId === variantId)
        )
      }
      return currentItems.filter(item => item.id !== itemId)
    })
  }

  // Alias for backward compatibility
  const removeItem = removeFromCart;

  const updateQuantity = (itemId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId, variantId)
      return
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        (item.id === itemId && item.variantId === variantId)
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)
  }

  const setCartOpen = (open: boolean) => {
    setIsOpen(open)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        isOpen,
        setCartOpen,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 