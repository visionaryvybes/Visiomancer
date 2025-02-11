'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PrintifyClient } from '../api/printify/client'
import { WarpBackground } from "../../components/ui/warp-background"

interface Product {
  id: string
  title: string
  description: string
  images: { src: string }[]
  variants: Array<{
    id: string
    price: number
    title: string
    is_enabled: boolean
    options: Record<string, string>
  }>
}

const categories = [
  {
    id: "posters",
    title: "Posters",
    description: "High-quality art prints and posters",
    image: "/categories/posters.jpg",
    count: 24,
    featured: true
  },
  {
    id: "wall-art",
    title: "Wall Art",
    description: "Premium wall art and canvas prints",
    image: "/categories/wall-art.jpg",
    count: 18,
    featured: true
  },
  {
    id: "digital-art",
    title: "Digital Art",
    description: "Contemporary digital artwork",
    image: "/categories/digital-art.jpg",
    count: 15,
    featured: true
  },
  {
    id: "abstract",
    title: "Abstract",
    description: "Abstract and modern art pieces",
    image: "/categories/abstract.jpg",
    count: 12,
    featured: false
  },
  {
    id: "photography",
    title: "Photography",
    description: "Fine art photography prints",
    image: "/categories/photography.jpg",
    count: 20,
    featured: true
  },
  {
    id: "minimalist",
    title: "Minimalist",
    description: "Clean and minimalist designs",
    image: "/categories/minimalist.jpg",
    count: 16,
    featured: false
  }
]

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const client = new PrintifyClient(process.env.NEXT_PUBLIC_PRINTIFY_API_TOKEN || '')
        const response = await client.getProducts()
        
        // Transform the response to match our needs
        const formattedProducts = response.data.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description || '',
          images: product.images,
          variants: product.variants.map(variant => ({
            id: variant.id,
            title: variant.title || '',
            price: variant.price,
            is_enabled: true,
            options: variant.options || {}
          }))
        }))

        setProducts(formattedProducts)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Separate featured and regular categories
  const featuredCategories = categories.filter(cat => cat.featured)
  const regularCategories = categories.filter(cat => !cat.featured)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="bg-[#1A1F2B] rounded-lg overflow-hidden shadow-lg aspect-[4/5]"
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
            <p className="text-lg text-white/70">
              Explore our collection of unique designs across different categories
            </p>
          </div>

          {/* Featured Categories */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Featured Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group relative overflow-hidden rounded-lg bg-white aspect-[4/3]"
                >
                  {/* Category Image */}
                  <div className="absolute inset-0 bg-black">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Category Info */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {category.title}
                    </h3>
                    <p className="text-white/80 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">
                        {category.count} items
                      </span>
                      <span className="text-sm text-blue-400 group-hover:translate-x-1 transition-transform">
                        Browse →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Regular Categories */}
          <div>
            <h2 className="text-2xl font-semibold mb-8">All Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {regularCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <h3 className="font-medium mb-1">{category.title}</h3>
                  <p className="text-sm text-white/60 mb-2 line-clamp-2">
                    {category.description}
                  </p>
                  <span className="text-xs text-white/40">
                    {category.count} items
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-white/60 mb-8">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Categories</span>
          </nav>
        </div>
      </WarpBackground>
    </div>
  )
} 