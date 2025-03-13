'use client'

import React from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from './dialog'
import { Button } from './button'
import { ShoppingCart } from 'lucide-react'
import { PrintifyProduct } from '../../app/api/printify/client'
import { formatPrice } from '../../lib/utils'
import { useCart } from '../../context/CartContext'

interface QuickViewProps {
  isOpen: boolean
  onClose: () => void
  product: PrintifyProduct
}

export function QuickView({ isOpen, onClose, product }: QuickViewProps) {
  const { addToCart } = useCart()

  if (!product) return null

  const handleAddToCart = () => {
    if (product.variants[0]) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.variants[0].price,
        image: product.images[0]?.src || '',
        variantId: product.variants[0].id
      })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100">
            <Image
              src={product.images[0]?.src || '/placeholder.jpg'}
              alt={product.title}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.variants[0]?.price || 0)}
                </span>
                {product.variants.some(v => v.is_enabled) ? (
                  <span className="px-2 py-1 text-xs font-medium bg-green-500/90 text-white rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium bg-red-500/90 text-white rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {product.variants.length} {product.variants.length === 1 ? 'variant' : 'variants'} available
              </div>

              <Button
                className="w-full"
                onClick={handleAddToCart}
                disabled={!product.variants.some(v => v.is_enabled)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 