'use client'

import React, { createContext, useContext, useEffect, useState } from "react"

interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
  variantId: string
  variantTitle: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: any, variantId: string, quantity?: number) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product: any, variantId: string, quantity = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => 
        item.id === product.id && item.variantId === variantId
      )
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id && item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      const variant = product.variants.find((v: any) => v.id === variantId)
      if (!variant) return currentItems

      return [...currentItems, {
        id: product.id,
        title: product.title,
        price: variant.price,
        image: product.images[0]?.src || '/placeholder.jpg',
        quantity,
        variantId: variant.id,
        variantTitle: variant.title
      }]
    })
  }

  const removeItem = (productId: string, variantId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => 
        !(item.id === productId && item.variantId === variantId)
      )
    )
  }

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity < 1) return
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      total
    }}>
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