import React from "react"
import Link from "next/link"
import { WarpBackground } from "../../components/ui/warp-background"
import { PrintifyClient } from "../api/printify/client"
import ProductCard from "../../components/ProductCard"

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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const client = new PrintifyClient()
  let products: Product[] = []

  try {
    const response = await client.getProducts()
    products = response.data.map(product => ({
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
      })),
      options: product.options || []
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  // Filter products by category if specified
  const category = searchParams.category as string | undefined
  if (category) {
    products = products.filter(product => 
      product.title.toLowerCase().includes(category.toLowerCase()) ||
      product.description.toLowerCase().includes(category.toLowerCase())
    )
  }

  // Sort products if specified
  const sort = searchParams.sort as string | undefined
  if (sort) {
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0))
        break
      case 'price-desc':
        products.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0))
        break
      case 'title-asc':
        products.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        products.sort((a, b) => b.title.localeCompare(a.title))
        break
    }
  }

  return (
    <div className="min-h-screen bg-[#1e1e6f]">
      <div className="container mx-auto px-4 py-16">
        {/* Header with sorting options */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-4xl font-bold text-white">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
          </h1>
          
          <div className="flex items-center gap-4">
            <label htmlFor="sort" className="text-sm font-medium text-white">Sort by:</label>
            <select
              id="sort"
              className="rounded-lg border border-white/10 bg-[#1a1f4d] px-4 py-2 text-sm text-white"
              defaultValue={sort || ''}
              onChange={(e) => {
                const url = new URL(window.location.href)
                url.searchParams.set('sort', e.target.value)
                window.location.href = url.toString()
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

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 8}
            />
          ))}
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-white mb-4">No products found</h2>
            <p className="text-white/70">
              {category 
                ? `No products found in the ${category} category.` 
                : 'No products available at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 