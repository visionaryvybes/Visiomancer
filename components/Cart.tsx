'use client'

import React from 'react'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const {
    items,
    getCartTotal,
    itemCount,
    isOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
  } = useCart()

  const total = getCartTotal()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="absolute inset-y-0 right-0 flex max-w-full">
        <div className="w-screen max-w-[85vw] sm:max-w-md">
          <div className="flex h-full flex-col overflow-y-scroll bg-black/90 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 px-3 sm:px-4 py-4 sm:py-6">
              <div className="flex items-center gap-1 sm:gap-2">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                <h2 className="text-base sm:text-lg font-medium">Shopping Cart</h2>
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-white/60">
                  ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-lg p-1.5 sm:p-2 text-white/60 hover:bg-white/5 hover:text-white"
                aria-label="Close cart"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <ShoppingCart className="mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 text-white/40" />
                  <p className="text-base sm:text-lg font-medium">Your cart is empty</p>
                  <p className="mt-1 text-xs sm:text-sm text-white/60">
                    Add some awesome products to your cart!
                  </p>
                  <Link
                    href="/products"
                    onClick={() => setCartOpen(false)}
                    className="mt-4 sm:mt-6 rounded-lg bg-blue-500 px-4 sm:px-6 py-2 text-sm sm:text-base font-medium text-white hover:bg-blue-600"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.variantId}`}
                      className="flex gap-3 sm:gap-4"
                    >
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <h3 className="text-sm sm:text-base font-medium line-clamp-2">{item.title}</h3>
                          <button
                            onClick={() => removeFromCart(item.id, item.variantId)}
                            className="text-white/60 hover:text-white ml-1 sm:ml-2"
                            aria-label="Remove item"
                          >
                            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                        {item.size && (
                          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-white/60">
                            Size: {item.size}
                          </p>
                        )}
                        <div className="mt-auto pt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.variantId,
                                  Math.max(1, (item.quantity || 1) - 1)
                                )
                              }
                              className="rounded-lg bg-white/5 p-1 hover:bg-white/10"
                              disabled={(item.quantity || 1) <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <span className="min-w-[1.5rem] sm:min-w-[2rem] text-center text-sm sm:text-base">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.variantId,
                                  (item.quantity || 1) + 1
                                )
                              }
                              className="rounded-lg bg-white/5 p-1 hover:bg-white/10"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                          <p className="text-sm sm:text-base font-medium">
                            ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 px-3 sm:px-4 py-4 sm:py-6">
                <div className="mb-3 sm:mb-4 flex justify-between text-base sm:text-lg font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block w-full rounded-lg bg-blue-500 px-4 sm:px-6 py-2.5 sm:py-3 text-center text-sm sm:text-base font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-3 sm:mt-4 w-full text-center text-xs sm:text-sm text-white/60 hover:text-white"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 