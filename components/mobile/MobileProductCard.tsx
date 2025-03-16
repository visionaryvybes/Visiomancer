'use client'

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { PrintifyProduct } from "../../app/api/printify/client"
import { useCart } from "../../context/CartContext"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileProductCardProps {
  product: PrintifyProduct
  priority?: boolean
}

export default function MobileProductCard({ product, priority = false }: MobileProductCardProps) {
  const { title, images, variants } = product
  const imageUrl = images?.[0]?.src
  const { addToCart } = useCart()

  // Get base price from first available variant
  const basePrice = React.useMemo(() => {
    console.log('Product:', title)
    console.log('All variants:', variants.map(v => ({ title: v.title, price: v.price, enabled: v.is_enabled })))
    const enabledVariant = variants.find(v => v.is_enabled)
    const price = enabledVariant?.price || variants[0]?.price || 0
    console.log('Selected price:', price)
    return price
  }, [variants, title])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    const defaultVariant = variants.find(v => v.is_enabled) || variants[0]
    if (defaultVariant && imageUrl) {
      addToCart({
        id: product.id,
        title: product.title,
        price: defaultVariant.price,
        image: imageUrl,
        variantId: defaultVariant.id
      })
    }
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    // TODO: Implement wishlist functionality
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price) // Remove the *100 multiplication
  }

  return (
    <div className="h-full w-full">
      <Link href={`/product/${product.id}`} className="group block h-full">
        <div className="relative h-full overflow-hidden rounded-lg bg-gradient-to-b from-white/10 to-white/5">
          {/* Product Image */}
          <div className="relative aspect-[4/5] w-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover p-2 transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-white/5">
                <span className="text-sm text-white/60">No image</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute inset-x-0 top-0 flex justify-end gap-1.5 p-2">
              <button
                onClick={handleAddToWishlist}
                className="rounded-full bg-black/40 p-2.5 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-red-500 hover:text-white active:scale-95"
                aria-label="Add to wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                onClick={handleAddToCart}
                className="rounded-full bg-black/40 p-2.5 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-blue-500 hover:text-white active:scale-95"
                aria-label="Add to cart"
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3">
            <div className="space-y-1">
              <h3 className="line-clamp-2 text-sm font-medium text-white">
                {title}
              </h3>
              <p className="text-sm font-semibold text-white">
                {formatPrice(basePrice)}
              </p>
            </div>

            {/* View Button */}
            <div className="mt-2">
              <button
                className={cn(
                  "w-full rounded-full bg-black/40 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-sm",
                  "transition-all hover:bg-purple-500 hover:text-white active:scale-95"
                )}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  View Details
                </span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
} 