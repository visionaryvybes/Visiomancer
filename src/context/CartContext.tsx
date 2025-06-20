"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { CartItem, Product, ProductSource } from '@/types'
import toast from 'react-hot-toast'

const LOCAL_STORAGE_KEY = 'myEcomCart'

interface CartContextType {
  cartItems: CartItem[]
  addItem: (item: Product, quantity: number, selectedVariantId?: string | number, selectedOptions?: Record<string, string>) => void
  removeItem: (itemId: string, selectedVariantId?: string | number) => void
  updateQuantity: (itemId: string, selectedVariantId: string | number | undefined, newQuantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getItemCount: () => number
  isCartLoaded: boolean;
  getGumroadItems: () => CartItem[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false); // To prevent hydration mismatch

  // Load cart from localStorage on initial mount
  useEffect(() => {
    console.log('[CartContext] Initial load effect triggered.');
    const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY)
    console.log('[CartContext] Read from localStorage:', storedCart);
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        console.log('[CartContext] Parsed cart from storage:', parsedCart);
        console.log('[CartContext] State BEFORE setting from storage:', cartItems);
        setCartItems(parsedCart)
        console.log('[CartContext] State AFTER setting from storage - should reflect parsedCart shortly.');
      } catch (error) {
        console.error('[CartContext] Error parsing cart from localStorage:', error);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
      }
    }
    setIsLoaded(true); // Mark as loaded after initial state sync
    console.log('[CartContext] Marked as loaded.');
  }, [])

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) { // Only save after initial load
        console.log('[CartContext] Persisting to localStorage:', cartItems);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems))
    }
  }, [cartItems, isLoaded])

  const addItem = useCallback((item: Product, quantity: number, selectedVariantId?: string | number, selectedOptions?: Record<string, string>) => {
    console.log('[CartContext] addItem called:', { product: item.name, quantity, selectedVariantId, selectedOptions });
    console.log('[CartContext] !!! addItem function execution start !!!');

    let isNewItem = false; // Flag to track if it's an add or update

    setCartItems(prevItems => {
      console.log('[CartContext] setCartItems updater function running.');
      const cartItemId = selectedVariantId ? `${item.id}-${selectedVariantId}` : item.id;
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => (
             (cartItem.selectedVariantId ? `${cartItem.product?.id}-${cartItem.selectedVariantId}` : cartItem.product?.id)
             === cartItemId
            )
      );

      if (existingItemIndex > -1) {
        // Item exists - Prepare for update
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        // Don't toast here
        isNewItem = false; // Mark as update
        return updatedItems;
      } else {
        // Item doesn't exist - Prepare for add
        const newItem: CartItem = { product: item, quantity, selectedVariantId, selectedOptions };
        // Don't toast here
        isNewItem = true; // Mark as new item
        return [...prevItems, newItem];
      }
    });

    // Show toast *after* state update, based on the flag
    if (isNewItem) {
      toast.success(`${item.name} added to cart.`);
    } else {
      toast.success(`${item.name} quantity updated in cart.`);
    }
    console.log('[CartContext] !!! addItem function execution end !!!'); // Log end
    
    // Note: Pinterest conversion tracking is now handled by ConversionsContext
    // This avoids duplicate tracking events

  }, []);

  const removeItem = useCallback((itemId: string, selectedVariantId?: string | number) => {
    console.log('[CartContext] removeItem called:', { itemId, selectedVariantId });
    const cartItemId = selectedVariantId ? `${itemId}-${selectedVariantId}` : itemId;
    let itemRemoved = false; // Flag

    setCartItems(prevItems => {
      const initialLength = prevItems.length;
      const newItems = prevItems.filter(item => {
        // Check product existence before accessing id
        if (!item || !item.product) return true; // Keep item if product is missing (shouldn't happen ideally)
        const currentCartItemId = item.selectedVariantId ? `${item.product.id}-${item.selectedVariantId}` : item.product.id;
        return currentCartItemId !== cartItemId;
      });
      itemRemoved = newItems.length < initialLength; // Check if an item was actually removed
      // Don't toast here
      return newItems;
    });

    // Toast after state update only if an item was removed
    if (itemRemoved) {
      toast.success('Item removed from cart.');
    }
    console.log('[CartContext] removeItem execution end.');

  }, []);

  const updateQuantity = useCallback((itemId: string, selectedVariantId: string | number | undefined, newQuantity: number) => {
    console.log('[CartContext] updateQuantity called:', { itemId, selectedVariantId, newQuantity });
    const cartItemId = selectedVariantId ? `${itemId}-${selectedVariantId}` : itemId;

    setCartItems(prevItems => {
      const itemIndex = prevItems.findIndex(
        (cartItem) => {
            // Check product existence before accessing id
            if (!cartItem || !cartItem.product) return false;
            const currentCartItemId = cartItem.selectedVariantId ? `${cartItem.product.id}-${cartItem.selectedVariantId}` : cartItem.product.id;
            return currentCartItemId === cartItemId;
        }
      );

      if (itemIndex === -1) { 
          return prevItems; // Item not found
      }

      if (newQuantity <= 0) {
        // Don't toast here - do it after state update
        return prevItems.filter((_, index) => index !== itemIndex);
      } else {
        // Don't toast here - do it after state update
        const updatedItems = [...prevItems];
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], quantity: newQuantity };
        return updatedItems;
      }
    });

    console.log('[CartContext] updateQuantity execution end.');

  }, []);

  const clearCart = useCallback(() => {
    setCartItems([])
    toast.success('Cart cleared.');
  }, [])

  const getCartTotal = useCallback((): number => {
    return cartItems.reduce((total, item) => {
      // Ensure item and product exist before processing
      if (!item || !item.product) return total;

      let itemPrice = item.product.price;

      // Check for specific variant price
      if (item.selectedVariantId && item.product.variantDetails) {
          // Find the optionKey or directly use variantId depending on structure
          // Assuming variantDetails maps selectedVariantId to price
          const variantDetail = item.product.variantDetails.find(vd => vd.variantId === item.selectedVariantId);
          if (variantDetail) {
              itemPrice = variantDetail.price;
          }
      }

      return total + itemPrice * item.quantity;
    }, 0)
  }, [cartItems])

  const getItemCount = useCallback((): number => {
      // Ensure item exists before accessing quantity
      return cartItems.reduce((count, item) => count + (item?.quantity || 0), 0)
  }, [cartItems])

  // --- Filtering Functions ---
  const getGumroadItems = useCallback((): CartItem[] => {
    const gumroadItems = cartItems.filter(
      (item) => item && item.product && item.product.source === 'gumroad'
    );

    const aggregatedItems: { [key: string]: CartItem } = {};

    gumroadItems.forEach((item) => {
      const { product, quantity } = item;
      const key = product.id; // Aggregate by base product ID for simplicity

      if (aggregatedItems[key]) {
        aggregatedItems[key].quantity += quantity;
      } else {
        aggregatedItems[key] = { ...item };
      }
    });
    
    return Object.values(aggregatedItems);
  }, [cartItems]);

  // --- Calculate Subtotals ---
  const calculateSubtotal = useCallback((items: CartItem[]): number => {
       return items.reduce((total, item) => {
           // Ensure item and product exist before processing
            if (!item || !item.product) return total;

            let itemPrice = item.product.price;
            if (item.selectedVariantId && item.product.variantDetails) {
                const variantDetail = item.product.variantDetails.find(vd => vd.variantId === item.selectedVariantId);
                if (variantDetail) {
                    itemPrice = variantDetail.price;
                }
            }
            return total + itemPrice * item.quantity;
        }, 0)
  }, []); // Dependency array is empty as it uses the passed items
  
  const getGumroadTotal = useCallback((): number => {
      return calculateSubtotal(getGumroadItems());
  }, [getGumroadItems, calculateSubtotal]);

  // --- Checkout Functions ---

  const initiateGumroadCheckout = useCallback(() => {
    const items = getGumroadItems();
    if (items.length === 0) {
      toast.error("No Gumroad items in cart.")
      return
    }
    const firstItem = items[0];
    if (firstItem?.product.gumroadUrl) {
      toast.success(`Redirecting to Gumroad for ${firstItem.product.name}...`);
      window.open(firstItem.product.gumroadUrl, '_blank'); // Open in new tab
      // Note: Handling multiple Gumroad items might require a different approach
    } else {
      toast.error("Could not find checkout URL for Gumroad item.");
    }
  }, [getGumroadItems])

  // --- End Checkout Functions ---

  const value = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    isCartLoaded: isLoaded,
    getGumroadItems,
    getGumroadTotal,
    initiateGumroadCheckout,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 