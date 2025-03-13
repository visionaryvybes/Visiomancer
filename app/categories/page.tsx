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

interface PrintifyProduct {
  id: string
  title: string
  description?: string
  images: Array<{ src: string }>
  variants: Array<{
    id: string
    title?: string
    price: number
    is_enabled?: boolean
    options?: Record<string, string>
  }>
}

interface Category {
  id: string
  title: string
  description: string
  icon: string
  bgColor: string
  keywords: string[]
  count: number
  featured: boolean
}

// Define categories with icons and background colors instead of images
const categories: Category[] = [
  {
    id: "posters",
    title: "Posters",
    description: "High-quality art prints and posters",
    icon: "🖼️",
    bgColor: "bg-gradient-to-br from-blue-600 to-purple-700",
    keywords: ["poster", "print", "art print"],
    count: 3,
    featured: true
  },
  {
    id: "apparel",
    title: "Apparel",
    description: "T-shirts, hoodies, and other clothing items",
    icon: "👕",
    bgColor: "bg-gradient-to-br from-green-600 to-teal-700",
    keywords: ["shirt", "t-shirt", "hoodie", "sweatshirt", "clothing"],
    count: 3,
    featured: true
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "Hats, bags, and other accessories",
    icon: "🧢",
    bgColor: "bg-gradient-to-br from-red-600 to-orange-700",
    keywords: ["hat", "cap", "bag", "accessory"],
    count: 1,
    featured: true
  },
  {
    id: "home-decor",
    title: "Home Decor",
    description: "Decorative items for your home",
    icon: "🏠",
    bgColor: "bg-gradient-to-br from-amber-600 to-yellow-700",
    keywords: ["home", "decor", "decoration", "wall art"],
    count: 3,
    featured: false
  },
  {
    id: "automotive",
    title: "Automotive",
    description: "Car-themed designs and accessories",
    icon: "🚗",
    bgColor: "bg-gradient-to-br from-indigo-600 to-blue-800",
    keywords: ["car", "automotive", "vehicle", "racing"],
    count: 1,
    featured: true
  },
  {
    id: "minimalist",
    title: "Minimalist",
    description: "Clean and minimalist designs",
    icon: "✨",
    bgColor: "bg-gradient-to-br from-gray-700 to-gray-900",
    keywords: ["minimalist", "simple", "clean"],
    count: 1,
    featured: false
  }
]

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setIsLoading] = useState(true)
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<Category[]>(categories)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const client = new PrintifyClient()
        const response = await client.getProducts()
        
        if (!response || !response.data) {
          console.error('Invalid response from Printify API')
          setIsLoading(false)
          return
        }

        // Transform the response to match our needs
        const formattedProducts = response.data.map((product: PrintifyProduct) => ({
          id: product.id,
          title: product.title || '',
          description: product.description || '',
          images: Array.isArray(product.images) ? product.images : [],
          variants: Array.isArray(product.variants) 
            ? product.variants.map((variant: PrintifyProduct['variants'][0]) => ({
                id: variant.id || '',
                title: variant.title || '',
                price: variant.price || 0,
                is_enabled: variant.is_enabled || false,
                options: variant.options || {}
              }))
            : []
        }))

        setProducts(formattedProducts)

        // Update category counts based on product titles and descriptions
        const updatedCategories = categories.map(category => {
          let count = 0;
          
          // Special case for automotive - only count Ford GT
          if (category.id === 'automotive') {
            count = formattedProducts.filter((product: Product) => 
              (product.title.toLowerCase().includes('ford gt'))).length;
          } 
          // Special case for accessories - only count hat products
          else if (category.id === 'accessories') {
            count = formattedProducts.filter((product: Product) => 
              (product.title.toLowerCase().includes('hat'))).length;
          }
          // For other categories, use keywords
          else {
            count = formattedProducts.filter((product: Product) => {
              const titleAndDesc = (product.title + ' ' + product.description).toLowerCase()
              return category.keywords.some(keyword => titleAndDesc.includes(keyword.toLowerCase()))
            }).length;
          }

          // If no products match the category, use the default count or a minimum of 1
          return {
            ...category,
            count: count || Math.max(1, category.count)
          }
        })

        setCategoriesWithCounts(updatedCategories)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Separate featured and regular categories
  const featuredCategories = categoriesWithCounts.filter(cat => cat.featured)
  const regularCategories = categoriesWithCounts.filter(cat => !cat.featured)

  if (loading) {
    return (
      <div className="min-h-screen">
        <WarpBackground>
          <div className="container mx-auto px-4 py-8 sm:py-16">
            <div className="mb-6 sm:mb-12 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">Shop by Category</h1>
              <p className="text-base sm:text-lg text-white/70">
                Loading categories...
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-white/5 rounded-lg overflow-hidden shadow-lg aspect-[4/5]"
                />
              ))}
            </div>
          </div>
        </WarpBackground>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="container mx-auto px-4 py-8 sm:py-16">
          {/* Header */}
          <div className="mb-6 sm:mb-12 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">Shop by Category</h1>
            <p className="text-sm sm:text-base md:text-lg text-white/70">
              Explore our collection of unique designs across different categories
            </p>
          </div>

          {/* Featured Categories */}
          <div className="mb-8 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-8">Featured Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className={`group relative overflow-hidden rounded-lg ${category.bgColor} aspect-[4/3] transition-transform hover:scale-[1.02] shadow-lg`}
                >
                  {/* Category Icon */}
                  <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-3xl sm:text-5xl opacity-30 group-hover:opacity-40 transition-opacity">
                    {category.icon}
                  </div>

                  {/* Category Info */}
                  <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">
                      {category.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-white/80 mb-2 sm:mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-white/60">
                        {category.count} {category.count === 1 ? 'item' : 'items'}
                      </span>
                      <span className="text-xs sm:text-sm text-white group-hover:translate-x-1 transition-transform">
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
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-8">All Categories</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {regularCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className={`group p-3 sm:p-4 rounded-lg border border-white/10 ${category.bgColor} hover:brightness-110 transition-all`}
                >
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <h3 className="text-sm sm:text-base font-medium">{category.title}</h3>
                    <span className="text-xl sm:text-2xl">{category.icon}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/80 mb-1 sm:mb-2 line-clamp-2">
                    {category.description}
                  </p>
                  <span className="text-xs text-white/60">
                    {category.count} {category.count === 1 ? 'item' : 'items'}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-white/60 mt-8 sm:mt-16">
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