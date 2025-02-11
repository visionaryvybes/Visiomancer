'use client'

import React, { useState, useEffect } from "react"
import { WarpBackground } from "../../../components/ui/warp-background"
import ProductGrid from "../../../components/ProductGrid"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { PrintifyClient } from "../../api/printify/client"

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
    options: Record<string, string>
  }>
  options: Array<{
    name: string
    values: string[]
  }>
}

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState("")

  const categoryTitle = params.category.charAt(0).toUpperCase() + params.category.slice(1)

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true)
      try {
        const client = new PrintifyClient(process.env.NEXT_PUBLIC_PRINTIFY_API_TOKEN || '')
        const shops = await client.getShops()
        if (shops.length === 0) return

        const shopId = shops[0].id.toString()
        const response = await client.getProducts(shopId)
        
        // Filter products by category and transform the response
        const categoryProducts: Product[] = response.data
          .filter((product: any) => product.tags?.includes(params.category))
          .map((product: any) => ({
            id: product.id,
            title: product.title,
            description: product.description || '',
            images: product.images.map((img: any) => ({ src: img.src })),
            variants: product.variants.map((variant: any) => ({
              id: variant.id,
              title: variant.title || '',
              price: variant.price,
              is_enabled: true,
              options: variant.options || {}
            })),
            options: product.options?.map((option: any) => ({
              name: option.name,
              values: option.values
            })) || []
          }))

        // Apply sorting
        const sortedProducts = sortProducts(categoryProducts, sortBy)
        
        // Apply price filtering
        const filteredProducts = filterProductsByPrice(sortedProducts, priceRange)
        
        setProducts(filteredProducts)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [params.category, sortBy, priceRange])

  const sortProducts = (products: Product[], sort: string) => {
    return [...products].sort((a, b) => {
      switch (sort) {
        case 'price-low':
          return (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0)
        case 'price-high':
          return (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0)
        case 'newest':
        default:
          return 0 // In a real app, you'd sort by creation date
      }
    })
  }

  const filterProductsByPrice = (products: Product[], range: string) => {
    if (!range) return products

    const [min, max] = range.split('-').map(Number)
    return products.filter(product => {
      const price = product.variants[0]?.price || 0
      if (max) {
        return price >= min && price <= max
      }
      return price >= min
    })
  }

  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/categories" className="hover:text-foreground">
                Categories
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{categoryTitle}</span>
            </nav>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold">{categoryTitle}</h1>
              
              <div className="flex flex-wrap gap-4">
                <select
                  className="rounded-lg border bg-background px-4 py-2"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="">All Prices</option>
                  <option value="0-50">$0 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100">$100+</option>
                </select>

                <select
                  className="rounded-lg border bg-background px-4 py-2"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={products} isLoading={isLoading} />
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 