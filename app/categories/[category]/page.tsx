'use client'

import React, { useState } from "react"
import { WarpBackground } from "../../../components/ui/warp-background"
import ProductGrid from "../../../components/ProductGrid"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState("")

  const categoryTitle = params.category.charAt(0).toUpperCase() + params.category.slice(1)

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
                  <option value="">Price Range</option>
                  <option value="0-50">$0 - $50</option>
                  <option value="50-100">$50 - $100</option>
                  <option value="100+">$100+</option>
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
            <ProductGrid />
          </div>
        </div>
      </WarpBackground>
    </div>
  )
} 