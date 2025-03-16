'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const categoryKeywords = {
  "posters": ["poster", "print", "art print", "wall art"],
  "apparel": ["shirt", "t-shirt", "hoodie", "sweatshirt", "clothing", "tee", "unisex"],
  "accessories": ["hat", "cap", "bag", "accessory", "patch", "dad hat", "leather"],
  "home-decor": ["home", "decor", "decoration", "wall art", "poster"],
  "automotive": ["ford gt", "car", "racing", "automotive", "vehicle"],
  "minimalist": ["minimalist", "simple", "clean", "awaken"]
}

const categoryDisplayNames = {
  "posters": "Posters",
  "apparel": "Apparel",
  "accessories": "Accessories",
  "home-decor": "Home Decor",
  "automotive": "Automotive",
  "minimalist": "Minimalist"
}

interface CategoryNavProps {
  isLoading?: boolean
  error?: string | null
}

export default function CategoryNav({ isLoading, error }: CategoryNavProps) {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')

  const formatCategoryName = (category: string): string => {
    return categoryDisplayNames[category as keyof typeof categoryDisplayNames] || 
      category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
  }

  if (error) {
    return (
      <div className="hidden md:block mb-8">
        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="hidden md:block mb-8">
      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/products"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !activeCategory
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            All Products
          </Link>
          {Object.keys(categoryKeywords).map((category) => (
            <Link
              key={category}
              href={`/products?category=${category}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {formatCategoryName(category)}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 