'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WarpBackground } from '../../components/ui/warp-background'
import { WishlistButton } from '../../components/ui/wishlist-button'
import AddToCartButton from '../../components/AddToCartButton'

interface Product {
  id: string
  title: string
  images: { src: string }[]
  variants: Array<{
    id: string
    title: string
    price: number
  }>
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])

  useEffect(() => {
    const items = JSON.parse(
      localStorage.getItem('wishlist') || '[]'
    ) as Product[]
    setWishlistItems(items)
  }, [])

  if (wishlistItems.length === 0) {
    return (
      <WarpBackground>
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <div className="text-center py-12">
            <p className="text-foreground/60 mb-4">Your wishlist is empty</p>
            <Link
              href="/products"
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </WarpBackground>
    )
  }

  return (
    <WarpBackground>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div key={product.id} className="group relative">
              <div className="relative aspect-square mb-4">
                <Image
                  src={product.images[0]?.src || ''}
                  alt={product.title}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <WishlistButton product={product} />
                </div>
              </div>
              <Link
                href={`/products/${product.id}`}
                className="block group-hover:text-primary"
              >
                <h2 className="font-medium mb-2">{product.title}</h2>
              </Link>
              <p className="text-lg font-semibold mb-4">
                ${product.variants[0]?.price.toFixed(2)}
              </p>
              <AddToCartButton
                product={product}
                variantId={product.variants[0]?.id || ''}
              />
            </div>
          ))}
        </div>
      </div>
    </WarpBackground>
  )
} 