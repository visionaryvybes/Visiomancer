'use client'

import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { toast } from 'sonner'

interface CartItem {
  id: string
  variantId: string
  title: string
  price: number
  quantity: number
  image: string
  size?: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string; variantId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; variantId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'INITIALIZE_CART'; payload: CartItem[] }

interface CartContextType extends CartState {
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string, variantId: string) => void
  updateQuantity: (id: string, variantId: string, quantity: number) => void
  clearCart: () => void
  setCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'INITIALIZE_CART':
      const total = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = action.payload.reduce((count, item) => count + item.quantity, 0)
      return {
        ...state,
        items: action.payload,
        total,
        itemCount
      }

    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.variantId === action.payload.variantId
      )

      let newItems: CartItem[]
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
        toast.success('Item quantity updated in cart')
      } else {
        // Add new item
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
        toast.success('Item added to cart')
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((count, item) => count + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount,
        isOpen: true // Open cart when adding items
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        item => !(item.id === action.payload.id && item.variantId === action.payload.variantId)
      )
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((count, item) => count + item.quantity, 0)

      toast.success('Item removed from cart')

      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity < 1) {
        return cartReducer(state, {
          type: 'REMOVE_ITEM',
          payload: {
            id: action.payload.id,
            variantId: action.payload.variantId
          }
        })
      }

      const newItems = state.items.map(item =>
        item.id === action.payload.id && item.variantId === action.payload.variantId
          ? { ...item, quantity: action.payload.quantity }
          : item
      )

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const itemCount = newItems.reduce((count, item) => count + item.quantity, 0)

      return {
        ...state,
        items: newItems,
        total,
        itemCount
      }
    }

    case 'CLEAR_CART':
      toast.success('Cart cleared')
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      }

    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.payload
      }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart.items)) {
          dispatch({ type: 'INITIALIZE_CART', payload: parsedCart.items })
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      localStorage.removeItem('cart') // Clear potentially corrupted data
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify({
        items: state.items,
        total: state.total,
        itemCount: state.itemCount
      }))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [state.items, state.total, state.itemCount])

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } })
  }

  const removeFromCart = (id: string, variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, variantId } })
  }

  const updateQuantity = (id: string, variantId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, variantId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const setCartOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: isOpen })
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setCartOpen
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