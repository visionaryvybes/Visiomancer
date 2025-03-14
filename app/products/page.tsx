'use client'

import React, { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { WarpBackground } from "../../components/ui/warp-background"
import ProductCard from "../../components/ProductCard"
import { motion } from "framer-motion"
import type { PrintifyProduct as Product } from '../api/printify/client'

// Helper function for safe logging (only in development)
const safeLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    if (data !== undefined) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

// Define category keywords for filtering
const categoryKeywords = {
  "posters": ["poster", "print", "art print", "wall art"],
  "apparel": ["shirt", "t-shirt", "hoodie", "sweatshirt", "clothing", "tee", "unisex"],
  "accessories": ["hat", "cap", "bag", "accessory", "patch", "dad hat", "leather"],
  "home-decor": ["home", "decor", "decoration", "wall art", "poster"],
  "automotive": ["ford gt", "car", "racing", "automotive", "vehicle"],
  "minimalist": ["minimalist", "simple", "clean", "awaken"]
}

// Define category display names
const categoryDisplayNames = {
  "posters": "Posters",
  "apparel": "Apparel",
  "accessories": "Accessories",
  "home-decor": "Home Decor",
  "automotive": "Automotive",
  "minimalist": "Minimalist"
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const router = useRouter()
  const [products, setProducts] = React.useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    typeof searchParams.category === 'string' ? searchParams.category : undefined
  )

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        setError(null)
        safeLog('Fetching products from API...')
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('API error response:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          })
          throw new Error(`Failed to fetch products: ${response.statusText}`)
        }
        
        const data = await response.json()
        safeLog('API response data:', data)
        
        // Ensure we're getting the products array from the correct property
        const productsArray = data.data || []
        
        safeLog('Fetched products:', productsArray)
        safeLog('Products count:', productsArray.length)
        
        if (productsArray.length === 0) {
          safeLog('No products returned from API')
          // Create a dummy product for testing if no products are returned
          const dummyProduct = {
            id: 'dummy-product',
            title: 'Sample Product',
            description: 'This is a sample product for testing purposes.',
            images: [{ src: '/placeholder.jpg' }],
            variants: [
              {
                id: 'dummy-variant',
                title: 'Sample Variant',
                price: 19.99,
                is_enabled: true,
                options: {}
              }
            ]
          }
          setProducts([dummyProduct])
          setIsLoading(false)
          return
        } else {
          safeLog('First product sample:', {
            id: productsArray[0]?.id,
            title: productsArray[0]?.title,
            hasImages: productsArray[0]?.images?.length > 0,
            hasVariants: productsArray[0]?.variants?.length > 0
          })
        }

        let filteredProducts = productsArray

        // Filter products by category if specified
        const category = searchParams.category as string | undefined
        setActiveCategory(category)
        
        if (category && categoryKeywords[category as keyof typeof categoryKeywords]) {
          const keywords = categoryKeywords[category as keyof typeof categoryKeywords]
          
          filteredProducts = filteredProducts.filter((product: Product) => {
            const titleAndDesc = (product.title + ' ' + (product.description || '')).toLowerCase()
            
            // Special case for automotive category - only include Ford GT product
            if (category === 'automotive') {
              return titleAndDesc.includes('ford gt')
            }
            
            return keywords.some(keyword => titleAndDesc.includes(keyword.toLowerCase()))
          })
          
          safeLog(`Filtered products for category "${category}":`, filteredProducts.length)
        }

        // Sort products if specified
        const sort = searchParams.sort as string | undefined
        if (sort) {
          switch (sort) {
            case 'price-asc':
              filteredProducts.sort((a: Product, b: Product) => {
                const aPrice = a.variants?.[0]?.price || 0
                const bPrice = b.variants?.[0]?.price || 0
                return aPrice - bPrice
              })
              break
            case 'price-desc':
              filteredProducts.sort((a: Product, b: Product) => {
                const aPrice = a.variants?.[0]?.price || 0
                const bPrice = b.variants?.[0]?.price || 0
                return bPrice - aPrice
              })
              break
            case 'title-asc':
              filteredProducts.sort((a: Product, b: Product) => 
                (a.title || '').localeCompare(b.title || ''))
              break
            case 'title-desc':
              filteredProducts.sort((a: Product, b: Product) => 
                (b.title || '').localeCompare(a.title || ''))
              break
          }
        }

        setProducts(filteredProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  // Format category name for display
  const formatCategoryName = (category: string): string => {
    return categoryDisplayNames[category as keyof typeof categoryDisplayNames] || 
      category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
  }

  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="container mx-auto px-4 py-8 sm:py-16">
          {/* Header with sorting options */}
          <div className="mb-4 sm:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {activeCategory 
                ? `${formatCategoryName(activeCategory)} Products` 
                : 'All Products'}
            </h1>
            
            <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto">
              <label htmlFor="sort" className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">Sort by:</label>
              <select
                id="sort"
                className="rounded-lg border border-white/10 bg-black/20 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white flex-grow md:flex-grow-0"
                value={searchParams.sort || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const url = new URL(window.location.href);
                  
                  if (value) {
                    url.searchParams.set('sort', value);
                  } else {
                    url.searchParams.delete('sort');
                  }
                  
                  // Preserve category if it exists
                  if (activeCategory) {
                    url.searchParams.set('category', activeCategory);
                  }
                  
                  // Use Next.js router instead of direct window.location
                  router.push(url.pathname + url.search);
                }}
              >
                <option value="">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Name: A to Z</option>
                <option value="title-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Category filters */}
          <div className="mb-6 sm:mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 pb-2 min-w-max">
              <Link 
                href="/products"
                className={`whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
                  !activeCategory 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                All Products
              </Link>
              {Object.keys(categoryKeywords).map(category => (
                <Link 
                  key={category}
                  href={`/products?category=${category}`}
                  className={`whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors ${
                    activeCategory === category 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {formatCategoryName(category)}
                </Link>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/5 rounded-2xl h-[300px] sm:h-[400px]" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-8 sm:py-16">
              <h2 className="text-xl sm:text-2xl font-bold text-red-500 mb-2 sm:mb-4">Error</h2>
              <p className="text-sm sm:text-base text-white/70">{error}</p>
            </div>
          )}

          {/* Products grid */}
          {!isLoading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-8 sm:py-16">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">No products found</h2>
              <p className="text-sm sm:text-base text-white/70">
                {activeCategory 
                  ? `No products found in the ${formatCategoryName(activeCategory)} category.` 
                  : 'No products available at the moment.'}
              </p>
              <Link href="/products" className="mt-4 sm:mt-6 inline-block rounded-lg bg-blue-500 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-white hover:bg-blue-600">
                View All Products
              </Link>
            </div>
          )}

          {/* Navigation Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-white/60 mt-8 sm:mt-16">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-white">
              Categories
            </Link>
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-white">{formatCategoryName(activeCategory)}</span>
              </>
            )}
          </nav>
        </div>
      </WarpBackground>
    </div>
  )
} 