'use client'

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { WarpBackground } from "../../components/ui/warp-background"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const total = getCartTotal()
  const itemCount = items.reduce((count, item) => count + (item.quantity || 1), 0)

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <WarpBackground>
          <div className="flex flex-col items-center justify-center py-32">
            <h1 className="mb-4 text-2xl font-bold">Your cart is empty</h1>
            <p className="mb-8 text-muted-foreground">
              Add some products to your cart and they will appear here
            </p>
            <Link
              href="/products"
              className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
          </div>
        </WarpBackground>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.variantId}`}
                      className="flex gap-4 rounded-lg border bg-card p-4"
                    >
                      <div className="relative aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">Variant: {item.variantId}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.variantId)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const newQuantity = Math.max(1, (item.quantity || 1) - 1);
                                updateQuantity(item.id, item.variantId, newQuantity);
                              }}
                              className="rounded-md border p-1 hover:bg-accent"
                              disabled={(item.quantity || 1) <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity || 1}</span>
                            <button
                              onClick={() => {
                                const newQuantity = (item.quantity || 1) + 1;
                                updateQuantity(item.id, item.variantId, newQuantity);
                              }}
                              className="rounded-md border p-1 hover:bg-accent"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="font-medium">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-20">
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Items ({itemCount})</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="mt-6 block w-full rounded-lg bg-primary px-6 py-3 text-center font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 