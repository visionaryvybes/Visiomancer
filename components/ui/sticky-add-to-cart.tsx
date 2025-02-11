'use client'

import React from 'react'
import { useCart } from '../../context/CartContext'

interface Product {
  id: string
  title: string
  images: { src: string }[]
  variants: Array<{
    id: string
    title: string
    price: number
    is_enabled: boolean
  }>
}

interface StickyAddToCartProps {
  product: Product
  selectedVariantId: string
  className?: string
}

export function StickyAddToCart({
  product,
  selectedVariantId,
  className = ''
}: StickyAddToCartProps) {
  const { addItem } = useCart()
  const selectedVariant = product.variants.find(v => v.id === selectedVariantId)

  if (!selectedVariant) return null

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-background border-t p-4 md:hidden z-40 ${className}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div>
          <p className="text-sm font-medium truncate">{product.title}</p>
          <p className="text-lg font-bold">
            ${selectedVariant.price.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => addItem(product, selectedVariantId)}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
} 