'use client'

import React, { useState } from 'react'
import { ShoppingCart, X, Plus, Minus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

export function MiniCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart()

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white/90 hover:text-white transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Cart Panel */}
          <div className="absolute right-0 top-8 z-50 w-96 rounded-lg border border-white/10 bg-black/90 p-4 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-white/10"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="py-8 text-center text-white/60">
                Your cart is empty
              </div>
            ) : (
              <>
                <div className="max-h-96 overflow-auto py-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.variantId}`}
                      className="flex gap-4 border-b border-white/10 py-4 last:border-0"
                    >
                      {/* Product Image */}
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`/products/${item.id}`}
                          className="font-medium hover:text-blue-400"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </Link>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, Math.max(1, (item.quantity || 1) - 1))}
                              className="rounded-full p-1 hover:bg-white/10"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity || 1}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, (item.quantity || 1) + 1)}
                              className="rounded-full p-1 hover:bg-white/10"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-medium">
                              ${(item.price * (item.quantity || 1)).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id, item.variantId)}
                              className="text-red-400 hover:text-red-300"
                              aria-label="Remove item"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    className="mt-4 block w-full rounded-lg bg-blue-500 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
} 