'use client'

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, Heart } from "lucide-react"
import { useCart } from "../context/CartContext"
import { WishlistButton } from "./ui/wishlist-button"
import { Button } from "./ui/button"
import { formatPrice } from "../lib/utils"

interface ProductCardProps {
  product: {
    id: string
    title: string
    description: string
    images: { src: string }[]
    variants: Array<{
      id: string
      title: string
      price: number
      is_enabled: boolean
      options: Record<string, string>
    }>
  }
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const defaultVariant = product.variants[0]
  const price = defaultVariant?.price || 0

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    if (defaultVariant) {
      addToCart({
        id: product.id,
        title: product.title,
        price: defaultVariant.price,
        image: product.images[0]?.src || '',
        variantId: defaultVariant.id
      })
    }
  }

  return (
    <div className="h-full flex flex-col rounded-lg bg-[#1a1f4d] overflow-hidden">
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square bg-white p-6">
          <Image
            src={product.images[0]?.src || ''}
            alt={product.title}
            fill
            priority={priority}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/products/${product.id}`} className="flex-grow">
          <h3 className="text-base font-medium text-white mb-4 line-clamp-2 hover:text-blue-400 transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">
                {formatPrice(price)}
              </span>
              <span className="text-sm text-white/60">CAD</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-white/60">In Stock</span>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#1e254d] hover:bg-[#252b57] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
} 