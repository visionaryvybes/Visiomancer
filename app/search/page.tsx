'use client'

import React from "react"
import { useSearchParams } from "next/navigation"
import { WarpBackground } from "../../components/ui/warp-background"
import ProductGrid from "../../components/ProductGrid"
import { Search } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <div className="min-h-screen">
      <WarpBackground>
        <div className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Search Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Search className="h-5 w-5" />
                <span>Search results for</span>
              </div>
              <h1 className="mt-2 text-3xl font-bold">&quot;{query}&quot;</h1>
            </div>

            {/* Filters and Sort */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <select className="rounded-lg border bg-background px-4 py-2">
                  <option value="">All Categories</option>
                  <option value="watches">Watches</option>
                  <option value="accessories">Accessories</option>
                  <option value="electronics">Electronics</option>
                </select>

                <select className="rounded-lg border bg-background px-4 py-2">
                  <option value="">Price Range</option>
                  <option value="0-50">$0 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100+">$100+</option>
                </select>
              </div>

              <select className="rounded-lg border bg-background px-4 py-2">
                <option value="relevance">Sort by Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Search Results */}
            <ProductGrid />
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 