'use client'

import React from "react"
import { useSearchParams } from "next/navigation"
import { PrintifyProduct } from "../api/printify/client"
import ProductGridMobile from "../../components/ProductGridMobile"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [products, setProducts] = React.useState<PrintifyProduct[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function searchProducts() {
      if (!query) {
        setProducts([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        setProducts(data.data || [])
      } catch (err) {
        console.error('Error searching products:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    searchProducts()
  }, [query])

  return (
    <div className="min-h-screen w-full pb-24 md:pb-0">
      <div className="container mx-auto px-0 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {query 
              ? `Search results for "${query}"`
              : 'Search Products'
            }
          </h1>
          {!isLoading && (
            <p className="mt-2 text-sm text-white/60">
              {products.length} {products.length === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>

        {error && (
          <div className="mx-4 mb-6 rounded-lg border border-red-500/10 bg-red-500/5 p-4 text-red-500">
            {error}
          </div>
        )}

        <ProductGridMobile products={products} isLoading={isLoading} />
      </div>
    </div>
  )
} 