'use client'

import React, { useEffect, useState } from "react"
import ProductCard from "./ProductCard"
import { Loader2 } from "lucide-react"

interface PrintifyProduct {
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
  options: Array<{
    name: string
    values: string[]
  }>
}

export default function ProductGrid() {
  const [products, setProducts] = useState<PrintifyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/printify/products')
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }

        setProducts(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded-2xl bg-gray-800" />
            <div className="mt-4 space-y-3">
              <div className="h-4 w-2/3 rounded bg-gray-800" />
              <div className="h-4 w-1/3 rounded bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/10 bg-red-500/5 p-4 text-center text-red-500">
        {error}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-lg text-muted-foreground">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          priority={index < 4} // Set priority for first 4 products (above the fold)
        />
      ))}
    </div>
  )
} 