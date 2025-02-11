'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

interface Product {
  id: string
  title: string
  description: string
  images: { src: string }[]
  variants: Array<{
    id: string
    title: string
    price: number
    is_enabled: boolean
  }>
  category: string
}

interface ProductRecommendationsProps {
  currentProduct: Product
  allProducts: Product[]
}

export default function ProductRecommendations({
  currentProduct,
  allProducts
}: ProductRecommendationsProps) {
  // Get 4 products from the same category, excluding the current product
  const recommendations = allProducts
    .filter(product => 
      product.category === currentProduct.category && 
      product.id !== currentProduct.id
    )
    .slice(0, 4)

  if (recommendations.length === 0) return null

  return (
    <div className="py-8">
      <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <div className="relative aspect-square mb-2">
              <Image
                src={product.images[0]?.src || ''}
                alt={product.title}
                fill
                className="object-cover rounded-lg group-hover:opacity-90 transition-opacity"
              />
            </div>
            <h3 className="text-sm font-medium truncate">{product.title}</h3>
            <p className="text-sm text-foreground/60">
              ${product.variants[0]?.price.toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
} 