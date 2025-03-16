'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, getBestPrice } from '../utils/formatters'

interface Product {
  id: string
  title: string
  images: { src: string }[]
  variants: Array<{
    id: string
    price: number
  }>
}

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const recentlyViewed = JSON.parse(
      localStorage.getItem('recently-viewed') || '[]'
    ) as Product[]
    setProducts(recentlyViewed.slice(-4)) // Show last 4 viewed products
  }, [])

  if (products.length === 0) return null

  return (
    <div className="py-8">
      <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((product) => (
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
              {formatPrice(getBestPrice(product.variants))}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
} 